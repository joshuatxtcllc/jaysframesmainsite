import React from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import Markdown from 'markdown-to-jsx';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

// Icons
import { Calendar, Clock, ArrowLeft, Share2, Tag, Facebook, Twitter, Linkedin } from 'lucide-react';

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

// Custom components for markdown rendering
const MarkdownComponents = {
  h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mt-5 mb-2" {...props} />,
  h4: (props: any) => <h4 className="text-lg font-bold mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="my-4 text-lg leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-8 my-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-8 my-4 space-y-2" {...props} />,
  li: (props: any) => <li className="text-lg leading-relaxed" {...props} />,
  a: (props: any) => <a className="text-primary hover:underline" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic" {...props} />
  ),
  img: (props: any) => (
    <img className="mx-auto my-6 rounded-lg max-w-full h-auto" alt={props.alt || ''} {...props} />
  ),
  code: (props: any) => <code className="bg-secondary px-1 py-0.5 rounded" {...props} />,
  pre: (props: any) => (
    <pre className="bg-secondary p-4 rounded-lg overflow-x-auto my-4" {...props} />
  ),
};

export default function BlogPostPage() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug;

  // Fetch blog post by slug
  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ['/api/blog/posts/slug', slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/posts/slug/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      return response.json();
    },
    enabled: !!slug,
  });

  // Fetch categories for displaying category info
  const { data: categories } = useQuery({
    queryKey: ['/api/blog/categories'],
  });

  // Fetch related posts based on category
  const { data: relatedPosts } = useQuery({
    queryKey: ['/api/blog/posts/category', post?.categoryId],
    queryFn: async () => {
      const response = await fetch(`/api/blog/posts/category/${post.categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch related posts');
      }
      return response.json();
    },
    enabled: !!post?.categoryId,
  });

  // Filter out the current post from related posts and limit to 3
  const filteredRelatedPosts = relatedPosts?.filter((relatedPost: BlogPost) => 
    relatedPost.id !== post?.id
  ).slice(0, 3);

  if (isPostLoading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-10" />
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-between items-center mb-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-40" />
          </div>
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-4/5 mb-4" />
          <Skeleton className="h-6 w-11/12 mb-8" />
          
          <Skeleton className="h-48 w-full mb-8" />
          
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-8" />
          
          <Skeleton className="h-8 w-40 mb-4" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-5/6 mb-4" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-lg mb-8">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/blog">Return to Blog</Link>
        </Button>
      </div>
    );
  }

  const category = categories?.find(
    (c: BlogCategory) => c.id === post.categoryId
  );
  const readingTime = calculateReadingTime(post.content);

  const shareUrl = `https://jaysframes.com/blog/${post.slug}`;

  return (
    <div className="container mx-auto py-10">
      <Helmet>
        <title>{post.metaTitle || post.title}</title>
        <meta name="description" content={post.metaDescription || post.excerpt} />
        <meta name="keywords" content={post.keywords} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={post.metaTitle || post.title} />
        <meta property="og:description" content={post.metaDescription || post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:image" content="https://jaysframes.com/images/blog-header.jpg" />
        <meta property="article:published_time" content={post.publishedAt || post.createdAt} />
        <meta property="article:modified_time" content={post.updatedAt} />
        <meta property="article:section" content={category?.name || "Framing"} />
        <meta property="article:tag" content={post.keywords.split(',')[0]} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Jay's Frames" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.metaTitle || post.title} />
        <meta name="twitter:description" content={post.metaDescription || post.excerpt} />
        <meta name="twitter:image" content="https://jaysframes.com/images/blog-header.jpg" />
        
        {/* Canonical Link */}
        <link rel="canonical" href={shareUrl} />
      </Helmet>
      
      <div className="mb-12">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all articles
          </Link>
        </Button>
      </div>
      
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {category && (
              <Badge variant="outline" className="text-sm">
                {category.name}
              </Badge>
            )}
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{readingTime} min read</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <p className="text-xl text-muted-foreground mb-4">
            {post.excerpt}
          </p>
          
          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Published on {formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {post.keywords.split(',').map((keyword, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {keyword.trim()}
              </Badge>
            ))}
          </div>
          
          <Separator className="my-8" />
        </header>
        
        <div className="prose prose-lg max-w-none">
          <Markdown options={{ overrides: MarkdownComponents }}>
            {post.content}
          </Markdown>
        </div>
        
        <footer className="mt-12">
          <Separator className="my-8" />
          
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <p className="font-semibold mb-2">Share this article:</p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" asChild>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            
            <Button asChild>
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </footer>
      </article>
      
      {filteredRelatedPosts?.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {filteredRelatedPosts.map((relatedPost: BlogPost) => (
              <Card key={relatedPost.id} className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3">
                    {category?.name || 'Framing'}
                  </Badge>
                  <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors duration-200">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                  <Button variant="ghost" size="sm" className="mt-auto" asChild>
                    <Link href={`/blog/${relatedPost.slug}`}>
                      Read Article
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}