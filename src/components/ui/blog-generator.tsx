
import React, { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Label } from './label';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function BlogGenerator() {
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['/api/blog/categories'],
  });

  const generateBlogPost = async () => {
    if (!keyword) {
      toast({
        title: 'Keyword required',
        description: 'Please enter a main keyword for your blog post.',
        variant: 'destructive'
      });
      return;
    }

    if (!categoryId) {
      toast({
        title: 'Category required',
        description: 'Please select a category for your blog post.',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword,
          title: title || undefined,
          categoryId: parseInt(categoryId),
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Blog post generation started',
          description: 'Your post is being generated and will be available soon.',
          variant: 'default'
        });
        
        setKeyword('');
        setTitle('');
      } else {
        throw new Error(data.message || 'Failed to generate blog post');
      }
    } catch (error) {
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Failed to generate blog post',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generate Blog Post</CardTitle>
        <CardDescription>
          Create high-quality SEO content for your customers automatically using AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="keyword">Main Keyword</Label>
          <Input
            id="keyword"
            placeholder="e.g., custom framing benefits, shadowbox framing, art preservation"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="title">Title (Optional)</Label>
          <Input
            id="title"
            placeholder="Leave blank to generate automatically"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {isCategoriesLoading ? (
                <SelectItem value="loading" disabled>Loading categories...</SelectItem>
              ) : (
                categories?.map((category: any) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={generateBlogPost} 
          disabled={isGenerating || !keyword || !categoryId}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            'Generate Blog Post'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
