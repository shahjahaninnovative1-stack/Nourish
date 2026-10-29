import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { LABEL_FLAGS, LABEL_INGREDIENTS, LABEL_SWAPS } from '../data';
import { PlaceholderImage, Screen, ScreenHeader } from '../components/ui';

const DOT_COLOR: Record<string, string> = { amber: colors.amber, red: colors.red, green: colors.green };

export default function Label() {
  const { goScan } = useApp();

  return (
    <Screen>
      <ScreenHeader title="Label check" onBack={goScan} />

      <View style={{ flexDirection: 'row', gap: 14, padding: 16, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft, marginBottom: 14 }}>
        <PlaceholderImage label="Pack shot" style={{ width: 76, height: 92, borderRadius: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11, color: 'rgba(25,21,18,.45)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Barcode 8901234·567890</Text>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15.5, color: colors.ink, marginTop: 7 }}>Everyday Elaichi Rusk</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, color: 'rgba(25,21,18,.5)', marginTop: 4 }}>Per 2 pieces · 28 g</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 11 }}>
            <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9, backgroundColor: colors.chipAlt }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: colors.ink }}>124 kcal</Text>
            </View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9, backgroundColor: colors.redBg }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: colors.red }}>High sodium</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ padding: 18, borderRadius: 20, backgroundColor: colors.redBg, borderWidth: 1, borderColor: colors.redLine, marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 }}>
          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: '#fff' }}>!</Text>
          </View>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.redDark }}>Not for you, Ayesha</Text>
        </View>
        <View style={{ gap: 9 }}>
          {LABEL_FLAGS.map((f) => (
            <View key={f.name} style={{ padding: 12, paddingHorizontal: 14, borderRadius: 13, backgroundColor: 'rgba(255,255,255,.75)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.redDark }}>{f.name}</Text>
                <View style={{ paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, backgroundColor: colors.red }}>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 9.5, letterSpacing: 0.5, color: '#fff', textTransform: 'uppercase' }}>{f.level}</Text>
                </View>
              </View>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 18, color: 'rgba(25,21,18,.65)', marginTop: 6 }}>{f.why}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ padding: 18, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft, marginBottom: 12 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink, marginBottom: 13 }}>Ingredients, decoded</Text>
        {LABEL_INGREDIENTS.map((i, idx) => (
          <View key={i.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9, borderBottomWidth: idx === LABEL_INGREDIENTS.length - 1 ? 0 : 1, borderBottomColor: 'rgba(25,21,18,.06)' }}>
            <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: DOT_COLOR[i.dot] }} />
            <Text style={{ flex: 1, fontFamily: fonts.bodySemibold, fontSize: 12.5, color: colors.ink }}>{i.name}</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, color: 'rgba(25,21,18,.5)', textAlign: 'right', maxWidth: 150 }}>{i.note}</Text>
          </View>
        ))}
      </View>

      <View style={{ padding: 18, borderRadius: 20, backgroundColor: colors.greenBg, borderWidth: 1, borderColor: colors.greenLine }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.greenDark, marginBottom: 11 }}>Safer swaps on your shelf</Text>
        <View style={{ gap: 8 }}>
          {LABEL_SWAPS.map((sw) => (
            <View key={sw.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 11, padding: 11, paddingHorizontal: 13, borderRadius: 13, backgroundColor: 'rgba(255,255,255,.8)' }}>
              <Text style={{ fontSize: 16 }}>{sw.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.ink }}>{sw.name}</Text>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11, color: 'rgba(25,21,18,.5)', marginTop: 3 }}>{sw.why}</Text>
              </View>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: colors.greenDark }}>{sw.kcal}</Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}
