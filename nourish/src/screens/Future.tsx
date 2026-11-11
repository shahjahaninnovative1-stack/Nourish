import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { Chip, Screen, ScreenHeader } from '../components/ui';

const HORIZONS: (4 | 12 | 24 | 52)[] = [4, 12, 24, 52];
const W = 300, H = 150, PAD = 18;

// A weight trajectory rather than a rendered body. Generated body imagery
// harms body image even when labelled as AI, and cannot satisfy advertising,
// medical-device and app-store rules at once; a chart of the user's own
// numbers carries the same motivation without either problem.
export default function Future() {
  const { s, set, go, d } = useApp();
  const deltaW = d.deltaW;
  const perWeek = deltaW / s.horizon;

  const lo = Math.min(s.wKg, d.projW) - 1.5;
  const hi = Math.max(s.wKg, d.projW) + 1.5;
  const x = (t: number) => PAD + t * (W - PAD * 2);
  const y = (kg: number) => PAD + (1 - (kg - lo) / (hi - lo)) * (H - PAD * 2);
  const pts = [0, 0.25, 0.5, 0.75, 1].map((t) => ({ t, kg: s.wKg + deltaW * t }));
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)},${y(p.kg).toFixed(1)}`).join(' ');
  const fmt = (kg: number) => (d.imp ? `${Math.round(kg * 2.205)} lb` : `${kg.toFixed(1)} kg`);

  const stats = [
    { name: 'weight change', val: `${deltaW > 0 ? '+' : deltaW < 0 ? '−' : ''}${Math.abs(deltaW).toFixed(1)} kg`, color: deltaW < 0 ? colors.green : deltaW > 0 ? colors.amber : colors.ink },
    { name: 'projected BMI', val: d.projectedBmi.toFixed(1), color: colors.ink },
    { name: 'kg per week', val: `${perWeek > 0 ? '+' : perWeek < 0 ? '−' : ''}${Math.abs(perWeek).toFixed(2)}`, color: colors.ink },
  ];
  const note = deltaW < 0
    ? `This projection assumes you hold your current ${d.target.toLocaleString()} kcal target and keep the evening walks. Miss two weeks and it slides back about 1.2 kg.`
    : deltaW > 0
      ? 'At your current intake you gain slowly. If that’s the plan, add 20 g protein a day so it lands as muscle, not just weight.'
      : 'Your target is set to hold your weight steady. The line stays flat as long as intake and activity stay where they are.';

  return (
    <Screen padBottom={40}>
      <ScreenHeader title="Future you" onBack={() => go('home')} />
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 20, color: 'rgba(25,21,18,.55)', marginVertical: 10 }}>
        Where your own numbers lead at the pace you're actually eating and moving. Pick a horizon.
      </Text>

      <View style={{ padding: 18, borderRadius: 20, backgroundColor: colors.ink, marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,251,244,.5)' }}>Projected trajectory</Text>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: colors.amber }}>{d.futureLabel}</Text>
        </View>
        <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
          {[0.25, 0.5, 0.75].map((g) => (
            <Line key={g} x1={PAD} x2={W - PAD} y1={PAD + g * (H - PAD * 2)} y2={PAD + g * (H - PAD * 2)} stroke="rgba(255,251,244,.1)" strokeWidth={1} />
          ))}
          <Path d={line} stroke={colors.accent} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          {pts.map((p, i) => (
            <Circle key={i} cx={x(p.t)} cy={y(p.kg)} r={i === 0 || i === pts.length - 1 ? 5.5 : 3} fill={i === pts.length - 1 ? colors.amber : '#FFFBF4'} />
          ))}
        </Svg>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: colors.onDark }}>Today · {fmt(s.wKg)}</Text>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: colors.amber }}>{fmt(d.projW)}</Text>
        </View>
      </View>

      <View style={{ padding: 18, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft, marginBottom: 12 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink, marginBottom: 14 }}>Timeline</Text>
        <View style={{ flexDirection: 'row', gap: 7 }}>
          {HORIZONS.map((h) => (
            <Chip key={h} label={h === 52 ? '1 yr' : `${h} wk`} active={s.horizon === h} onPress={() => set({ horizon: h })} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          {stats.map((f) => (
            <View key={f.name} style={{ flex: 1, padding: 13, borderRadius: 14, backgroundColor: colors.chipAlt, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.display, fontSize: 18, color: f.color }}>{f.val}</Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 10.5, lineHeight: 14, color: 'rgba(25,21,18,.5)', marginTop: 6, textAlign: 'center' }}>{f.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ padding: 16, borderRadius: 18, backgroundColor: colors.greenBg, borderWidth: 1, borderColor: colors.greenLine, marginBottom: 12 }}>
        <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: colors.greenDark }}>{note}</Text>
      </View>
      <View style={{ padding: 15, borderRadius: 16, backgroundColor: colors.chip }}>
        <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, lineHeight: 18, color: 'rgba(25,21,18,.55)' }}>
          This is an estimate from your own numbers, not a medical prediction. Bodies respond differently — use it for motivation, not diagnosis, and talk to a doctor before a major change in diet.
        </Text>
      </View>
    </Screen>
  );
}
