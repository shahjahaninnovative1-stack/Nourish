import React, { useEffect } from 'react';
import { Platform, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { ADSENSE_CLIENT, ADSENSE_SLOTS, adProvider, Placement } from '../ads';

let scriptRequested = false;
function ensureAdSense() {
  if (scriptRequested || typeof document === 'undefined') return;
  scriptRequested = true;
  const w = window as any;
  w.adsbygoogle = w.adsbygoogle || [];
  // Must be set before the first ad request: no behavioural targeting.
  w.adsbygoogle.requestNonPersonalizedAds = 1;
  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT)}`;
  document.head.appendChild(s);
}

function AdSenseUnit({ slot }: { slot: string }) {
  useEffect(() => {
    ensureAdSense();
    try { ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({}); } catch { /* blocked or not yet loaded */ }
  }, []);
  return React.createElement('ins', {
    className: 'adsbygoogle',
    style: { display: 'block', minHeight: 90 },
    'data-ad-client': ADSENSE_CLIENT,
    'data-ad-slot': slot,
    'data-ad-format': 'auto',
    'data-full-width-responsive': 'true',
  });
}

/** One ad position. Renders nothing at all when no ad network is configured. */
export function AdSlot({ placement }: { placement: Placement }) {
  if (adProvider === 'none') return null;
  const label = (
    <Text style={{ fontFamily: fonts.bodyBold, fontSize: 9.5, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(25,21,18,.38)', marginBottom: 6 }}>Advertisement</Text>
  );
  if (adProvider === 'adsense' && Platform.OS === 'web' && ADSENSE_SLOTS[placement]) {
    return <View style={{ marginTop: 16 }} accessibilityLabel="Advertisement">{label}<AdSenseUnit slot={ADSENSE_SLOTS[placement]} /></View>;
  }
  if (adProvider !== 'placeholder') return null;
  return (
    <View style={{ marginTop: 16 }} accessibilityLabel="Advertisement placeholder">
      {label}
      <View style={{ height: 78, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(25,21,18,.2)', backgroundColor: colors.chipAlt, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12, color: 'rgba(25,21,18,.42)' }}>Ad space · no ad network connected yet</Text>
      </View>
    </View>
  );
}
