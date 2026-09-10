import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors, fonts, radii } from '../theme';
import { useApp } from '../store';
import { QUICK_ADD } from '../data';
import { CalorieRing } from '../components/Charts';

const MACROS = [
  { name: 'Protein', val: '52 / 96 g', pct: 0.54, color: '#F5A524' },
  { name: 'Carbs', val: '168 / 210 g', pct: 0.8, color: '#E1552B' },
  { name: 'Fat', val: '41 / 62 g', pct: 0.66, color: '#8A6FD6' },
];

function IconMic() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round">
      <Rect x={9} y={2.5} width={6} height={11} rx={3} />
      <Path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
    </Svg>
  );
}

export default function Home() {
  const { s, d, go, flash } = useApp();

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 108 }} showsVerticalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <View>
          <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12, color: 'rgba(25,21,18,.45)', letterSpacing: 0.5 }}>Saturday, 5 Sept</Text>
          <Text style={{ fontFamily: fonts.display, fontSize: 25, color: colors.ink, marginTop: 5 }}>Assalam-o-alaikum 👋</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 99, backgroundColor: '#FFF0DE', borderWidth: 1, borderColor: 'rgba(245,165,36,.35)' }}>
          <Text style={{ fontSize: 14 }}>🔥</Text>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: '#B8730C' }}>12</Text>
        </View>
      </View>

      {/* Rings card */}
      <View style={{ padding: 22, borderRadius: 24, backgroundColor: colors.ink, marginBottom: 14, overflow: 'hidden' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 22 }}>
          <View style={{ width: 118, height: 118, alignItems: 'center', justifyContent: 'center' }}>
            <CalorieRing pct={d.remaining / d.target} />
            <View style={{ position: 'absolute', alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.display, fontSize: 29, color: colors.onDark }}>{d.remaining.toLocaleString()}</Text>
              <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 10, color: 'rgba(255,251,244,.55)', marginTop: 6, letterSpacing: 1 }}>kcal left</Text>
            </View>
          </View>
          <View style={{ flex: 1, gap: 11 }}>
            {MACROS.map((m) => (
              <View key={m.name}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 11.5, color: 'rgba(255,251,244,.7)' }}>{m.name}</Text>
                  <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 11.5, color: colors.onDark }}>{m.val}</Text>
                </View>
                <View style={{ height: 6, borderRadius: 99, backgroundColor: 'rgba(255,251,244,.16)', overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${m.pct * 100}%`, borderRadius: 99, backgroundColor: m.color }} />
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 20, marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,251,244,.14)' }}>
          {[['eaten', d.eaten.toLocaleString()], ['burned', '340'], ['target', d.target.toLocaleString()]].map(([label, val]) => (
            <View key={label}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: colors.onDark }}>{val}</Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 10.5, color: 'rgba(255,251,244,.5)', marginTop: 5 }}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* AI ambient cards */}
      <View style={{ gap: 10, marginBottom: 4 }}>
        <Pressable onPress={() => go('feed')} style={{ padding: 17, borderRadius: 18, backgroundColor: colors.amberBg, borderWidth: 1, borderColor: colors.amberLine }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 }}>
            <Text style={{ fontSize: 15 }}>🧠</Text>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1, color: 'rgba(25,21,18,.45)' }}>NOURISH AI</Text>
          </View>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.ink, marginBottom: 6 }}>Protein is trailing again</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: 'rgba(25,21,18,.6)' }}>18 g by 4pm. A cup of rajma or 150 g curd closes the gap without touching your calories.</Text>
        </Pressable>
        <Pressable onPress={() => go('feed')} style={{ padding: 17, borderRadius: 18, backgroundColor: colors.redBg, borderWidth: 1, borderColor: colors.redLine }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 }}>
            <Text style={{ fontSize: 15 }}>🧂</Text>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1, color: 'rgba(25,21,18,.45)' }}>NOURISH AI</Text>
          </View>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.ink, marginBottom: 6 }}>Sodium at 118% of target</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: 'rgba(25,21,18,.6)' }}>The elaichi rusk did most of it. Nourish will flag it next time you scan the pack.</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginVertical: 14 }}>
        <Pressable onPress={() => go('micros')} style={{ flex: 1, padding: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: 'rgba(25,21,18,.45)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Micros</Text>
          <Text style={{ fontFamily: fonts.display, fontSize: 22, color: colors.ink, marginTop: 8 }}>6 / 9</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, color: colors.red, marginTop: 5 }}>B12 & iron low</Text>
        </Pressable>
        <Pressable onPress={() => go('insights')} style={{ flex: 1, padding: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: 'rgba(25,21,18,.45)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Thali score</Text>
          <Text style={{ fontFamily: fonts.display, fontSize: 22, color: colors.ink, marginTop: 8 }}>74</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, color: colors.green, marginTop: 5 }}>+6 this week</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6, marginBottom: 12 }}>
        <Text style={{ fontFamily: fonts.displayBold, fontSize: 17, color: colors.ink }}>Quick add</Text>
        <Pressable onPress={() => go('diary')}><Text style={{ fontFamily: fonts.bodySemibold, fontSize: 12.5, color: colors.accent }}>Full diary →</Text></Pressable>
      </View>
      <View style={{ gap: 8 }}>
        {QUICK_ADD.map((q) => (
          <View key={q.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, borderRadius: 15, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
            <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: colors.chip, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 17 }}>{q.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>{q.name}</Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, color: 'rgba(25,21,18,.48)', marginTop: 4 }}>{q.serving} · {q.kcal} kcal</Text>
            </View>
            <Pressable onPress={() => flash(`${q.name} added · ${q.kcal} kcal`)} style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: colors.onDark }}>+</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Pressable onPress={() => go('voice')} style={{ marginTop: 14, padding: 16, borderRadius: 18, backgroundColor: colors.ink, flexDirection: 'row', alignItems: 'center', gap: 13 }}>
        <View style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}><IconMic /></View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.onDark }}>Just say what you ate</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, color: 'rgba(255,251,244,.6)', marginTop: 4 }}>"Two rotis, dal tadka and a chai"</Text>
        </View>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: colors.amber }}>→</Text>
      </Pressable>

      <Pressable onPress={() => go('future')} style={{ marginTop: 10, padding: 16, borderRadius: 18, backgroundColor: '#FFF0DE', borderWidth: 1, borderColor: 'rgba(245,165,36,.35)', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text style={{ fontSize: 20 }}>🪞</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>See yourself in 12 weeks</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, color: 'rgba(25,21,18,.55)', marginTop: 4 }}>At your current pace: −4.8 kg</Text>
        </View>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: '#B8730C' }}>→</Text>
      </Pressable>

      <Pressable onPress={() => go('split')} style={{ marginTop: 10, padding: 16, borderRadius: 18, backgroundColor: colors.indigoBg, borderWidth: 1, borderColor: colors.indigoLine, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text style={{ fontSize: 20 }}>🍽️</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>Eating from one handi tonight?</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, color: 'rgba(25,21,18,.55)', marginTop: 4 }}>Split the dish across the table in four taps</Text>
        </View>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: colors.indigo }}>→</Text>
      </Pressable>

      <Pressable onPress={() => go('recipes')} style={{ marginTop: 10, padding: 16, borderRadius: 18, backgroundColor: colors.greenBg, borderWidth: 1, borderColor: colors.greenLine, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text style={{ fontSize: 20 }}>🥗</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink }}>World kitchen</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 11.5, color: 'rgba(25,21,18,.55)', marginTop: 4 }}>24 healthy recipes · fits your {d.remaining.toLocaleString()} kcal</Text>
        </View>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: colors.green }}>→</Text>
      </Pressable>
    </ScrollView>
  );
}
