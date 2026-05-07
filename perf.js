// Scroll-perf benchmark for rubyqian.com.
// Usage:  node perf.js [baseUrl]
//   default baseUrl: https://rubyqian.com
// Requires: npm i -D playwright   (or  npx playwright install chromium  once)
//
// Writes results to perf-results-<timestamp>.json and prints a console table.
// Run before changes to capture a baseline; re-run after each fix and diff.

const { chromium } = require('playwright');
const fs = require('fs');

const BASE = process.argv[2] || 'https://rubyqian.com';
const PAGES = ['/', '/hemi', '/yammii', '/googlemaps', '/phia', '/fun', '/about'];

// This runs in the browser. Programmatically scrolls top -> bottom at a fixed
// rate, sampling rAF intervals. Lenis is stopped so we measure raw paint cost.
const PERF_FN = `async () => {
  if (window.lenis) window.lenis.stop();
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 600));

  const intervals = [];
  let last = performance.now();
  let longTasks = 0;
  const lto = new PerformanceObserver(list => longTasks += list.getEntries().length);
  try { lto.observe({ entryTypes: ['longtask'] }); } catch {}

  const STEP = 8;
  const maxY = document.documentElement.scrollHeight - innerHeight;
  const t0 = performance.now();

  await new Promise(done => {
    const tick = t => {
      intervals.push(t - last); last = t;
      if (window.scrollY >= maxY - 1) return done();
      window.scrollBy(0, STEP);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(t => { last = t; requestAnimationFrame(tick); });
  });

  lto.disconnect();
  intervals.shift();
  const sorted = [...intervals].sort((a,b) => a-b);
  const q = p => sorted[Math.floor(sorted.length * p)];
  const avg = intervals.reduce((s,x) => s+x, 0) / intervals.length;

  const r = performance.getEntriesByType('resource');
  const sumBytes = filter => r.filter(filter).reduce((s,e) => s + (e.transferSize || 0), 0);
  const total = sumBytes(() => true);
  const vid = sumBytes(e => e.name.includes('.mp4'));
  const img = sumBytes(e => /\\.(png|jpg|jpeg|webp|avif|gif)/i.test(e.name));

  return {
    pageHeight: maxY,
    frames: intervals.length,
    avgFps: +(1000/avg).toFixed(1),
    p50FrameMs: +q(0.5).toFixed(2),
    p95FrameMs: +q(0.95).toFixed(2),
    p99FrameMs: +q(0.99).toFixed(2),
    maxFrameMs: +Math.max(...intervals).toFixed(2),
    jankFrames50: intervals.filter(x => x > 50).length,
    jankPct: +(intervals.filter(x => x > 16.7).length / intervals.length * 100).toFixed(1),
    longTasks,
    durationS: +((performance.now() - t0)/1000).toFixed(2),
    totalKB: Math.round(total/1024),
    videoKB: Math.round(vid/1024),
    imageKB: Math.round(img/1024),
    playingVideos: Array.from(document.querySelectorAll('video')).filter(v => !v.paused).length,
    totalVideos: document.querySelectorAll('video').length,
  };
}`;

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();

  const results = [];
  for (const path of PAGES) {
    const url = BASE.replace(/\/$/, '') + path;
    process.stdout.write(`Measuring ${path} ... `);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    const r = await page.evaluate(PERF_FN);
    results.push({ page: path, ...r });
    console.log(`fps=${r.avgFps} p95=${r.p95FrameMs}ms jank=${r.jankPct}%`);
  }

  await browser.close();

  console.log('\n=== Summary ===');
  console.table(results.map(r => ({
    page: r.page,
    avgFps: r.avgFps,
    p95: r.p95FrameMs,
    p99: r.p99FrameMs,
    'jank%': r.jankPct,
    totalKB: r.totalKB,
    videoKB: r.videoKB,
    imageKB: r.imageKB,
    playingVideos: r.playingVideos,
  })));

  const out = `perf-results-${Date.now()}.json`;
  fs.writeFileSync(out, JSON.stringify({
    baseUrl: BASE,
    timestamp: new Date().toISOString(),
    viewport: '1440x900',
    results,
  }, null, 2));
  console.log(`\nSaved -> ${out}`);
})().catch(e => { console.error(e); process.exit(1); });
