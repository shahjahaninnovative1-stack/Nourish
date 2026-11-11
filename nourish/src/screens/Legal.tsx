import React from 'react';
import { Share, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { useApp } from '../store';
import { APP_NAME, DEMO_MODE, MIN_AGE } from '../brand';
import { PrimaryButton, Screen, ScreenHeader } from '../components/ui';

const SECTIONS: { title: string; body: string }[] = [
  {
    title: 'Not medical advice',
    body: `${APP_NAME} gives general wellness information. It does not diagnose, treat or prevent any condition. Calorie and nutrient figures are estimates and can be wrong by a wide margin. Talk to a doctor or registered dietitian before changing your diet, especially if you are pregnant, have a medical condition, or have a history of disordered eating.`,
  },
  {
    title: 'Allergens',
    body: 'Allergen flags come from listed ingredients only. They cannot detect cross-contamination, recipe changes or unlabelled ingredients, and this app never confirms that a food is safe for you. Always read the label and ask whoever prepared the food.',
  },
  {
    title: 'Your data',
    body: 'Your profile (age, sex, height, weight, goal, allergies and preferences) is stored on this device only. This version does not create an account, does not upload your profile, and contains no advertising or tracking.',
  },
  {
    title: 'Who can use it',
    body: `${APP_NAME} is for adults aged ${MIN_AGE} and over. It is not designed for children or teenagers.`,
  },
  {
    title: 'If tracking stops helping',
    body: 'Counting calories is not right for everyone. If logging food is causing anxiety, guilt or a need to restrict, stop using the app and speak to a health professional.',
  },
];

export default function Legal() {
  const { s, go, resetAll, flash } = useApp();
  // Export is free and unrestricted: the data is the user's own.
  const exportData = async () => {
    const { screen, toast, scanPhase, pin, micState, typed, dropped, ob, ...profile } = s;
    try { await Share.share({ title: `${APP_NAME} data export`, message: JSON.stringify(profile, null, 2) }); }
    catch { flash('Export prepared — sharing is not available in this browser'); }
  };
  return (
    <Screen padBottom={40}>
      <ScreenHeader title="Privacy & terms" onBack={() => go('me')} />
      {DEMO_MODE && (
        <View style={{ padding: 14, borderRadius: 16, backgroundColor: colors.indigoBg, borderWidth: 1, borderColor: colors.indigoLine, marginTop: 10 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.indigo, marginBottom: 4 }}>This is a demo build</Text>
          <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 18, color: 'rgba(25,21,18,.6)' }}>
            Photo scanning, voice logging and insights show sample results. They are not analysing your real food yet.
          </Text>
        </View>
      )}
      <View style={{ gap: 10, marginTop: 12 }}>
        {SECTIONS.map((sec) => (
          <View key={sec.title} style={{ padding: 16, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.lineSoft }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink, marginBottom: 6 }}>{sec.title}</Text>
            <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 12.5, lineHeight: 19, color: 'rgba(25,21,18,.6)' }}>{sec.body}</Text>
          </View>
        ))}
      </View>
      <PrimaryButton label="Export my data" onPress={exportData} style={{ marginTop: 16 }} />
      <PrimaryButton
        label="Delete my data from this device"
        dim
        onPress={() => { resetAll(); flash('All data deleted'); }}
        style={{ marginTop: 10 }}
      />
    </Screen>
  );
}
