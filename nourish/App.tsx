import React, { useCallback } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { NotoSansDevanagari_600SemiBold } from '@expo-google-fonts/noto-sans-devanagari';
import { NotoNastaliqUrdu_700Bold } from '@expo-google-fonts/noto-nastaliq-urdu';

import { colors } from './src/theme';
import { AppProvider, useApp } from './src/store';
import { ScreenRouter } from './src/screens';
import { TabBar } from './src/components/TabBar';
import { Toast } from './src/components/ui';

SplashScreen.preventAutoHideAsync().catch(() => {});

const TAB_SCREENS = new Set(['home', 'diary', 'move', 'me']);

function Root() {
  const { s } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <ScreenRouter screen={s.screen} />
        {TAB_SCREENS.has(s.screen) && <TabBar />}
        <Toast message={s.toast} />
      </View>
      <StatusBar style="dark" />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_500Medium,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    NotoSansDevanagari_600SemiBold,
    NotoNastaliqUrdu_700Bold,
  });

  const onLayout = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <AppProvider>
        <Root />
      </AppProvider>
    </View>
  );
}
