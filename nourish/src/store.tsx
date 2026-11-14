import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RECIPES, QUOTES, DEMO_SCAN, DEMO_VOICE } from './data';
import { analyzePhoto, parseMealText, scaled, MealResult } from './ai';

export type Sex = 'Female' | 'Male';
export type Goal = 'Lose weight' | 'Maintain' | 'Build muscle' | 'Manage sugar';
export type Act = 'Sedentary' | 'Light' | 'Active' | 'Athlete';
export type Units = 'Metric' | 'Imperial';
export type Region = string;
export type ScanPhase = 'aim' | 'busy' | 'done';
export type LogEntry = { name: string; kcal: number; via: 'photo' | 'voice' | 'quick'; at: number };
export type Screen =
  | 'ob' | 'perm' | 'home' | 'voice' | 'scan' | 'diary' | 'label' | 'micros' | 'move'
  | 'insights' | 'recipes' | 'me' | 'feed' | 'split' | 'leftover' | 'kitchen' | 'shield'
  | 'calib' | 'future' | 'nudges' | 'legal';

type State = {
  screen: Screen;
  ob: 0 | 1 | 2;
  scanPhase: ScanPhase;
  pin: number;
  toast: string;
  sex: Sex; age: number; hCm: number; wKg: number; goal: Goal; act: Act;
  allergies: string[]; region: Region;
  units: Units;
  recipeTab: string; cuisine: string;
  eatenBase: number;
  shares: number[];
  horizon: 4 | 12 | 24 | 52; quoteIdx: number;
  scanResult: MealResult | null; scanImage: string | null; scanMult: number[];
  voiceText: string; voiceBusy: boolean; voiceResult: MealResult | null;
  aiConsent: boolean; log: LogEntry[];
  permOn: Record<string, boolean>;
  notifOn: Record<string, boolean>;
  plateCm: number;
  dropped: string[];
  onboarded: boolean;
  workouts: { name: string; icon: string; minutes: number; kcal: number }[];
};

const BURNED = 340;
const STORE_KEY = 'savora.profile.v1';
const PERSISTED: (keyof State)[] = [
  'sex', 'age', 'hCm', 'wKg', 'goal', 'act', 'allergies', 'region', 'units',
  'eatenBase', 'permOn', 'notifOn', 'plateCm', 'onboarded', 'workouts', 'aiConsent', 'log',
];

// Only the US, Liberia and Myanmar use pounds and feet day to day.
function defaultUnits(): Units {
  try {
    const loc = Intl.DateTimeFormat().resolvedOptions().locale || '';
    return /-(US|LR|MM)\b/i.test(loc) ? 'Imperial' : 'Metric';
  } catch { return 'Metric'; }
}

function initialState(): State {
  return {
    screen: 'ob', ob: 0, scanPhase: 'aim', pin: 0, toast: '',
    sex: 'Female', age: 28, hCm: 163, wKg: 68, goal: 'Lose weight', act: 'Light',
    allergies: ['Lactose', 'Peanuts'], region: 'South Asian',
    units: defaultUnits(),
    recipeTab: 'All', cuisine: 'All', eatenBase: 1120,
    shares: [40, 34, 26],
    horizon: 12, quoteIdx: 0,
    scanResult: null, scanImage: null, scanMult: [],
    voiceText: '', voiceBusy: false, voiceResult: null,
    aiConsent: false, log: [],
    permOn: { Camera: true, Microphone: true, Notifications: true },
    notifOn: { Breakfast: true, 'Water reminders': false, 'Evening check-in': true, 'Quote of the day': true, 'Streak rescue': true },
    plateCm: 26, dropped: [], onboarded: false, workouts: [],
  };
}

