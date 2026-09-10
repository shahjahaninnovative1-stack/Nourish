export const VOICE_SENTENCE = 'Do roti, ek katori dal tadka, thoda chicken karahi aur ek chai';
export const VOICE_WORDS = VOICE_SENTENCE.split(' ');

export type VoiceItem = { name: string; heard: string; kcal: number; icon: string };
export const VOICE_ITEMS: VoiceItem[] = [
  { name: 'Roti (atta)', heard: '"do roti" → 2 pieces', kcal: 196, icon: '🥓' },
  { name: 'Dal tadka', heard: '"ek katori" → 150 g', kcal: 150, icon: '🍲' },
  { name: 'Chicken karahi', heard: '"thoda" → half serving, 90 g', kcal: 155, icon: '🍗' },
  { name: 'Chai with sugar', heard: '"ek chai" → your usual, 1 tsp', kcal: 90, icon: '☕' },
];

export const VOICE_EXAMPLES = [
  'Do roti, ek katori dal aur chai',
  'Half plate biryani and raita for lunch',
  'Aik samosa aur ek cup doodh patti',
];

export type Cuisine = { name: string; flag: string };
export const CUISINES: Cuisine[] = [
  { name: 'All', flag: '🌍' },
  { name: 'South Asian', flag: '🇮🇳' },
  { name: 'Middle East', flag: '🇱🇧' },
  { name: 'East Asia', flag: '🇯🇵' },
  { name: 'Mediterranean', flag: '🇬🇷' },
  { name: 'Latin', flag: '🇲🇽' },
  { name: 'Africa', flag: '🇪🇹' },
  { name: 'Nordic', flag: '🇸🇪' },
];

const RECIPE_ALLERGENS: Record<string, string[]> = {
  'Baked palak paneer tikka': ['Lactose'],
  'Kerala meen curry': ['Fish'],
  'Shakshuka': ['Egg'],
  'Persian herb kuku': ['Egg'],
  'Japanese salmon donburi': ['Fish', 'Soy'],
  'Korean tofu bibimbap': ['Soy', 'Egg', 'Sesame'],
  'Vietnamese pho ga': ['Fish'],
  'Thai larb gai': ['Fish'],
  'Sicilian tuna caponata': ['Fish'],
  'Spanish tortilla with greens': ['Egg'],
  'Brazilian moqueca': ['Fish'],
  'West African peanut stew': ['Peanuts'],
  'Nordic barley salmon bowl': ['Fish', 'Gluten'],
  'Finnish rye kaurapuuro': ['Gluten'],
  'Lebanese fattoush': ['Gluten'],
  'Greek chickpea gigantes': [],
  'Turkish mercimek soup': [],
  'Mexican black bean bowl': [],
  'Peruvian quinoa causa': [],
  'Ethiopian misir wot': [],
  'Moroccan chicken tagine': [],
  'Masala oats khichdi': ['Gluten'],
  'Chana chaat with pudina': [],
  'Sindhi saai bhaji': [],
};

export type Recipe = {
  name: string;
  kcal: number;
  cuisine: string;
  origin: string;
  flag: string;
  note: string;
  tags: string[];
  allergens: string[];
};

