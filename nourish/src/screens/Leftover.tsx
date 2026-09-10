import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { LEFTOVERS } from '../data';
import { PlaceholderImage, PrimaryButton, Screen, ScreenHeader } from '../components/ui';

export default function Leftover() {
  const { s, set, go, flash } = useApp();
  return (
    <Screen padBottom={40}>
      <ScreenHeader title="Leftover re-scan" onBack={() => go('home')} />
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 20, color: 'rgba(25,21,18,.55)', marginVertical: 10 }}>
        Every other app charges you for the plate you were served. Nourish charges you for the plate you finished.
      </Text>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
        <View style={{ flex: 1 }}>
          <PlaceholderImage label="Before" style={{ height: 140, borderRadius: 16 }} />
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(25,21,18,.45)', marginTop: 9 }}>Served · 760</Text>
        </View>
        <View style={{ flex: 1 }}>
          <PlaceholderImage label="After" style={{ height: 140, borderRadius: 16 }} />
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: colors.greenDark, marginTop: 9 }}>Eaten · 553</Text>
        </View>
      </View>

      <View style={{ padding: 18, borderRadius: 20, backgroundColor: colors.greenBg, borderWidth: 1, borderColor: colors.greenLine, marginBottom: 12 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.greenDark, marginBottom: 12 }}>You left food on the plate</Text>
        <View style={{ gap: 8 }}>
          {LEFTOVERS.map((l) => (
            <View key={l.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 11, padding: 11, paddingHorizontal: 13, borderRadius: 13, backgroundColor: 'rgba(255,255,255,.82)' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.ink }}>{l.name}</Text>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11, color: 'rgba(25,21,18,.5)', marginTop: 3 }}>{l.note}</Text>
              </View>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, color: l.zero ? 'rgba(25,21,18,.35)' : colors.green }}>{l.delta}</Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.greenLine }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: colors.greenDark }}>Correction</Text>
          <Text style={{ fontFamily: fonts.display, fontSize: 24, color: colors.greenDark }}>−207 kcal</Text>
        </View>
      </View>

      <View style={{ padding: 14, paddingHorizontal: 16, borderRadius: 16, backgroundColor: colors.indigoBg, borderWidth: 1, borderColor: colors.indigoLine, marginBottom: 14 }}>
        <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: 'rgba(25,21,18,.65)' }}>
          This is the third time you've left a roti behind at dinner. Nourish will serve you one fewer in tomorrow's plan.
        </Text>
      </View>

      <PrimaryButton
        label="Apply correction"
        onPress={() => {
          set({ screen: 'diary', eatenBase: Math.max(s.eatenBase - 207, 0) });
          flash('Corrected · 207 kcal back in your budget');
        }}
      />
    </Screen>
  );
}