function target(s: State) {
  const m = s.sex === 'Male' ? 5 : -161;
  const bmr = 10 * s.wKg + 6.25 * s.hCm - 5 * s.age + m;
  const f = { Sedentary: 1.25, Light: 1.38, Active: 1.55, Athlete: 1.72 }[s.act] || 1.38;
  const g = { 'Lose weight': -380, Maintain: 0, 'Build muscle': 240, 'Manage sugar': -180 }[s.goal] || 0;
  return Math.round(((bmr * f + g) / 10)) * 10;
}

export function useDerived(s: State) {
  return useMemo(() => {
    const imp = s.units === 'Imperial';
    const tgt = target(s);
    const eaten = s.eatenBase;
    const burned = BURNED + s.workouts.reduce((a, w) => a + w.kcal, 0);
    const remaining = Math.max(tgt - eaten + burned, 0);
    const shareTotal = s.shares.reduce((a, b) => a + b, 0);
    const paceKgPerWk = ({ 'Lose weight': -0.4, Maintain: 0, 'Build muscle': 0.16, 'Manage sugar': -0.22 } as Record<string, number>)[s.goal] || 0;
    const deltaW = paceKgPerWk * s.horizon;
    const projW = Math.max(s.wKg + deltaW, 35);
    const bmi = s.wKg / Math.pow(s.hCm / 100, 2);
    const projectedBmi = projW / Math.pow(s.hCm / 100, 2);
    const permCount = Object.keys(s.permOn).filter((k) => s.permOn[k]).length;
    const notifCount = Object.keys(s.notifOn).filter((k) => s.notifOn[k]).length;

    const filterFns: Record<string, (r: (typeof RECIPES)[number]) => boolean> = {
      All: () => true,
      'Under 250': (r) => r.kcal < 250,
      'High protein': (r) => r.tags.some((t) => /\d+ g protein|High protein|Complete protein/.test(t)),
      Vegan: (r) => r.tags.indexOf('Vegan') > -1,
      'No dairy': (r) => r.tags.some((t) => t === 'Dairy-free' || t === 'Vegan'),
      'Batch cook': (r) => r.tags.some((t) => t === 'Batch cook' || t === 'Meal prep'),
    };
    const shownRecipes = RECIPES
      .filter((r) => s.cuisine === 'All' || r.cuisine === s.cuisine)
      .filter(filterFns[s.recipeTab] || (() => true))
      .map((r) => {
        const hits = r.allergens.filter((a) => s.allergies.indexOf(a) > -1);
        return { ...r, blocked: hits.length ? 'Contains ' + hits.join(' and ').toLowerCase() + ' — on your flag list' : null };
      });
    const blockedCount = shownRecipes.filter((r) => r.blocked).length;
    const originCount = new Set(RECIPES.map((r) => r.origin)).size;

    const hStr = imp ? `${Math.floor(s.hCm / 30.48)}' ${Math.round((s.hCm / 2.54) % 12)}"` : `${s.hCm} cm`;
    const wStr = imp ? `${Math.round(s.wKg * 2.205)} lb` : `${s.wKg} kg`;
    const futureWeight = imp ? `${Math.round(projW * 2.205)} lb` : `${projW.toFixed(1)} kg`;
    const futureLabel = s.horizon === 52 ? 'In 1 year' : `In ${s.horizon} weeks`;

    return {
      imp, target: tgt, eaten, remaining, burned, shareTotal,
      deltaW, projW, bmi, projectedBmi, permCount, notifCount,
      shownRecipes, blockedCount, originCount, hStr, wStr, futureWeight, futureLabel,
      quote: QUOTES[s.quoteIdx % QUOTES.length],
      myShareKcal: Math.round(1240 * s.shares[0] / 100),
    };
  }, [s]);
}

export type Derived = ReturnType<typeof useDerived>;