const RAW_RECIPES: Omit<Recipe, 'allergens'>[] = [
  { name: 'Baked palak paneer tikka', kcal: 268, cuisine: 'South Asian', origin: 'North India', flag: '🇮🇳', note: 'Air-fried, no cream. The paneer swap keeps it lactose-light and it still tastes like a restaurant order.', tags: ['22 g protein', '25 min', 'Vegetarian'] },
  { name: 'Masala oats khichdi', kcal: 242, cuisine: 'South Asian', origin: 'India', flag: '🇮🇳', note: 'Pressure-cook oats with moong dal and vegetables. Low GI, sits well for diabetics.', tags: ['Low GI', '15 min', 'One pot'] },
  { name: 'Chana chaat with pudina', kcal: 186, cuisine: 'South Asian', origin: 'Pakistan', flag: '🇵🇰', note: 'Roasted chana, onion, tomato, mint. Iftar-friendly and 11 g of fibre.', tags: ['11 g fibre', 'No cook', 'Iftar'] },
  { name: 'Sindhi saai bhaji', kcal: 214, cuisine: 'South Asian', origin: 'Sindh', flag: '🇵🇰', note: 'Spinach and chana dal cooked down with tomato. One katori covers a third of your iron.', tags: ['High iron', 'Vegan', '35 min'] },
  { name: 'Kerala meen curry', kcal: 296, cuisine: 'South Asian', origin: 'Kerala', flag: '🇮🇳', note: 'Kokum and coconut milk instead of cream. Omega-3s without the frying.', tags: ['Omega-3', '30 min', 'Dairy-free'] },
  { name: 'Shakshuka', kcal: 278, cuisine: 'Middle East', origin: 'Levant', flag: '🇱🇧', note: 'Eggs poached in cumin tomato. The cheapest complete-protein breakfast on this list.', tags: ['20 g protein', '20 min', 'Breakfast'] },
  { name: 'Lebanese fattoush', kcal: 172, cuisine: 'Middle East', origin: 'Lebanon', flag: '🇱🇧', note: 'Sumac, mint and baked pita chips instead of fried. Sharp enough to eat as a whole meal.', tags: ['Under 200', 'No cook', 'Vegan'] },
  { name: 'Turkish mercimek soup', kcal: 198, cuisine: 'Middle East', origin: 'Turkey', flag: '🇹🇷', note: 'Red lentil, cumin, a squeeze of lemon. Freezes well and reheats better.', tags: ['13 g protein', 'Batch cook', 'Vegan'] },
  { name: 'Persian herb kuku', kcal: 224, cuisine: 'Middle East', origin: 'Iran', flag: '🇮🇷', note: 'Baked, not fried — three bunches of herbs held together by four eggs.', tags: ['High folate', '30 min', 'Vegetarian'] },
  { name: 'Japanese salmon donburi', kcal: 412, cuisine: 'East Asia', origin: 'Japan', flag: '🇯🇵', note: 'Miso-glazed salmon over barley rice. The barley swap adds 6 g fibre over white rice.', tags: ['34 g protein', '25 min', 'Omega-3'] },
  { name: 'Korean tofu bibimbap', kcal: 334, cuisine: 'East Asia', origin: 'Korea', flag: '🇰🇷', note: 'Five vegetables, one egg, gochujang thinned with vinegar to cut the sugar.', tags: ['High fibre', '30 min', 'Vegetarian'] },
  { name: 'Vietnamese pho ga', kcal: 286, cuisine: 'East Asia', origin: 'Vietnam', flag: '🇻🇳', note: 'Clear chicken broth, herbs, lime. Very filling for the calories.', tags: ['Low fat', 'Batch cook', 'Dairy-free'] },
  { name: 'Thai larb gai', kcal: 248, cuisine: 'East Asia', origin: 'Thailand', flag: '🇹🇭', note: 'Minced chicken with toasted rice powder and mint, served in lettuce cups.', tags: ['28 g protein', '20 min', 'Low carb'] },
  { name: 'Greek chickpea gigantes', kcal: 264, cuisine: 'Mediterranean', origin: 'Greece', flag: '🇬🇷', note: 'Slow-baked beans in tomato and dill. Olive oil measured, not poured.', tags: ['15 g fibre', 'Batch cook', 'Vegan'] },
  { name: 'Sicilian tuna caponata', kcal: 236, cuisine: 'Mediterranean', origin: 'Italy', flag: '🇮🇹', note: 'Roasted aubergine, capers, tinned tuna. Store-cupboard dinner in 20 minutes.', tags: ['24 g protein', '20 min', 'Dairy-free'] },
  { name: 'Spanish tortilla with greens', kcal: 252, cuisine: 'Mediterranean', origin: 'Spain', flag: '🇪🇸', note: 'Half the usual potato, twice the spinach. Good hot, better cold the next day.', tags: ['18 g protein', '25 min', 'Meal prep'] },
  { name: 'Moroccan chicken tagine', kcal: 318, cuisine: 'Mediterranean', origin: 'Morocco', flag: '🇲🇦', note: 'Apricot and preserved lemon do the sweetness — no added sugar anywhere.', tags: ['30 g protein', '45 min', 'One pot'] },
  { name: 'Mexican black bean bowl', kcal: 294, cuisine: 'Latin', origin: 'Mexico', flag: '🇲🇽', note: 'Beans, charred corn, avocado, lime. Complete protein without any meat.', tags: ['16 g fibre', '20 min', 'Vegan'] },
  { name: 'Peruvian quinoa causa', kcal: 262, cuisine: 'Latin', origin: 'Peru', flag: '🇵🇪', note: 'Layered quinoa, aji amarillo and lime — where quinoa actually comes from.', tags: ['Complete protein', '30 min', 'Gluten-free'] },
  { name: 'Brazilian moqueca', kcal: 308, cuisine: 'Latin', origin: 'Brazil', flag: '🇧🇷', note: 'Fish stewed with coconut milk, peppers and coriander. No dairy, no thickener.', tags: ['32 g protein', '35 min', 'Dairy-free'] },
  { name: 'Ethiopian misir wot', kcal: 232, cuisine: 'Africa', origin: 'Ethiopia', flag: '🇪🇹', note: 'Red lentils in berbere. Fiery, filling, and vegan by tradition rather than trend.', tags: ['14 g protein', '30 min', 'Vegan'] },
  { name: 'West African peanut stew', kcal: 296, cuisine: 'Africa', origin: 'Ghana', flag: '🇬🇭', note: 'Sweet potato and greens in peanut broth. Skip if peanuts are on your flag list.', tags: ['High potassium', '40 min', 'Vegan'] },
  { name: 'Nordic barley salmon bowl', kcal: 352, cuisine: 'Nordic', origin: 'Sweden', flag: '🇸🇪', note: 'Poached salmon, pearl barley, dill and cucumber. Vitamin D and omega-3 in one bowl.', tags: ['Vitamin D', '25 min', 'High protein'] },
  { name: 'Finnish rye kaurapuuro', kcal: 214, cuisine: 'Nordic', origin: 'Finland', flag: '🇫🇮', note: 'Rye-oat porridge with berries and seeds. Keeps you full until lunch, properly.', tags: ['Breakfast', '10 min', '9 g fibre'] },
];

