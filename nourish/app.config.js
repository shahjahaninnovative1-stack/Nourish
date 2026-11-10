// Expo reads this in preference to app.json.
//
// The web build bakes an absolute base path into every asset URL, so the host
// has to be known at build time:
//   GitHub Pages serves this project at /Nourish/  -> base "/Nourish"
//   Netlify serves it at a domain root             -> base ""
// PUBLIC_BASE_PATH selects which. Defaults to the Pages path so the existing
// `npm run build:web` keeps working unchanged.
const base = process.env.PUBLIC_BASE_PATH ?? '/Nourish';

module.exports = ({ config }) => ({
  ...config,
  experiments: { ...config.experiments, baseUrl: base },
});
