# Release checklist

Status of everything between this repo and a store listing.

## Done in the code
- [x] 71-check end-to-end suite passing (`node e2e/full-check.js`)
- [x] Profile persists across launches; in-app data deletion
- [x] 18+ age floor
- [x] In-app medical disclaimer, allergen caveat, privacy summary
- [x] No "safe" allergen verdicts anywhere
- [x] Body-render feature replaced with a weight trajectory chart
- [x] No accuracy percentages on scan results
- [x] `eas.json` build profiles; iOS/Android bundle identifiers
- [x] Store copy and privacy policy drafted (`docs/`)

## Blocking — must be resolved before selling
1. **The AI is simulated.** Photo scan, voice logging and the insight feed return
   fixed sample data. `DEMO_MODE` in `src/brand.ts` labels this in the app. Selling
   it with the label removed would present fake results as real: Apple rejects
   that under guideline 1.1.6, and it would mislead paying users. Either wire
   real services (vision + speech-to-text + a food database) or sell it only as
   what it is today: a manual food diary.
2. **The name.** "Nourish" is already used by a US nutrition company with
   $115M in funding and by at least six calorie apps on the stores. Pick a new
   name, check it at the trademark office in each launch country, then change
   `APP_NAME` in `src/brand.ts`, the name fields in `app.json`, and the
   remaining "Nourish" strings in `src/`.
3. **Developer accounts.** Apple Developer Program ($99/yr) and Google Play
   ($25 once). Apple requires health apps to be submitted by a legal entity,
   not an individual.
4. **Privacy policy URL.** Host `docs/PRIVACY_POLICY.md` publicly and fill in
   the entity name and contact.
5. **Photography and screenshots.** Image slots are placeholders; stores need
   real screenshots (6.7" and 6.5" iPhone, phone + 7" Android).

## Then
```
npm i -g eas-cli && eas login
eas build --platform all --profile production
eas submit --platform all
```
