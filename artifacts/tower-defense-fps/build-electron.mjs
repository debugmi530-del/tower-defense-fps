#!/usr/bin/env node
/**
 * Build pipeline for the Electron desktop app:
 *   1. Vite builds the renderer → dist/renderer/
 *   2. esbuild bundles electron/main.ts + electron/preload.ts → dist/electron/
 *   3. electron-builder packages everything → dist/installer/
 *
 * Run: node build-electron.mjs [--dist]  (--dist also runs electron-builder)
 */

import { createRequire } from 'module';
import { execSync } from 'child_process';
import { mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve esbuild from local node_modules to avoid hoisting issues
const require = createRequire(import.meta.url);
const { build } = require('esbuild');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const doDist = process.argv.includes('--dist');

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: __dirname });
}

// ── Step 1: Build renderer with Vite ──────────────────────────────────────────
console.log('\n═══ 1/3  Building renderer (Vite) ═══');
run('pnpm vite build --config vite.electron.config.ts');

// ── Step 2: Bundle Electron main + preload with esbuild ───────────────────────
console.log('\n═══ 2/3  Bundling Electron main process (esbuild) ═══');

mkdirSync(path.join(__dirname, 'dist/electron'), { recursive: true });

const shared = {
  bundle: true,
  platform: 'node',
  target: 'node20',
  external: ['electron'],
  sourcemap: false,
  minify: false,
};

await build({
  ...shared,
  entryPoints: [path.join(__dirname, 'electron/main.ts')],
  outfile: path.join(__dirname, 'dist/electron/main.js'),
  format: 'cjs',   // CJS for broadest Electron compat
  define: { 'import.meta.url': '__importMetaUrl' },
  banner: { js: 'const __importMetaUrl = require("url").pathToFileURL(__filename).href;' },
});

await build({
  ...shared,
  entryPoints: [path.join(__dirname, 'electron/preload.ts')],
  outfile: path.join(__dirname, 'dist/electron/preload.js'),
  format: 'cjs',
});

console.log('  ✔ main.js + preload.js written to dist/electron/');

// ── Step 3 (optional): Package with electron-builder ─────────────────────────
if (doDist) {
  console.log('\n═══ 3/3  Packaging with electron-builder ═══');
  run('pnpm electron-builder --config electron-builder.yml');
  console.log('\n✅ Installer written to dist/installer/');
} else {
  console.log('\n═══ 3/3  Skipped (pass --dist to package) ═══');
  console.log('  Run:  node build-electron.mjs --dist');
}
