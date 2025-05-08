
import { Request, Response, NextFunction } from 'express';

/**
 * Redirect map for handling URLs that have been moved or no longer exist
 */
const redirectMap: Record<string, string> = {
  // Fix 404/4XX pages we detected
  '/q': '/',
  '/robots.txt': '/robots.txt', // Ensure robots.txt is accessible
  
  // Common redirects for SEO
  '/framing': '/custom-framing',
  '/frames': '/products?category=frame',
  '/shadowboxes': '/products?category=shadowbox',
  '/shadowbox': '/products?category=shadowbox', 
  '/about-us': '/about',
  '/contact-us': '/contact',
  '/services': '/custom-framing',
  '/gallery': '/products',
  '/our-work': '/products',
  '/frequently-asked-questions': '/about',
  '/faq': '/about',
  '/shipping': '/about',
  
  // Handle trailing slashes
  '/home/': '/',
  '/custom-framing/': '/custom-framing',
  '/products/': '/products',
  '/about/': '/about',
  '/contact/': '/contact'
};

/**
 * Handles redirects for known old URLs
 */
export const handleRedirects = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  
  // Check if we have a redirect for this exact path
  if (redirectMap[path]) {
    return res.redirect(301, redirectMap[path]);
  }
  
  // Handle trailing slashes on all URLs
  if (path.length > 1 && path.endsWith('/')) {
    return res.redirect(301, path.slice(0, -1));
  }
  
  // Handle old product pages 
  if (path.startsWith('/product/') || path.startsWith('/frame/')) {
    return res.redirect(301, '/products');
  }
  
  next();
};

/**
 * Custom 404 handler to track and report 404s
 */
export const handle404 = (req: Request, res: Response) => {
  // Log 404 for monitoring
  console.warn(`404 Not Found: ${req.originalUrl}`);
  
  // Redirect to 404 page to maintain clean site audit
  res.status(404).redirect('/not-found');
};
