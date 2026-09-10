import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { DOW, MEALS } from '../data';
import { Screen } from '../components/ui';

const WEEK_NUMS = [31, 1, 2, 3, 4, 5, 6];

export default function Diary() {
  const { d, go } = useApp();

  return (
    <Screen>
      <Text style={{ fontFamily: fonts.display, fontSize: 26, color: colors.ink, marginBottom: 14 }}>Diary</Text>

      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 18 }}>
        {DOW.map((dow, i) => {
          const active = i === 5;
          return (
            <View key={i} style={{ flex: 1, paddingVertical: 10, borderRadius: 13, alignItems: 'center', backgroundColor: active ? colors.ink : '#fff' }}>
              <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 10, color: active ? 'rgba(255,251,244,.6)' : 'rgba(25,21,18,.6)' }}>{dow}</Text>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: active ? colors.onDark : 'rgba(25,21,18,.6)', marginTop: 6 }}>{WEEK_NUMS[i]}</Text>
            </View>
          );
        })}
      </View>

      <View style={{ padding: 16, borderRadius: 18, backgroundColor: colors.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <View>
          <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 11, color: 'rgba(255,251,244,.55)', letterSpacing: 1, textTransform: 'uppercase' }}>Eaten today</Text>
          <Text style={{ fontFamily: fonts.display, fontSize: 24, color: colors.onDark, marginTop: 7 }}>
            {d.eaten.toLocaleString()} <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12, color: 'rgba(255,251,244,.5)' }}>/ {d.target.toLocaleString()}</Text>
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 11, color: 'rgba(255,251,244,.55)', letterSpacing: 1, textTransform: 'uppercase' }}>Left</Text>
          <Text style={{ fontFamily: fonts.display, fontSize: 24, color: colors.amber, marginTop: 7 }}>{d.remaining.toLocaleString()}</Text>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        {MEALS.map((m) => (
          <View key={m.name} style={{ borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(25,21,18,.07)' }}>
              <Text style={{ fontSize: 16 }}>{m.icon}</Text>
              <Text style={{ flex: 1, fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink }}>{m.name}</Text>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: 'rgba(25,21,18,.5)' }}>{m.kcal}</Text>
            </View>
            {m.items.map((it) => (
              <View key={it.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 13, color: colors.ink }}>{it.name}</Text>
                  <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11, color: 'rgba(25,21,18,.45)', marginTop: 3 }}>{it.portion}</Text>
                </View>
                <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12.5, color: 'rgba(25,21,18,.55)' }}>{it.kcal}</Text>
              </View>
            ))}
            <Pressable onPress={() => go('scan')} style={{ paddingVertical: 12, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: 'rgba(25,21,18,.07)' }}>
              <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12.5, color: colors.accent }}>+ Add to {m.name}</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </Screen>
  );
}
