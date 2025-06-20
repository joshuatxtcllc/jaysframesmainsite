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
  structuredData?: Record<string, any> | Record<string, any>[];
  noIndex?: boolean;
  children?: React.ReactNode;
}

/**
 * Enhanced SEO component for consistent meta tags and canonical URLs
 */
export default function SeoHead({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage = '/images/jays-frames-og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
  structuredData,
  noIndex = false,
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

  // Format title to include brand name if not already included
  const formattedTitle = title.includes("Jay's Frames") 
    ? title 
    : `${title} | Jay's Frames - Custom Framing Houston`;

  return (
    <Helmet>
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots directives */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={ogTitle || formattedTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      {ogImage && <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`} />}
      <meta property="og:site_name" content="Jay's Frames" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle || formattedTitle} />
      <meta name="twitter:description" content={ogDescription || description} />
      {ogImage && <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`} />}

      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="US-TX" />
      <meta name="geo.placename" content="Houston" />
      <meta name="geo.position" content="29.7604;-95.3698" />
      <meta name="ICBM" content="29.7604, -95.3698" />

      {/* Structured Data / JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {children}
    </Helmet>
  );
}