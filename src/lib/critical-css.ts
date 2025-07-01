
/**
 * Critical CSS loader to improve First Contentful Paint
 */
export function loadCriticalCSS() {
  const criticalCSS = `
    /* Critical above-the-fold styles */
    body { 
      font-family: 'Montserrat', sans-serif; 
      background: #000; 
      color: #fff; 
      margin: 0; 
      padding: 0;
    }
    
    /* Header critical styles */
    .header { 
      background: rgba(0,0,0,0.9); 
      position: fixed; 
      top: 0; 
      width: 100%; 
      z-index: 50; 
    }
    
    /* Hero critical styles */
    .hero { 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
    }
    
    /* Loading skeleton */
    .loading-skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;

  // Inject critical CSS inline
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
}
