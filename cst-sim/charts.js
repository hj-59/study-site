'use strict';
/* ---------- 1D 그래프 / 극좌표 그래프 ---------- */
function niceTicks(min, max, n) {
  const span = max - min || 1, step0 = span / n, mag = Math.pow(10, Math.floor(Math.log10(step0))), e = step0 / mag;
  const step = (e >= 7.5 ? 10 : e >= 3.5 ? 5 : e >= 1.5 ? 2 : 1) * mag, out = [];
  for (let v = Math.ceil(min / step - 1e-9) * step; v <= max + 1e-9; v += step) out.push(+v.toFixed(10));
  return out;
}
const COLORS = ['#e00000', '#0050d0', '#009000', '#c06000', '#8000b0', '#008b8b', '#b0007a', '#555'];
function drawLineChart(c, cfg, hx) {
  const d = U.dpr, x = c.getContext('2d'), W = c.width, H = c.height;
  x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
  x.font = `${11 * d}px sans-serif`; const lw = Math.max(...cfg.series.map(s => x.measureText(s.name).width)); const L = 70 * d, R = Math.max(120 * d, lw + 60 * d), Tp = 46 * d, Bm = 56 * d, pw = W - L - R, ph = H - Tp - Bm;
  const all = cfg.series.flatMap(s => s.pts);
  const xr = cfg.xr || [Math.min(...all.map(p => p[0])), Math.max(...all.map(p => p[0]))];
  let yr = cfg.yr;
  if (!yr) { let a = Math.min(...all.map(p => p[1])), b = Math.max(...all.map(p => p[1])); if (b - a < 1) { a -= 1; b += 1; } const pad = (b - a) * 0.06; yr = [a - pad, b + pad]; }
  const X = v => L + (v - xr[0]) / (xr[1] - xr[0]) * pw, Y = v => Tp + (1 - (v - yr[0]) / (yr[1] - yr[0])) * ph;
  x.font = `${12 * d}px sans-serif`; x.fillStyle = '#222'; x.textAlign = 'center';
  x.font = `${13 * d}px sans-serif`; x.fillText(cfg.title, L + pw / 2, 24 * d);
  x.font = `${11 * d}px sans-serif`;
  x.strokeStyle = '#c8c8c8'; x.setLineDash([3 * d, 3 * d]); x.lineWidth = 1;
  const xt = niceTicks(xr[0], xr[1], 8), yt = niceTicks(yr[0], yr[1], 7);
  for (const v of xt) { x.beginPath(); x.moveTo(X(v), Tp); x.lineTo(X(v), Tp + ph); x.stroke(); x.fillStyle = '#333'; x.fillText(String(v), X(v), Tp + ph + 16 * d); }
  x.textAlign = 'right';
  for (const v of yt) { x.beginPath(); x.moveTo(L, Y(v)); x.lineTo(L + pw, Y(v)); x.stroke(); x.fillText(String(v), L - 6 * d, Y(v) + 4 * d); }
  x.setLineDash([]); x.strokeStyle = '#444'; x.strokeRect(L, Tp, pw, ph);
  x.textAlign = 'center'; x.fillText(cfg.xl || 'Frequency / GHz', L + pw / 2, H - 16 * d);
  x.save(); x.translate(18 * d, Tp + ph / 2); x.rotate(-PI / 2); x.fillText(cfg.yl || '', 0, 0); x.restore();
  (cfg.hlines || []).forEach(h => { if (h.y < yr[0] || h.y > yr[1]) return; x.strokeStyle = h.color || '#f0b400'; x.lineWidth = 1.5 * d; x.setLineDash([6 * d, 4 * d]); x.beginPath(); x.moveTo(L, Y(h.y)); x.lineTo(L + pw, Y(h.y)); x.stroke(); x.setLineDash([]); x.fillStyle = h.color || '#b08000'; x.textAlign = 'left'; x.fillText(h.label, L + 6 * d, Y(h.y) - 5 * d); });
  x.save(); x.beginPath(); x.rect(L, Tp, pw, ph); x.clip();
  cfg.series.forEach((s, i) => {
    x.strokeStyle = s.color || COLORS[i % COLORS.length]; x.lineWidth = 1.6 * d; x.beginPath();
    s.pts.forEach((p, k) => k ? x.lineTo(X(p[0]), Y(p[1])) : x.moveTo(X(p[0]), Y(p[1]))); x.stroke();
    if (s.marker) { x.fillStyle = x.strokeStyle; s.pts.forEach(p => { x.beginPath(); x.arc(X(p[0]), Y(p[1]), 3 * d, 0, 2 * PI); x.fill(); }); }
  });
  x.restore();
  x.textAlign = 'left';
  cfg.series.forEach((s, i) => { const yy = Tp + 10 * d + i * 18 * d; x.strokeStyle = s.color || COLORS[i % COLORS.length]; x.lineWidth = 2 * d; x.beginPath(); x.moveTo(L + pw + 12 * d, yy); x.lineTo(L + pw + 34 * d, yy); x.stroke(); x.fillStyle = x.strokeStyle; x.fillText(s.name, L + pw + 40 * d, yy + 4 * d); });
  if (cfg.note) { x.fillStyle = '#a05000'; x.textAlign = 'left'; x.fillText(cfg.note, L, H - 2 * d - 2); }
  if (hx != null && hx >= L && hx <= L + pw) {
    const fv = xr[0] + (hx - L) / pw * (xr[1] - xr[0]);
    x.strokeStyle = '#000'; x.lineWidth = 1; x.beginPath(); x.moveTo(hx, Tp); x.lineTo(hx, Tp + ph); x.stroke();
    const lines = [`${fmt(fv, 4)} GHz`];
    cfg.series.forEach(s => { if (fv >= s.pts[0][0] && fv <= s.pts[s.pts.length - 1][0]) lines.push(`${s.name}: ${fmt(interp(s.pts, fv), 3)}`); });
    const bw = Math.max(...lines.map(l => x.measureText(l).width)) + 14 * d, bh = lines.length * 16 * d + 8 * d, bx = Math.min(hx + 8 * d, W - bw - 4), by = Tp + 6 * d;
    x.fillStyle = 'rgba(255,255,255,.95)'; x.strokeStyle = '#d00'; x.fillRect(bx, by, bw, bh); x.strokeRect(bx, by, bw, bh);
    x.fillStyle = '#d00'; lines.forEach((l, k) => x.fillText(l, bx + 7 * d, by + 18 * d + k * 16 * d));
  }
}
function drawPolar(c, cfg) {
  const d = U.dpr, x = c.getContext('2d'), W = c.width, H = c.height;
  x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
  const cx = W / 2 - 60 * d, cy = H / 2 + 8 * d, R = Math.min(W - 260 * d, H - 80 * d) / 2, top = cfg.rmax, rng = 40;
  const r = v => R * clamp((v - (top - rng)) / rng, 0, 1);
  x.font = `${13 * d}px sans-serif`; x.fillStyle = '#222'; x.textAlign = 'center'; x.fillText(cfg.title, W / 2, 22 * d);
  x.strokeStyle = '#ccc'; x.lineWidth = 1; x.font = `${10 * d}px sans-serif`;
  for (let k = 0; k <= 4; k++) { x.beginPath(); x.arc(cx, cy, R * k / 4, 0, 2 * PI); x.stroke(); if (k) { x.fillStyle = '#888'; x.fillText(fmt(top - rng + rng * k / 4, 1), cx + 3 * d, cy - R * k / 4 + 11 * d); } }
  for (let a = 0; a < 360; a += 30) { const t = -a * D2R - PI / 2; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + R * Math.cos(t), cy + R * Math.sin(t)); x.stroke(); x.fillStyle = '#333'; x.fillText(String(a), cx + (R + 16 * d) * Math.cos(t), cy + (R + 16 * d) * Math.sin(t) + 4 * d); }
  cfg.series.forEach((s, i) => {
    x.strokeStyle = s.color || COLORS[i]; x.lineWidth = 2 * d; x.beginPath();
    s.pts.forEach(([a, v], k) => { const t = -a * D2R - PI / 2, rr = r(v), px = cx + rr * Math.cos(t), py = cy + rr * Math.sin(t); k ? x.lineTo(px, py) : x.moveTo(px, py); });
    x.closePath(); x.stroke();
    x.fillStyle = x.strokeStyle; x.textAlign = 'left'; x.fillText(s.name, W - 190 * d, 60 * d + i * 18 * d);
  });
  x.fillStyle = '#555'; x.textAlign = 'center'; x.fillText(cfg.axisLabel, cx, cy + R + 36 * d);
}
