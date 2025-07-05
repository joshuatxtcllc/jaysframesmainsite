import { useEffect } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  navigationTime: number;
  resourceCount: number;
}

const PerformanceMonitor = () => {
  useEffect(() => {
    let navigationStart = 0;
    let domContentLoaded = 0;
    let loadComplete = 0;

    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const resources = performance.getEntriesByType('resource');
        
        if (navigation) {
          navigationStart = navigation.fetchStart || 0;
          domContentLoaded = navigation.domContentLoadedEventEnd || 0;
          loadComplete = navigation.loadEventEnd || 0;

          const metrics: PerformanceMetrics = {
            loadTime: loadComplete - navigationStart,
            renderTime: domContentLoaded - navigationStart,
            navigationTime: navigation.responseEnd - navigation.requestStart,
            resourceCount: resources.length
          };

          // Log performance metrics in development
          if (process.env.NODE_ENV === 'development') {
            console.group('Performance Metrics');
            console.log('Page Load Time:', metrics.loadTime.toFixed(2), 'ms');
            console.log('DOM Content Loaded:', metrics.renderTime.toFixed(2), 'ms');
            console.log('Navigation Time:', metrics.navigationTime.toFixed(2), 'ms');
            console.log('Resources Loaded:', metrics.resourceCount);
            console.groupEnd();

            // Warn about slow performance
            if (metrics.loadTime > 3000) {
              console.warn('⚠️ Slow page load detected:', metrics.loadTime.toFixed(2), 'ms');
            }
            if (metrics.resourceCount > 50) {
              console.warn('⚠️ High resource count detected:', metrics.resourceCount);
            }
          }

          // Check for memory leaks
          if ('memory' in performance) {
            const memory = (performance as any).memory;
            if (memory && memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
              console.warn('⚠️ High memory usage detected:', (memory.usedJSHeapSize / 1024 / 1024).toFixed(2), 'MB');
            }
          }
        }
      }
    };

    const detectSlowOperations = () => {
      let lastTime = performance.now();
      let frames = 0;
      
      const checkFrameRate = () => {
        const currentTime = performance.now();
        frames++;
        
        if (currentTime - lastTime >= 1000) {
          const fps = Math.round((frames * 1000) / (currentTime - lastTime));
          if (fps < 30 && process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Low FPS detected:', fps, 'fps');
          }
          frames = 0;
          lastTime = currentTime;
        }
        
        requestAnimationFrame(checkFrameRate);
      };
      
      requestAnimationFrame(checkFrameRate);
    };

    // Measure initial load performance
    if (document.readyState === 'complete') {
      setTimeout(measurePerformance, 0);
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Start FPS monitoring
    detectSlowOperations();

    // Check for unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      // Filter out known WebSocket HMR issues
      if (event.reason?.message?.includes('WebSocket') || 
          event.reason?.message?.includes('localhost:undefined')) {
        return;
      }
      
      console.error('Unhandled Promise Rejection:', event.reason);
      
      // In development, show more details
      if (process.env.NODE_ENV === 'development') {
        console.group('Promise Rejection Details');
        console.error('Reason:', event.reason);
        console.error('Stack:', event.reason?.stack);
        console.groupEnd();
      }
    };

    window.addEventListener('unhandledrejection', handleRejection);

    // Monitor for console errors
    const originalError = console.error;
    console.error = (...args) => {
      // Filter out expected WebSocket errors
      const message = args.join(' ');
      if (!message.includes('WebSocket') && !message.includes('localhost:undefined')) {
        originalError.apply(console, args);
      }
    };

    return () => {
      window.removeEventListener('load', measurePerformance);
      window.removeEventListener('unhandledrejection', handleRejection);
      console.error = originalError;
    };
  }, []);

  return null; // This is a monitoring component, no UI needed
};

export default PerformanceMonitor;