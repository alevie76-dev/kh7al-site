// Generates public/topo-bg.svg using marching squares over a Gaussian heightmap.
// Run: node scripts/generate-topo.js

const fs = require('fs');
const path = require('path');

const W = 1600, H = 900;
const RES = 8; // grid spacing in px
const COLS = Math.floor(W / RES) + 2;
const ROWS = Math.floor(H / RES) + 2;

// ── Height field: Gaussian peaks + sine undulation ────────────
function elevation(x, y) {
  const nx = x / W, ny = y / H;

  function gauss(cx, cy, sx, sy, h) {
    const dx = (nx - cx) / sx, dy = (ny - cy) / sy;
    return h * Math.exp(-(dx * dx + dy * dy) * 0.5);
  }

  let e = 0;
  // Main summits
  e += gauss(0.25, 0.32, 0.14, 0.19, 10.0); // Summit A — upper left
  e += gauss(0.73, 0.44, 0.17, 0.14,  8.5); // Summit B — center right
  e += gauss(0.06, 0.11, 0.07, 0.09,  6.5); // NW peak
  e += gauss(0.93, 0.83, 0.07, 0.08,  5.0); // SE hill
  e += gauss(0.48, 0.17, 0.11, 0.07,  3.8); // ridge saddle between A & B
  e += gauss(0.87, 0.22, 0.09, 0.07,  3.2); // NE shoulder

  // Broad terrain undulation (makes lines organic, not round)
  e += 0.75 * Math.sin(nx * Math.PI * 2.5)       * Math.cos(ny * Math.PI * 1.8 + 0.3);
  e += 0.50 * Math.cos(nx * Math.PI * 4.0 + 0.8) * Math.sin(ny * Math.PI * 2.5 + 0.6);
  e += 0.30 * Math.sin(nx * Math.PI * 6.0 + 1.2) * Math.cos(ny * Math.PI * 3.5 + 0.9);
  e += 0.18 * Math.sin(nx * Math.PI * 9.0 + 2.1) * Math.sin(ny * Math.PI * 5.0 + 1.4);

  return e;
}

// ── Build height grid ─────────────────────────────────────────
const grid = [];
for (let j = 0; j < ROWS; j++) {
  const row = new Float32Array(COLS);
  for (let i = 0; i < COLS; i++) row[i] = elevation(i * RES, j * RES);
  grid.push(row);
}

// ── Marching squares — one grid cell ─────────────────────────
function cellSegments(i, j, level) {
  const v00 = grid[j][i],   v10 = grid[j][i + 1];
  const v01 = grid[j+1][i], v11 = grid[j+1][i + 1];

  const b = ((v00 >= level) << 3) | ((v10 >= level) << 2)
          | ((v11 >= level) << 1) |  (v01 >= level);
  if (b === 0 || b === 15) return [];

  const x0 = i * RES, y0 = j * RES;

  function ep(va, vb, ax, ay, bx, by) {
    const t = (level - va) / (vb - va);
    return [ax + t * (bx - ax), ay + t * (by - ay)];
  }

  const pT = ep(v00, v10, x0,      y0,      x0+RES, y0     );
  const pR = ep(v10, v11, x0+RES,  y0,      x0+RES, y0+RES );
  const pB = ep(v01, v11, x0,      y0+RES,  x0+RES, y0+RES );
  const pL = ep(v00, v01, x0,      y0,      x0,     y0+RES );

  switch (b) {
    case 1:  return [[pB, pL]];
    case 2:  return [[pR, pB]];
    case 3:  return [[pR, pL]];
    case 4:  return [[pT, pR]];
    case 5:  return [[pT, pR], [pB, pL]];
    case 6:  return [[pT, pB]];
    case 7:  return [[pT, pL]];
    case 8:  return [[pL, pT]];
    case 9:  return [[pB, pT]];
    case 10: return [[pL, pB], [pT, pR]];
    case 11: return [[pR, pT]];
    case 12: return [[pL, pR]];
    case 13: return [[pB, pR]];
    case 14: return [[pL, pB]];
    default: return [];
  }
}

