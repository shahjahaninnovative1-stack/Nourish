import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { PIN_DATA } from '../data';
import { PlaceholderImage, PrimaryButton } from '../components/ui';

function PulseDot() {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.6, duration: 500, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scale]);
  return <Animated.View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, transform: [{ scale }] }} />;
}

const PIN_POS = [
  { left: '26%', top: '46%' },
  { left: '44%', top: '32%' },
  { left: '20%', top: '64%' },
  { left: '58%', top: '76%' },
];

export default function Scan() {
  const { s, set, go, shoot, flash } = useApp();

  if (s.scanPhase !== 'done') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.photoBg }}>
        <PlaceholderImage label="Drop a thali photo" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="box-none">
          <View style={{ position: 'absolute', top: 150, left: '50%', marginLeft: -125, width: 250, height: 250, borderRadius: 26, borderWidth: 2, borderColor: 'rgba(255,255,255,.85)' }} />
          <Text style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.bodySemibold, fontSize: 13, color: '#fff' }}>
            Frame the whole plate — bowls and all
          </Text>
          <View style={{ position: 'absolute', top: 418, left: 0, right: 0, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 99, backgroundColor: 'rgba(27,138,90,.9)' }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: '#fff' }}>◉ Plate calibrated · 26 cm thali</Text>
            </View>
          </View>

          <View style={{ position: 'absolute', bottom: 52, left: 0, right: 0, alignItems: 'center', gap: 18 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ paddingHorizontal: 15, paddingVertical: 9, borderRadius: 99, backgroundColor: 'rgba(255,255,255,.16)' }}>
                <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12.5, color: '#fff' }}>Photo</Text>
              </View>
              <Pressable onPress={() => go('voice')} style={{ paddingHorizontal: 15, paddingVertical: 9, borderRadius: 99, backgroundColor: 'rgba(0,0,0,.35)' }}>
                <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12.5, color: 'rgba(255,255,255,.72)' }}>Voice</Text>
              </Pressable>
              <Pressable onPress={() => go('label')} style={{ paddingHorizontal: 15, paddingVertical: 9, borderRadius: 99, backgroundColor: 'rgba(0,0,0,.35)' }}>
                <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12.5, color: 'rgba(255,255,255,.72)' }}>Label / barcode</Text>
              </Pressable>
            </View>
            <Pressable onPress={shoot} style={{ width: 74, height: 74, borderRadius: 37, backgroundColor: '#fff', borderWidth: 5, borderColor: 'rgba(255,255,255,.32)', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent }} />
            </Pressable>
          </View>

          <Pressable onPress={() => go('home')} style={{ position: 'absolute', top: 60, left: 20, width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(0,0,0,.4)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: '#fff' }}>✕</Text>
          </Pressable>
        </View>

        {s.scanPhase === 'busy' && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(13,11,10,.55)' }}>
            <View style={{ position: 'absolute', bottom: 130, left: 24, right: 24, padding: 18, borderRadius: 20, backgroundColor: 'rgba(255,251,244,.94)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <PulseDot />
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>Reading your plate…</Text>
              </View>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: 'rgba(25,21,18,.6)' }}>
                Matching against 4,100 South Asian dishes · estimating portion depth from bowl geometry
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  const sel = PIN_DATA[s.pin];

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={{ height: 342, backgroundColor: colors.photoBg, position: 'relative' }}>
        <PlaceholderImage label="Drop a thali photo" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        {PIN_DATA.map((p, i) => {
          const active = i === s.pin;
          const color = active ? colors.accent : 'rgba(13,11,10,.62)';
          const label = `${p.name} · ${p.kcal}`;
          return (
            <Pressable key={p.name} onPress={() => set({ pin: i as 0 | 1 | 2 | 3 })} style={{ position: 'absolute', ...PIN_POS[i], flexDirection: 'row', alignItems: 'center', gap: 7 } as any}>
              <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff', borderWidth: 3, borderColor: color }} />
              <View style={{ paddingHorizontal: 9, paddingVertical: 5, borderRadius: 9, backgroundColor: color }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, color: '#fff' }}>{label}</Text>
              </View>
            </Pressable>
          );
        })}
        <Pressable onPress={() => go('home')} style={{ position: 'absolute', top: 60, left: 20, width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(0,0,0,.45)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: '#fff' }}>✕</Text>
        </Pressable>
        <View style={{ position: 'absolute', bottom: 14, right: 20, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99, backgroundColor: 'rgba(27,138,90,.9)' }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: '#fff' }}>92% sure</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(25,21,18,.42)', marginBottom: 8 }}>Tap a pin to adjust</Text>

        <View style={{ padding: 18, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.display, fontSize: 21, color: colors.ink }}>{sel.name}</Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, color: 'rgba(25,21,18,.5)', marginTop: 5 }}>{sel.note}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 20, color: colors.ink }}>{sel.kcal}</Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 10.5, color: 'rgba(25,21,18,.45)', marginTop: 4 }}>kcal</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 18 }}>
            <Pressable onPress={() => flash('Portion down · recalculating')} style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 17, color: colors.ink }}>−</Text>
            </Pressable>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink }}>{sel.portion}</Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 10.5, color: 'rgba(25,21,18,.45)', marginTop: 5 }}>portion</Text>
            </View>
            <Pressable onPress={() => flash('Portion up · recalculating')} style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 17, color: colors.ink }}>+</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', gap: 7, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.lineSoft }}>
            {sel.macros.map((mm) => (
              <View key={mm.k} style={{ flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 11, backgroundColor: colors.chipAlt }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: colors.ink }}>{mm.v}</Text>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 10, color: 'rgba(25,21,18,.45)', marginTop: 5 }}>{mm.k}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ padding: 14, borderRadius: 16, backgroundColor: colors.amberBg, borderWidth: 1, borderColor: colors.amberLine, marginTop: 12 }}>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: colors.amberDark }}>Ghee on the roti adds ~45 kcal each. Tap the roti pin if it was dry.</Text>
        </View>

        <Pressable onPress={() => go('calib')} style={{ padding: 17, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft, marginTop: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 11 }}>
            <Text style={{ fontSize: 15 }}>◉</Text>
            <Text style={{ flex: 1, fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>Plate size locked</Text>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: colors.greenDark }}>26 cm</Text>
          </View>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 19, color: 'rgba(25,21,18,.55)' }}>Depth measured against your calibrated thali, so the karahi is 180 g — not "a serving". Recalibrate if you're eating out.</Text>
        </Pressable>

        <View style={{ padding: 17, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft, marginTop: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 }}>
            <Text style={{ fontSize: 15 }}>🫗</Text>
            <Text style={{ flex: 1, fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>Hidden-oil meter</Text>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: colors.red }}>3.2 tsp</Text>
          </View>
          <View style={{ height: 9, borderRadius: 99, backgroundColor: colors.chip, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: '64%', borderRadius: 99, backgroundColor: colors.amber }} />
          </View>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 19, color: 'rgba(25,21,18,.55)', marginTop: 10 }}>128 of these 760 kcal are pure oil — the karahi tarka is doing it. A home karahi lands near 1.4 tsp.</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <Pressable onPress={() => go('split')} style={{ flex: 1, padding: 15, borderRadius: 18, backgroundColor: colors.indigoBg, borderWidth: 1, borderColor: colors.indigoLine }}>
            <Text style={{ fontSize: 17, marginBottom: 9 }}>🍽️</Text>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: colors.indigo }}>Split this dish</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11, lineHeight: 16, color: 'rgba(25,21,18,.55)', marginTop: 4 }}>Shared handi? Divide it</Text>
          </Pressable>
          <Pressable onPress={() => go('leftover')} style={{ flex: 1, padding: 15, borderRadius: 18, backgroundColor: colors.greenBg, borderWidth: 1, borderColor: colors.greenLine }}>
            <Text style={{ fontSize: 17, marginBottom: 9 }}>📷</Text>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: colors.greenDark }}>Scan leftovers</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11, lineHeight: 16, color: 'rgba(25,21,18,.55)', marginTop: 4 }}>Only pay for what you ate</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 30, backgroundColor: colors.cream, flexDirection: 'row', gap: 10 }}>
        <Pressable onPress={() => set({ scanPhase: 'aim' })} style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 18 }}>↺</Text>
        </Pressable>
        <PrimaryButton
          label="Log 760 kcal"
          onPress={() => { set({ screen: 'diary', scanPhase: 'aim', eatenBase: s.eatenBase + 760 }); flash('760 kcal logged · +40 XP'); }}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}
