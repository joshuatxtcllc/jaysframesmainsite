import React from 'react';
import { Helmet } from 'react-helmet';

interface SeoHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  canonicalUrl?: string;
  children?: React.ReactNode;
}

/**
 * SEO component for consistent meta tags and canonical URLs
 */
export default function SeoHead({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
  children,
}: SeoHeadProps) {
  // Generate proper canonical URL
  const baseUrl = 'https://jaysframes.com';
  
  // Make sure canonicalUrl starts with / and doesn't have trailing slash (except for homepage)
  let path = '';
  if (canonicalUrl) {
    path = canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`;
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
  } else {
    // If no canonical URL provided, try to get current path from window location
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      path = window.location.pathname;
      if (path !== '/' && path.endsWith('/')) {
        path = path.slice(0, -1);
      }
    }
  }
  
  const fullCanonicalUrl = `${baseUrl}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      {ogImage && <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`} />}
      <meta property="og:site_name" content="Jay's Frames" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      {ogImage && <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`} />}
      
      {children}
    </Helmet>
  );
}