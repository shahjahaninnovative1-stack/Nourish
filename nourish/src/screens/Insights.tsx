import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { CAL_VALS, DOW, WEEK_NOTES } from '../data';
import { Screen, ScreenHeader } from '../components/ui';

export default function Insights() {
  const { go } = useApp();
  return (
    <Screen>
      <ScreenHeader title="Your week" onBack={() => go('home')} />

      <View style={{ padding: 22, borderRadius: 22, backgroundColor: colors.greenDark, marginBottom: 14 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(234,247,240,.7)' }}>Thali score</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 12 }}>
          <Text style={{ fontFamily: fonts.display, fontSize: 56, lineHeight: 48, color: '#EAF7F0' }}>74</Text>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: 'rgba(234,247,240,.85)', paddingBottom: 8 }}>+6 vs last week</Text>
        </View>
        <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 20, color: 'rgba(234,247,240,.85)', marginTop: 14 }}>
          Protein finally cleared 60 g on five days. Sodium is the one holding you back — three days above 2,300 mg.
        </Text>
      </View>

      <View style={{ padding: 20, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft, marginBottom: 14 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink, marginBottom: 16 }}>Calories vs target</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 110 }}>
          {DOW.map((dow, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: 8 }}>
              <View style={{ width: '100%', borderRadius: 6, height: `${Math.min(CAL_VALS[i], 1.2) / 1.2 * 100}%`, backgroundColor: CAL_VALS[i] > 1 ? colors.red : colors.green }} />
              <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 10, color: 'rgba(25,21,18,.4)' }}>{dow}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ gap: 9 }}>
        {WEEK_NOTES.map((n) => (
          <View key={n.title} style={{ flexDirection: 'row', gap: 12, padding: 15, paddingHorizontal: 16, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
            <Text style={{ fontSize: 17 }}>{n.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: colors.ink }}>{n.title}</Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 19, color: 'rgba(25,21,18,.55)', marginTop: 5 }}>{n.body}</Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}
