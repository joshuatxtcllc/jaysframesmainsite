
import { useEffect } from 'react';

/**
 * Hook to validate SEO elements on a page
 * - Ensures pages have an H1 tag
 * - Validates meta description length
 * - Checks for proper image alt tags
 */
export function useSeoValidation() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Only run in development to prevent console noise in production
      
      // Check for H1 tag
      const h1Elements = document.querySelectorAll('h1');
      if (h1Elements.length === 0) {
        console.warn('⚠️ SEO Warning: No H1 tag found on this page');
      } else if (h1Elements.length > 1) {
        console.warn(`⚠️ SEO Warning: Multiple H1 tags found (${h1Elements.length})`);
      }
      
      // Check for images without alt text
      const images = document.querySelectorAll('img:not([alt])');
      if (images.length > 0) {
        console.warn(`⚠️ SEO Warning: ${images.length} images missing alt text`);
      }
      
      // Check meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        console.warn('⚠️ SEO Warning: No meta description found');
      } else {
        const content = metaDescription.getAttribute('content') || '';
        if (content.length < 50) {
          console.warn('⚠️ SEO Warning: Meta description is too short (< 50 chars)');
        } else if (content.length > 160) {
          console.warn('⚠️ SEO Warning: Meta description is too long (> 160 chars)');
        }
      }
    }
  }, []);
}

/**
 * Generates schema markup for a local business
 */
export function generateLocalBusinessSchema(data: {
  name: string;
  description: string;
  url: string;
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  openingHours: string[];
  image: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    description: data.description,
    url: data.url,
    telephone: data.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.geo.latitude,
      longitude: data.geo.longitude,
    },
    openingHoursSpecification: data.openingHours.map(hours => ({
      '@type': 'OpeningHoursSpecification',
      ...hours,
    })),
    image: data.image,
  };
}

/**
 * Generates schema markup for a product
 */
export function generateProductSchema(data: {
  name: string;
  description: string;
  image: string;
  sku: string;
  brand: string;
  price: number;
  priceCurrency: string;
  availability: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    image: data.image,
    sku: data.sku,
    brand: {
      '@type': 'Brand',
      name: data.brand,
    },
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.priceCurrency,
      availability: data.availability,
    },
  };
}

/**
 * Checks if current URL has been redirected (for monitoring 301/302 issues)
 */
export function checkForRedirects() {
  if (typeof window !== 'undefined') {
    const { performance } = window;
    if (performance && performance.getEntriesByType) {
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const navigation = navigationEntries[0] as PerformanceNavigationTiming;
        if (navigation.redirectCount > 0) {
          console.info(`Page was redirected ${navigation.redirectCount} times`);
        }
      }
    }
  }
}
