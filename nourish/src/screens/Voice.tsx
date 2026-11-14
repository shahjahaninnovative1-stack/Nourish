import React, { useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { VOICE_EXAMPLES } from '../data';
import { Consent } from '../components/Consent';

function IconMic() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.1} strokeLinecap="round">
      <Rect x={9} y={2.5} width={6} height={11} rx={3} />
      <Path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
    </Svg>
  );
}

// Browser speech recognition, where the browser has it. Native builds use the
// keyboard's own dictation key in the text box instead, which needs no extra
// permission or library.
function speechCtor(): any {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export default function Voice() {
  const { s, d, set, go, runVoice, logMeal, flash } = useApp();
  const [listening, setListening] = useState(false);
  const [dropped, setDropped] = useState<number[]>([]);
  const rec = useRef<any>(null);
  const r = s.voiceResult;

  const toggleMic = () => {
    if (listening) { rec.current?.stop(); return; }
    const Ctor = speechCtor();
    if (!Ctor) { flash(Platform.OS === 'web' ? 'Speech input is not available in this browser — type it instead' : 'Tap the mic on your keyboard to dictate'); return; }
    const sr = new Ctor();
    rec.current = sr;
    sr.interimResults = false;
    sr.onresult = (e: any) => {
      const said = Array.from(e.results).map((x: any) => x[0].transcript).join(' ');
      set({ voiceText: `${s.voiceText} ${said}`.trim() });
    };
    sr.onerror = () => { setListening(false); flash('Could not hear that — type it instead'); };
    sr.onend = () => setListening(false);
    setListening(true);
    try { sr.start(); } catch { setListening(false); }
  };

  const reset = () => { setDropped([]); set({ voiceResult: null, voiceText: '' }); };
  const kept = r ? r.items.filter((_, i) => !dropped.includes(i)) : [];
  const total = kept.reduce((a, it) => a + it.kcal, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream, paddingTop: 52 }}>
      <View style={{ flex: 1, backgroundColor: colors.ink, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 24, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable onPress={() => { reset(); go('home'); }} style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,251,244,.12)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: colors.onDark }}>✕</Text>
          </Pressable>
          <Text style={{ flex: 1, fontFamily: fonts.display, fontSize: 20, color: colors.onDark }}>Talk it in</Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingTop: 22 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {!s.aiConsent ? (
            <Consent dark onAllow={() => set({ aiConsent: true })} />
          ) : !r ? (
            <View>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 22, color: 'rgba(255,251,244,.55)', marginBottom: 14 }}>
                Say or type what you ate, in your own words. Mixing languages is fine.
              </Text>
              <TextInput
                value={s.voiceText}
                onChangeText={(t) => set({ voiceText: t })}
                placeholder="e.g. two rotis, a bowl of dal and a chai"
                placeholderTextColor="rgba(255,251,244,.3)"
                multiline
                maxLength={600}
                accessibilityLabel="What you ate"
                style={{ minHeight: 96, padding: 15, borderRadius: 16, backgroundColor: 'rgba(255,251,244,.08)', color: colors.onDark, fontFamily: fonts.bodyMedium, fontSize: 15, lineHeight: 22, textAlignVertical: 'top' }}
              />
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,251,244,.4)', marginTop: 20, marginBottom: 10 }}>Or try one of these</Text>
              <View style={{ gap: 8 }}>
                {VOICE_EXAMPLES.map((e) => (
                  <Pressable key={e} onPress={() => set({ voiceText: e })} style={{ padding: 13, borderRadius: 14, backgroundColor: 'rgba(255,251,244,.07)' }}>
                    <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13.5, color: 'rgba(255,251,244,.8)' }}>{e}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <View>
              {r.source === 'demo' && (
                <View style={{ padding: 13, borderRadius: 14, backgroundColor: 'rgba(120,134,255,.16)', borderWidth: 1, borderColor: 'rgba(120,134,255,.35)', marginBottom: 14 }}>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, color: '#C9CFFF', marginBottom: 3 }}>This is sample data, not what you typed</Text>
                  <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 18, color: 'rgba(255,251,244,.6)' }}>The analysis service did not answer ({r.reason}).</Text>
                </View>
              )}
              <View style={{ padding: 15, borderRadius: 15, backgroundColor: 'rgba(255,251,244,.07)', marginBottom: 16 }}>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13.5, lineHeight: 20, color: 'rgba(255,251,244,.7)' }}>"{s.voiceText}"</Text>
              </View>
              {kept.length === 0 ? (
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13.5, lineHeight: 20, color: 'rgba(255,251,244,.6)' }}>No food found in that. Try describing the dishes and how much of each.</Text>
              ) : (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                    <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,251,244,.4)' }}>Heard {kept.length} items</Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,251,244,.12)' }} />
                    <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: '#7ED3A8' }}>{total.toLocaleString()} kcal</Text>
                  </View>
                  <View style={{ gap: 8 }}>
                    {r.items.map((v, i) => dropped.includes(i) ? null : (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: 'rgba(255,251,244,.08)' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.onDark }}>{v.name}</Text>
                          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, color: 'rgba(255,251,244,.5)', marginTop: 4 }}>{v.portion} · {v.confidence} confidence</Text>
                        </View>
                        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: colors.onDark }}>{v.kcal}</Text>
                        <Pressable onPress={() => setDropped([...dropped, i])} accessibilityLabel={`Remove ${v.name}`} style={{ width: 26, height: 26, borderRadius: 9, backgroundColor: 'rgba(255,251,244,.1)', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: 'rgba(255,251,244,.55)' }}>✕</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                  <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, lineHeight: 17, color: 'rgba(255,251,244,.45)', marginTop: 12 }}>Estimates from your description. Remove anything that is wrong.</Text>
                </>
              )}
            </View>
          )}
        </ScrollView>

        {s.aiConsent && (
          <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 34, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            {!r ? (
              <>
                <Pressable onPress={toggleMic} accessibilityLabel={listening ? 'Stop listening' : 'Speak'} style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: listening ? colors.accent : 'rgba(255,251,244,.14)' }}>
                  <IconMic />
                </Pressable>
                <Pressable
                  onPress={() => (d.describesLeft === 0 ? flash("Today's free descriptions are used — quick add still works") : s.voiceText.trim().length < 2 ? flash('Say or type what you ate first') : runVoice(s.voiceText))}
                  disabled={s.voiceBusy}
                  style={{ flex: 1, height: 56, borderRadius: 16, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', opacity: s.voiceBusy ? 0.7 : 1 }}
                >
                  {s.voiceBusy ? <ActivityIndicator color="#fff" /> : <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: '#fff' }}>Work it out</Text>}
                </Pressable>
              </>
            ) : (
              <>
                <Pressable onPress={reset} accessibilityLabel="Start again" style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,251,244,.12)', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18, color: colors.onDark }}>↺</Text>
                </Pressable>
                {kept.length > 0 && (
                  <Pressable
                    onPress={() => {
                      const n = logMeal({ ...r, items: kept }, kept.map(() => 1), 'voice');
                      reset(); go('diary'); flash(`${n.toLocaleString()} kcal logged`);
                    }}
                    style={{ flex: 1, height: 52, borderRadius: 16, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: '#fff' }}>Log {total.toLocaleString()} kcal</Text>
                  </Pressable>
                )}
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
