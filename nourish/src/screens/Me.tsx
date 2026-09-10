import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp, Screen as ScreenName } from '../store';
import { PlaceholderImage, Screen } from '../components/ui';

export default function Me() {
  const { s, d, set, go } = useApp();

  const meRows: { icon: string; name: string; meta: string; go: ScreenName }[] = [
    { icon: '🚫', name: 'Allergies & flags', meta: `${s.allergies.length} set`, go: 'ob' },
    { icon: '🔔', name: 'Nudges & healthy quotes', meta: `${d.notifCount} on`, go: 'nudges' },
    { icon: '🪞', name: 'Future you', meta: '12-week render', go: 'future' },
    { icon: '◉', name: 'Plate calibration', meta: `${s.plateCm} cm`, go: 'calib' },
    { icon: '🔐', name: 'Camera, mic & alerts', meta: `${d.permCount} of 3 on`, go: 'perm' },
    { icon: '🧠', name: 'What Nourish noticed', meta: '4 new', go: 'feed' },
    { icon: '🔬', name: 'Kitchen fingerprint', meta: '94% accurate', go: 'kitchen' },
    { icon: '🛡️', name: 'Allergy shield card', meta: `${s.allergies.length} listed`, go: 'shield' },
    { icon: '🧪', name: 'Micronutrient history', meta: '30 days', go: 'micros' },
    { icon: '📈', name: 'Weekly insights', meta: 'Score 74', go: 'insights' },
    { icon: '🥗', name: 'Saved recipes', meta: '12', go: 'recipes' },
  ];

  return (
    <Screen>
      <Text style={{ fontFamily: fonts.display, fontSize: 26, color: colors.ink, marginBottom: 16 }}>Me</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft, marginBottom: 12 }}>
        <PlaceholderImage label="Photo" style={{ width: 56, height: 56, borderRadius: 18 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink }}>Ayesha K.</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, color: 'rgba(25,21,18,.5)', marginTop: 5 }}>
            {s.age} · {s.sex} · {d.imp ? `${Math.round(s.wKg * 2.205)} lb` : `${s.wKg} kg`} · {s.goal}
          </Text>
        </View>
        <Pressable onPress={() => set({ screen: 'ob', ob: 0 })} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.chip }}>
          <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12, color: colors.ink }}>Edit</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        {[[String(d.target), 'daily kcal'], [d.bmi.toFixed(1), 'BMI'], ['12', 'day streak']].map(([val, label]) => (
          <View key={label} style={{ flex: 1, padding: 15, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 18, color: colors.ink }}>{val}</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11, lineHeight: 15, color: 'rgba(25,21,18,.5)', marginTop: 6 }}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={{ borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft, overflow: 'hidden', marginBottom: 12 }}>
        {meRows.map((r, idx) => (
          <Pressable
            key={r.name}
            onPress={() => (r.go === 'ob' ? set({ screen: 'ob', ob: 2 }) : go(r.go))}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, paddingHorizontal: 16, borderBottomWidth: idx === meRows.length - 1 ? 0 : 1, borderBottomColor: 'rgba(25,21,18,.06)' }}
          >
            <Text style={{ fontSize: 16 }}>{r.icon}</Text>
            <Text style={{ flex: 1, fontFamily: fonts.bodySemibold, fontSize: 13.5, color: colors.ink }}>{r.name}</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, color: 'rgba(25,21,18,.4)' }}>{r.meta}</Text>
            <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 14, color: 'rgba(25,21,18,.28)' }}>›</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => set({ units: d.imp ? 'Metric' : 'Imperial' })}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, paddingHorizontal: 16, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}
      >
        <Text style={{ fontSize: 16 }}>📐</Text>
        <Text style={{ flex: 1, fontFamily: fonts.bodySemibold, fontSize: 13.5, color: colors.ink }}>Units</Text>
        <View style={{ paddingHorizontal: 11, paddingVertical: 6, borderRadius: 99, backgroundColor: colors.ink }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: colors.onDark }}>{d.imp ? 'Imperial' : 'Metric'}</Text>
        </View>
      </Pressable>
    </Screen>
  );
}