export const RECIPES: Recipe[] = RAW_RECIPES.map((r) => ({ ...r, allergens: RECIPE_ALLERGENS[r.name] || [] }));

export const QUOTES = [
  { t: 'You do not need a perfect plate. You need the next honest one.', by: 'Nourish · daily' },
  { t: 'Dal before dessert is not deprivation. It is sequencing.', by: 'Nourish · daily' },
  { t: 'The roti you skip in anger comes back at midnight. Eat properly instead.', by: 'Nourish · daily' },
  { t: 'Twelve days logged. Consistency is quietly beating intensity again.', by: 'Nourish · daily' },
];

export const GOAL_LIST: { key: string; sub: string; icon: string }[] = [
  { key: 'Lose weight', sub: '~0.4 kg a week', icon: '⬇️' },
  { key: 'Maintain', sub: 'Hold steady, eat better', icon: '⚖️' },
  { key: 'Build muscle', sub: 'Lean gain + protein push', icon: '💪' },
  { key: 'Manage sugar', sub: 'Low-GI, split meals', icon: '🩺' },
];

export const ACTIVITY_LEVELS = ['Sedentary', 'Light', 'Active', 'Athlete'] as const;
export const ALLERGY_OPTIONS = ['Lactose', 'Peanuts', 'Gluten', 'Tree nuts', 'Soy', 'Shellfish', 'Egg', 'Sesame', 'Mustard'];
export const REGIONS = ['Indian', 'Pakistani', 'Both'] as const;

export const PIN_DATA = [
  { name: 'Roti (tandoori)', note: '2 pieces · atta, no ghee', kcal: 208, portion: '2 pieces', macros: [{ k: 'carb', v: '42g' }, { k: 'protein', v: '7g' }, { k: 'fat', v: '2g' }, { k: 'fibre', v: '6g' }] },
  { name: 'Dal tadka', note: '1 katori · toor dal, 1 tsp ghee', kcal: 180, portion: '1 katori (150g)', macros: [{ k: 'carb', v: '22g' }, { k: 'protein', v: '9g' }, { k: 'fat', v: '6g' }, { k: 'fibre', v: '5g' }] },
  { name: 'Chicken karahi', note: '1 serving · bone-in, tomato base', kcal: 310, portion: '1 serving (180g)', macros: [{ k: 'carb', v: '6g' }, { k: 'protein', v: '28g' }, { k: 'fat', v: '19g' }, { k: 'fibre', v: '2g' }] },
  { name: 'Raita', note: '1 small bowl · cucumber', kcal: 62, portion: '1 bowl (100g)', macros: [{ k: 'carb', v: '5g' }, { k: 'protein', v: '3g' }, { k: 'fat', v: '3g' }, { k: 'fibre', v: '1g' }] },
];

