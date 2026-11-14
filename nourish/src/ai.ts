import { Platform } from 'react-native';

export type MealItem = {
  name: string; portion: string; grams?: number;
  kcal: number; protein: number; carbs: number; fat: number; fibre: number;
  confidence: 'high' | 'medium' | 'low'; allergens: string[];
};
export type MealResult = {
  source: 'ai' | 'demo';
  isFood: boolean;
  items: MealItem[];
  hiddenOilTsp?: number;
  notes?: string;
  /** Why a demo result was shown instead of a real analysis. */
  reason?: string;
};
export type MealContext = { cuisine?: string; plateCm?: number };

// The analysis functions are deployed with the web build, so on the web an
// empty base means "same origin". A native build has no origin and must be
// told where they live via EXPO_PUBLIC_API_URL.
const BASE = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/$/, '');
export const aiConfigured = Platform.OS === 'web' || BASE.length > 0;

async function post(fn: string, body: unknown): Promise<MealResult> {
  if (!aiConfigured) throw new Error('No analysis service is set for this build');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 45_000);
  try {
    const res = await fetch(`${BASE}/.netlify/functions/${fn}`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal,
    });
    // A static host answers unknown paths with an HTML page, sometimes with a
    // 200, so the content type is checked before the body is trusted.
    if (!(res.headers.get('content-type') || '').includes('application/json')) throw new Error('Analysis service is not deployed');
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Analysis failed');
    if (!data || !Array.isArray(data.items)) throw new Error('Analysis returned an unexpected result');
    return data as MealResult;
  } finally {
    clearTimeout(timer);
  }
}

export const analyzePhoto = (image: string, mediaType: string, context: MealContext) =>
  post('analyze-meal', { image, mediaType, context });
export const parseMealText = (text: string, context: MealContext) =>
  post('parse-meal', { text, context });

export const scaled = (it: MealItem, mult: number) => ({
  kcal: Math.round(it.kcal * mult),
  protein: Math.round(it.protein * mult), carbs: Math.round(it.carbs * mult),
  fat: Math.round(it.fat * mult), fibre: Math.round(it.fibre * mult),
});
