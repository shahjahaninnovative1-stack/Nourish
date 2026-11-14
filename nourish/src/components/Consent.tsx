import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { PrimaryButton } from './ui';

/** Asked once, before the first photo or description leaves the device. */
export function Consent({ onAllow, dark }: { onAllow: () => void; dark?: boolean }) {
  return (
    <View style={{ padding: 18, borderRadius: 20, backgroundColor: dark ? 'rgba(255,251,244,.08)' : 'rgba(255,251,244,.96)' }}>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: dark ? colors.onDark : colors.ink, marginBottom: 6 }}>Before your first analysis</Text>
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: dark ? 'rgba(255,251,244,.65)' : 'rgba(25,21,18,.62)', marginBottom: 14 }}>
        To estimate a meal, your photo or description is sent to our server and our AI provider. It is not stored and not linked to you. Results are estimates, not measurements.
      </Text>
      <PrimaryButton label="Allow & continue" onPress={onAllow} />
    </View>
  );
}
