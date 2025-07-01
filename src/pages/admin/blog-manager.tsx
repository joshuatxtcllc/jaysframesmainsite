
import React from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogGenerator } from '@/components/ui/blog-generator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Icons
import { Plus, Calendar, Edit, Trash2, Eye, CheckCircle } from 'lucide-react';

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export default function BlogManagerPage() {
  // Fetch all blog posts
  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ['/api/blog/posts'],
  });

  // Fetch blog categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['/api/blog/categories'],
  });

  const getCategoryName = (categoryId: number) => {
    const category = categories?.find((c: any) => c.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  return (
    <div className="container mx-auto py-10">
      <Helmet>
        <title>Blog Manager | Admin Dashboard</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Manager</h1>
        <Button asChild>
          <Link href="/admin/blog-manager/new">
            <Plus className="h-4 w-4 mr-2" /> New Post
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="posts" className="mb-10">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">All Posts</TabsTrigger>
          <TabsTrigger value="generator">AI Content Generator</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>Manage your blog content</CardDescription>
            </CardHeader>
            <CardContent>
              {isPostsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="w-full h-16" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts?.length > 0 ? (
                      posts.map((post: any) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>{getCategoryName(post.categoryId)}</TableCell>
                          <TableCell>
                            <Badge variant={post.status === 'published' ? 'success' : 'secondary'}>
                              {post.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Calendar className="inline h-3 w-3 mr-1" /> 
                            {formatDate(post.createdAt)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {post.publishedAt ? (
                              <>
                                <Calendar className="inline h-3 w-3 mr-1" /> 
                                {formatDate(post.publishedAt)}
                              </>
                            ) : (
                              'Not published'
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon" asChild title="View">
                                <Link href={`/blog/${post.slug}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="outline" size="icon" asChild title="Edit">
                                <Link href={`/admin/blog-manager/edit/${post.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              {post.status !== 'published' && (
                                <Button variant="outline" size="icon" title="Publish">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="outline" size="icon" title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No blog posts found. Create your first post or use the AI generator.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="generator">
          <BlogGenerator />
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Blog Categories</CardTitle>
              <CardDescription>Manage your blog categories</CardDescription>
            </CardHeader>
            <CardContent>
              {isCategoriesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="w-full h-12" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories?.length > 0 ? (
                      categories.map((category: any) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{category.slug}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Calendar className="inline h-3 w-3 mr-1" /> 
                            {formatDate(category.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon" title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No categories found. Create your first category.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/admin/blog-manager/categories/new">
                  <Plus className="h-4 w-4 mr-2" /> Add Category
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
