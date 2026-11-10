#!/usr/bin/env node
// Builds the web bundle for a host that serves the app at a domain root
// (Netlify), rather than the /Nourish subpath GitHub Pages uses.
// Spawning with an explicit env keeps this working on Windows too, where
// `VAR=value cmd` is not valid shell.
const { spawnSync } = require('child_process');
const r = spawnSync('npm', ['run', 'build:web'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, PUBLIC_BASE_PATH: '' },
});
process.exit(r.status ?? 1);
