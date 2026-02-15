/**
 * AdSense configuration module
 * Centralizes AdSense settings and provides helper functions
 */

// Read AdSense client ID from environment variable
const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID || '';

// Read AdSense banner ad slot ID from environment variable (existing middle placement)
const ADSENSE_BANNER_AD_SLOT = import.meta.env.VITE_ADSENSE_BANNER_AD_SLOT || '';

// Read AdSense top banner ad slot ID from environment variable
const ADSENSE_TOP_BANNER_AD_SLOT = import.meta.env.VITE_ADSENSE_TOP_BANNER_AD_SLOT || '';

// Read AdSense footer banner ad slot ID from environment variable
const ADSENSE_FOOTER_BANNER_AD_SLOT = import.meta.env.VITE_ADSENSE_FOOTER_BANNER_AD_SLOT || '';

/**
 * Check if AdSense is configured
 */
export function isAdSenseConfigured(): boolean {
  return ADSENSE_CLIENT_ID.length > 0 && ADSENSE_CLIENT_ID.startsWith('ca-pub-');
}

/**
 * Get the AdSense client ID
 */
export function getAdSenseClientId(): string {
  return ADSENSE_CLIENT_ID;
}

/**
 * Get the banner ad slot ID (existing middle placement)
 */
export function getBannerAdSlot(): string {
  return ADSENSE_BANNER_AD_SLOT;
}

/**
 * Get the top banner ad slot ID
 */
export function getTopBannerAdSlot(): string {
  return ADSENSE_TOP_BANNER_AD_SLOT;
}

/**
 * Get the footer banner ad slot ID
 */
export function getFooterBannerAdSlot(): string {
  return ADSENSE_FOOTER_BANNER_AD_SLOT;
}

/**
 * Check if banner ad slot is configured
 */
export function isBannerAdSlotConfigured(): boolean {
  return ADSENSE_BANNER_AD_SLOT.length > 0;
}

/**
 * Check if top banner ad slot is configured
 */
export function isTopBannerAdSlotConfigured(): boolean {
  return ADSENSE_TOP_BANNER_AD_SLOT.length > 0;
}

/**
 * Check if footer banner ad slot is configured
 */
export function isFooterBannerAdSlotConfigured(): boolean {
  return ADSENSE_FOOTER_BANNER_AD_SLOT.length > 0;
}

/**
 * Check if AdSense script is loaded and available
 */
export function isAdSenseAvailable(): boolean {
  return typeof window !== 'undefined' && 
         typeof (window as any).adsbygoogle !== 'undefined';
}
