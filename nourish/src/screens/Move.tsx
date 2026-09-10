import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { DOW, MOVE_STATS, STEP_VALS, SESSIONS, CONNECTED_APPS } from '../data';
import { Pill, Screen } from '../components/ui';

export default function Move() {
  return (
    <Screen>
      <Text style={{ fontFamily: fonts.display, fontSize: 26, color: colors.ink, marginBottom: 16 }}>Move</Text>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
        {MOVE_STATS.map((s) => (
          <View key={s.name} style={{ flex: 1, padding: 16, paddingHorizontal: 14, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
            <Text style={{ fontSize: 16, marginBottom: 9 }}>{s.icon}</Text>
            <Text style={{ fontFamily: fonts.display, fontSize: 20, color: colors.ink }}>{s.val}</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11, lineHeight: 15, color: 'rgba(25,21,18,.5)', marginTop: 5 }}>{s.name}</Text>
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

      <Text style={{ fontFamily: fonts.displayBold, fontSize: 17, color: colors.ink, marginVertical: 12 }}>Today's sessions</Text>
      <View style={{ gap: 8, marginBottom: 20 }}>
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
    </Screen>
  );
}
