import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { colors, fonts } from '../theme';
import { Screen, useApp } from '../store';

function IconHome({ color }: { color: string }) {
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 10.5 12 3l9 7.5" />
      <Path d="M5 9.5V21h14V9.5" />
    </Svg>
  );
}
function IconDiary({ color }: { color: string }) {
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={4} y={3} width={16} height={18} rx={3} />
      <Path d="M8 8h8M8 12h8M8 16h5" />
    </Svg>
  );
}
function IconMove({ color }: { color: string }) {
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 13h3l2.5-7 3.5 14 2.5-7h4.5" />
    </Svg>
  );
}
function IconMe({ color }: { color: string }) {
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={8} r={3.6} />
      <Path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" />
    </Svg>
  );
}
function IconMic({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round">
      <Rect x={9} y={2.5} width={6} height={11} rx={3} />
      <Path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
    </Svg>
  );
}
function IconScan({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <Circle cx={12} cy={12} r={3.2} />
    </Svg>
  );
}

export function TabBar() {
  const { s, go, goScan } = useApp();
  const tone = (t: Screen) => (s.screen === t ? colors.ink : 'rgba(25,21,18,.35)');
  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => go('home')} style={styles.tab}>
        <IconHome color={tone('home')} />
        <Text style={[styles.label, { color: tone('home') }]}>Home</Text>
      </Pressable>
      <Pressable onPress={() => go('diary')} style={styles.tab}>
        <IconDiary color={tone('diary')} />
        <Text style={[styles.label, { color: tone('diary') }]}>Diary</Text>
      </Pressable>
      <View style={[styles.tab, { position: 'relative' }]}>
        <Pressable onPress={() => go('voice')} style={styles.micBtn}>
          <IconMic color="rgba(25,21,18,.55)" />
        </Pressable>
        <Pressable onPress={goScan} style={styles.scanBtn}>
          <IconScan color="#fff" />
        </Pressable>
      </View>
      <Pressable onPress={() => go('move')} style={styles.tab}>
        <IconMove color={tone('move')} />
        <Text style={[styles.label, { color: tone('move') }]}>Move</Text>
      </Pressable>
      <Pressable onPress={() => go('me')} style={styles.tab}>
        <IconMe color={tone('me')} />
        <Text style={[styles.label, { color: tone('me') }]}>Me</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
    paddingTop: 8, paddingHorizontal: 12, paddingBottom: 26,
    backgroundColor: 'rgba(255,251,244,.94)', borderTopWidth: 1, borderTopColor: colors.lineSoft,
    flexDirection: 'row', alignItems: 'center',
  },
  tab: { flex: 1, alignItems: 'center', gap: 5 },
  label: { fontFamily: fonts.bodySemibold, fontSize: 10 },
  micBtn: {
    // Sits clear of the 54px camera button (which is centred in this slot and
    // painted over it). At left:-2 the camera covered the mic's centre, leaving
    // a ~12px tappable sliver that opened the camera instead of voice logging.
    position: 'absolute', left: -28, top: 4, width: 36, height: 36, borderRadius: 12,
    backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center',
  },
  scanBtn: {
    width: 54, height: 54, marginTop: -22, borderRadius: 19, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.accent, shadowOpacity: 0.4, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
});
