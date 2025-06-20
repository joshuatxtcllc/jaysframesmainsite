
import { useEffect } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

const PerformanceOptimizer = ({ children }: PerformanceOptimizerProps) => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload critical images
      const criticalImages = [
        '/images/hero-background.jpg',
        '/images/logo.png',
        '/images/frames/sample-frame.jpg'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Optimize images with Intersection Observer
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('loading-skeleton');
            imageObserver.unobserve(img);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // Web Vitals monitoring
    const monitorWebVitals = () => {
      // Monitor LCP
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor FID
      new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry) => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });

      // Monitor CLS
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('CLS:', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
    };

    // Initialize optimizations
    preloadCriticalResources();
    optimizeImages();
    monitorWebVitals();

    // Cleanup function
    return () => {
      // Remove any observers if component unmounts
    };
  }, []);

  return <>{children}</>;
};

export default PerformanceOptimizer;
