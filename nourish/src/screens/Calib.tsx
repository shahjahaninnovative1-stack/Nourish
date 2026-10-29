import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { PLATES } from '../data';
import { PlaceholderImage, PrimaryButton, Screen, ScreenHeader, SubText } from '../components/ui';

export default function Calib() {
  const { s, set, goScan, flash } = useApp();

  return (
    <Screen padBottom={40}>
      <ScreenHeader title="Plate calibration" onBack={goScan} />
      <SubText>A photo can't tell a 22 cm plate from a 30 cm one — which is exactly where every other app loses 200 kcal. Calibrate once per plate.</SubText>

      <View style={{ height: 190, borderRadius: 20, overflow: 'hidden', marginBottom: 14, position: 'relative' }}>
        <PlaceholderImage label="Plate with a coin on it" style={{ width: '100%', height: '100%' }} />
        <View style={{ position: 'absolute', left: 16, bottom: 16, paddingHorizontal: 13, paddingVertical: 8, borderRadius: 99, backgroundColor: 'rgba(13,11,10,.75)' }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: '#fff' }}>◉ Reference found · ₹10 coin</Text>
        </View>
      </View>

      <View style={{ gap: 9, marginBottom: 14 }}>
        {PLATES.map((p) => {
          const on = p.cm !== null && s.plateCm === p.cm;
          return (
            <Pressable
              key={p.name}
              onPress={() => (p.cm === null ? flash('Hold a ₹10 coin beside the plate') : set({ plateCm: p.cm }))}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15, borderRadius: 17, borderWidth: 1.5, borderColor: on ? colors.ink : colors.line, backgroundColor: on ? colors.amberBg : '#fff' }}
            >
              <View style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 3, borderColor: on ? colors.accent : '#E4DCCE', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10, color: 'rgba(25,21,18,.5)' }}>{p.cm ?? '?'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>{p.name}</Text>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, lineHeight: 17, color: 'rgba(25,21,18,.5)', marginTop: 4 }}>{p.note}</Text>
              </View>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: on ? colors.accent : 'rgba(25,21,18,.4)' }}>
                {on ? 'In use' : p.cm === null ? 'Set up' : 'Switch'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ padding: 17, borderRadius: 18, backgroundColor: colors.ink, marginBottom: 12 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,251,244,.5)', marginBottom: 12 }}>What calibration bought you</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, padding: 13, borderRadius: 14, backgroundColor: 'rgba(255,251,244,.09)' }}>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 10.5, color: 'rgba(255,251,244,.5)' }}>Uncalibrated</Text>
            <Text style={{ fontFamily: fonts.display, fontSize: 22, color: colors.onDark, marginTop: 8 }}>±210</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 10.5, color: 'rgba(255,251,244,.5)', marginTop: 5 }}>kcal error</Text>
          </View>
          <View style={{ flex: 1, padding: 13, borderRadius: 14, backgroundColor: 'rgba(126,211,168,.16)' }}>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 10.5, color: '#7ED3A8' }}>Now</Text>
            <Text style={{ fontFamily: fonts.display, fontSize: 22, color: '#7ED3A8', marginTop: 8 }}>±34</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 10.5, color: 'rgba(126,211,168,.75)', marginTop: 5 }}>kcal error</Text>
          </View>
        </View>
      </View>

      <PrimaryButton label="Use this plate" onPress={goScan} />
    </Screen>
  );
}
