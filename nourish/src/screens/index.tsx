import React from 'react';
import { Text, View } from 'react-native';
import { Screen } from '../store';
import Onboarding from './Onboarding';
import Permissions from './Permissions';
import Home from './Home';
import Voice from './Voice';
import Scan from './Scan';
import Diary from './Diary';
import Label from './Label';
import Micros from './Micros';
import Move from './Move';
import Insights from './Insights';
import Recipes from './Recipes';
import Me from './Me';
import Feed from './Feed';
import Split from './Split';
import Leftover from './Leftover';
import Kitchen from './Kitchen';
import Shield from './Shield';
import Calib from './Calib';
import Future from './Future';
import Nudges from './Nudges';

const registry: Record<Screen, React.ComponentType> = {
  ob: Onboarding,
  perm: Permissions,
  home: Home,
  voice: Voice,
  scan: Scan,
  diary: Diary,
  label: Label,
  micros: Micros,
  move: Move,
  insights: Insights,
  recipes: Recipes,
  me: Me,
  feed: Feed,
  split: Split,
  leftover: Leftover,
  kitchen: Kitchen,
  shield: Shield,
  calib: Calib,
  future: Future,
  nudges: Nudges,
};

export function ScreenRouter({ screen }: { screen: Screen }) {
  const Comp = registry[screen];
  if (!Comp) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Unknown screen: {screen}</Text>
      </View>
    );
  }
  return <Comp />;
}
