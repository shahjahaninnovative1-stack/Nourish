import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { MICROS } from '../data';
import { ProgressBar, Screen, ScreenHeader, SubText } from '../components/ui';

const TONE: Record<string, string> = { green: colors.green, amber: colors.amber, red: colors.red };

export default function Micros() {
  const { go } = useApp();
  return (
    <Screen>
      <ScreenHeader title="Micronutrients" onBack={() => go('home')} />
      <SubText>Estimated from everything you logged today, adjusted for how desi cooking actually behaves — turmeric, ghee, pressure-cooked dals.</SubText>
      <View style={{ gap: 11 }}>
        {MICROS.map((m) => (
          <View key={m.name} style={{ padding: 14, paddingHorizontal: 16, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 9 }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>{m.name}</Text>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, color: TONE[m.tone] }}>{m.label}</Text>
            </View>
            <ProgressBar pct={m.pct} color={TONE[m.tone]} />
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, lineHeight: 17, color: 'rgba(25,21,18,.5)', marginTop: 9 }}>{m.tip}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}
