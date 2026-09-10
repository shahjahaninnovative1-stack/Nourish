import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { CUISINES } from '../data';
import { Chip, PlaceholderImage, Screen, ScreenHeader } from '../components/ui';

const RECIPE_TABS = ['All', 'Under 250', 'High protein', 'Vegan', 'No dairy', 'Batch cook'];

export default function Recipes() {
  const { s, set, go, d } = useApp();
  const originCount = d.originCount;

  const intro = s.cuisine === 'All'
    ? `Healthy cooking from ${originCount} kitchens — desi first, then everywhere else. Portions sized to your ${d.remaining.toLocaleString()} kcal left, and anything carrying one of your allergens is flagged, not hidden.`
    : `${s.cuisine} cooking, lightened. Portions already sized to your ${d.remaining.toLocaleString()} kcal left.`;

  const countLabel = d.shownRecipes.length === 24 ? `24 recipes from ${originCount} kitchens` : `${d.shownRecipes.length} of 24 recipes`;
  const allergyNote = d.shownRecipes.length === 0 ? '' : (d.blockedCount ? `${d.blockedCount} flagged for your allergies` : 'All clear for your allergies');

  return (
    <Screen>
      <ScreenHeader title="World kitchen" onBack={() => go('home')} />
      <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 20, color: 'rgba(25,21,18,.55)', marginVertical: 10 }}>{intro}</Text>

      <Text style={sectionLabel}>Kitchen</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
        {CUISINES.map((c) => (
          <Chip key={c.name} label={c.name} icon={c.flag} active={s.cuisine === c.name} onPress={() => set({ cuisine: c.name })} />
        ))}
      </View>

      <Text style={sectionLabel}>Filter</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
        {RECIPE_TABS.map((t) => (
          <Chip key={t} label={t} active={s.recipeTab === t} onPress={() => set({ recipeTab: t })} />
        ))}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: 'rgba(25,21,18,.45)' }}>{countLabel}</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(25,21,18,.1)' }} />
        <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 11.5, color: d.blockedCount ? colors.red : colors.green }}>{allergyNote}</Text>
      </View>

      <View style={{ gap: 12 }}>
        {d.shownRecipes.map((r) => (
          <View key={r.name} style={{ borderRadius: 20, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
            <View style={{ height: 132, position: 'relative' }}>
              <PlaceholderImage label={r.name} style={{ width: '100%', height: '100%' }} />
              <View style={{ position: 'absolute', top: 12, right: 12, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 99, backgroundColor: 'rgba(13,11,10,.72)' }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: '#fff' }}>{r.kcal} kcal</Text>
              </View>
              <View style={{ position: 'absolute', top: 12, left: 12, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 99, backgroundColor: 'rgba(255,251,244,.92)' }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11.5, color: colors.ink }}>{r.flag} {r.origin}</Text>
              </View>
            </View>
            <View style={{ padding: 15, paddingHorizontal: 16 }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, lineHeight: 19, color: colors.ink }}>{r.name}</Text>
              <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 18, color: 'rgba(25,21,18,.55)', marginTop: 6 }}>{r.note}</Text>
              {r.blocked ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, padding: 11, paddingHorizontal: 13, borderRadius: 12, backgroundColor: colors.redBg, borderWidth: 1, borderColor: colors.redLine, marginTop: 11 }}>
                  <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, color: '#fff' }}>!</Text>
                  </View>
                  <Text style={{ flex: 1, fontFamily: fonts.bodySemibold, fontSize: 11.5, lineHeight: 16, color: colors.redDark }}>{r.blocked}</Text>
                </View>
              ) : null}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                {r.tags.map((tg) => (
                  <View key={tg} style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: colors.chipAlt }}>
                    <Text style={{ fontFamily: fonts.bodySemibold, fontSize: 11, color: 'rgba(25,21,18,.6)' }}>{tg}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>

      {d.shownRecipes.length === 0 && (
        <View style={{ padding: 26, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(25,21,18,.18)', borderStyle: 'dashed', alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, lineHeight: 18, color: colors.ink, marginBottom: 6, textAlign: 'center' }}>Nothing matches both filters</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: 'rgba(25,21,18,.55)', textAlign: 'center' }}>Try a different kitchen, or loosen the filter to "All".</Text>
        </View>
      )}
    </Screen>
  );
}

const sectionLabel = {
  fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1.2, textTransform: 'uppercase' as const,
  color: 'rgba(25,21,18,.4)', marginBottom: 9,
};
