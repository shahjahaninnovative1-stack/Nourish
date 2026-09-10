import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { RECIPES, VOICE_ITEMS, VOICE_WORDS, VOICE_SENTENCE, QUOTES } from './data';

export type Sex = 'Female' | 'Male';
export type Goal = 'Lose weight' | 'Maintain' | 'Build muscle' | 'Manage sugar';
export type Act = 'Sedentary' | 'Light' | 'Active' | 'Athlete';
export type Units = 'Metric' | 'Imperial';
export type Region = 'Indian' | 'Pakistani' | 'Both';
export type ScanPhase = 'aim' | 'busy' | 'done';
export type MicState = 'idle' | 'hearing' | 'parsed';
export type Screen =
  | 'ob' | 'perm' | 'home' | 'voice' | 'scan' | 'diary' | 'label' | 'micros' | 'move'
  | 'insights' | 'recipes' | 'me' | 'feed' | 'split' | 'leftover' | 'kitchen' | 'shield'
  | 'calib' | 'future' | 'nudges';

type State = {
  screen: Screen;
  ob: 0 | 1 | 2;
  scanPhase: ScanPhase;
  pin: 0 | 1 | 2 | 3;
  toast: string;
  sex: Sex; age: number; hCm: number; wKg: number; goal: Goal; act: Act;
  allergies: string[]; region: Region;
  units: Units;
  recipeTab: string; cuisine: string;
  eatenBase: number;
  shares: number[];
  micState: MicState; typed: number; horizon: 4 | 12 | 24 | 52; quoteIdx: number;
  permOn: Record<string, boolean>;
  notifOn: Record<string, boolean>;
  plateCm: number;
  dropped: string[];
};

const BURNED = 340;

function initialState(): State {
  return {
    screen: 'ob', ob: 0, scanPhase: 'aim', pin: 0, toast: '',
    sex: 'Female', age: 28, hCm: 163, wKg: 68, goal: 'Lose weight', act: 'Light',
    allergies: ['Lactose', 'Peanuts'], region: 'Both',
    units: 'Metric',
    recipeTab: 'All', cuisine: 'All', eatenBase: 1120,
    shares: [40, 34, 26],
    micState: 'idle', typed: 0, horizon: 12, quoteIdx: 0,
    permOn: { Camera: true, Microphone: true, Notifications: true },
    notifOn: { Breakfast: true, 'Water reminders': false, 'Evening check-in': true, 'Quote of the day': true, 'Streak rescue': true },
    plateCm: 26, dropped: [],
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
    const remaining = Math.max(tgt - eaten + BURNED, 0);
    const shareTotal = s.shares.reduce((a, b) => a + b, 0);
    const voiceTotal = VOICE_ITEMS.filter((v) => s.dropped.indexOf(v.name) < 0).reduce((a, v) => a + v.kcal, 0);
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
      imp, target: tgt, eaten, remaining, burned: BURNED, shareTotal, voiceTotal,
      deltaW, projW, bmi, projectedBmi, permCount, notifCount,
      shownRecipes, blockedCount, originCount, hStr, wStr, futureWeight, futureLabel,
      transcript: s.micState === 'parsed' ? VOICE_SENTENCE : VOICE_WORDS.slice(0, s.typed).join(' '),
      voiceItems: VOICE_ITEMS.filter((v) => s.dropped.indexOf(v.name) < 0),
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
  flash: (msg: string) => void;
  toggleMic: () => void;
  shoot: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<State>(initialState);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voiceTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(s);
  stateRef.current = s;

  const set = useCallback((patch: Partial<State>) => setS((prev) => ({ ...prev, ...patch })), []);
  const go = useCallback((screen: Screen) => set({ screen }), [set]);

  const flash = useCallback((msg: string) => {
    set({ toast: msg });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => set({ toast: '' }), 2400);
  }, [set]);

  const shoot = useCallback(() => {
    set({ scanPhase: 'busy' });
    if (scanTimer.current) clearTimeout(scanTimer.current);
    scanTimer.current = setTimeout(() => set({ scanPhase: 'done' }), 1500);
  }, [set]);

  const toggleMic = useCallback(() => {
    const cur = stateRef.current;
    if (cur.micState === 'hearing') {
      if (voiceTimer.current) clearInterval(voiceTimer.current);
      set({ micState: 'parsed' });
      return;
    }
    const start = Date.now();
    set({ micState: 'hearing', typed: 0 });
    if (voiceTimer.current) clearInterval(voiceTimer.current);
    voiceTimer.current = setInterval(() => {
      const n = Math.min(Math.floor((Date.now() - start) / 190), VOICE_WORDS.length);
      if (n >= VOICE_WORDS.length) {
        if (voiceTimer.current) clearInterval(voiceTimer.current);
        set({ typed: VOICE_WORDS.length, micState: 'parsed' });
      } else if (n !== stateRef.current.typed) {
        set({ typed: n });
      }
    }, 90);
  }, [set]);

  const d = useDerived(s);
  const value = useMemo(() => ({ s, d, set, go, flash, toggleMic, shoot }), [s, d, set, go, flash, toggleMic, shoot]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
