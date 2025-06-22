import { useState, useEffect } from "react";
import SeoHead from '@/components/seo/seo-head';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { 
  Upload, 
  Trash2, 
  Plus, 
  Camera, 
  Heart,
  Eye,
  Star
} from "lucide-react";

interface GalleryImage {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  alt: string;
  title?: string;
  description?: string;
  category?: string;
  featured?: boolean;
  uploadedAt: string;
}

const Gallery = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch gallery images
  const { data: images = [], isLoading } = useQuery({
    queryKey: ["/api/gallery/images"],
    queryFn: async () => {
      const response = await fetch("/api/gallery/images");
      return response.json();
    }
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/gallery/images", {
        method: "POST",
        body: formData
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery/images"] });
      setIsUploadOpen(false);
      toast({ title: "Image uploaded successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to upload image", variant: "destructive" });
    }
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const response = await fetch(`/api/gallery/images/${imageId}`, {
        method: "DELETE"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery/images"] });
      toast({ title: "Image deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete image", variant: "destructive" });
    }
  });

  const handleImageUpload = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    uploadImageMutation.mutate(formData);
  };

  const categories = ["all", ...new Set(images.map((img: GalleryImage) => img.category).filter(Boolean))];
  const filteredImages = selectedCategory === "all" 
    ? images 
    : images.filter((img: GalleryImage) => img.category === selectedCategory);

  const featuredImages = images.filter((img: GalleryImage) => img.featured);

  return (
    <div className="bg-white">
      <SeoHead
        title="Custom Frame Gallery | Jay's Frames Houston"
        description="Explore our gallery of custom framed artwork, photography, and memorabilia. See examples of our professional picture framing work in Houston Heights."
        keywords="custom framing gallery, picture framing examples, Houston framing studio, framed artwork, professional framing"
        canonicalUrl="/gallery"
        ogTitle="Custom Frame Gallery | Jay's Frames Houston"
        ogDescription="Explore our gallery of custom framed artwork, photography, and memorabilia from Houston's premier framing studio."
        ogImage="/images/gallery-hero.jpg"
      />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-secondary/20 mb-4">
              <Camera className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
              Our Gallery
            </h1>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              Discover the artistry of custom framing through our portfolio of completed projects. 
              From family photos to fine art, see how we transform memories into masterpieces.
            </p>
          </div>

          {/* Admin Upload Button */}
          {user?.role === 'admin' && (
            <div className="flex justify-center mb-8">
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Image
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Gallery Image</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleImageUpload} className="space-y-4">
                    <div>
                      <Label htmlFor="image">Image File</Label>
                      <Input 
                        id="image" 
                        name="image" 
                        type="file" 
                        accept="image/*" 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" placeholder="Image title" />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        placeholder="Describe this framing project..." 
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input 
                        id="category" 
                        name="category" 
                        placeholder="e.g., Fine Art, Family Photos, Sports Memorabilia" 
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="featured" 
                        name="featured" 
                        className="rounded" 
                      />
                      <Label htmlFor="featured">Featured Image</Label>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={uploadImageMutation.isPending}
                      className="w-full"
                    >
                      {uploadImageMutation.isPending ? "Uploading..." : "Upload Image"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </section>

      {/* Featured Carousel */}
      {featuredImages.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-center mb-8">Featured Work</h2>
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {featuredImages.map((image: GalleryImage) => (
                  <CarouselItem key={image.id}>
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative aspect-[16/10]">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                          />
                          <div className="absolute top-4 right-4">
                            <div className="bg-yellow-500 text-white p-2 rounded-full">
                              <Star className="h-4 w-4 fill-current" />
                            </div>
                          </div>
                          {image.title && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                              <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                              {image.description && (
                                <p className="text-white/90 text-sm mt-1">{image.description}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>
      )}

      {/* Category Filter */}
      {categories.length > 1 && (
        <section className="py-8 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-neutral-200 animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-600 mb-2">No Images Yet</h3>
              <p className="text-neutral-500">
                {user?.role === 'admin' 
                  ? "Upload your first gallery image to get started!" 
                  : "Check back soon for our latest framing projects."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image: GalleryImage) => (
                <Card key={image.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedImage(image)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {user?.role === 'admin' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteImageMutation.mutate(image.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Featured Badge */}
                      {image.featured && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-yellow-500 text-white p-1 rounded">
                            <Star className="h-3 w-3 fill-current" />
                          </div>
                        </div>
                      )}
                    </div>

                    {(image.title || image.description) && (
                      <div className="p-4">
                        {image.title && (
                          <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                        )}
                        {image.description && (
                          <p className="text-neutral-600 text-sm">{image.description}</p>
                        )}
                        {image.category && (
                          <span className="inline-block mt-2 text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                            {image.category}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Detail Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="space-y-4">
                {selectedImage.title && (
                  <h2 className="text-2xl font-heading font-bold">{selectedImage.title}</h2>
                )}
                {selectedImage.description && (
                  <p className="text-neutral-600">{selectedImage.description}</p>
                )}
                {selectedImage.category && (
                  <div>
                    <span className="text-sm font-medium text-neutral-500">Category: </span>
                    <span className="bg-secondary/20 text-secondary px-2 py-1 rounded text-sm">
                      {selectedImage.category}
                    </span>
                  </div>
                )}
                <div className="text-sm text-neutral-500">
                  Uploaded: {new Date(selectedImage.uploadedAt).toLocaleDateString()}
                </div>

                <div className="pt-4">
                  <Button className="w-full">
                    <Heart className="h-4 w-4 mr-2" />
                    Get Similar Framing
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Gallery;