'use strict';
/* ---------- 3D/평면 뷰 그리기 ---------- */
const cv = () => $('#cv');
const POOL = []; let poolIdx = 0;
function oc() {
  const c = cv(); let o = POOL[poolIdx];
  if (!o) { o = document.createElement('canvas'); POOL[poolIdx] = o; }
  poolIdx++;
  if (o.width !== c.width || o.height !== c.height) { o.width = c.width; o.height = c.height; }
  const x = o.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; x.clearRect(0, 0, o.width, o.height);
  return o;
}
function T() {
  // [a,b,c,d,e,f] for z = 0 plane, plus zk (screen-y per mm of z)
  const z = U.zoom;
  if (U.view === 'top') return { m: [z, 0, 0, -z, U.ox, U.oy], zk: 0 };
  if (U.view === 'bot') return { m: [-z, 0, 0, -z, U.ox, U.oy], zk: 0 };
  const ca = Math.cos(U.az * D2R), sa = Math.sin(U.az * D2R), se = Math.sin(U.el * D2R), ce = Math.cos(U.el * D2R);
  return { m: [z * ca, -z * se * sa, -z * sa, -z * se * ca, U.ox, U.oy], zk: z * ce };
}
function proj(t, x, y, zz) { const m = t.m; return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5] - t.zk * zz]; }
function unproj(t, sx, sy, zz) {
  const m = t.m, X = sx - m[4], Y = sy - m[5] + t.zk * zz, det = m[0] * m[3] - m[2] * m[1];
  return [(X * m[3] - m[2] * Y) / det, (m[0] * Y - m[1] * X) / det];
}
function depthKey(t, bb) { // 화면에서 위쪽(멀리)에 있는 것부터
  const cx = (bb.x0 + bb.x1) / 2, cy = (bb.y0 + bb.y1) / 2; return proj(t, cx, cy, 0)[1];
}
function leafPath(x, l) {
  x.beginPath();
  if (l.t === 'brick') { l.pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); }
  else { x.arc(l.c[0], l.c[1], l.ro, 0, 2 * PI); if (l.ri > 0) { x.moveTo(l.c[0] + l.ri, l.c[1]); x.arc(l.c[0], l.c[1], l.ri, 0, 2 * PI, true); } }
}
let CLIP = null; // 이 도형이 차지하는 화면 영역 (z = 0 기준)
function dImg(ctx, src, dy) { if (!CLIP) return ctx.drawImage(src, 0, dy || 0); const r = CLIP; ctx.drawImage(src, r.x, r.y, r.w, r.h, r.x, r.y + (dy || 0), r.w, r.h); }
function renderInto(x, en, op, t) {
  if (en.t !== 'grp') { x.globalCompositeOperation = op; leafPath(x, en); x.fillStyle = '#000'; x.fill('evenodd'); return; }
  const c2 = oc(), x2 = c2.getContext('2d'); x2.setTransform(...t.m);
  en.items.forEach(it => renderInto(x2, it.n, it.s > 0 ? 'source-over' : 'destination-out', t));
  x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = op; dImg(x, c2, 0); x.restore();
}
function tinted(mask, color) { const o = oc(), x = o.getContext('2d'); dImg(x, mask, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; if (CLIP) x.fillRect(CLIP.x, CLIP.y, CLIP.w, CLIP.h); else x.fillRect(0, 0, o.width, o.height); return o; }
function shade(hex, k) { const n = parseInt(hex.slice(1), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; return `rgb(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)})`; }

let lastItems = [], drawPending = false;
function drawSoon() { if (drawPending) return; drawPending = true; requestAnimationFrame(() => { drawPending = false; draw(); }); }
function draw() {
  const c = cv(); if (!c || !S) return;
  const ctx = c.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, c.height); g.addColorStop(0, '#aeb8c8'); g.addColorStop(1, '#eef0f4');
  ctx.fillStyle = g; ctx.fillRect(0, 0, c.width, c.height);
  const t = T(), P = curP();
  if (U.grid) drawGrid(ctx, t);
  const items = [];
  for (const s of S.solids) { try { const en = evalNode(s.node, P); items.push({ s, en, bb: bboxOf(en) }); } catch (e) { } }
  if (U.view === 'top') items.sort((a, b) => a.bb.z1 - b.bb.z1 || a.bb.z0 - b.bb.z0);
  else if (U.view === 'bot') items.sort((a, b) => b.bb.z0 - a.bb.z0 || b.bb.z1 - a.bb.z1);
  else items.sort((a, b) => (a.bb.z0 - b.bb.z0) || (a.bb.z1 - b.bb.z1) || (depthKey(t, a.bb) - depthKey(t, b.bb)));
  lastItems = items;
  for (const it of items) { if (it.s.hidden) continue; poolIdx = 0; drawSolid(ctx, t, it, U.sel.includes(it.s.id)); }
  poolIdx = 0;
  if (U.mesh && U.view !== 'iso') drawMesh(ctx, t, items);
  if (U.ghost) drawGhost(ctx, t);
  if (U.preview) { try { const en = evalNode(U.preview, P); outline(ctx, t, en, '#ff7a00', 2, [6, 4]); } catch (e) { } }
  S.ports.forEach((p, i) => drawPort(ctx, t, p, P, i));
  if (U.pick) { const [a, b] = [proj(t, U.pick.p1[0], U.pick.p1[1], U.pick.z), proj(t, U.pick.p2[0], U.pick.p2[1], U.pick.z)]; ctx.strokeStyle = '#ff6a00'; ctx.lineWidth = 4 * U.dpr; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); ctx.fillStyle = '#d10000'; [a, b].forEach(p => { ctx.beginPath(); ctx.arc(p[0], p[1], 4 * U.dpr, 0, 2 * PI); ctx.fill(); }); }
  drawAxes(ctx, t);
  ctx.fillStyle = 'rgba(20,40,80,.55)'; ctx.font = `${12 * U.dpr}px sans-serif`;
  ctx.fillText(U.view === 'iso' ? '3D (드래그: 회전, Shift+드래그: 이동, 휠: 확대)' : U.view === 'top' ? 'Front: +z에서 내려다본 모습 (윗면)' : 'Back: −z에서 올려다본 모습 (아랫면, 좌우 반전)', 10 * U.dpr, c.height - 10 * U.dpr);
}
function drawSolid(ctx, t, it, sel) {
  const W = cv().width, Hh = cv().height, b = it.bb;
  const cs = [[b.x0, b.y0], [b.x1, b.y0], [b.x0, b.y1], [b.x1, b.y1]].map(([x, y]) => proj(t, x, y, 0));
  let x0 = Math.floor(Math.min(...cs.map(c => c[0]))) - 3, x1 = Math.ceil(Math.max(...cs.map(c => c[0]))) + 3, y0 = Math.floor(Math.min(...cs.map(c => c[1]))) - 3, y1 = Math.ceil(Math.max(...cs.map(c => c[1]))) + 3;
  const top0 = y0 - Math.ceil(t.zk * Math.max(b.z1, 0)) - 2, bot0 = y1 + Math.ceil(t.zk * Math.max(-b.z0, 0)) + 2;
  if (x1 < 0 || x0 > W || bot0 < 0 || top0 > Hh) return;
  x0 = clamp(x0, 0, W); x1 = clamp(x1, 0, W); y0 = clamp(y0, 0, Hh); y1 = clamp(y1, 0, Hh);
  CLIP = x1 > x0 && y1 > y0 ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
  const m = getMat(it.s.mat), mask = oc(), mx = mask.getContext('2d'); mx.setTransform(...t.m);
  renderInto(mx, it.en, 'source-over', t);
  const isD = m.kind === 'diel';
  const alpha = it.s.mat === 'Vacuum' ? 0.25 : (isD && U.trans ? 0.45 : 1);
  const top = tinted(mask, m.color);
  const layer = oc(), lx = layer.getContext('2d');
  if (t.zk > 0) {
    const side = tinted(mask, shade(m.color, 0.72)), z0 = it.bb.z0, z1 = it.bb.z1, n = Math.min(400, Math.max(1, Math.ceil((z1 - z0) * t.zk)));
    if (z1 - z0 > 1e-9) for (let i = 0; i <= n; i++) dImg(lx, side, -t.zk * (z0 + (z1 - z0) * i / n));
    dImg(lx, top, -t.zk * z1);
  } else dImg(lx, top, 0);
  if (sel) { const o = tinted(mask, '#ff8c1a'); lx.globalAlpha = 0.55; dImg(lx, o, -t.zk * it.bb.z1); lx.globalAlpha = 1; }
  const cl = CLIP; CLIP = null;
  ctx.globalAlpha = alpha;
  if (cl) { const ya = clamp(top0, 0, Hh), yb = clamp(bot0, 0, Hh); if (yb > ya) ctx.drawImage(layer, cl.x, ya, cl.w, yb - ya, cl.x, ya, cl.w, yb - ya); } else ctx.drawImage(layer, 0, 0);
  ctx.globalAlpha = 1;
  outline(ctx, t, it.en, sel ? '#ff6a00' : 'rgba(25,25,25,.45)', sel ? 2 : 1);
}
function outline(ctx, t, en, color, w, dash) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w * U.dpr; if (dash) ctx.setLineDash(dash.map(v => v * U.dpr));
  const zz = U.view === 'bot' ? null : 1;
  for (const { l } of leaves(en)) {
    const z = U.view === 'bot' ? l.z0 : l.z1;
    ctx.beginPath();
    if (l.t === 'brick') { l.pts.forEach((p, i) => { const q = proj(t, p[0], p[1], z); i ? ctx.lineTo(...q) : ctx.moveTo(...q); }); ctx.closePath(); }
    else { for (let k = 0; k <= 36; k++) { const a = k / 36 * 2 * PI, q = proj(t, l.c[0] + l.ro * Math.cos(a), l.c[1] + l.ro * Math.sin(a), z); k ? ctx.lineTo(...q) : ctx.moveTo(...q); } }
    ctx.stroke();
  }
  ctx.restore();
}
function drawGrid(ctx, t) {
  const pj = PJ(), s = boundsOf(pj), m = (s.x1 - s.x0) < 20 ? 3 : 10, st = (s.x1 - s.x0) > 60 ? 10 : (s.x1 - s.x0) < 20 ? 1 : 5;
  const x0 = Math.floor((s.x0 - m) / st) * st, x1 = Math.ceil((s.x1 + m) / st) * st, y0 = Math.floor((s.y0 - m) / st) * st, y1 = Math.ceil((s.y1 + m) / st) * st, z = pj.z.bot;
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1;
  for (let x = x0; x <= x1; x += st) { ctx.beginPath(); ctx.moveTo(...proj(t, x, y0, z)); ctx.lineTo(...proj(t, x, y1, z)); ctx.stroke(); }
  for (let y = y0; y <= y1; y += st) { ctx.beginPath(); ctx.moveTo(...proj(t, x0, y, z)); ctx.lineTo(...proj(t, x1, y, z)); ctx.stroke(); }
  ctx.restore();
}
function drawMesh(ctx, t, items) {
  const pj = PJ(), s = boundsOf(pj), f1 = S.freq ? S.freq[1] : pj.freq[1];
  const lam = 300 / f1, maxStep = Math.min(lam / S.gmesh.cpw, Math.max(s.x1 - s.x0, s.y1 - s.y0) / S.gmesh.cpe);
  const xs = new Set([s.x0, s.x1]), ys = new Set([s.y0, s.y1]);
  for (const it of items) for (const { l } of leaves(it.en)) {
    if (l.t === 'brick') l.pts.forEach(p => { xs.add(+p[0].toFixed(3)); ys.add(+p[1].toFixed(3)); });
    else { const k = it.s.localMesh || 1; for (let i = -k; i <= k; i++) { xs.add(+(l.c[0] + l.ro * i / k).toFixed(3)); ys.add(+(l.c[1] + l.ro * i / k).toFixed(3)); } }
  }
  const fill = set => { const a = [...set].filter(v => v >= s.x0 - 50 && v <= 1e4).sort((p, q) => p - q), out = []; for (let i = 0; i < a.length; i++) { out.push(a[i]); if (i < a.length - 1) { const gap = a[i + 1] - a[i], n = Math.ceil(gap / maxStep); for (let k = 1; k < n; k++) out.push(a[i] + gap * k / n); } } return out; };
  const X = fill(xs), Y = fill(ys);
  ctx.save(); ctx.strokeStyle = 'rgba(0,0,90,.28)'; ctx.lineWidth = 1;
  for (const x of X) { ctx.beginPath(); ctx.moveTo(...proj(t, x, s.y0, 0)); ctx.lineTo(...proj(t, x, s.y1, 0)); ctx.stroke(); }
  for (const y of Y) { ctx.beginPath(); ctx.moveTo(...proj(t, s.x0, y, 0)); ctx.lineTo(...proj(t, s.x1, y, 0)); ctx.stroke(); }
  ctx.restore();
  const nz = 8 + (pj.dr ? 20 : 0);
  U.meshCells = X.length * Y.length * nz; $('#stMesh').textContent = 'Meshcells ≈ ' + U.meshCells.toLocaleString();
}
function drawGhost(ctx, t) {
  const pj = PJ();
  let zOf, show;
  if (pj.spec) {
    zOf = {}; for (const c of pj.cats) zOf[c] = U.view === 'bot' ? pj.spec[c].z[0] : pj.spec[c].z[1];
    show = U.view === 'bot' ? pj.cats.filter(c => pj.spec[c].z[0] <= 0.01) : pj.cats;
  } else {
    zOf = { sub: U.view === 'bot' ? pj.sub.z0 : pj.sub.z1, top: pj.z.top, bot: pj.z.bot, tall: pj.tall ? pj.tall.z1 : 0, dr: pj.dr ? pj.dr.z1 : 0 };
    show = U.view === 'top' ? ['sub', 'top', 'tall', 'dr'] : U.view === 'bot' ? ['sub', 'bot'] : pj.cats;
  }
  ctx.save(); ctx.strokeStyle = '#0077ff'; ctx.lineWidth = 1.5 * U.dpr; ctx.setLineDash([5 * U.dpr, 4 * U.dpr]);
  for (const c of show) {
    if (!pj.ref[c]) continue;
    for (const p of pj.ref[c][0]) {
      const pts = refPoly(p);
      ctx.beginPath(); pts.forEach((q, i) => { const r = proj(t, q[0], q[1], zOf[c]); i ? ctx.lineTo(...r) : ctx.moveTo(...r); }); ctx.closePath(); ctx.stroke();
    }
  }
  if (pj.via) { const v = pj.via; ctx.beginPath(); for (let k = 0; k <= 24; k++) { const a = k / 24 * 2 * PI, r = proj(t, v.x + Math.max(v.r, 0.4) * Math.cos(a), v.y + Math.max(v.r, 0.4) * Math.sin(a), pj.z.top); k ? ctx.lineTo(...r) : ctx.moveTo(...r); } ctx.stroke(); }
  if (pj.coax) { const v = pj.coax; ctx.beginPath(); for (let k = 0; k <= 24; k++) { const a = k / 24 * 2 * PI, r = proj(t, v.x + 0.635 * Math.cos(a), v.y + 0.635 * Math.sin(a), -1.5); k ? ctx.lineTo(...r) : ctx.moveTo(...r); } ctx.stroke(); }
  ctx.restore();
}
function drawPort(ctx, t, p, P, i) {
  let C; try { C = portCorners(p, P); } catch (e) { return; }
  const q = C.map(c => proj(t, c[0], c[1], c[2]));
  ctx.save(); ctx.fillStyle = 'rgba(230,0,0,.78)'; ctx.strokeStyle = '#b00000'; ctx.lineWidth = (t.zk ? 1 : 5) * U.dpr;
  ctx.beginPath(); q.forEach((r, k) => k ? ctx.lineTo(...r) : ctx.moveTo(...r)); ctx.closePath(); ctx.fill(); ctx.stroke();
  const cx = C.reduce((a, c) => a + c[0], 0) / 4, cy = C.reduce((a, c) => a + c[1], 0) / 4, cz = C.reduce((a, c) => a + c[2], 0) / 4;
  const L = Math.max(3, 40 / U.zoom * U.dpr), d = [0, 0, 0]; d['xyz'.indexOf(p.normal)] = p.dir * L;
  const a = proj(t, cx, cy, cz), b = proj(t, cx + d[0], cy + d[1], cz + d[2]);
  ctx.strokeStyle = '#d00000'; ctx.lineWidth = 2.5 * U.dpr; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke();
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), h = 9 * U.dpr;
  ctx.fillStyle = '#d00000'; ctx.beginPath(); ctx.moveTo(...b); ctx.lineTo(b[0] - h * Math.cos(ang - 0.4), b[1] - h * Math.sin(ang - 0.4)); ctx.lineTo(b[0] - h * Math.cos(ang + 0.4), b[1] - h * Math.sin(ang + 0.4)); ctx.fill();
  ctx.fillStyle = '#000'; ctx.font = `bold ${13 * U.dpr}px sans-serif`; ctx.fillText(String(i + 1), a[0] + 6 * U.dpr, a[1] - 6 * U.dpr);
  ctx.restore();
}
function drawAxes(ctx, t) {
  const c = cv(), ox = c.width - 60 * U.dpr, oy = c.height - 50 * U.dpr, L = 32 * U.dpr, m = t.m, z = U.zoom;
  const ax = [['x', [m[0] / z, m[1] / z], '#e00000'], ['y', [m[2] / z, m[3] / z], '#00a000'], ['z', [0, -t.zk / z], '#0040e0']];
  ctx.save(); ctx.lineWidth = 2.5 * U.dpr; ctx.font = `bold ${12 * U.dpr}px sans-serif`;
  for (const [n, v, col] of ax) {
    const len = Math.hypot(v[0], v[1]); if (len < 0.05) { ctx.fillStyle = col; ctx.fillText(n === 'z' ? (U.view === 'bot' ? '−z ⊗' : 'z ⊙') : n, ox - 6 * U.dpr, oy + 4 * U.dpr); continue; }
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + v[0] * L, oy + v[1] * L); ctx.stroke(); ctx.fillText(n, ox + v[0] * (L + 9 * U.dpr) - 4 * U.dpr, oy + v[1] * (L + 9 * U.dpr) + 4 * U.dpr);
  }
  ctx.restore();
}
function fit() {
  const c = cv(), pj = PJ(), s = boundsOf(pj), zr = pj.fitZ || [pj.sub.z0, pj.dr ? pj.dr.z1 : pj.z.top];
  U.zoom = 1; U.ox = 0; U.oy = 0; const t = T();
  const pts = []; for (const x of [s.x0, s.x1]) for (const y of [s.y0, s.y1]) for (const z of zr) pts.push(proj(t, x, y, z));
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
  U.zoom = Math.min(c.width * 0.8 / w, c.height * 0.78 / h);
  const t2 = T(), p2 = pts.map(() => 0); const q = []; for (const x of [s.x0, s.x1]) for (const y of [s.y0, s.y1]) for (const z of zr) q.push(proj(t2, x, y, z));
  const cx = (Math.max(...q.map(p => p[0])) + Math.min(...q.map(p => p[0]))) / 2, cy = (Math.max(...q.map(p => p[1])) + Math.min(...q.map(p => p[1]))) / 2;
  U.ox = c.width / 2 - cx; U.oy = c.height / 2 - cy;
  draw();
}
function resizeCanvas() {
  const c = cv(), vp = $('#vp'); U.dpr = window.devicePixelRatio || 1;
  const w = Math.max(50, vp.clientWidth), h = Math.max(50, vp.clientHeight);
  const ow = c.width; c.width = Math.round(w * U.dpr); c.height = Math.round(h * U.dpr); c.style.width = w + 'px'; c.style.height = h + 'px';
  if (ow && ow !== c.width) { U.ox *= c.width / ow; U.oy *= c.width / ow; U.zoom *= c.width / ow; }
  draw(); if (U.tab !== '3D') renderResult();
}