export const DETECTED = [
  { name: 'Roti (tandoori)', portion: '2 pieces', kcal: 208, icon: '🥓' },
  { name: 'Dal tadka', portion: '1 katori', kcal: 180, icon: '🍲' },
  { name: 'Chicken karahi', portion: '180 g', kcal: 310, icon: '🍗' },
  { name: 'Cucumber raita', portion: '1 bowl', kcal: 62, icon: '🥣' },
];

export const QUICK_ADD = [
  { name: 'Roti (atta)', serving: '1 medium', kcal: 104, icon: '🥓' },
  { name: 'Dal tadka', serving: '1 katori', kcal: 180, icon: '🍲' },
  { name: 'Chai with sugar', serving: '1 cup', kcal: 90, icon: '☕' },
  { name: 'Greek yoghurt & berries', serving: '1 bowl', kcal: 148, icon: '🫠' },
  { name: 'Hummus with pita', serving: '3 tbsp + 1 pita', kcal: 212, icon: '🥙' },
  { name: 'Miso soup & edamame', serving: '1 bowl', kcal: 126, icon: '🍜' },
];

export const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
export const STEP_VALS = [0.62, 0.78, 0.55, 0.9, 0.71, 1, 0.83];
export const CAL_VALS = [0.86, 1.02, 0.74, 0.93, 0.68, 1.12, 0.82];

export const MEALS = [
  { name: 'Breakfast', icon: '🌅', kcal: '520 kcal', items: [
    { name: 'Aloo paratha', portion: '1 with 1 tsp ghee', kcal: '250' },
    { name: 'Dahi', portion: '1 katori', kcal: '100' },
    { name: 'Chai with sugar', portion: '1 cup', kcal: '90' },
    { name: 'Banana', portion: '1 medium', kcal: '80' },
  ] },
  { name: 'Lunch', icon: '☀️', kcal: '470 kcal', items: [
    { name: 'Roti (atta)', portion: '2 medium', kcal: '208' },
    { name: 'Bhindi masala', portion: '1 katori', kcal: '132' },
    { name: 'Dal tadka', portion: '1 katori', kcal: '130' },
  ] },
  { name: 'Snack', icon: '🧖', kcal: '130 kcal', items: [
    { name: 'Samosa', portion: '1 piece', kcal: '130' },
  ] },
  { name: 'Dinner', icon: '🌙', kcal: 'planned', items: [
    { name: 'Suggested: shakshuka + fattoush', portion: 'Nourish pick · 38 g protein', kcal: '~450' },
    { name: 'Alt: seekh kebab + salad', portion: '30 g protein', kcal: '~620' },
    { name: 'Alt: Japanese salmon donburi', portion: '34 g protein · omega-3', kcal: '~412' },
  ] },
];

export const LABEL_FLAGS = [
  { name: 'Milk solids', level: 'Your allergy', why: 'You logged lactose intolerance. 2 pieces carry ~3.1 g lactose — enough for you to feel it.' },
  { name: 'Sodium 480 mg', level: 'High', why: '21% of your daily cap in a snack you rarely stop at two pieces of.' },
  { name: 'Palm oil + INS 471', level: 'Watch', why: 'Saturated fat and an emulsifier. Fine occasionally, not daily with chai.' },
];

export const LABEL_INGREDIENTS = [
  { name: 'Refined wheat flour (maida)', note: 'Low fibre', dot: 'amber' as const },
  { name: 'Sugar', note: '6.2 g per 2 pcs', dot: 'amber' as const },
  { name: 'Palm oil', note: 'Saturated fat', dot: 'amber' as const },
  { name: 'Milk solids', note: 'Contains lactose', dot: 'red' as const },
  { name: 'Iodised salt', note: '480 mg sodium', dot: 'red' as const },
  { name: 'Cardamom, yeast', note: 'Fine', dot: 'green' as const },
  { name: 'INS 471 (emulsifier)', note: 'Plant-derived, watch', dot: 'amber' as const },
];

export const LABEL_SWAPS = [
  { name: 'Ragi khakhra', why: 'No dairy · 4 g fibre', kcal: '92', icon: '🟤' },
  { name: 'Roasted chana', why: '7 g protein per handful', kcal: '110', icon: '🫘' },
  { name: 'Multigrain toast', why: 'Lower sodium, no milk solids', kcal: '86', icon: '🍞' },
];

