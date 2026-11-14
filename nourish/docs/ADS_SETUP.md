# Free app, funded by ads

## The limit that makes this work
Each photo analysis is billed to you by the AI provider. One banner view earns
far less than one scan costs. So free use is capped per day in `src/ads.ts`:

| Setting | Default |
|---|---|
| `FREE_SCANS_PER_DAY` | 3 photo scans |
| `FREE_DESCRIBES_PER_DAY` | 10 described meals |

Quick add and everything else stay unlimited. After the cap the app offers
"Describe it instead" and resets the next day. Watch your provider bill against
your ad income for a few weeks and adjust these numbers.

The cap is enforced in the app, which stops ordinary users but not someone
calling your server directly. Keep the provider spend limit on (see
`AI_SETUP.md`) and add accounts before a large launch.

## Where ads appear
Bottom of Home, Diary, World kitchen and Move. Never on the camera, voice,
label, allergy, future-you, onboarding or privacy screens — app-store rules bar
using health or camera data for advertising, and ads beside allergy warnings
are a liability.

All ads are requested as **non-personalised**.

## Web (AdSense)
1. Apply at adsense.google.com with your live site URL. Approval is Google's
   decision and can take days or be refused for a new, low-traffic site.
2. Create one display ad unit per placement.
3. In Netlify → Environment variables, add and redeploy:

```
EXPO_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
EXPO_PUBLIC_ADSENSE_SLOT_HOME=...
EXPO_PUBLIC_ADSENSE_SLOT_DIARY=...
EXPO_PUBLIC_ADSENSE_SLOT_RECIPES=...
EXPO_PUBLIC_ADSENSE_SLOT_MOVE=...
```
These IDs are public by design (they appear in every page), unlike the AI key.
AdSense also needs an `ads.txt` file at the site root; it gives you the line.

Until these are set, the app shows a dashed "Ad space" box where each ad will
sit. That box is tied to `DEMO_MODE` and disappears when it is turned off.

## Phone apps (AdMob) — not built yet
Store builds need Google AdMob, which is a native component: it requires an
AdMob account, an app ID for each platform, and a development build (it does
not run in Expo Go). `AdSlot` is the single place to add it. On iOS, keeping
ads non-personalised avoids the tracking-permission prompt.

A "watch an ad for one more scan" option belongs here too, once AdMob is in.

## Before you publish
- The privacy policy and in-app Privacy & terms screen already describe ads.
- App Store privacy label / Play Data safety: declare advertising data
  collected by Google's SDK.
- Many countries require a cookie/consent banner for ads on the web (EU, UK
  and others). One is not built yet; add Google's consent tool or a
  certified consent platform before serving ads to those regions.
