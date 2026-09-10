import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { SHIELD_LINES } from '../data';
import { Screen, ScreenHeader } from '../components/ui';

const QR_SEED = [1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1];
const FONT_MAP: Record<string, string> = { body: fonts.body, devanagari: fonts.devanagari, nastaliq: fonts.nastaliq };

export default function Shield() {
  const { s, go, flash } = useApp();
  const tags = s.allergies.length ? s.allergies : ['Lactose'];

  return (
    <Screen padBottom={40}>
      <ScreenHeader title="Allergy shield" onBack={() => go('me')} />
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 20, color: 'rgba(25,21,18,.55)', marginVertical: 10 }}>
        Hand this to the waiter, the caterer, or whoever insists there's no cream in it.
      </Text>

      <View style={{ borderRadius: 24, overflow: 'hidden', backgroundColor: colors.red, marginBottom: 14 }}>
        <View style={{ padding: 22, paddingBottom: 18 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1.6, textTransform: 'uppercase', color: 'rgba(255,243,228,.75)' }}>Medical · allergy card</Text>
          <Text style={{ fontFamily: fonts.display, fontSize: 27, color: '#FFF3E4', marginTop: 12 }}>Do not serve me</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 14 }}>
            {tags.map((t) => (
              <View key={t} style={{ paddingHorizontal: 13, paddingVertical: 8, borderRadius: 99, backgroundColor: 'rgba(0,0,0,.22)' }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: '#FFF3E4' }}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ padding: 18, paddingHorizontal: 22, backgroundColor: 'rgba(0,0,0,.14)', flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <View style={{ flex: 1, gap: 9 }}>
            {SHIELD_LINES.map((l) => (
              <View key={l.lang}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,243,228,.7)' }}>{l.lang}</Text>
                <Text
                  style={{
                    fontFamily: FONT_MAP[l.font], fontSize: 15.5, lineHeight: 24, color: '#FFF3E4', marginTop: 5,
                    writingDirection: l.dir,
                    textAlign: l.dir === 'rtl' ? 'right' : 'left',
                  }}
                >
                  {l.text}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ width: 74, height: 74, borderRadius: 12, backgroundColor: '#FFF3E4', flexDirection: 'row', flexWrap: 'wrap', padding: 7 }}>
            {QR_SEED.map((v, i) => (
              <View key={i} style={{ width: '20%', height: '20%', padding: 1 }}>
                <View style={{ flex: 1, borderRadius: 1, backgroundColor: v ? colors.ink : 'transparent' }} />
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        <Pressable onPress={() => flash('Shield card link copied')} style={{ flex: 1, height: 50, borderRadius: 16, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: colors.onDark }}>Show full screen</Text>
        </Pressable>
        <Pressable onPress={() => flash('Shield card link copied')} style={{ flex: 1, height: 50, borderRadius: 16, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: 'rgba(25,21,18,.7)' }}>Send to family</Text>
        </Pressable>
      </View>

      <View style={{ padding: 16, paddingHorizontal: 18, borderRadius: 18, backgroundColor: colors.amberBg, borderWidth: 1, borderColor: colors.amberLine }}>
        <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: colors.amberDark }}>
          The QR opens a live page — if you edit your allergies here, every card you've already handed out updates itself.
        </Text>
      </View>
    </Screen>
  );
}