// ── Connect segments into polylines ──────────────────────────
function connectSegments(segs) {
  const used = new Uint8Array(segs.length);

  function key(p) {
    return `${Math.round(p[0])}_${Math.round(p[1])}`;
  }

  const byStart = new Map(), byEnd = new Map();
  for (let i = 0; i < segs.length; i++) {
    const ks = key(segs[i][0]), ke = key(segs[i][1]);
    (byStart.get(ks) || (byStart.set(ks, []), byStart.get(ks))).push(i);
    (byEnd.get(ke)   || (byEnd.set(ke,   []), byEnd.get(ke)  )).push(i);
  }

  const polylines = [];
  for (let s = 0; s < segs.length; s++) {
    if (used[s]) continue;
    used[s] = 1;
    const pts = [segs[s][0], segs[s][1]];

    // extend forward
    let tail = pts[pts.length - 1];
    for (;;) {
      const nexts = byStart.get(key(tail)) || [];
      let added = false;
      for (const idx of nexts) {
        if (!used[idx]) { used[idx] = 1; tail = segs[idx][1]; pts.push(tail); added = true; break; }
      }
      if (!added) break;
    }

    // extend backward
    let head = pts[0];
    for (;;) {
      const prevs = byEnd.get(key(head)) || [];
      let added = false;
      for (const idx of prevs) {
        if (!used[idx]) { used[idx] = 1; head = segs[idx][0]; pts.unshift(head); added = true; break; }
      }
      if (!added) break;
    }

    if (pts.length >= 3) polylines.push(pts);
  }
  return polylines;
}

// ── Douglas-Peucker simplification ───────────────────────────
function simplify(pts, eps) {
  if (pts.length <= 2) return pts;
  const [x1, y1] = pts[0], [x2, y2] = pts[pts.length - 1];
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  let maxD = 0, maxI = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i];
    const d = len > 0 ? Math.abs(dy*(px-x1) - dx*(py-y1)) / len : Math.hypot(px-x1, py-y1);
    if (d > maxD) { maxD = d; maxI = i; }
  }
  if (maxD > eps) {
    return [...simplify(pts.slice(0, maxI + 1), eps).slice(0, -1), ...simplify(pts.slice(maxI), eps)];
  }
  return [pts[0], pts[pts.length - 1]];
}

// ── Render polylines to SVG path data ────────────────────────
function toPathD(polys, eps = 2.0) {
  return polys
    .map(pts => simplify(pts, eps))
    .filter(pts => pts.length >= 2)
    .map(pts => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${Math.round(p[0])},${Math.round(p[1])}`).join(''))
    .join(' ');
}

// ── Trace all contour levels ──────────────────────────────────
const LEVEL_START = 0.3;
const LEVEL_END   = 10.5;
const INTERVAL    = 0.55;
const INDEX_MOD   = 4; // every 4th level is an index contour

let regularPaths = '', indexPaths = '';
let count = 0;

for (let lv = LEVEL_START; lv <= LEVEL_END; lv += INTERVAL) {
  const segs = [];
  for (let j = 0; j < ROWS - 1; j++)
    for (let i = 0; i < COLS - 1; i++)
      segs.push(...cellSegments(i, j, lv));

  const polys = connectSegments(segs);
  const d = toPathD(polys);
  if (!d) { count++; continue; }

  if (count % INDEX_MOD === 0) {
    indexPaths += `  <path d="${d}"/>\n`;
  } else {
    regularPaths += `  <path d="${d}"/>\n`;
  }
  count++;
}

// ── Write SVG ─────────────────────────────────────────────────
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g stroke="#6a8aaa" stroke-width="0.9">
${regularPaths}    </g>
    <g stroke="#88aacc" stroke-width="1.5">
${indexPaths}    </g>
  </g>
</svg>`;

const out = path.join(__dirname, '..', 'public', 'topo-bg.svg');
fs.writeFileSync(out, svg);
const kb = (fs.statSync(out).size / 1024).toFixed(0);
console.log(`Wrote ${out}  (${kb} KB)`);
