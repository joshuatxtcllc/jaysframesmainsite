
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit3, Save, X, Plus, Trash2, Upload, 
  FileText, Image as ImageIcon, Type, MousePointer 
} from "lucide-react";

interface ContentBlock {
  id: string;
  key: string;
  type: 'text' | 'image' | 'rich_text' | 'button' | 'link';
  title: string;
  value: string;
  description?: string;
  section: string;
  page: string;
  updatedAt: string;
  createdAt: string;
}

interface ContentImage {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  alt: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

const ContentManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Fetch content
  const { data: content = [], isLoading } = useQuery({
    queryKey: ["/api/content", selectedPage],
    queryFn: async () => {
      const response = await fetch(`/api/content?page=${selectedPage}`);
      return response.json();
    }
  });

  // Fetch content structure
  const { data: structure } = useQuery({
    queryKey: ["/api/content-structure"],
    queryFn: async () => {
      const response = await fetch("/api/content-structure");
      return response.json();
    }
  });

  // Fetch images
  const { data: images = [] } = useQuery({
    queryKey: ["/api/images"],
    queryFn: async () => {
      const response = await fetch("/api/images");
      return response.json();
    }
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ key, updates }: { key: string, updates: any }) => {
      const response = await fetch(`/api/content/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      setEditingContent(null);
      toast({ title: "Content updated successfully!" });
    }
  });

  // Create content mutation
  const createContentMutation = useMutation({
    mutationFn: async (contentData: any) => {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/content-structure"] });
      setIsCreating(false);
      toast({ title: "Content created successfully!" });
    }
  });

  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (key: string) => {
      const response = await fetch(`/api/content/${key}`, {
        method: "DELETE"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({ title: "Content deleted successfully!" });
    }
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async ({ imageData, filename, alt }: { imageData: string, filename: string, alt: string }) => {
      const response = await fetch("/api/images/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData, filename, alt })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
      toast({ title: "Image uploaded successfully!" });
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;
      uploadImageMutation.mutate({
        imageData,
        filename: file.name,
        alt: ""
      });
    };
    reader.readAsDataURL(file);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="h-4 w-4" />;
      case 'rich_text': return <FileText className="h-4 w-4" />;
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'button': return <MousePointer className="h-4 w-4" />;
      default: return <Type className="h-4 w-4" />;
    }
  };

  // Group content by section
  const contentBySection = content.reduce((acc: Record<string, ContentBlock[]>, block: ContentBlock) => {
    if (!acc[block.section]) acc[block.section] = [];
    acc[block.section].push(block);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Manage all text content and images across your website
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Content Block</DialogTitle>
              </DialogHeader>
              <CreateContentForm 
                onSubmit={(data) => createContentMutation.mutate(data)}
                structure={structure}
                isLoading={createContentMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={selectedPage} onValueChange={setSelectedPage}>
        <TabsList className="mb-6">
          {structure?.pages?.map((page: string) => (
            <TabsTrigger key={page} value={page} className="capitalize">
              {page}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Management */}
          <div className="lg:col-span-2">
            <TabsContent value={selectedPage}>
              {isLoading ? (
                <div>Loading content...</div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(contentBySection).map(([section, blocks]) => (
                    <Card key={section}>
                      <CardHeader>
                        <CardTitle className="capitalize">{section} Section</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {blocks.map((block) => (
                          <ContentBlockEditor
                            key={block.id}
                            block={block}
                            isEditing={editingContent === block.key}
                            onEdit={() => setEditingContent(block.key)}
                            onCancel={() => setEditingContent(null)}
                            onSave={(updates) => updateContentMutation.mutate({ key: block.key, updates })}
                            onDelete={() => deleteContentMutation.mutate(block.key)}
                            isLoading={updateContentMutation.isPending}
                          />
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>

          {/* Image Gallery */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Image Gallery</CardTitle>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button asChild className="cursor-pointer">
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </span>
                    </Button>
                  </label>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {images.map((image: ContentImage) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-20 object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            // Add delete image functionality
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

interface ContentBlockEditorProps {
  block: ContentBlock;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (updates: any) => void;
  onDelete: () => void;
  isLoading: boolean;
}

const ContentBlockEditor = ({
  block,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  isLoading
}: ContentBlockEditorProps) => {
  const [value, setValue] = useState(block.value);
  const [title, setTitle] = useState(block.title);

  useEffect(() => {
    setValue(block.value);
    setTitle(block.title);
  }, [block]);

  const handleSave = () => {
    onSave({ value, title });
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getTypeIcon(block.type)}
          <span className="font-medium">{block.title}</span>
          <Badge variant="outline">{block.type}</Badge>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave} disabled={isLoading}>
                <Save className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={onCancel}>
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit3 className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="destructive" onClick={onDelete}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </div>

      {block.description && (
        <p className="text-sm text-muted-foreground mb-2">{block.description}</p>
      )}

      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          {block.type === 'rich_text' ? (
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={4}
            />
          ) : (
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Content value"
            />
          )}
        </div>
      ) : (
        <div className="text-sm">
          {block.type === 'rich_text' ? (
            <div className="whitespace-pre-wrap">{block.value}</div>
          ) : (
            <span>{block.value}</span>
          )}
        </div>
      )}
    </div>
  );
};

interface CreateContentFormProps {
  onSubmit: (data: any) => void;
  structure: any;
  isLoading: boolean;
}

const CreateContentForm = ({ onSubmit, structure, isLoading }: CreateContentFormProps) => {
  const [formData, setFormData] = useState({
    key: '',
    type: 'text',
    title: '',
    value: '',
    description: '',
    section: '',
    page: 'home'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="key">Key (unique identifier)</Label>
        <Input
          id="key"
          value={formData.key}
          onChange={(e) => setFormData({ ...formData, key: e.target.value })}
          placeholder="e.g., hero_new_subtitle"
          required
        />
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Display title for this content"
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="rich_text">Rich Text</SelectItem>
            <SelectItem value="button">Button</SelectItem>
            <SelectItem value="link">Link</SelectItem>
            <SelectItem value="image">Image</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="page">Page</Label>
        <Select value={formData.page} onValueChange={(value) => setFormData({ ...formData, page: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {structure?.pages?.map((page: string) => (
              <SelectItem key={page} value={page}>{page}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="section">Section</Label>
        <Input
          id="section"
          value={formData.section}
          onChange={(e) => setFormData({ ...formData, section: e.target.value })}
          placeholder="e.g., hero, about, contact"
          required
        />
      </div>

      <div>
        <Label htmlFor="value">Content Value</Label>
        {formData.type === 'rich_text' ? (
          <Textarea
            id="value"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            rows={4}
            required
          />
        ) : (
          <Input
            id="value"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            required
          />
        )}
      </div>

      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What this content is used for"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : "Create Content"}
      </Button>
    </form>
  );
};

export default ContentManager;