export const MICROS = [
  { name: 'Fibre', label: '71%', pct: 0.71, tone: 'green' as const, tip: 'Dal and bhindi carried it. One more veg katori and you clear it.' },
  { name: 'Iron', label: '62%', pct: 0.62, tone: 'amber' as const, tip: 'Add lemon to your dal — vitamin C lifts non-heme iron absorption.' },
  { name: 'Vitamin B12', label: '40%', pct: 0.4, tone: 'red' as const, tip: 'Low three days running. Curd, eggs or a fortified milk would fix it.' },
  { name: 'Calcium', label: '55%', pct: 0.55, tone: 'amber' as const, tip: 'Lactose-free route: sesame chutney, ragi, or almonds.' },
  { name: 'Vitamin D', label: '28%', pct: 0.28, tone: 'red' as const, tip: 'Diet rarely covers this. 15 min of morning sun is the cheap fix.' },
  { name: 'Potassium', label: '48%', pct: 0.48, tone: 'amber' as const, tip: 'Bananas and rajma are your easiest wins.' },
  { name: 'Folate', label: '66%', pct: 0.66, tone: 'green' as const, tip: 'Palak and chana keep this healthy.' },
  { name: 'Sodium', label: '118% · over', pct: 1, tone: 'red' as const, tip: 'Rusk, pickle and karahi. Cutting pickle alone drops you 12%.' },
  { name: 'Vitamin C', label: '88%', pct: 0.88, tone: 'green' as const, tip: 'Tomato base in the karahi did most of the work.' },
];

export const MOVE_STATS = [
  { icon: '👟', val: '7,420', name: 'steps of 9,000' },
  { icon: '🔥', val: '340', name: 'kcal burned' },
  { icon: '⏱️', val: '46 min', name: 'active time' },
];

export const SESSIONS = [
  { name: 'Evening walk', meta: '32 min · 2.8 km · Google Fit', kcal: '146', icon: '🚶' },
  { name: 'Strength — push', meta: '28 min · 6 sets · logged manually', kcal: '194', icon: '🏋️' },
  { name: 'Yoga (planned)', meta: '20 min · 7:00 am tomorrow', kcal: '82', icon: '🧘' },
];

export const CONNECTED_APPS = [
  { name: 'Apple Health', icon: '🍎', bg: '#F3ECE0', state: 'Synced', connected: true },
  { name: 'Google Fit', icon: '🟢', bg: '#EAF5EF', state: 'Synced', connected: true },
  { name: 'Strava', icon: '🟠', bg: '#FFF0DE', state: 'Connect', connected: false },
  { name: 'Samsung Health', icon: '🔵', bg: '#EDF1FF', state: 'Connect', connected: false },
];

export const WEEK_NOTES = [
  { icon: '🍛', title: 'Saturdays are your biryani day', body: 'Every Saturday runs ~380 kcal over. Nourish will pre-book the budget on Friday night instead of nagging you after.' },
  { icon: '🧂', title: 'Sodium spikes track eating out', body: 'Three of four high-sodium days had a restaurant entry. Home karahi runs 40% lower.' },
  { icon: '💪', title: 'Protein trend up', body: 'Averaged 71 g, up from 58 g. Two more curd servings a week hits your 96 g target.' },
];

export const AI_FEED = [
  { icon: '🧠', kind: 'Pattern', when: '2m ago', title: 'Protein is trailing again', body: '18 g by 4pm on four of the last five days. A katori of rajma at lunch would close it without touching your calorie budget.', tone: 'amber' as const },
  { icon: '🧂', kind: 'Label flag', when: '1h ago', title: 'The rusk you scanned has milk solids', body: 'You logged lactose intolerance, so Nourish moved it to your avoid list and suggested ragi khakhra instead.', tone: 'red' as const },
  { icon: '📷', kind: 'Scan correction', when: 'Yesterday', title: 'Learned your roti size', body: 'You resized roti down twice. Nourish now assumes 6-inch atta roti at 98 kcal for your kitchen.', tone: 'plain' as const },
  { icon: '🏃', kind: 'Activity', when: 'Yesterday', title: 'Evening walks are working', body: 'Your 8pm walk shows up on nine of the last ten days and pulled resting heart rate down 3 bpm.', tone: 'green' as const },
  { icon: '🍛', kind: 'Heads up', when: '2d ago', title: 'Saturday biryani is booked', body: 'Nourish trimmed 120 kcal from Thursday and Friday so today’s plate has room. Eat it guilt-free.', tone: 'plain' as const },
];

