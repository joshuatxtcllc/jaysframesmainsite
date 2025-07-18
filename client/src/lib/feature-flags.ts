// Feature flags for controlling what functionality is enabled
export const FEATURE_FLAGS = {
  // Core features
  ROUTING: true,
  BASIC_PAGES: true,
  
  // Advanced features - disable for now
  AI_FEATURES: false,
  BLOG_SYSTEM: false,
  ADMIN_DASHBOARD: false,
  CART_SYSTEM: false,
  AUTH_SYSTEM: false,
  NOTIFICATIONS: false,
  WEBSOCKETS: false,
  EXTERNAL_API: false,
  
  // UI Features
  ANIMATIONS: false,
  ADVANCED_COMPONENTS: false,
  
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