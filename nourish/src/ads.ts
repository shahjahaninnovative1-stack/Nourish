import { Platform } from 'react-native';
import { DEMO_MODE } from './brand';

/**
 * Advertising and the free-usage limits that keep an ad-funded app solvent.
 *
 * Every photo analysis costs real money; a banner impression earns a tiny
 * fraction of that. So the free tier is bounded per day, and ads are kept to
 * browsing screens.
 *
 * Rules this file encodes:
 *  - Ads are never shown on screens handling the camera, allergens, health
 *    detail, consent or legal text.
 *  - Ads are requested as non-personalised. App-store rules forbid using
 *    health or camera data for ad targeting, and this app has no other signal.
 */
export const FREE_SCANS_PER_DAY = 3;
export const FREE_DESCRIBES_PER_DAY = 10;

export type Placement = 'home' | 'diary' | 'recipes' | 'move';

// AdSense publisher id, e.g. "ca-pub-1234567890123456". Unset means no ads.
export const ADSENSE_CLIENT = process.env.EXPO_PUBLIC_ADSENSE_CLIENT || '';
// One ad-unit slot id per placement, from the AdSense dashboard.
export const ADSENSE_SLOTS: Record<Placement, string> = {
  home: process.env.EXPO_PUBLIC_ADSENSE_SLOT_HOME || '',
  diary: process.env.EXPO_PUBLIC_ADSENSE_SLOT_DIARY || '',
  recipes: process.env.EXPO_PUBLIC_ADSENSE_SLOT_RECIPES || '',
  move: process.env.EXPO_PUBLIC_ADSENSE_SLOT_MOVE || '',
};

export type AdProvider = 'adsense' | 'placeholder' | 'none';
export const adProvider: AdProvider =
  Platform.OS === 'web' && ADSENSE_CLIENT ? 'adsense'
    : DEMO_MODE ? 'placeholder'   // shows where ads will sit, clearly marked
      : 'none';

export const todayKey = () => new Date().toISOString().slice(0, 10);
