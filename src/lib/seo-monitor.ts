
/**
 * SEO Monitor - Client-side script to detect and report SEO issues
 * Automatically runs on page load in development mode
 */

interface SeoIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  fix?: string;
}

class SeoMonitor {
  private issues: SeoIssue[] = [];
  
  constructor() {
    if (process.env.NODE_ENV === 'development') {
      // Only run in development environment
      window.addEventListener('load', () => {
        setTimeout(() => this.runChecks(), 500);
      });
    }
  }
  
  private addIssue(issue: SeoIssue) {
    this.issues.push(issue);
  }
  
  private runChecks() {
    this.checkH1Tags();
    this.checkMetaTags();
    this.checkImageAlt();
    this.checkCanonicalLink();
    this.checkStructuredData();
    this.checkInternalLinks();
    this.reportIssues();
  }
  
  private checkH1Tags() {
    const h1Elements = document.querySelectorAll('h1');
    
    if (h1Elements.length === 0) {
      this.addIssue({
        type: 'error',
        message: 'No H1 tag found on this page',
        fix: 'Add an H1 tag that includes your primary keyword'
      });
    } else if (h1Elements.length > 1) {
      this.addIssue({
        type: 'warning',
        message: `Multiple H1 tags found (${h1Elements.length})`,
        fix: 'Use only one H1 tag per page for best SEO practices'
      });
    }
  }
  
  private checkMetaTags() {
    // Check title
    const title = document.title;
    if (!title) {
      this.addIssue({
        type: 'error',
        message: 'No page title found',
        fix: 'Add a descriptive title tag with keywords'
      });
    } else if (title.length < 30) {
      this.addIssue({
        type: 'warning',
        message: 'Page title is too short (< 30 chars)',
        fix: 'Use a longer, more descriptive title that includes keywords'
      });
    } else if (title.length > 60) {
      this.addIssue({
        type: 'warning',
        message: 'Page title is too long (> 60 chars)',
        fix: 'Shorten title to under 60 characters for optimal display in search results'
      });
    }
    
    // Check meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      this.addIssue({
        type: 'error',
        message: 'No meta description found',
        fix: 'Add a meta description with relevant keywords'
      });
    } else {
      const content = metaDescription.getAttribute('content') || '';
      if (content.length < 50) {
        this.addIssue({
          type: 'warning',
          message: 'Meta description is too short (< 50 chars)',
          fix: 'Create a more detailed description between 50-160 characters'
        });
      } else if (content.length > 160) {
        this.addIssue({
          type: 'warning',
          message: 'Meta description is too long (> 160 chars)',
          fix: 'Shorten description to under 160 characters for optimal display'
        });
      }
    }
  }
  
  private checkImageAlt() {
    const images = document.querySelectorAll('img');
    let missingAlt = 0;
    
    images.forEach(img => {
      if (!img.hasAttribute('alt') || img.getAttribute('alt') === '') {
        missingAlt++;
      }
    });
    
    if (missingAlt > 0) {
      this.addIssue({
        type: 'warning',
        message: `${missingAlt} image(s) missing alt text`,
        fix: 'Add descriptive alt text to all images for accessibility and SEO'
      });
    }
  }
  
  private checkCanonicalLink() {
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      this.addIssue({
        type: 'warning',
        message: 'No canonical link found',
        fix: 'Add a canonical link to prevent duplicate content issues'
      });
    }
  }
  
  private checkStructuredData() {
    const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
    if (structuredData.length === 0) {
      this.addIssue({
        type: 'info',
        message: 'No structured data found',
        fix: 'Add JSON-LD structured data to improve rich snippets in search results'
      });
    }
  }
  
  private checkInternalLinks() {
    const links = document.querySelectorAll('a');
    let missingLinks = 0;
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href === 'javascript:void(0)') {
        missingLinks++;
      }
    });
    
    if (missingLinks > 0) {
      this.addIssue({
        type: 'warning',
        message: `${missingLinks} link(s) with missing or placeholder URLs`,
        fix: 'Replace placeholder links with valid URLs or remove them'
      });
    }
  }
  
  private reportIssues() {
    if (this.issues.length === 0) {
      console.log('%c✅ No SEO issues detected', 'color: green; font-weight: bold;');
      return;
    }
    
    console.group('%c📊 SEO Issues Detected', 'color: #0066ff; font-weight: bold; font-size: 14px;');
    
    const errors = this.issues.filter(issue => issue.type === 'error');
    const warnings = this.issues.filter(issue => issue.type === 'warning');
    const infos = this.issues.filter(issue => issue.type === 'info');
    
    console.log(`Issues: ${errors.length} errors, ${warnings.length} warnings, ${infos.length} suggestions`);
    
    if (errors.length > 0) {
      console.group('%c❌ Errors', 'color: red;');
      errors.forEach(issue => {
        console.log(`${issue.message}${issue.fix ? ` - ${issue.fix}` : ''}`);
      });
      console.groupEnd();
    }
    
    if (warnings.length > 0) {
      console.group('%c⚠️ Warnings', 'color: orange;');
      warnings.forEach(issue => {
        console.log(`${issue.message}${issue.fix ? ` - ${issue.fix}` : ''}`);
      });
      console.groupEnd();
    }
    
    if (infos.length > 0) {
      console.group('%cℹ️ Suggestions', 'color: blue;');
      infos.forEach(issue => {
        console.log(`${issue.message}${issue.fix ? ` - ${issue.fix}` : ''}`);
      });
      console.groupEnd();
    }
    
    console.groupEnd();
  }
}

// Initialize the monitor
export const seoMonitor = new SeoMonitor();
