import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Icons
import { Calendar, Clock, Tag, ChevronRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  status: string;
  categoryId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Calculate estimated reading time
const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Fetch blog categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['/api/blog/categories'],
  });

  // Fetch blog posts
  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ['/api/blog/posts'],
  });

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const filteredPosts = activeCategory && posts
    ? posts.filter((post: BlogPost) => post.categoryId === parseInt(activeCategory))
    : posts;

  // Create an array of keywords from all posts for SEO optimization
  const allKeywords = posts
    ? posts.flatMap((post: BlogPost) => 
        post.keywords.split(',').map(keyword => keyword.trim())
      )
    : [];
  
  // Remove duplicates and limit to 20 keywords
  const uniqueKeywords = Array.from(new Set(allKeywords)).slice(0, 20).join(', ');

  return (
    <div className="container mx-auto py-10">
      <Helmet>
        <title>Framing Blog | Jay's Frames Houston</title>
        <meta name="description" content="Expert framing advice, preservation techniques, and art installation tips from Houston's premier custom framing specialists." />
        <meta name="keywords" content={uniqueKeywords} />
        <meta property="og:title" content="Custom Framing Blog | Jay's Frames Houston" />
        <meta property="og:description" content="Expert framing advice, preservation techniques, and art installation tips from Houston's premier custom framing specialists." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jaysframes.com/blog" />
        <meta property="og:image" content="https://jaysframes.com/images/blog-header.jpg" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Jay's Frames" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Custom Framing Blog | Jay's Frames Houston" />
        <meta name="twitter:description" content="Expert framing advice, preservation techniques, and art installation tips from Houston's premier custom framing specialists." />
        <meta name="twitter:image" content="https://jaysframes.com/images/blog-header.jpg" />
        <link rel="canonical" href="https://jaysframes.com/blog" />
      </Helmet>

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Custom Framing Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Expert guidance on custom framing, art preservation, and display solutions from Houston's premier frame shop
        </p>
      </div>

      {isCategoriesLoading ? (
        <div className="my-6">
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <Tabs 
          defaultValue="all" 
          className="mb-10"
          onValueChange={handleCategoryChange}
        >
          <TabsList className="flex flex-wrap justify-center gap-2 mb-6">
            <TabsTrigger value="all" onClick={() => setActiveCategory(null)}>
              All Articles
            </TabsTrigger>
            {categories && categories.map((category: BlogCategory) => (
              <TabsTrigger key={category.id} value={category.id.toString()}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {isPostsLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-[400px]">
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-6 w-1/3 mr-4" />
                <Skeleton className="h-6 w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {filteredPosts?.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post: BlogPost) => {
                const category = categories && categories.find((c: BlogCategory) => c.id === post.categoryId);
                const readingTime = calculateReadingTime(post.content);
                
                return (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-4">
                        <Badge variant="outline" className="mb-2">
                          {category?.name || 'Uncategorized'}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{readingTime} min read</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl hover:text-primary transition-colors duration-200">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground pt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {post.excerpt}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex flex-wrap gap-2">
                        {post.keywords.split(',').slice(0, 2).map((keyword, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {keyword.trim()}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.slug}`}>
                          Read More <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
              <p className="text-muted-foreground">
                We couldn't find any articles in this category. Please check back later!
              </p>
            </div>
          )}
        </>
      )}
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Have Questions About Custom Framing?</h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Our framing experts are here to help you with all your custom framing needs.
          Visit our Houston Heights location or contact us today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/custom-framing">Learn About Our Process</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}