type Ctx = {
  s: State;
  d: Derived;
  set: (patch: Partial<State>) => void;
  go: (screen: Screen) => void;
  goScan: () => void;
  resetAll: () => void;
  flash: (msg: string) => void;
  runScan: (img: { base64: string; mediaType: string; uri: string }) => void;
  runVoice: (text: string) => void;
  logMeal: (r: MealResult, mult: number[], via: 'photo' | 'voice') => number;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  // Restore the saved profile once on launch. A returning user goes straight
  // to Home rather than through onboarding again.
  useEffect(() => {
    let live = true;
    AsyncStorage.getItem(STORE_KEY)
      .then((raw) => {
        if (!live || !raw) return;
        const saved = JSON.parse(raw) as Partial<State>;
        setS((prev) => ({ ...prev, ...saved, screen: saved.onboarded ? 'home' : 'ob' }));
      })
      .catch(() => {})
      .finally(() => { if (live) setHydrated(true); });
    return () => { live = false; };
  }, []);

  // Persist only durable profile data, never transient UI state such as the
  // current screen, scan phase or toast.
  useEffect(() => {
    if (!hydrated) return;
    const durable: Partial<State> = {};
    for (const k of PERSISTED) (durable as Record<string, unknown>)[k] = s[k];
    AsyncStorage.setItem(STORE_KEY, JSON.stringify(durable)).catch(() => {});
  }, [hydrated, s]);

  const resetAll = useCallback(() => {
    AsyncStorage.removeItem(STORE_KEY).catch(() => {});
    setS(initialState());
  }, []);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(s);
  stateRef.current = s;

  const set = useCallback((patch: Partial<State>) => setS((prev) => ({ ...prev, ...patch })), []);
  const go = useCallback((screen: Screen) => set({ screen }), [set]);
  // Entering the camera must always start a fresh frame: without this, returning
  // to the scanner after a completed scan shows the previous meal's result with
  // its Log button primed, which risks logging the same meal twice.
  const goScan = useCallback(() => set({ screen: 'scan', scanPhase: 'aim', scanResult: null, scanImage: null }), [set]);

  const flash = useCallback((msg: string) => {
    set({ toast: msg });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => set({ toast: '' }), 2400);
  }, [set]);

  // Sends the photo for analysis. If no service answers, falls back to a
  // sample result that the screen labels as a demo, with the reason.
  const runScan = useCallback((img: { base64: string; mediaType: string; uri: string }) => {
    const cur = stateRef.current;
    set({ scanPhase: 'busy', scanImage: img.uri, scanResult: null, pin: 0 });
    analyzePhoto(img.base64, img.mediaType, { cuisine: cur.region, plateCm: cur.plateCm })
      .catch((e): MealResult => ({ ...DEMO_SCAN, reason: e?.message || 'Analysis unavailable' }))
      .then((r) => set({ scanPhase: 'done', scanResult: r, scanMult: r.items.map(() => 1) }));
  }, [set]);

  const runVoice = useCallback((text: string) => {
    const cur = stateRef.current;
    set({ voiceBusy: true, voiceResult: null });
    parseMealText(text, { cuisine: cur.region })
      .catch((e): MealResult => ({ ...DEMO_VOICE, reason: e?.message || 'Analysis unavailable' }))
      .then((r) => set({ voiceBusy: false, voiceResult: r }));
  }, [set]);

  const logMeal = useCallback((r: MealResult, mult: number[], via: 'photo' | 'voice') => {
    const cur = stateRef.current;
    const at = Date.now();
    const entries = r.items.map((it, i) => ({ name: it.name, kcal: scaled(it, mult[i] ?? 1).kcal, via, at }));
    const total = entries.reduce((a, e) => a + e.kcal, 0);
    set({ eatenBase: cur.eatenBase + total, log: [...cur.log, ...entries] });
    return total;
  }, [set]);

  const d = useDerived(s);
  const value = useMemo(() => ({ s, d, set, go, goScan, resetAll, flash, runScan, runVoice, logMeal }), [s, d, set, go, goScan, resetAll, flash, runScan, runVoice, logMeal]);

  if (!hydrated) return null;

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
