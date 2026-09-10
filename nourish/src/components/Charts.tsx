import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '../theme';

export function CalorieRing({ pct, size = 118 }: { pct: number; size?: number }) {
  const r = 52 * (size / 118);
  const c = size / 2;
  const C = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(pct, 1));
  return (
    <Svg width={size} height={size} viewBox="0 0 118 118" style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={59} cy={59} r={52} fill="none" stroke="rgba(255,251,244,.16)" strokeWidth={11} />
      <Circle
        cx={59} cy={59} r={52} fill="none" stroke={colors.accent} strokeWidth={11} strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * 52}`} strokeDashoffset={2 * Math.PI * 52 * (1 - clamped)}
      />
    </Svg>
  );
}

export function ThaliPlate({ pct = 0.58 }: { pct?: number }) {
  const segs = [
    { c: '#F5A524', v: 0.82 }, { c: '#E1552B', v: 0.54 }, { c: '#1B8A5A', v: 0.31 }, { c: '#8A6FD6', v: 0.66 },
  ];
  const R = 58;
  const quarter = (2 * Math.PI * R) / 4;
  const full = 2 * Math.PI * R;
  return (
    <View style={{ width: 132, height: 132, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={132} height={132} viewBox="0 0 132 132" style={{ position: 'absolute' }}>
        <Circle cx={66} cy={66} r={R} fill="none" stroke="#F3ECE0" strokeWidth={14} />
        {segs.map((s, i) => (
          <Circle
            key={i} cx={66} cy={66} r={R} fill="none" stroke={s.c} strokeWidth={14}
            strokeDasharray={`${quarter * s.v} ${full}`}
            rotation={i * 90 - 90} origin="66,66"
          />
        ))}
        <Circle cx={66} cy={66} r={36} fill="#FFFBF4" />
      </Svg>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 22, color: colors.ink }}>{Math.round(pct * 100)}%</Text>
      <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 9, color: 'rgba(25,21,18,.45)', marginTop: 2 }}>FULL</Text>
    </View>
  );
}
