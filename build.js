#!/usr/bin/env node
// build.js — ABYSS // SURVIVORS single-file builder.
// Concatenates every file in src/ (sorted by filename) into dist/index.html.
// The output is EXACTLY the same single-file game you have always deployed:
// same scope, same load order, zero runtime changes. Filename order = load order.
//
// usage:  node build.js          (build)
//         node build.js --check  (build + syntax-check the JS with node --check)

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const SRC = path.join(__dirname, 'src');
const OUT = path.join(__dirname, 'dist', 'index.html');

const files = fs.readdirSync(SRC).filter(f => !f.startsWith('.')).sort();
if (!files.length) { console.error('src/ is empty'); process.exit(1); }

let out = '';
for (const f of files) out += fs.readFileSync(path.join(SRC, f), 'utf8');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out);

const sha = crypto.createHash('sha256').update(out).digest('hex');
console.log('built dist/index.html');
console.log('  parts : ' + files.length);
console.log('  bytes : ' + out.length);
console.log('  sha256: ' + sha);

// sanity: exactly one <script> block, file ends with </html>
const opens = (out.match(/^<script>$/gm) || []).length;
const closes = (out.match(/^<\/script>$/gm) || []).length;
if (opens !== 1 || closes !== 1) console.warn('  WARN: expected exactly one <script> block, found ' + opens + '/' + closes);
if (!/<\/html>\s*$/.test(out)) console.warn('  WARN: file does not end with </html>');

if (process.argv.includes('--check')) {
  const m = out.match(/<script>([\s\S]*?)<\/script>/);
  if (m) {
    const tmp = path.join(__dirname, 'dist', '.check.js');
    fs.writeFileSync(tmp, m[1]);
    try { execSync(process.execPath + ' --check ' + JSON.stringify(tmp), { stdio: 'inherit' }); console.log('  syntax: OK'); }
    catch (e) { console.error('  syntax: FAILED'); process.exit(1); }
    fs.unlinkSync(tmp);
  }
}
