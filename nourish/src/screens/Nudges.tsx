import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { NOTIF_PREVIEW, NOTIF_SETTINGS_ICON, NOTIF_SETTINGS_META } from '../data';
import { Screen, ScreenHeader, Toggle } from '../components/ui';

export default function Nudges() {
  const { s, set, go, d } = useApp();

  return (
    <Screen padBottom={40}>
      <ScreenHeader title="Nudges & quotes" onBack={() => go('me')} />
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 20, color: 'rgba(25,21,18,.55)', marginVertical: 10 }}>
        Four a day, maximum. Each one is tied to something real that just happened — never a random buzz.
      </Text>

      <View style={{ gap: 10, marginBottom: 16 }}>
        {NOTIF_PREVIEW.map((n) => (
          <View key={n.title} style={{ padding: 15, paddingHorizontal: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 }}>
              <View style={{ width: 22, height: 22, borderRadius: 7, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10, color: '#fff' }}>N</Text>
              </View>
              <Text style={{ flex: 1, fontFamily: fonts.bodyBold, fontSize: 11, color: 'rgba(25,21,18,.5)' }}>NOURISH</Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11, color: 'rgba(25,21,18,.35)' }}>{n.when}</Text>
            </View>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, lineHeight: 18, color: colors.ink }}>{n.title}</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: 'rgba(25,21,18,.58)', marginTop: 5 }}>{n.body}</Text>
          </View>
        ))}
      </View>

      <View style={{ padding: 22, borderRadius: 22, backgroundColor: colors.ink, marginBottom: 14 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,251,244,.45)', marginBottom: 14 }}>Quote of the day</Text>
        <Text style={{ fontFamily: fonts.displayBold, fontSize: 22, lineHeight: 30, color: colors.onDark }}>{d.quote.t}</Text>
        <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12, color: 'rgba(255,251,244,.45)', marginTop: 14 }}>{d.quote.by}</Text>
        <Pressable onPress={() => set({ quoteIdx: s.quoteIdx + 1 })} style={{ alignSelf: 'flex-start', marginTop: 18, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, backgroundColor: 'rgba(255,251,244,.12)' }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: colors.onDark }}>Another one →</Text>
        </Pressable>
      </View>

      <Text style={{ fontFamily: fonts.displayBold, fontSize: 17, color: colors.ink, marginBottom: 12 }}>When should we tap you?</Text>
      <View style={{ gap: 8 }}>
        {Object.keys(s.notifOn).map((name) => {
          const on = !!s.notifOn[name];
          return (
            <View key={name} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingHorizontal: 16, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
              <Text style={{ fontSize: 16 }}>{NOTIF_SETTINGS_ICON[name]}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 13.5, color: colors.ink }}>{name}</Text>
                <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11, color: 'rgba(25,21,18,.45)', marginTop: 4 }}>{NOTIF_SETTINGS_META[name]}</Text>
              </View>
              <Toggle on={on} activeColor={colors.ink} onPress={() => set({ notifOn: { ...s.notifOn, [name]: !on } })} />
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
