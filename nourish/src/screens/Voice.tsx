import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { VOICE_EXAMPLES } from '../data';

function IconMic() {
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.1} strokeLinecap="round">
      <Rect x={9} y={2.5} width={6} height={11} rx={3} />
      <Path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
    </Svg>
  );
}

export default function Voice() {
  const { s, d, go, set, toggleMic, flash } = useApp();

  const waveBars = Array.from({ length: 22 }, (_, i) => Math.round(14 + Math.abs(Math.sin(i * 1.7 + s.typed * 1.1)) * 30));

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream, paddingTop: 52 }}>
      <View style={{ flex: 1, backgroundColor: colors.ink, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 24, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable onPress={() => go('home')} style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,251,244,.12)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: colors.onDark }}>✕</Text>
          </Pressable>
          <Text style={{ flex: 1, fontFamily: fonts.display, fontSize: 20, color: colors.onDark }}>Talk it in</Text>
          <View style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99, backgroundColor: 'rgba(255,251,244,.12)' }}>
            <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 11, color: 'rgba(255,251,244,.7)' }}>Urdu · Hindi · English</Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingTop: 26 }} showsVerticalScrollIndicator={false}>
          {s.micState === 'idle' && (
            <View>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 24, color: 'rgba(255,251,244,.55)', marginBottom: 22 }}>
                Hold the mic and speak normally. Mix languages if you want — "do roti, ek katori dal, aur chai with sugar" works fine.
              </Text>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,251,244,.4)', marginBottom: 11 }}>Try saying</Text>
              <View style={{ gap: 8 }}>
                {VOICE_EXAMPLES.map((e) => (
                  <View key={e} style={{ padding: 14, borderRadius: 15, backgroundColor: 'rgba(255,251,244,.07)' }}>
                    <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13.5, lineHeight: 20, color: 'rgba(255,251,244,.8)' }}>"{e}"</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {s.micState === 'hearing' && (
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 18 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent }} />
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,251,244,.55)' }}>Listening</Text>
              </View>
              <Text style={{ fontFamily: fonts.displayBold, fontSize: 26, lineHeight: 34, color: colors.onDark }}>
                {d.transcript}<Text style={{ color: colors.accent }}>|</Text>
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 44, marginTop: 26 }}>
                {waveBars.map((h, i) => (
                  <View key={i} style={{ flex: 1, borderRadius: 99, backgroundColor: 'rgba(245,165,36,.85)', height: h }} />
                ))}
              </View>
            </View>
          )}

          {s.micState === 'parsed' && (
            <View>
              <View style={{ padding: 15, borderRadius: 15, backgroundColor: 'rgba(255,251,244,.07)', marginBottom: 18 }}>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13.5, lineHeight: 20, color: 'rgba(255,251,244,.7)' }}>"{d.transcript}"</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,251,244,.4)' }}>Heard {d.voiceItems.length} items</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,251,244,.12)' }} />
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: '#7ED3A8' }}>{d.voiceTotal.toLocaleString()} kcal</Text>
              </View>
              <View style={{ gap: 8 }}>
                {d.voiceItems.map((v) => (
                  <View key={v.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: 'rgba(255,251,244,.08)' }}>
                    <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: 'rgba(255,251,244,.1)', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 16 }}>{v.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.onDark }}>{v.name}</Text>
                      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, color: 'rgba(255,251,244,.5)', marginTop: 4 }}>{v.heard}</Text>
                    </View>
                    <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: colors.onDark }}>{v.kcal}</Text>
                    <Pressable onPress={() => set({ dropped: s.dropped.concat([v.name]) })} style={{ width: 26, height: 26, borderRadius: 9, backgroundColor: 'rgba(255,251,244,.1)', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: 'rgba(255,251,244,.55)' }}>✕</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
              <View style={{ padding: 14, borderRadius: 15, backgroundColor: 'rgba(245,165,36,.14)', borderWidth: 1, borderColor: 'rgba(245,165,36,.3)', marginTop: 12 }}>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: '#FFD79A' }}>
                  You said "chai" without sugar detail — Nourish used your usual: one spoon, full-fat milk. Tap it to change.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 34, alignItems: 'center', gap: 16 }}>
          {s.micState !== 'parsed' && (
            <>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, color: 'rgba(255,251,244,.4)' }}>
                {s.micState === 'hearing' ? 'Tap to stop' : 'Tap and speak'}
              </Text>
              <Pressable
                onPress={toggleMic}
                style={{
                  width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: s.micState === 'hearing' ? colors.accent : 'rgba(255,251,244,.14)',
                }}
              >
                <IconMic />
              </Pressable>
            </>
          )}
          {s.micState === 'parsed' && (
            <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
              <Pressable onPress={() => set({ micState: 'idle', typed: 0, dropped: [] })} style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,251,244,.12)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18 }}>↺</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  set({ screen: 'diary', micState: 'idle', typed: 0, eatenBase: s.eatenBase + d.voiceTotal });
                  flash(`${d.voiceTotal} kcal logged by voice · +25 XP`);
                }}
                style={{ flex: 1, height: 52, borderRadius: 16, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: '#fff' }}>Log {d.voiceTotal.toLocaleString()} kcal</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
