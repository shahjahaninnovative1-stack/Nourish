# Turning on real meal analysis

Photo scan and "Talk it in" call two server functions that ship with the
Netlify deploy. Until an API key is set they answer "not configured" and the
app shows a result clearly labelled **Demo result**.

## 1. Get a key
Create an API key at console.anthropic.com. Usage is billed per request by
Anthropic to that account; set a monthly spend limit there before going live.

## 2. Add it to Netlify
Site configuration → Environment variables → add:

| Variable | Value | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | your key | yes |
| `ANTHROPIC_MODEL` | model id; defaults to `claude-sonnet-5` | no |
| `ALLOWED_ORIGIN` | your site URL, e.g. `https://savora.netlify.app` | recommended |

Never put the key in the app, in `app.json`, or in any `EXPO_PUBLIC_*`
variable — those are shipped to every user. Redeploy after adding it.

## 3. Native builds
A phone build has no "same origin", so tell it where the functions live:

```
EXPO_PUBLIC_API_URL=https://<your-site>.netlify.app eas build ...
```

## How to tell it is working
Scan a meal. The badge on the photo reads **AI estimate** instead of
**Demo result**.

## Known limits
- **Accuracy.** Estimates from a photo are approximate and tend to run low,
  mainly from cooking fat that cannot be seen. The app says "estimate"
  everywhere and lets the user correct portions. Do not advertise an accuracy
  figure.
- **Abuse protection is basic.** The functions throttle bursts per client but
  have no login, so anyone who finds the URL can spend your credit. Before a
  public launch add app attestation or user accounts, and keep the provider
  spend limit on.
- **Speech.** Speaking works in browsers that support speech recognition; on a
  phone build the user dictates with the keyboard's mic key. Typing always works.
- **Still sample data:** diary history, insights feed, micronutrients, shared
  plate, leftover re-scan, label/barcode scan and connected apps.

## Tests
```
node e2e/server-check.js                       # function logic, provider stubbed
node e2e/serve-with-api.js dist 4500 &         # site + functions, provider stubbed
BASE_URL=http://localhost:4500 node e2e/ai-check.js
```
None of these call the real provider, so they cost nothing — and they do not
prove the quality of real estimates. Check that yourself on real meals.
