import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { PlaceholderImage, PrimaryButton, Screen, ScreenHeader } from '../components/ui';

const PEOPLE = [
  { name: 'You', role: 'Ayesha · lactose-free', initial: 'A', color: colors.accent },
  { name: 'Bilal', role: 'Husband · building muscle', initial: 'B', color: colors.indigo },
  { name: 'Amma', role: 'Shared account · diabetic', initial: 'M', color: colors.green },
];

const POT_TOTAL = 1240;

export default function Split() {
  const { s, set, go, d, flash } = useApp();

  const shareTotal = d.shareTotal;
  const splitOk = shareTotal === 100;
  const splitNote = splitOk
    ? 'The pot adds up. Everyone gets their real number.'
    : shareTotal < 100
      ? `${100 - shareTotal}% of the handi is unclaimed — leftovers, or someone is being shy?`
      : `That is ${shareTotal - 100}% more than was in the pot. Trim someone.`;

  const bump = (i: number, dir: 1 | -1) => {
    const next = s.shares.slice();
    next[i] = Math.max(0, Math.min(100, next[i] + dir * 5));
    set({ shares: next });
  };

  return (
    <Screen padBottom={40}>
      <ScreenHeader title="Shared plate" onBack={() => go('home')} />
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 20, color: 'rgba(25,21,18,.55)', marginVertical: 10 }}>
        One handi, one photo, everyone's numbers. Drag the shares until it matches how the table actually ate.
      </Text>

      <View style={{ flexDirection: 'row', gap: 14, padding: 16, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft, marginBottom: 14 }}>
        <PlaceholderImage label="Handi" style={{ width: 70, height: 70, borderRadius: 14 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink }}>Chicken karahi handi</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, color: 'rgba(25,21,18,.5)', marginTop: 5 }}>Full pot · 720 g · scanned 7:42 pm</Text>
          <Text style={{ fontFamily: fonts.display, fontSize: 20, color: colors.ink, marginTop: 8 }}>
            {POT_TOTAL.toLocaleString()} <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 11, color: 'rgba(25,21,18,.45)' }}>kcal in the pot</Text>
          </Text>
        </View>
      </View>

      <View style={{ gap: 9 }}>
        {PEOPLE.map((p, i) => (
          <View key={p.name} style={{ padding: 15, paddingHorizontal: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: p.color, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: '#fff' }}>{p.initial}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>{p.name}</Text>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, color: 'rgba(25,21,18,.48)', marginTop: 4 }}>{p.role}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink }}>{Math.round(POT_TOTAL * s.shares[i] / 100).toLocaleString()}</Text>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 10, color: 'rgba(25,21,18,.45)', marginTop: 4 }}>kcal</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 13 }}>
              <Pressable onPress={() => bump(i, -1)} style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink }}>−</Text>
              </Pressable>
              <View style={{ flex: 1, height: 8, borderRadius: 99, backgroundColor: colors.chip, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${s.shares[i]}%`, borderRadius: 99, backgroundColor: p.color }} />
              </View>
              <Pressable onPress={() => bump(i, 1)} style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink }}>+</Text>
              </Pressable>
              <Text style={{ width: 42, textAlign: 'right', fontFamily: fonts.bodyBold, fontSize: 12.5, color: 'rgba(25,21,18,.55)' }}>{s.shares[i]}%</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, padding: 14, paddingHorizontal: 16, borderRadius: 16, marginTop: 12, backgroundColor: splitOk ? colors.greenBg : colors.amberBg, borderWidth: 1, borderColor: splitOk ? colors.greenLine : colors.amberLine }}>
        <Text style={{ fontSize: 15 }}>{splitOk ? '✓' : '⚖️'}</Text>
        <Text style={{ flex: 1, fontFamily: fonts.bodySemibold, fontSize: 12.5, lineHeight: 19, color: splitOk ? colors.greenDark : colors.amberDark }}>{splitNote}</Text>
      </View>

      <PrimaryButton
        label={`Log my ${d.myShareKcal.toLocaleString()} kcal & notify the family`}
        onPress={() => {
          set({ screen: 'diary', eatenBase: s.eatenBase + d.myShareKcal });
          flash('Your share logged · family notified');
        }}
        style={{ marginTop: 14 }}
      />
    </Screen>
  );
}
