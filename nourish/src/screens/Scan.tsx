import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { scaled } from '../ai';
import { capture } from '../capture';
import { PlaceholderImage, PrimaryButton } from '../components/ui';
import { Consent } from '../components/Consent';
import { FREE_SCANS_PER_DAY } from '../ads';

function PulseDot() {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(scale, { toValue: 1.6, duration: 500, useNativeDriver: false }),
      Animated.timing(scale, { toValue: 1, duration: 500, useNativeDriver: false }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [scale]);
  return <Animated.View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, transform: [{ scale }] }} />;
}

const FILL = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };

export default function Scan() {
  const { s, d, set, go, runScan, logMeal, flash } = useApp();

  const take = async (from: 'camera' | 'library') => {
    try {
      const img = await capture(from);
      if (img) runScan(img);
    } catch (e) {
      flash(e instanceof Error ? e.message : 'Could not open the camera');
    }
  };

  if (s.scanPhase !== 'done' || !s.scanResult) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.photoBg }}>
        {s.scanImage
          ? <Image source={{ uri: s.scanImage }} style={FILL} resizeMode="cover" />
          : <PlaceholderImage label="" style={FILL} />}

        <View style={FILL} pointerEvents="box-none">
          <Text style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.bodySemibold, fontSize: 13, color: 'rgba(25,21,18,.6)' }}>
            Frame the whole plate — bowls and all
          </Text>
          <View style={{ position: 'absolute', top: 150, left: '50%', marginLeft: -125, width: 250, height: 250, borderRadius: 26, borderWidth: 2, borderColor: 'rgba(25,21,18,.25)' }} />

          <View style={{ position: 'absolute', bottom: 52, left: 20, right: 20, alignItems: 'center', gap: 18 }}>
            {!s.aiConsent ? (
              <View style={{ alignSelf: 'stretch' }}><Consent onAllow={() => set({ aiConsent: true })} /></View>
            ) : d.scansLeft === 0 ? (
              <View style={{ alignSelf: 'stretch', padding: 18, borderRadius: 20, backgroundColor: 'rgba(255,251,244,.96)' }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink, marginBottom: 6 }}>Today's free scans are used</Text>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: 'rgba(25,21,18,.62)', marginBottom: 14 }}>
                  Photo scans are limited to {FREE_SCANS_PER_DAY} a day to keep the app free. You can still describe a meal or use quick add, and scans reset tomorrow.
                </Text>
                <PrimaryButton label="Describe it instead" onPress={() => go('voice')} />
              </View>
            ) : (
              <>
                <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 11.5, color: 'rgba(25,21,18,.5)' }}>{d.scansLeft} of {FREE_SCANS_PER_DAY} free scans left today</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable onPress={() => take('library')} style={pill}><Text style={pillText}>Library</Text></Pressable>
                  <Pressable onPress={() => go('voice')} style={pill}><Text style={pillText}>Describe it</Text></Pressable>
                  <Pressable onPress={() => go('label')} style={pill}><Text style={pillText}>Label / barcode</Text></Pressable>
                </View>
                <Pressable onPress={() => take('camera')} accessibilityLabel="Take photo" style={{ width: 74, height: 74, borderRadius: 37, backgroundColor: '#fff', borderWidth: 5, borderColor: 'rgba(25,21,18,.12)', alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent }} />
                </Pressable>
              </>
            )}
          </View>

          <Pressable onPress={() => go('home')} style={{ position: 'absolute', top: 60, left: 20, width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(0,0,0,.4)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: '#fff' }}>✕</Text>
          </Pressable>
        </View>

        {s.scanPhase === 'busy' && (
          <View style={[FILL, { backgroundColor: 'rgba(13,11,10,.55)' }]}>
            <View style={{ position: 'absolute', bottom: 130, left: 24, right: 24, padding: 18, borderRadius: 20, backgroundColor: 'rgba(255,251,244,.94)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <PulseDot />
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>Reading your plate…</Text>
              </View>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: 'rgba(25,21,18,.6)' }}>Identifying each dish and estimating portions. This takes a few seconds.</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  const r = s.scanResult;
  const mult = (i: number) => s.scanMult[i] ?? 1;
  const total = r.items.reduce((a, it, i) => a + scaled(it, mult(i)).kcal, 0);
  const idx = Math.min(s.pin, Math.max(r.items.length - 1, 0));
  const sel = r.items[idx];
  const selScaled = sel ? scaled(sel, mult(idx)) : null;
  const bump = (dir: 1 | -1) => {
    const next = r.items.map((_, i) => mult(i));
    next[idx] = Math.max(0.5, Math.min(4, next[idx] + dir * 0.5));
    set({ scanMult: next });
  };
  const flagged = sel ? sel.allergens.filter((a) => s.allergies.includes(a)) : [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={{ height: 250, backgroundColor: colors.photoBg }}>
        {s.scanImage ? <Image source={{ uri: s.scanImage }} style={FILL} resizeMode="cover" /> : <PlaceholderImage label="" style={FILL} />}
        <Pressable onPress={() => go('home')} style={{ position: 'absolute', top: 60, left: 20, width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(0,0,0,.45)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: '#fff' }}>✕</Text>
        </Pressable>
        <View style={{ position: 'absolute', bottom: 14, right: 20, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99, backgroundColor: r.source === 'ai' ? 'rgba(27,138,90,.92)' : 'rgba(43,56,148,.92)' }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: '#fff' }}>{r.source === 'ai' ? 'AI estimate' : 'Demo result'}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        {r.source === 'demo' && (
          <View style={{ padding: 14, borderRadius: 16, backgroundColor: colors.indigoBg, borderWidth: 1, borderColor: colors.indigoLine, marginBottom: 12 }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.indigo, marginBottom: 3 }}>This is sample data, not your photo</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 18, color: 'rgba(25,21,18,.6)' }}>The analysis service did not answer ({r.reason}).</Text>
          </View>
        )}

        {!sel || !selScaled ? (
          <View style={{ padding: 22, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink, marginBottom: 6 }}>No food found in that photo</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: 'rgba(25,21,18,.6)' }}>Try again with the whole plate in frame and good light.</Text>
          </View>
        ) : (
          <>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(25,21,18,.42)', marginBottom: 8 }}>Tap a dish to adjust</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
              {r.items.map((it, i) => (
                <Pressable key={i} onPress={() => set({ pin: i })} style={{ paddingHorizontal: 11, paddingVertical: 8, borderRadius: 11, backgroundColor: i === idx ? colors.accent : 'rgba(13,11,10,.62)' }}>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: '#fff' }}>{it.name} · {scaled(it, mult(i)).kcal}</Text>
                </Pressable>
              ))}
            </View>

            <View style={{ padding: 18, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.display, fontSize: 21, color: colors.ink }}>{sel.name}</Text>
                  <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, color: 'rgba(25,21,18,.5)', marginTop: 5 }}>
                    {sel.grams ? `about ${Math.round(sel.grams * mult(idx))} g · ` : ''}{sel.confidence} confidence
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 20, color: colors.ink }}>{selScaled.kcal}</Text>
                  <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 10.5, color: 'rgba(25,21,18,.45)', marginTop: 4 }}>kcal</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 18 }}>
                <Pressable onPress={() => bump(-1)} accessibilityLabel="Smaller portion" style={step}><Text style={stepText}>−</Text></Pressable>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink }}>{mult(idx) === 1 ? sel.portion : `${mult(idx)}× ${sel.portion}`}</Text>
                  <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 10.5, color: 'rgba(25,21,18,.45)', marginTop: 5 }}>portion</Text>
                </View>
                <Pressable onPress={() => bump(1)} accessibilityLabel="Larger portion" style={step}><Text style={stepText}>+</Text></Pressable>
              </View>
              <View style={{ flexDirection: 'row', gap: 7, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.lineSoft }}>
                {([['carb', selScaled.carbs], ['protein', selScaled.protein], ['fat', selScaled.fat], ['fibre', selScaled.fibre]] as const).map(([k, v]) => (
                  <View key={k} style={{ flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 11, backgroundColor: colors.chipAlt }}>
                    <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: colors.ink }}>{v}g</Text>
                    <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 10, color: 'rgba(25,21,18,.45)', marginTop: 5 }}>{k}</Text>
                  </View>
                ))}
              </View>
              {flagged.length > 0 && (
                <View style={{ marginTop: 12, padding: 11, borderRadius: 12, backgroundColor: colors.redBg, borderWidth: 1, borderColor: colors.redLine }}>
                  <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 11.5, lineHeight: 16, color: colors.redDark }}>
                    Usually contains {flagged.join(' and ').toLowerCase()} — on your flag list. Check before eating.
                  </Text>
                </View>
              )}
            </View>

            <View style={{ padding: 14, borderRadius: 16, backgroundColor: colors.amberBg, borderWidth: 1, borderColor: colors.amberLine, marginTop: 12 }}>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: colors.amberDark }}>
                Photo estimates are approximate — hidden oil and portion depth are easy to miss. Adjust anything that looks off.{r.notes ? ` ${r.notes}` : ''}
              </Text>
            </View>

            {r.hiddenOilTsp != null && (
              <View style={{ padding: 17, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft, marginTop: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                  <Text style={{ fontSize: 15 }}>🫗</Text>
                  <Text style={{ flex: 1, fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>Hidden-oil meter</Text>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: colors.red }}>{r.hiddenOilTsp} tsp</Text>
                </View>
                <View style={{ height: 9, borderRadius: 99, backgroundColor: colors.chip, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${Math.min(r.hiddenOilTsp / 5, 1) * 100}%`, borderRadius: 99, backgroundColor: colors.amber }} />
                </View>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 19, color: 'rgba(25,21,18,.55)', marginTop: 10 }}>
                  About {Math.round(r.hiddenOilTsp * 40)} kcal of this meal is estimated cooking fat.
                </Text>
              </View>
            )}

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
          </>
        )}
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 30, backgroundColor: colors.cream, flexDirection: 'row', gap: 10 }}>
        <Pressable onPress={() => set({ scanPhase: 'aim', scanResult: null, scanImage: null })} accessibilityLabel="Retake" style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 18 }}>↺</Text>
        </Pressable>
        {sel && (
          <PrimaryButton
            label={`Log ${total.toLocaleString()} kcal`}
            onPress={() => {
              const n = logMeal(r, r.items.map((_, i) => mult(i)), 'photo');
              set({ screen: 'diary', scanPhase: 'aim', scanResult: null, scanImage: null });
              flash(`${n.toLocaleString()} kcal logged`);
            }}
            style={{ flex: 1 }}
          />
        )}
      </View>
    </View>
  );
}

const pill = { paddingHorizontal: 15, paddingVertical: 9, borderRadius: 99, backgroundColor: 'rgba(0,0,0,.45)' };
const pillText = { fontFamily: fonts.bodySemibold, fontSize: 12.5, color: '#fff' };
const step = { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.chip, alignItems: 'center' as const, justifyContent: 'center' as const };
const stepText = { fontFamily: fonts.bodyBold, fontSize: 17, color: colors.ink };
