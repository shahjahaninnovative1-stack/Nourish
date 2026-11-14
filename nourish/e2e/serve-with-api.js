#!/usr/bin/env node
/**
 * Serves a built site together with the real analysis functions, with only
 * the model provider stubbed. Lets the app's real (non-demo) path be tested
 * end to end without an API key or network access.
 *
 *   node e2e/serve-with-api.js <dist-dir> <port>
 */
const http = require('http'); const fs = require('fs'); const path = require('path');
const [dir, port] = [path.resolve(process.argv[2] || 'dist'), Number(process.argv[3] || 4500)];

process.env.ANTHROPIC_API_KEY = 'test-key';
const seen = [];
const PHOTO_REPLY = { is_food: true, hidden_oil_tsp: 1.5, notes: 'Dressing amount is uncertain.', items: [
  { name: 'Grilled chicken', portion: '1 breast', grams: 150, kcal: 250, protein_g: 40, carbs_g: 0, fat_g: 9, fibre_g: 0, confidence: 'high', allergens: [] },
  { name: 'Brown rice', portion: '1 cup', grams: 195, kcal: 216, protein_g: 5, carbs_g: 45, fat_g: 2, fibre_g: 4, confidence: 'medium', allergens: [] },
  { name: 'Yoghurt dip', portion: '2 tbsp', grams: 30, kcal: 40, protein_g: 2, carbs_g: 2, fat_g: 3, fibre_g: 0, confidence: 'low', allergens: ['Lactose'] } ] };
const TEXT_REPLY = { is_food: true, items: [
  { name: 'Oat porridge', portion: '1 bowl', kcal: 158, protein_g: 6, carbs_g: 27, fat_g: 3, fibre_g: 4, confidence: 'high', allergens: ['Gluten'] },
  { name: 'Banana', portion: '1 medium', kcal: 105, protein_g: 1, carbs_g: 27, fat_g: 0, fibre_g: 3, confidence: 'high', allergens: [] } ] };

global.fetch = async (url, opts) => {
  const body = JSON.parse(opts.body);
  const content = body.messages[0].content;
  const isPhoto = content.some((c) => c.type === 'image');
  seen.push({ url: String(url), hasKey: !!opts.headers['x-api-key'], isPhoto, model: body.model, forcedTool: body.tool_choice && body.tool_choice.name,
    text: content.filter((c) => c.type === 'text').map((c) => c.text).join(' ') });
  return { ok: true, status: 200, json: async () => ({ content: [{ type: 'tool_use', name: 'record_meal', input: isPhoto ? PHOTO_REPLY : TEXT_REPLY }] }) };
};
const fns = { 'analyze-meal': require('../netlify/functions/analyze-meal').handler, 'parse-meal': require('../netlify/functions/parse-meal').handler };
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon', '.ttf': 'font/ttf' };

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/__requests') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify(seen)); }
  const m = u.pathname.match(/^\/\.netlify\/functions\/([\w-]+)$/);
  if (m && fns[m[1]]) {
    let raw = ''; for await (const c of req) raw += c;
    const out = await fns[m[1]]({ httpMethod: req.method, headers: req.headers, body: raw });
    res.writeHead(out.statusCode, out.headers); return res.end(out.body);
  }
  let file = path.join(dir, decodeURIComponent(u.pathname));
  if (!file.startsWith(dir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(dir, 'index.html'); // SPA fallback
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`serving ${dir} + analysis functions on :${port}`));
