import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { DOW, MOVE_STATS, STEP_VALS, SESSIONS, CONNECTED_APPS, WORKOUTS } from '../data';
import { Chip, Pill, PrimaryButton, Screen } from '../components/ui';
import { AdSlot } from '../components/AdSlot';
import { useApp } from '../store';

export default function Move() {
  const { s, d, set, flash } = useApp();
  const [pick, setPick] = useState(0);
  const [mins, setMins] = useState(30);
  const w = WORKOUTS[pick];
  // Energy cost from the activity's MET value and the user's own weight.
  const kcal = Math.round(w.met * s.wKg * (mins / 60));
  const logWorkout = () => {
    set({ workouts: [...s.workouts, { name: w.name, icon: w.icon, minutes: mins, kcal }] });
    flash(`${w.name} logged · ${kcal} kcal burned`);
  };
  return (
    <Screen>
      <Text style={{ fontFamily: fonts.display, fontSize: 26, color: colors.ink, marginBottom: 16 }}>Move</Text>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
        {MOVE_STATS.map((ms) => (
          <View key={ms.name} style={{ flex: 1, padding: 16, paddingHorizontal: 14, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
            <Text style={{ fontSize: 16, marginBottom: 9 }}>{ms.icon}</Text>
            <Text style={{ fontFamily: fonts.display, fontSize: 20, color: colors.ink }}>{ms.val}</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11, lineHeight: 15, color: 'rgba(25,21,18,.5)', marginTop: 5 }}>{ms.name}</Text>
          </View>
        ))}
      </View>

      <View style={{ padding: 20, borderRadius: 20, backgroundColor: colors.ink, marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: colors.onDark }}>Steps this week</Text>
          <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 11.5, color: 'rgba(255,251,244,.5)' }}>avg 8,140</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 96 }}>
          {DOW.map((dow, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: 8 }}>
              <View style={{ width: '100%', borderRadius: 6, height: `${STEP_VALS[i] * 100}%`, backgroundColor: i === 6 ? colors.accent : 'rgba(255,251,244,.28)' }} />
              <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 10, color: 'rgba(255,251,244,.45)' }}>{dow}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ padding: 18, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft, marginBottom: 6 }}>
        <Text style={{ fontFamily: fonts.displayBold, fontSize: 17, color: colors.ink, marginBottom: 12 }}>Log a workout</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
          {WORKOUTS.map((x, i) => <Chip key={x.name} label={x.name} icon={x.icon} active={pick === i} onPress={() => setPick(i)} />)}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <Pressable onPress={() => setMins(Math.max(5, mins - 5))} style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 17, color: colors.ink }}>−</Text>
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink }}>{mins} min</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11, color: 'rgba(25,21,18,.5)', marginTop: 4 }}>about {kcal} kcal at your weight</Text>
          </View>
          <Pressable onPress={() => setMins(Math.min(240, mins + 5))} style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 17, color: colors.ink }}>+</Text>
          </Pressable>
        </View>
        <PrimaryButton label={`Log ${w.name.toLowerCase()}`} onPress={logWorkout} />
        <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11, lineHeight: 16, color: 'rgba(25,21,18,.45)', marginTop: 10 }}>
          Burn figures are estimates. Total burned today: {d.burned.toLocaleString()} kcal.
        </Text>
      </View>

      <Text style={{ fontFamily: fonts.displayBold, fontSize: 17, color: colors.ink, marginVertical: 12 }}>Today's sessions</Text>
      <View style={{ gap: 8, marginBottom: 20 }}>
        {s.workouts.map((x, i) => (
          <View key={`w${i}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingHorizontal: 15, borderRadius: 16, backgroundColor: colors.greenBg, borderWidth: 1, borderColor: colors.greenLine }}>
            <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 17 }}>{x.icon}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>{x.name}</Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, color: 'rgba(25,21,18,.48)', marginTop: 4 }}>{x.minutes} min · logged by you</Text>
            </View>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.accent }}>−{x.kcal}</Text>
          </View>
        ))}
        {SESSIONS.map((s) => (
          <View key={s.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingHorizontal: 15, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
            <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 17 }}>{s.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>{s.name}</Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, color: 'rgba(25,21,18,.48)', marginTop: 4 }}>{s.meta}</Text>
            </View>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.accent }}>−{s.kcal}</Text>
          </View>
        ))}
      </View>

      <Text style={{ fontFamily: fonts.displayBold, fontSize: 17, color: colors.ink, marginBottom: 12 }}>Connected apps</Text>
      <View style={{ gap: 8 }}>
        {CONNECTED_APPS.map((a) => (
          <View key={a.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, paddingHorizontal: 15, borderRadius: 15, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: a.bg, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 15 }}>{a.icon}</Text>
            </View>
            <Text style={{ flex: 1, fontFamily: fonts.bodySemibold, fontSize: 13, color: colors.ink }}>{a.name}</Text>
            <Pill label={a.state} tone={a.connected ? 'green' : 'neutral'} />
          </View>
        ))}
      </View>
      <AdSlot placement="move" />
    </Screen>
  );
}