export const LEFTOVERS = [
  { name: 'Roti (tandoori)', note: '2 served → 1 eaten', delta: '−104', zero: false },
  { name: 'Chicken karahi', note: 'A third still in the bowl', delta: '−103', zero: false },
  { name: 'Dal tadka', note: 'Finished', delta: '0', zero: true },
  { name: 'Raita', note: 'Finished', delta: '0', zero: true },
];

export const KITCHEN_ROWS = [
  { icon: '🥓', name: 'Your roti', value: '98 kcal', learned: 'You resized it down 24 times. Nourish now assumes a 6-inch atta roti, not the 8-inch database default.', conf: 0.94 },
  { icon: '🧈', name: 'Ghee hand', value: '0.4 tsp', learned: 'Weekday rotis run dry, Sunday parathas do not. It splits the estimate by day.', conf: 0.88 },
  { icon: '🍲', name: 'Dal consistency', value: 'Thin', learned: 'Your dal photographs thinner than average — 150 kcal a katori, not 180.', conf: 0.91 },
  { icon: '🛢️', name: 'Household oil', value: '1.4× base', learned: 'Across 60 home dishes your tarka runs heavier than the reference kitchen.', conf: 0.82 },
  { icon: '⭐', name: "Amma's biryani", value: '268 / cup', learned: 'You built this one yourself, ingredient by ingredient. It never guesses again.', conf: 1 },
];

export const SHIELD_LINES = [
  { lang: 'English', dir: 'ltr' as const, font: 'body', text: 'No milk, cream, paneer, ghee or peanuts. Medical allergy.' },
  { lang: 'हिन्दी', dir: 'ltr' as const, font: 'devanagari', text: 'दूध, क्रीम, पनीर, घी या मूंगफली नहीं। एलर्जी है।' },
  { lang: 'اردو', dir: 'rtl' as const, font: 'nastaliq', text: 'دودھ، کریم، پنیر، گھی یا مونگ پھلی نہیں۔ الرجی ہے۔' },
];

export const PLATES = [
  { name: 'Steel thali', cm: 26, note: 'Your everyday plate · calibrated Tuesday' },
  { name: 'Small katori', cm: 11, note: 'For dal, raita and sabzi bowls' },
  { name: 'Dinner plate', cm: 30, note: 'Guests and Sunday biryani' },
  { name: 'Restaurant plate', cm: null, note: 'Uncalibrated — hold a coin in frame' },
];

export const NOTIF_PREVIEW = [
  { when: '8:02 am', title: 'Chai first, protein second?', body: 'You have done this nine mornings running. Two boiled eggs with it and lunch stops feeling like a rescue mission.' },
  { when: '4:40 pm', title: '“The body keeps the receipts.”', body: 'Your quote for today, plus a nudge: 620 kcal left and you are 1,800 steps from closing the ring.' },
  { when: '9:15 pm', title: 'One roti away from a clean day', body: 'Log dinner and day 13 of the streak is yours. Nourish can hear it if you would rather talk than type.' },
];

export const NOTIF_SETTINGS_META: Record<string, string> = {
  Breakfast: '7:30 – 9:00 am',
  'Water reminders': 'Every 2 hours',
  'Evening check-in': '8:30 pm · before dinner',
  'Quote of the day': 'With your morning nudge',
  'Streak rescue': 'Only if you’re about to lose a streak',
};
export const NOTIF_SETTINGS_ICON: Record<string, string> = {
  Breakfast: '🌅',
  'Water reminders': '💧',
  'Evening check-in': '🌙',
  'Quote of the day': '✨',
  'Streak rescue': '🔥',
};

export const PERMISSIONS_META = [
  { name: 'Camera', icon: '📷', iconBg: '#FFF0DE', why: 'Photograph plates, labels and leftovers', detail: 'Frames are analysed on-device first. Nothing uploads unless a dish needs the cloud model.' },
  { name: 'Microphone', icon: '🎙️', iconBg: '#F5F2FF', why: 'Log meals by talking instead of typing', detail: 'Recording only runs while you hold the mic. Audio is transcribed then discarded.' },
  { name: 'Notifications', icon: '🔔', iconBg: '#F0F7F3', why: 'Four nudges a day, tied to real events', detail: 'You pick the windows. Quiet hours are on by default from 10pm to 7am.' },
];
