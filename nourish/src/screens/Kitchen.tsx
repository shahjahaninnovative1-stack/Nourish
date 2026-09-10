import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { KITCHEN_ROWS } from '../data';
import { PrimaryButton, ProgressBar, Screen, ScreenHeader } from '../components/ui';

export default function Kitchen() {
  const { go, flash } = useApp();
  return (
    <Screen padBottom={40}>
      <ScreenHeader title="Kitchen fingerprint" onBack={() => go('me')} />
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 20, color: 'rgba(25,21,18,.55)', marginVertical: 10 }}>
        A generic database says a roti is 120 kcal. Yours isn't. Every correction you make teaches Nourish your kitchen.
      </Text>

      <View style={{ padding: 20, borderRadius: 22, backgroundColor: colors.ink, marginBottom: 14 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,251,244,.5)' }}>Accuracy on your food</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 12 }}>
          <Text style={{ fontFamily: fonts.display, fontSize: 48, lineHeight: 42, color: colors.onDark }}>94%</Text>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, lineHeight: 17, color: 'rgba(255,251,244,.65)', paddingBottom: 6 }}>up from 71% in{'\n'}your first week</Text>
        </View>
        <View style={{ marginTop: 16 }}>
          <ProgressBar pct={0.94} color={colors.amber} trackColor="rgba(255,251,244,.16)" height={8} />
        </View>
        <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 19, color: 'rgba(255,251,244,.6)', marginTop: 13 }}>
          Built from 68 photos, 24 portion corrections and 6 dishes you named yourself.
        </Text>
      </View>

      <View style={{ gap: 9 }}>
        {KITCHEN_ROWS.map((k) => (
          <View key={k.name} style={{ padding: 15, paddingHorizontal: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
              <Text style={{ fontSize: 16 }}>{k.icon}</Text>
              <Text style={{ flex: 1, fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>{k.name}</Text>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: colors.accentDark }}>{k.value}</Text>
            </View>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, lineHeight: 17, color: 'rgba(25,21,18,.5)', marginTop: 9 }}>{k.learned}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 11 }}>
              <View style={{ flex: 1 }}><ProgressBar pct={k.conf} color={colors.green} height={5} /></View>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10.5, color: 'rgba(25,21,18,.45)' }}>{Math.round(k.conf * 100)}% sure</Text>
            </View>
          </View>
        ))}
      </View>

      <PrimaryButton
        label="Teach it a new family dish"
        dim
        onPress={() => flash('Recording mode on — cook and narrate')}
        style={{ marginTop: 14, height: 50 }}
      />
    </Screen>
  );
}