/* ---------- 마우스 ---------- */
function hitSolid(sx, sy) {
  const t = T();
  for (let i = lastItems.length - 1; i >= 0; i--) {
    const it = lastItems[i]; if (it.s.hidden) continue;
    const z = U.view === 'bot' ? it.bb.z0 : it.bb.z1, [x, y] = unproj(t, sx, sy, z);
    if (contains(it.en, x, y)) return it.s;
  }
  return null;
}
function pickEdgeAt(sx, sy) {
  if (U.view === 'iso') { msg('warn', 'Pick Edge는 View → Front 또는 Back 보기에서 하세요.'); return; }
  const t = T(); let best = null, bd = 14 * U.dpr;
  for (const it of lastItems) {
    if (getMat(it.s.mat).kind !== 'metal') continue;
    for (const { l } of leaves(it.en)) {
      if (l.t !== 'brick') continue; const z = U.view === 'bot' ? l.z0 : l.z1;
      for (let k = 0; k < 4; k++) {
        const p1 = l.pts[k], p2 = l.pts[(k + 1) % 4], a = proj(t, p1[0], p1[1], z), b = proj(t, p2[0], p2[1], z);
        const vx = b[0] - a[0], vy = b[1] - a[1], L2 = vx * vx + vy * vy || 1, u = clamp(((sx - a[0]) * vx + (sy - a[1]) * vy) / L2, 0, 1);
        const dd = Math.hypot(a[0] + u * vx - sx, a[1] + u * vy - sy);
        const pref = U.view === 'bot' ? -z : z;
        if (dd < bd - 0.5 || (Math.abs(dd - bd) < 0.5 && best && pref > best.pref)) { bd = dd; best = { p1, p2, z, pref, name: it.s.name }; }
      }
    }
  }
  if (!best) { msg('warn', '가까운 금속 모서리가 없습니다. 모서리 위를 클릭하세요.'); return; }
  U.pick = best; U.mode = null; setHint('');
  msg('info', `Edge picked: ${best.name} (${fmt(best.p1[0])}, ${fmt(best.p1[1])}) – (${fmt(best.p2[0])}, ${fmt(best.p2[1])}), z = ${fmt(best.z)}`);
  draw();
}
function initMouse() {
  const c = cv(); let down = null;
  c.addEventListener('contextmenu', e => e.preventDefault());
  c.addEventListener('mousedown', e => { down = { x: e.clientX, y: e.clientY, ox: U.ox, oy: U.oy, az: U.az, el: U.el, moved: false, shift: e.shiftKey || e.button !== 0 }; });
  window.addEventListener('mousemove', e => {
    if (!down) return; const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) down.moved = true; if (!down.moved) return;
    if (U.view === 'iso' && !down.shift) { U.az = down.az - dx * 0.4; U.el = clamp(down.el + dy * 0.3, 5, 90); }
    else { U.ox = down.ox + dx * U.dpr; U.oy = down.oy + dy * U.dpr; }
    drawSoon();
  });
  window.addEventListener('mouseup', e => {
    if (!down) return; const d = down; down = null; if (d.moved || e.target !== c) return;
    const r = c.getBoundingClientRect(), sx = (e.clientX - r.left) * U.dpr, sy = (e.clientY - r.top) * U.dpr;
    if (U.mode === 'pickEdge') return pickEdgeAt(sx, sy);
    if (U.mode === 'awaitEsc') { msg('info', '이 연습판은 좌표 입력만 지원합니다. Esc를 누르세요.'); return; }
    const s = hitSolid(sx, sy);
    if (U.mode === 'bool') { if (s) boolTarget(s.id); return; }
    if (s) { if (e.ctrlKey || e.metaKey) { U.sel = U.sel.includes(s.id) ? U.sel.filter(i => i !== s.id) : [...U.sel, s.id]; } else U.sel = [s.id]; }
    else U.sel = [];
    renderTree(); draw();
  });
  c.addEventListener('wheel', e => {
    e.preventDefault(); const r = c.getBoundingClientRect(), mx = (e.clientX - r.left) * U.dpr, my = (e.clientY - r.top) * U.dpr, k = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    U.ox = mx - (mx - U.ox) * k; U.oy = my - (my - U.oy) * k; U.zoom *= k; drawSoon();
  }, { passive: false });
}
