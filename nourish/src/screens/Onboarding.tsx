import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { colors, fonts, radii } from '../theme';
import { useApp } from '../store';
import { ACTIVITY_LEVELS, ALLERGY_OPTIONS, GOAL_LIST, REGIONS } from '../data';
import { Chip, PrimaryButton, StepperRow } from '../components/ui';

export default function Onboarding() {
  const { s, set, go, d, flash } = useApp();
  const imp = d.imp;

  const obNext = () => {
    if (s.ob < 2) set({ ob: (s.ob + 1) as 0 | 1 | 2 });
    else {
      set({ screen: 'perm', ob: 0 });
      flash(`Target set: ${d.target} kcal a day`);
    }
  };
  const obBack = () => {
    if (s.ob > 0) set({ ob: (s.ob - 1) as 0 | 1 | 2 });
    else go('home');
  };

  return (
    <View style={{ flex: 1, paddingTop: 64, paddingHorizontal: 26, paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 30 }}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ flex: 1, height: 4, borderRadius: 99, backgroundColor: s.ob >= i ? colors.accent : colors.chip }} />
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {s.ob === 0 && (
          <View>
            <Text style={{ fontFamily: fonts.display, fontSize: 32, lineHeight: 35, color: colors.ink, marginBottom: 10 }}>
              Let's size up{'\n'}your thali.
            </Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14.5, lineHeight: 22, color: 'rgba(25,21,18,.6)', marginBottom: 26 }}>
              Six taps and we'll know your numbers. No calorie shaming, promise.
            </Text>
            <Text style={sectionLabel}>Sex</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
              {(['Female', 'Male'] as const).map((sx) => {
                const active = s.sex === sx;
                return (
                  <Pressable
                    key={sx}
                    onPress={() => set({ sex: sx })}
                    style={{
                      flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center',
                      borderWidth: 1.5, borderColor: active ? colors.ink : colors.line,
                      backgroundColor: active ? colors.ink : '#fff',
                    }}
                  >
                    <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 14, color: active ? colors.cream : 'rgba(25,21,18,.65)' }}>{sx}</Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={{ gap: 10 }}>
              <StepperRow label="Age" value={`${s.age} yrs`} onUp={() => set({ age: s.age + 1 })} onDown={() => set({ age: Math.max(s.age - 1, 14) })} />
              <StepperRow label="Height" value={d.hStr} onUp={() => set({ hCm: s.hCm + 1 })} onDown={() => set({ hCm: Math.max(s.hCm - 1, 120) })} />
              <StepperRow label="Weight" value={d.wStr} onUp={() => set({ wKg: s.wKg + 1 })} onDown={() => set({ wKg: Math.max(s.wKg - 1, 30) })} />
              <Pressable onPress={() => set({ units: imp ? 'Metric' : 'Imperial' })} style={{ alignSelf: 'flex-start', marginTop: 2, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.chip }}>
                <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12, color: 'rgba(25,21,18,.6)' }}>Switch to {imp ? 'metric (cm / kg)' : 'imperial (ft / lb)'}</Text>
              </Pressable>
            </View>
          </View>
        )}

        {s.ob === 1 && (
          <View>
            <Text style={{ fontFamily: fonts.display, fontSize: 32, lineHeight: 35, color: colors.ink, marginBottom: 10 }}>
              What are we{'\n'}playing for?
            </Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14.5, lineHeight: 22, color: 'rgba(25,21,18,.6)', marginBottom: 24 }}>
              Pick a goal and how much you move. We'll set the daily target.
            </Text>
            <View style={{ gap: 9, marginBottom: 26 }}>
              {GOAL_LIST.map((g) => {
                const active = s.goal === g.key;
                return (
                  <Pressable
                    key={g.key}
                    onPress={() => set({ goal: g.key as typeof s.goal })}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, borderRadius: 15,
                      borderWidth: 1.5, borderColor: active ? colors.amber : colors.line,
                      backgroundColor: active ? colors.amberBg : '#fff',
                    }}
                  >
                    <Text style={{ fontSize: 19 }}>{g.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.ink }}>{g.key}</Text>
                      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, color: 'rgba(25,21,18,.5)', marginTop: 3 }}>{g.sub}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            <Text style={sectionLabel}>Activity level</Text>
            <View style={{ flexDirection: 'row', gap: 7 }}>
              {ACTIVITY_LEVELS.map((a) => (
                <Chip key={a} label={a} active={s.act === a} onPress={() => set({ act: a })} />
              ))}
            </View>
          </View>
        )}

        {s.ob === 2 && (
          <View>
            <Text style={{ fontFamily: fonts.display, fontSize: 32, lineHeight: 35, color: colors.ink, marginBottom: 10 }}>
              Anything we{'\n'}should flag?
            </Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14.5, lineHeight: 22, color: 'rgba(25,21,18,.6)', marginBottom: 22 }}>
              We'll scream (politely) when a label hides one of these.
            </Text>
            <Text style={sectionLabel}>Allergies & intolerances</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {ALLERGY_OPTIONS.map((n) => {
                const on = s.allergies.indexOf(n) > -1;
                return (
                  <Chip
                    key={n}
                    label={n}
                    active={on}
                    activeBg={colors.red}
                    activeFg="#fff"
                    onPress={() => set({ allergies: on ? s.allergies.filter((x) => x !== n) : s.allergies.concat([n]) })}
                  />
                );
              })}
            </View>
            <Text style={sectionLabel}>Kitchen region</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 22 }}>
              {REGIONS.map((r) => (
                <Chip key={r} label={r} active={s.region === r} onPress={() => set({ region: r })} />
              ))}
            </View>
            <View style={{ padding: 14, borderRadius: 14, backgroundColor: colors.greenBg, borderWidth: 1, borderColor: colors.greenLine, flexDirection: 'row', gap: 11 }}>
              <Text style={{ fontSize: 15 }}>🔒</Text>
              <Text style={{ flex: 1, fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: 'rgba(25,21,18,.65)' }}>
                Health data stays on device. Label scans are matched locally first, then anonymised.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 12 }}>
        <Pressable onPress={obBack} style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 18, color: 'rgba(25,21,18,.5)' }}>←</Text>
        </Pressable>
        <PrimaryButton label={s.ob === 2 ? 'Build my plan 🎉' : 'Continue'} onPress={obNext} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const sectionLabel = {
  fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' as const,
  color: 'rgba(25,21,18,.42)', marginBottom: 10,
};
