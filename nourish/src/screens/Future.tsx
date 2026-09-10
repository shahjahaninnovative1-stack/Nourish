import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { PlaceholderImage, Chip, Screen, ScreenHeader } from '../components/ui';

const HORIZONS: (4 | 12 | 24 | 52)[] = [4, 12, 24, 52];

export default function Future() {
  const { s, set, go, d } = useApp();
  const deltaW = d.deltaW;

  const futureStats = [
    { name: 'weight change', val: `${deltaW > 0 ? '+' : deltaW < 0 ? '−' : ''}${Math.abs(deltaW).toFixed(1)} kg`, color: deltaW < 0 ? colors.green : deltaW > 0 ? colors.amber : colors.ink },
    { name: 'projected BMI', val: d.projectedBmi.toFixed(1), color: colors.ink },
    { name: 'waist', val: `${deltaW < 0 ? '−' : '+'}${Math.abs(Math.round(deltaW * 1.4))} cm`, color: deltaW < 0 ? colors.green : colors.amber },
  ];
  const futureNote = deltaW < 0
    ? `This render assumes you hold your current ${d.target.toLocaleString()} kcal target and keep the evening walks. Miss two weeks and it slides back about 1.2 kg.`
    : 'At your current intake you gain slowly. If that’s the plan, add 20 g protein a day so it lands as muscle, not just weight.';

  return (
    <Screen padBottom={40}>
      <ScreenHeader title="Future you" onBack={() => go('home')} />
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 20, color: 'rgba(25,21,18,.55)', marginVertical: 10 }}>
        One selfie, rendered forward at the pace you're actually eating and moving. Pick a horizon.
      </Text>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
        <View style={{ flex: 1 }}>
          <PlaceholderImage label="Your selfie" style={{ height: 230, borderRadius: 18 }} />
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(25,21,18,.45)', marginTop: 9 }}>Today · {d.wStr}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ position: 'relative' }}>
            <PlaceholderImage label="AI render" style={{ height: 230, borderRadius: 18 }} />
            <View style={{ position: 'absolute', top: 10, left: 10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: 'rgba(225,85,43,.92)' }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase', color: '#fff' }}>AI render</Text>
            </View>
          </View>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: colors.accentDark, marginTop: 9 }}>{d.futureLabel} · {d.futureWeight}</Text>
        </View>
      </View>

      <View style={{ padding: 18, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft, marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>Timeline</Text>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: colors.accent }}>{d.futureLabel}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 7 }}>
          {HORIZONS.map((h) => (
            <Chip key={h} label={h === 52 ? '1 yr' : `${h} wk`} active={s.horizon === h} onPress={() => set({ horizon: h })} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          {futureStats.map((f) => (
            <View key={f.name} style={{ flex: 1, padding: 13, borderRadius: 14, backgroundColor: colors.chipAlt, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.display, fontSize: 19, color: f.color }}>{f.val}</Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 10.5, lineHeight: 14, color: 'rgba(25,21,18,.5)', marginTop: 6, textAlign: 'center' }}>{f.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ padding: 16, paddingHorizontal: 18, borderRadius: 18, backgroundColor: colors.greenBg, borderWidth: 1, borderColor: colors.greenLine, marginBottom: 12 }}>
        <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: colors.greenDark }}>{futureNote}</Text>
      </View>
      <View style={{ padding: 15, paddingHorizontal: 17, borderRadius: 16, backgroundColor: colors.chip }}>
        <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, lineHeight: 18, color: 'rgba(25,21,18,.55)' }}>
          This is an illustration generated from your own numbers, not a medical prediction. Bodies redistribute differently — use it for motivation, not diagnosis.
        </Text>
      </View>
    </Screen>
  );
}
