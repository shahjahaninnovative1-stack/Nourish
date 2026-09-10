import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { PERMISSIONS_META } from '../data';
import { PrimaryButton, Toggle } from '../components/ui';

export default function Permissions() {
  const { s, set, go, flash } = useApp();
  const onCount = Object.keys(s.permOn).filter((k) => s.permOn[k]).length;

  return (
    <View style={{ flex: 1, paddingTop: 64, paddingHorizontal: 26, paddingBottom: 40 }}>
      <Text style={{ fontFamily: fonts.display, fontSize: 32, lineHeight: 35, color: colors.ink, marginBottom: 10 }}>
        Three things{'\n'}and we're in.
      </Text>
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14.5, lineHeight: 22, color: 'rgba(25,21,18,.6)', marginBottom: 24 }}>
        Nourish only asks for what it actually uses. Say no to any of them and the rest still works.
      </Text>
      <View style={{ gap: 10 }}>
        {PERMISSIONS_META.map((p) => {
          const on = !!s.permOn[p.name];
          return (
            <View key={p.name} style={{ padding: 17, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1.5, borderColor: on ? colors.green : colors.line }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: p.iconBg, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18 }}>{p.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink }}>{p.name}</Text>
                  <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, lineHeight: 16, color: 'rgba(25,21,18,.5)', marginTop: 4 }}>{p.why}</Text>
                </View>
                <Toggle on={on} onPress={() => set({ permOn: { ...s.permOn, [p.name]: !on } })} />
              </View>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, lineHeight: 17, color: 'rgba(25,21,18,.42)', marginTop: 11, paddingTop: 11, borderTopWidth: 1, borderTopColor: colors.lineSoft }}>
                {p.detail}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={{ flex: 1, minHeight: 20 }} />
      <PrimaryButton
        label={onCount === 3 ? 'All set — let’s eat' : 'Continue without those'}
        onPress={() => { go('home'); flash('Permissions saved · change them any time in Me'); }}
        style={{ marginTop: 18 }}
      />
    </View>
  );
}
