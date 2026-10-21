// smoke-test.js - executes the game's entire top-level script in Node with a stubbed
// browser environment, then pumps animation frames. Catches load-order crashes (TDZ,
// undefined globals, bad init sequencing) that a pure syntax check can never see.
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync(process.argv[2] || 'dist/index.html', 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('no script block'); process.exit(1); }

const errors = [];

// ---- absorbing proxy: any property access returns another callable absorber ----
function absorber(label) {
  const fn = function () { return absorber(label); };
  return new Proxy(fn, {
    get(t, k) {
      if (k === Symbol.toPrimitive || k === 'valueOf') return () => 0;
      if (k === 'toString' || k === Symbol.toStringTag) return () => '';
      if (k === 'length' || k === 'width' || k === 'height' || k === 'clientWidth' || k === 'clientHeight') return 800;
      if (k === 'style' || k === 'dataset' || k === 'classList') return absorber(label + '.' + String(k));
      if (k === 'getBoundingClientRect') return () => ({ left: 0, top: 0, width: 800, height: 600, right: 800, bottom: 600 });
      if (k === 'getContext') return () => ctx2d();
      if (k === 'querySelectorAll') return () => [];
      if (k === 'children') return [];
      if (k === 'value' || k === 'textContent' || k === 'innerHTML') return '';
      return absorber(label + '.' + String(k));
    },
    set() { return true; },
    apply() { return absorber(label + '()'); },
    construct() { return absorber(label + '.new'); },
    has() { return true; }
  });
}

// ---- 2d context stub: real numeric state props, no-op methods, gradient objects ----
function ctx2d() {
  const state = { shadowBlur: 0, shadowColor: '', globalAlpha: 1, fillStyle: '', strokeStyle: '', lineWidth: 1, font: '', textAlign: '', textBaseline: '', lineCap: '', filter: '' };
  const grad = () => ({ addColorStop() {} });
  return new Proxy(state, {
    get(t, k) {
      if (k in t) return t[k];
      if (k === 'createRadialGradient' || k === 'createLinearGradient') return grad;
      if (k === 'measureText') return () => ({ width: 10 });
      if (k === 'getImageData') return () => ({ data: new Uint8ClampedArray(4) });
      return () => {}; // every method is a no-op
    },
    set(t, k, v) { t[k] = v; return true; }
  });
}

const storageMem = {};
const listeners = {};
let rafCbs = [];

const windowObj = {};
const sandbox = {
  console: { log() {}, warn() {}, error(...a) { errors.push('console.error: ' + a.map(String).join(' ').slice(0, 160)); } },
  setTimeout: (fn) => { try { fn(); } catch (e) { errors.push('setTimeout: ' + e.message); } return 1; },
  clearTimeout() {}, setInterval: () => 1, clearInterval() {},
  requestAnimationFrame: (cb) => { rafCbs.push(cb); return rafCbs.length; },
  performance: { now: () => Date.now() },
  navigator: { maxTouchPoints: 0, userAgent: 'smoke', language: 'en', vibrate() {} },
  document: new Proxy({}, {
    get(t, k) {
      if (k === 'getElementById' || k === 'querySelector') return () => absorber('el');
      if (k === 'querySelectorAll') return () => [];
      if (k === 'createElement') return () => absorber('created');
      if (k === 'addEventListener') return () => {};
      if (k === 'body' || k === 'documentElement' || k === 'head') return absorber('docpart');
      if (k === 'visibilityState') return 'visible';
      if (k === 'fonts') return { ready: Promise.resolve(), load: () => Promise.resolve() };
      return absorber('document.' + String(k));
    },
    set() { return true; }
  }),
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: false }) }),
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  Math, JSON, Object, Array, Number, String, Boolean, Date, Promise, Set, Map, WeakMap, WeakSet,
  parseInt, parseFloat, isNaN, isFinite, encodeURIComponent, decodeURIComponent, URLSearchParams,
  Uint8ClampedArray, Float32Array, Int32Array, Uint8Array, Error, TypeError, RangeError, Symbol, Proxy, Reflect, RegExp, Infinity, NaN, undefined: undefined,
  atob: (s) => Buffer.from(s, 'base64').toString('binary'),
  btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
  AbortController: class { constructor() { this.signal = {}; } abort() {} },
};
Object.assign(windowObj, sandbox, {
  addEventListener(ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); },
  removeEventListener() {},
  devicePixelRatio: 2, innerWidth: 800, innerHeight: 600,
  storage: {
    get: (k) => Promise.resolve(storageMem[k] != null ? { key: k, value: storageMem[k] } : null),
    set: (k, v) => { storageMem[k] = v; return Promise.resolve({ key: k, value: v }); },
    delete: (k) => { delete storageMem[k]; return Promise.resolve({}); },
    list: () => Promise.resolve({ keys: Object.keys(storageMem) })
  },
  Telegram: undefined,
  location: { href: 'https://smoke.test/', search: '', hash: '' },
  history: { replaceState() {} },
  matchMedia: () => ({ matches: false, addEventListener() {} }),
  open() {},
  visualViewport: undefined,
  AudioContext: undefined, webkitAudioContext: undefined,
  CanvasRenderingContext2D: undefined, // governor try/catch path
});
sandbox.window = windowObj;
sandbox.self = windowObj;
sandbox.globalThis = windowObj;
// expose window props as bare globals (scripts use unqualified names)
for (const k of ['addEventListener', 'removeEventListener', 'devicePixelRatio', 'innerWidth', 'innerHeight', 'location', 'history', 'matchMedia', 'visualViewport']) sandbox[k] = windowObj[k];

const context = vm.createContext(sandbox);

// ---- phase 1: top-level execution (this is where the QX crash happened) ----
try {
  vm.runInContext(m[1], context, { filename: 'game.js', timeout: 30000 });
  console.log('PHASE 1  top-level script executed without throwing');
} catch (e) {
  console.log('PHASE 1  TOP-LEVEL CRASH: ' + e.message);
  console.log(e.stack.split('\n').slice(0, 4).join('\n'));
  process.exit(1);
}

// ---- phase 2: async init settles (storage loader, applyQuality, resize chain) ----
setImmediate(() => {
  // ---- phase 3: pump 90 animation frames (~1.5s of menu runtime) ----
  let t = 1000, frameErrors = 0;
  for (let i = 0; i < 90; i++) {
    const cbs = rafCbs; rafCbs = [];
    t += 16.7;
    for (const cb of cbs) { try { cb(t); } catch (e) { frameErrors++; if (frameErrors <= 3) errors.push('frame ' + i + ': ' + e.message); } }
  }
  console.log('PHASE 2  async init settled');
  console.log('PHASE 3  pumped 90 frames, frame errors: ' + frameErrors);

  // ---- phase 4: fire resize + visibility listeners like a real browser would ----
  for (const ev of ['resize', 'focus', 'visibilitychange']) {
    for (const fn of (listeners[ev] || [])) { try { fn({}); } catch (e) { errors.push(ev + ': ' + e.message); } }
  }
  console.log('PHASE 4  event listeners fired');

  const fatal = errors.filter(e => /before initialization|is not defined|Cannot read|Cannot set/.test(e));
  if (errors.length) { console.log('\ncollected errors:'); for (const e of errors.slice(0, 12)) console.log('  ' + e); }
  console.log('\n' + (fatal.length === 0 ? 'SMOKE TEST PASS - no load-order or reference crashes' : 'SMOKE TEST FAIL - ' + fatal.length + ' fatal'));
  process.exit(fatal.length ? 1 : 0);
});
