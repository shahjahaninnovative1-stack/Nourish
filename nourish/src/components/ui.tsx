import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { colors, fonts, radii } from '../theme';

export function Screen({ children, padBottom = 108 }: { children: React.ReactNode; padBottom?: number }) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: padBottom }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function BackButton({ onPress, dark }: { onPress: () => void; dark?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 36, height: 36, borderRadius: 12, backgroundColor: dark ? 'rgba(255,251,244,.12)' : colors.chip,
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: dark ? colors.onDark : colors.ink }}>←</Text>
    </Pressable>
  );
}

export function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
      <BackButton onPress={onBack} />
      <Text style={{ fontFamily: fonts.display, fontSize: 22, color: colors.ink, letterSpacing: -0.4 }}>{title}</Text>
    </View>
  );
}

export function SubText({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[{ fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 20, color: colors.inkMuted, marginVertical: 12 }, style]}>{children}</Text>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function DarkCard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.darkCard, style]}>{children}</View>;
}

export function Pill({ label, tone = 'neutral', style }: { label: string; tone?: 'neutral' | 'green' | 'amber' | 'red' | 'dark'; style?: ViewStyle }) {
  const map = {
    neutral: { bg: colors.chip, fg: colors.inkMuted },
    green: { bg: '#EAF5EF', fg: colors.greenDark },
    amber: { bg: colors.amberBg, fg: colors.amberDark },
    red: { bg: colors.redBg, fg: colors.redDark },
    dark: { bg: colors.ink, fg: colors.onDark },
  }[tone];
  return (
    <View style={[{ paddingHorizontal: 11, paddingVertical: 6, borderRadius: radii.pill, backgroundColor: map.bg }, style]}>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: map.fg }}>{label}</Text>
    </View>
  );
}

export function Chip({
  label, active, onPress, activeBg = colors.ink, activeFg = colors.onDark, icon,
}: { label: string; active: boolean; onPress: () => void; activeBg?: string; activeFg?: string; icon?: string }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 13, paddingVertical: 9, borderRadius: radii.pill,
        borderWidth: 1.5, borderColor: active ? activeBg : colors.line,
        backgroundColor: active ? activeBg : colors.card,
        flexDirection: 'row', alignItems: 'center', gap: 6,
      }}
    >
      {icon ? <Text>{icon}</Text> : null}
      <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12.5, color: active ? activeFg : 'rgba(25,21,18,.65)' }}>{label}</Text>
    </Pressable>
  );
}

export function ProgressBar({ pct, color = colors.accent, trackColor = colors.chip, height = 7 }: { pct: number; color?: string; trackColor?: string; height?: number }) {
  return (
    <View style={{ height, borderRadius: radii.pill, backgroundColor: trackColor, overflow: 'hidden' }}>
      <View style={{ height: '100%', width: `${Math.max(0, Math.min(1, pct)) * 100}%`, borderRadius: radii.pill, backgroundColor: color }} />
    </View>
  );
}

export function Toggle({ on, onPress, activeColor = colors.green }: { on: boolean; onPress: () => void; activeColor?: string }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 46, height: 28, borderRadius: radii.pill, padding: 3,
        backgroundColor: on ? activeColor : '#E4DCCE',
        alignItems: on ? 'flex-end' : 'flex-start', justifyContent: 'center',
      }}
    >
      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' }} />
    </Pressable>
  );
}

export function PrimaryButton({ label, onPress, style, dim }: { label: string; onPress: () => void; style?: ViewStyle; dim?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={[{
        height: 52, borderRadius: radii.md, backgroundColor: dim ? colors.chip : colors.ink,
        alignItems: 'center', justifyContent: 'center',
      }, style]}
    >
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: dim ? 'rgba(25,21,18,.7)' : colors.onDark }}>{label}</Text>
    </Pressable>
  );
}

export function StepperRow({ label, value, onUp, onDown }: { label: string; value: string; onUp: () => void; onDown: () => void }) {
  return (
    <View style={styles.stepperRow}>
      <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.ink }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Pressable onPress={onDown} style={styles.stepperBtn}><Text style={styles.stepperBtnText}>−</Text></Pressable>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, minWidth: 74, textAlign: 'center', color: colors.ink }}>{value}</Text>
        <Pressable onPress={onUp} style={styles.stepperBtn}><Text style={styles.stepperBtnText}>+</Text></Pressable>
      </View>
    </View>
  );
}

export function PlaceholderImage({ label, style, dark }: { label: string; style?: ViewStyle; dark?: boolean }) {
  return (
    <View style={[{ backgroundColor: colors.photoBg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, style]}>
      <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12, color: dark ? 'rgba(255,255,255,.7)' : 'rgba(25,21,18,.35)', textAlign: 'center', paddingHorizontal: 10 }}>
        {label}
      </Text>
    </View>
  );
}

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <View style={styles.toast} pointerEvents="none">
      <View style={styles.toastCheck}><Text style={{ color: '#fff', fontFamily: fonts.bodyBold, fontSize: 12 }}>✓</Text></View>
      <Text style={{ flex: 1, fontFamily: fonts.bodySemibold, fontSize: 13, color: colors.onDark }}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radii.xl, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.lineSoft, padding: 18 },
  darkCard: { borderRadius: radii.xl, backgroundColor: colors.ink, padding: 20 },
  stepperRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, borderRadius: radii.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.lineSoft,
  },
  stepperBtn: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' },
  stepperBtnText: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink },
  toast: {
    position: 'absolute', left: 20, right: 20, bottom: 108, zIndex: 60, padding: 14, borderRadius: radii.md,
    backgroundColor: colors.ink, flexDirection: 'row', alignItems: 'center', gap: 11,
    shadowColor: '#000', shadowOpacity: 0.28, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 8,
  },
  toastCheck: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
});
