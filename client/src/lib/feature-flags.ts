// Feature flags for controlling what functionality is enabled
export const FEATURE_FLAGS = {
  // Core features
  ROUTING: true,
  BASIC_PAGES: true,
  
  // Advanced features - now enabling them gradually
  AI_FEATURES: true,
  BLOG_SYSTEM: true,
  ADMIN_DASHBOARD: true,
  CART_SYSTEM: true,
  AUTH_SYSTEM: true,
  NOTIFICATIONS: true,
  WEBSOCKETS: false, // Keep disabled to avoid connection issues
  EXTERNAL_API: true,
  
  // UI Features
  ANIMATIONS: true,
  ADVANCED_COMPONENTS: true,
  
  // Development features
  DEBUG_MODE: true,
  MOCK_DATA: true
};

// Helper function to check if a feature is enabled
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}

// Get environment-based overrides
export function getFeatureFlags() {
  const flags = { ...FEATURE_FLAGS };
  
  // In development, we might want to enable more features
  if (import.meta.env.DEV) {
    // Keep development flags as they are
  }
  
  return flags;
}