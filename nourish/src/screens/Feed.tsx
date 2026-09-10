import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { AI_FEED } from '../data';
import { Screen, ScreenHeader } from '../components/ui';

const TONE_BG: Record<string, { bg: string; bd: string }> = {
  amber: { bg: colors.amberBg, bd: colors.amberLine },
  red: { bg: colors.redBg, bd: colors.redLine },
  green: { bg: colors.greenBg, bd: colors.greenLine },
  plain: { bg: '#fff', bd: colors.lineSoft },
};

export default function Feed() {
  const { go } = useApp();
  return (
    <Screen>
      <ScreenHeader title="What Nourish noticed" onBack={() => go('home')} />
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 20, color: 'rgba(25,21,18,.55)', marginVertical: 10 }}>
        No chatbot. Just the handful of things worth knowing, written the moment we spot them.
      </Text>
      <View style={{ gap: 10 }}>
        {AI_FEED.map((f) => {
          const tone = TONE_BG[f.tone];
          return (
            <View key={f.title} style={{ padding: 17, paddingHorizontal: 18, borderRadius: 18, backgroundColor: tone.bg, borderWidth: 1, borderColor: tone.bd }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 }}>
                <Text style={{ fontSize: 15 }}>{f.icon}</Text>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(25,21,18,.45)' }}>{f.kind}</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 10.5, color: 'rgba(25,21,18,.35)' }}>{f.when}</Text>
              </View>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14.5, lineHeight: 19, color: colors.ink, marginBottom: 6 }}>{f.title}</Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: 'rgba(25,21,18,.6)' }}>{f.body}</Text>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
