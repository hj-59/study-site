'use strict';
/* =========================================================
   CST 연습 시뮬레이터 (모의)  ─  실제 전자기 계산은 하지 않음.
   만든 형상을 정답(교안 형상)과 비교해 결과 곡선을 근사 생성.
   ========================================================= */
const $ = s => document.querySelector(s);
const PI = Math.PI, D2R = PI / 180;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- 재질 라이브러리 ---------- */
const MAT_LIB = [
  { name: 'PEC', kind: 'metal', color: '#9b9b9b', info: 'Perfect Electric Conductor (손실 없는 이상적 도체)' },
  { name: 'Copper (annealed)', kind: 'metal', color: '#c98a4b', info: '구리, σ = 5.8e7 S/m' },
  { name: 'Vacuum', kind: 'diel', eps: 1, tand: 0, color: '#bfe3ff', info: 'εr = 1' },
  { name: 'FR-4 (lossy)', kind: 'diel', eps: 4.3, tand: 0.025, color: '#d9b49e', info: 'εr = 4.3, tanδ = 0.025' },
  { name: 'FR-4 (lossless)', kind: 'diel', eps: 4.3, tand: 0, color: '#e4c7b5', info: 'εr = 4.3, tanδ = 0' },
  { name: 'Rogers RO4003C (lossy)', kind: 'diel', eps: 3.38, tand: 0.0027, color: '#5fd3d6', info: 'εr = 3.38, tanδ = 0.0027' },
  { name: 'Rogers RO4003C (lossless)', kind: 'diel', eps: 3.38, tand: 0, color: '#7fdfe0', info: 'εr = 3.38, tanδ = 0' },
  { name: 'Rogers RT5880 (lossy)', kind: 'diel', eps: 2.2, tand: 0.0009, color: '#9ccff2', info: 'εr = 2.2, tanδ = 0.0009' },
  { name: 'Rogers RO3010 (lossy)', kind: 'diel', eps: 10.2, tand: 0.0022, color: '#f0d36a', info: 'εr = 10.2, tanδ = 0.0022' },
  { name: 'Alumina (99.5%) (lossy)', kind: 'diel', eps: 9.9, tand: 0.0001, color: '#f2efe2', info: 'εr = 9.9, tanδ = 0.0001' }
];
function getMat(name) {
  return MAT_LIB.find(m => m.name === name) || (S && S.custom[name]) || { name, kind: 'diel', eps: 1, tand: 0, color: '#ccc' };
}

/* ---------- 상태 ---------- */
let S = null;            // 저장되는 프로젝트 상태
const U = {              // 화면 상태
  view: 'iso', az: -30, el: 50, zoom: 10, ox: 0, oy: 0, sel: [], pick: null, mode: null, boolOp: null,
  trans: false, ghost: false, grid: true, mesh: false, tab: '3D', tabs: [], closed: new Set(['mats']),
  preview: null, dpr: 1, missionTab: 'steps', openStep: -1, hover: null
};
let undoStack = [];
const PJ = () => PROJECTS[S.proj];

function blankState(key) {
  return { proj: key, params: [], freq: null, solids: [], ports: [], monitors: [], tpls: [], mats: ['PEC', 'Vacuum'], custom: {}, results: null, sweep: null, gmesh: { cpw: 15, cpe: 20 }, nextId: 1 };
}
function save() { try { localStorage.setItem('cstsim2:' + S.proj, JSON.stringify(S)); localStorage.setItem('cstsim2:last', S.proj); } catch (e) { } }
function loadSaved(key) { try { const t = localStorage.getItem('cstsim2:' + key); return t ? JSON.parse(t) : null; } catch (e) { return null; } }
function pushUndo() { undoStack.push(JSON.stringify(S)); if (undoStack.length > 60) undoStack.shift(); }
function undo() { if (!undoStack.length) { msg('warn', '되돌릴 작업이 없습니다.'); return; } S = JSON.parse(undoStack.pop()); U.sel = []; afterChange(true); msg('info', 'Undo'); }

/* ---------- 수식 계산 ---------- */
const MATHF = { sin: Math.sin, cos: Math.cos, tan: Math.tan, sqrt: Math.sqrt, abs: Math.abs, exp: Math.exp, log: Math.log, atn: Math.atan, atan: Math.atan, asin: Math.asin, acos: Math.acos, pi: PI, min: Math.min, max: Math.max };
function ev(expr, P) {
  if (typeof expr === 'number') return expr;
  const s = String(expr).trim();
  if (s === '') throw new Error('값이 비어 있습니다');
  if (!/^[0-9A-Za-z_+\-*/().,\s^]*$/.test(s)) throw new Error('사용할 수 없는 문자: ' + s);
  const js = s.replace(/\^/g, '**').replace(/[A-Za-z_][A-Za-z0-9_]*/g, id => {
    if (P && Object.prototype.hasOwnProperty.call(P, id)) return 'P["' + id + '"]';
    if (Object.prototype.hasOwnProperty.call(MATHF, id)) return 'M.' + id;
    if (/^e$/i.test(id)) return 'e';
    throw new Error('정의되지 않은 이름: ' + id);
  });
  const v = Function('P', 'M', '"use strict";return (' + js + ');')(P, MATHF);
  if (typeof v !== 'number' || !isFinite(v)) throw new Error('숫자가 아닙니다: ' + s);
  return v;
}
function evalParams(list, override) {
  const P = {};
  for (const p of list) {
    if (override && p.name in override) { P[p.name] = override[p.name]; continue; }
    try { P[p.name] = ev(p.expr, P); } catch (e) { P[p.name] = NaN; }
  }
  return P;
}
const curP = () => evalParams(S.params);
function interp(arr, x) {
  if (x <= arr[0][0]) return arr[0][1];
  if (x >= arr[arr.length - 1][0]) return arr[arr.length - 1][1];
  let i = 1; while (arr[i][0] < x) i++;
  const [x0, y0] = arr[i - 1], [x1, y1] = arr[i];
  return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
}
const fmt = (v, d = 3) => (Math.abs(v) < 1e-9 ? 0 : +v.toFixed(d)).toString();

/* ---------- 형상 ---------- */
// node: {t:'brick', e:{x0,x1,y0,y1,z0,z1}, tf:[]} | {t:'cyl', e:{ro,ri,xc,yc,z0,z1}, tf:[]} | {t:'grp', items:[{n,s}]}
function applyTf(n, t) { if (n.t === 'grp') n.items.forEach(it => applyTf(it.n, t)); else n.tf.push(JSON.parse(JSON.stringify(t))); }
function tfPoint(p, t, P) {
  const k = t.n || 1;
  if (t.k === 'tr') return [p[0] + ev(t.v[0], P) * k, p[1] + ev(t.v[1], P) * k];
  if (t.k === 'rot') {
    const a = ev(t.a, P) * k * D2R, cx = ev(t.c[0], P), cy = ev(t.c[1], P), c = Math.cos(a), s = Math.sin(a);
    const x = p[0] - cx, y = p[1] - cy; return [cx + x * c - y * s, cy + x * s + y * c];
  }
  if (t.k === 'mir') { const c = ev(t.c, P); return t.ax === 'x' ? [2 * c - p[0], p[1]] : [p[0], 2 * c - p[1]]; }
  return p;
}
function evalNode(n, P) {
  if (n.t === 'grp') return { t: 'grp', items: n.items.map(it => ({ n: evalNode(it.n, P), s: it.s })) };
  const e = n.e; let z0 = ev(e.z0, P), z1 = ev(e.z1, P); if (z0 > z1) [z0, z1] = [z1, z0];
  let dz = 0;
  for (const t of n.tf) if (t.k === 'tr') dz += ev(t.v[2], P) * (t.n || 1);
  if (n.t === 'brick') {
    let x0 = ev(e.x0, P), x1 = ev(e.x1, P), y0 = ev(e.y0, P), y1 = ev(e.y1, P);
    if (x0 > x1) [x0, x1] = [x1, x0]; if (y0 > y1) [y0, y1] = [y1, y0];
    let pts = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    for (const t of n.tf) pts = pts.map(p => tfPoint(p, t, P));
    return { t: 'brick', pts, z0: z0 + dz, z1: z1 + dz };
  }
  let c = [ev(e.xc, P), ev(e.yc, P)];
  for (const t of n.tf) c = tfPoint(c, t, P);
  return { t: 'cyl', c, ro: Math.abs(ev(e.ro, P)), ri: Math.abs(ev(e.ri || 0, P)), z0: z0 + dz, z1: z1 + dz };
}
function inPoly(pts, x, y) {
  let ins = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) ins = !ins;
  }
  return ins;
}
function contains(en, x, y) {
  if (en.t === 'brick') return inPoly(en.pts, x, y);
  if (en.t === 'cyl') { const d2 = (x - en.c[0]) ** 2 + (y - en.c[1]) ** 2; return d2 <= en.ro * en.ro && d2 >= en.ri * en.ri; }
  let st = false; for (const it of en.items) if (contains(it.n, x, y)) st = it.s > 0; return st;
}
function leaves(en, sign = 1, out = []) {
  if (en.t === 'grp') en.items.forEach(it => leaves(it.n, sign * it.s, out)); else out.push({ l: en, s: sign });
  return out;
}
function bboxOf(en) {
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, z0 = 1e9, z1 = -1e9;
  for (const { l } of leaves(en)) {
    const pts = l.t === 'brick' ? l.pts : [[l.c[0] - l.ro, l.c[1] - l.ro], [l.c[0] + l.ro, l.c[1] + l.ro]];
    for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    z0 = Math.min(z0, l.z0); z1 = Math.max(z1, l.z1);
  }
  return { x0, x1, y0, y1, z0, z1 };
}
function isCylOnly(en) { return leaves(en).every(o => o.l.t === 'cyl'); }

/* ---------- 정답 비교 (래스터) ---------- */
const GRIDC = {};
function grid(pj) {
  if (GRIDC[pj.key]) return GRIDC[pj.key];
  const s = pj.ref.sub[0][0];
  const x0 = s.x0 - 3, x1 = s.x1 + 3, y0 = s.y0 - 3, y1 = s.y1 + 3;
  const step = Math.max(x1 - x0, y1 - y0) / 320;
  const nx = Math.ceil((x1 - x0) / step), ny = Math.ceil((y1 - y0) / step);
  return (GRIDC[pj.key] = { x0, y0, step, nx, ny, parts: {}, cats: {} });
}
function refContains(p, x, y) {
  let X = x, Y = y;
  if (p.rot) { const a = -p.rot * D2R, c = Math.cos(a), s = Math.sin(a); X = x * c - y * s; Y = x * s + y * c; }
  return X >= p.x0 && X <= p.x1 && Y >= p.y0 && Y <= p.y1;
}
function rasterize(G, fn) {
  const m = new Uint8Array(G.nx * G.ny);
  for (let j = 0; j < G.ny; j++) { const y = G.y0 + (j + 0.5) * G.step; for (let i = 0; i < G.nx; i++) if (fn(G.x0 + (i + 0.5) * G.step, y)) m[j * G.nx + i] = 1; }
  return m;
}
function refCatMask(pj, cat, v) {
  const G = grid(pj), key = cat + '#' + v;
  if (!G.cats[key]) { const parts = pj.ref[cat][v]; G.cats[key] = rasterize(G, (x, y) => { let st = false; for (const p of parts) if (refContains(p, x, y)) st = p.s > 0; return st; }); }
  return G.cats[key];
}
function refPartMask(pj, cat, v, id) {
  const G = grid(pj), key = cat + '#' + v + '#' + id;
  if (!G.parts[key]) { const p = pj.ref[cat][v].find(q => q.id === id); G.parts[key] = p ? rasterize(G, (x, y) => refContains(p, x, y)) : null; }
  return G.parts[key];
}
function userMask(G, list) {
  const m = new Uint8Array(G.nx * G.ny);
  for (const it of list) {
    const b = it.bb;
    const i0 = clamp(Math.floor((b.x0 - G.x0) / G.step), 0, G.nx - 1), i1 = clamp(Math.ceil((b.x1 - G.x0) / G.step), 0, G.nx - 1);
    const j0 = clamp(Math.floor((b.y0 - G.y0) / G.step), 0, G.ny - 1), j1 = clamp(Math.ceil((b.y1 - G.y0) / G.step), 0, G.ny - 1);
    for (let j = j0; j <= j1; j++) { const y = G.y0 + (j + 0.5) * G.step; for (let i = i0; i <= i1; i++) { const x = G.x0 + (i + 0.5) * G.step; if (contains(it.en, x, y)) m[j * G.nx + i] = 1; } }
  }
  return m;
}
function iouOf(a, b) { let I = 0, Un = 0; for (let k = 0; k < a.length; k++) { if (a[k] && b[k]) I++; if (a[k] || b[k]) Un++; } return Un ? I / Un : 0; }
function areaOf(a) { let n = 0; for (let k = 0; k < a.length; k++) n += a[k]; return n; }

function classify(pj, s, en, P) {
  const m = getMat(s.mat), bb = bboxOf(en), th = bb.z1 - bb.z0, near = (a, b, t = 0.06) => Math.abs(a - b) < t;
  if (m.kind === 'metal') {
    if (isCylOnly(en)) return 'via';
    if (th > 3) return (pj.tall && near(bb.z0, pj.tall.z0, 0.1) && near(bb.z1, pj.tall.z1, 0.3)) ? 'tall' : 'metal-other';
    if (near(bb.z0, pj.z.top) && near(bb.z1, pj.z.top)) return 'top';
    if (near(bb.z0, pj.z.bot) && near(bb.z1, pj.z.bot)) return 'bot';
    return 'metal-other';
  }
  if (s.mat === 'Vacuum') return 'vac';
  if (near(bb.z0, pj.sub.z0) && near(bb.z1, pj.sub.z1)) return 'sub';
  if (pj.dr && near(bb.z0, pj.dr.z0, 0.1) && near(bb.z1, pj.dr.z1, 0.3)) return 'dr';
  return 'diel-other';
}

function analyze(override) {
  const pj = PJ(), P = evalParams(S.params, override), G = grid(pj);
  const A = { P, iou: {}, count: {}, mask: {}, bestVar: {}, items: [], report: [], errors: [] };
  for (const s of S.solids) {
    let en; try { en = evalNode(s.node, P); } catch (e) { A.errors.push(s.name + ': ' + e.message); continue; }
    const it = { s, en, bb: bboxOf(en) }; it.cat = classify(pj, s, en, P); A.items.push(it);
  }
  const byCat = c => A.items.filter(i => i.cat === c);
  for (const c of [...pj.cats, 'via']) A.count[c] = byCat(c).length;
  for (const c of pj.cats) {
    const um = userMask(G, byCat(c)); A.mask[c] = um;
    let best = 0, bv = 0; pj.ref[c].forEach((_, v) => { const q = iouOf(um, refCatMask(pj, c, v)); if (q > best) { best = q; bv = v; } });
    A.iou[c] = best; A.bestVar[c] = bv;
  }
  A.cover = (c, ids) => {
    const um = A.mask[c]; if (!um) return 0; let best = 0;
    pj.ref[c].forEach((_, v) => {
      let mn = 1;
      for (const id of ids) { const pm = refPartMask(pj, c, v, id); if (!pm) { mn = 0; break; } let I = 0, N = 0; for (let k = 0; k < pm.length; k++) if (pm[k]) { N++; if (um[k]) I++; } mn = Math.min(mn, N ? I / N : 0); }
      best = Math.max(best, mn);
    });
    return best;
  };
  // 재질 점검
  const subs = byCat('sub').sort((a, b) => (b.bb.x1 - b.bb.x0) * (b.bb.y1 - b.bb.y0) - (a.bb.x1 - a.bb.x0) * (a.bb.y1 - a.bb.y0));
  A.subMat = subs[0] ? getMat(subs[0].s.mat) : null;
  A.subOk = !!(A.subMat && Math.abs(A.subMat.eps - pj.sub.eps) < 0.2 && A.subMat.tand > 0);
  if (pj.dr) { const d = byCat('dr')[0]; A.drMat = d ? getMat(d.s.mat) : null; A.drOk = !!(A.drMat && Math.abs(A.drMat.eps - pj.dr.eps) < 0.6); }
  if (pj.via) {
    const v = byCat('via').find(i => { const l = leaves(i.en)[0].l; return Math.hypot(l.c[0] - pj.via.x, l.c[1] - pj.via.y) < 0.4 && i.bb.z0 <= pj.via.z0 + 0.06 && i.bb.z1 >= pj.via.z1 - 0.06; });
    A.viaOk = !!v; A.viaMesh = !!(v && v.s.localMesh > 0);
  }
  // 파라미터
  A.paramsOk = pj.params.every(([n, v]) => Math.abs((P[n] ?? NaN) - v) < 1e-6);
  A.freqOk = !!(S.freq && S.freq[0] <= pj.freq[0] + 1e-9 && S.freq[1] >= pj.freq[1] - 1e-9);
  A.port = portCheck(P);
  A.portOk = A.port.q >= 0.84;
  A.monCount = S.monitors.length;
  A.hasResults = !!S.results;
  A.tplCount = S.tpls.length;
  A.tplAR = S.tpls.some(t => t.q === 'Axial Ratio');
  A.hasMat = eps => S.mats.some(n => { const m = getMat(n); return m.kind === 'diel' && Math.abs(m.eps - eps) < 0.05; });
  return A;
}

/* ---------- 포트 ---------- */
const inPlane = n => n === 'x' ? ['y', 'z'] : n === 'y' ? ['x', 'z'] : ['x', 'y'];
function portBox(p, P) {
  const u0 = ev(p.u[0], P) - ev(p.ue[0] || 0, P), u1 = ev(p.u[1], P) + ev(p.ue[1] || 0, P);
  const v0 = ev(p.v[0], P) - ev(p.ve[0] || 0, P), v1 = ev(p.v[1], P) + ev(p.ve[1] || 0, P);
  return { pos: ev(p.pos, P), u0: Math.min(u0, u1), u1: Math.max(u0, u1), v0: Math.min(v0, v1), v1: Math.max(v0, v1) };
}
function portCorners(p, P) {
  const b = portBox(p, P), [ua, va] = inPlane(p.normal);
  const mk = (u, v) => { const o = { x: 0, y: 0, z: 0 }; o[p.normal] = b.pos; o[ua] = u; o[va] = v; return [o.x, o.y, o.z]; };
  return [mk(b.u0, b.v0), mk(b.u1, b.v0), mk(b.u1, b.v1), mk(b.u0, b.v1)];
}
function portCheck(P) {
  const pj = PJ(), r = pj.port, p = S.ports[0], issues = [];
  if (!p) return { q: 0, issues: ['포트가 없습니다.'], none: true };
  let b; try { b = portBox(p, P); } catch (e) { return { q: 0, issues: ['포트 좌표 오류: ' + e.message] }; }
  let q = 1;
  if (p.normal !== r.axis) { return { q: 0, issues: ['포트 Normal이 ' + p.normal.toUpperCase() + '입니다. 급전선 끝면의 법선은 ' + r.axis.toUpperCase() + '입니다.'] }; }
  if (Math.abs(b.pos - r.pos) > 0.06) { q = Math.min(q, 0.1); issues.push('포트가 급전선 끝(기판 가장자리, ' + r.axis + ' = ' + r.pos + ')에 있지 않습니다.'); }
  if (p.dir !== r.dir) { q = 0; issues.push('Orientation이 바깥(허공)을 향합니다. 안테나 쪽을 보도록 ' + (r.dir > 0 ? 'Positive' : 'Negative') + '로 바꾸세요.'); }
  if (b.u0 > r.span[0] + 1e-6 || b.u1 < r.span[1] - 1e-6) { q = Math.min(q, 0.15); issues.push('포트가 급전선 폭을 다 덮지 않습니다.'); }
  if (b.v0 > r.z[0] + 1e-6 || b.v1 < r.z[1] - 1e-6) { q = Math.min(q, 0.4); issues.push('포트 z 범위가 급전선과 그라운드를 모두 포함하지 않습니다. 여유값을 주세요.'); }
  const th = Math.abs(r.z[1] - r.z[0]), wid = b.u1 - b.u0;
  if (q > 0.4 && wid < r.feedW + 2 * 2 * th) { q = Math.min(q, 0.85); issues.push('포트가 좁습니다. 급전선 양옆으로 기판 두께의 3~15배 여유를 권장합니다.'); }
  if (q > 0.4 && wid > r.feedW + 2 * 20 * th) { q = Math.min(q, 0.9); issues.push('포트가 너무 넓습니다(고차 모드 위험).'); }
  return { q, issues };
}

/* ---------- 모의 시뮬레이션 ---------- */
function simulate(override, baseQ) {
  const pj = PJ(), A = analyze(override), rep = [];
  if (!S.freq) return { err: 'Frequency range is not defined. (Simulation → Frequency)' };
  if (!S.solids.length) return { err: 'No solids defined.' };
  if (!S.ports.length) return { err: 'No excitation port defined. (Simulation → Waveguide Port)' };
  if (A.errors.length) return { err: '파라미터/수식 오류: ' + A.errors[0] };
  let q = 1;
  for (const c of pj.cats) {
    const v = A.iou[c]; q = Math.min(q, v);
    rep.push([v > 0.95 ? 'ok' : v > 0.7 ? 'warn' : 'err', `${pj.catName[c]}: 정답 형상과 ${(v * 100).toFixed(1)}% 일치`]);
  }
  for (const it of A.items) if (['metal-other', 'diel-other'].includes(it.cat)) rep.push(['warn', `'${it.s.name}'의 z 위치(${fmt(it.bb.z0)} ~ ${fmt(it.bb.z1)})가 약속한 면과 맞지 않아 비교에서 제외했습니다.`]);
  if (baseQ != null) q = Math.max(q, baseQ);
  let s = 1, lossless = false;
  if (A.subMat) {
    if (Math.abs(A.subMat.eps - pj.sub.eps) >= 0.2) { rep.push(['err', `기판 εr = ${A.subMat.eps} (논문: ${pj.sub.eps}).`]); if (pj.key !== 'dra') s *= Math.sqrt((A.subMat.eps + 1) / (pj.sub.eps + 1)); else s *= Math.pow(A.subMat.eps / pj.sub.eps, 0.15); }
    if (!(A.subMat.tand > 0)) { lossless = true; rep.push(['warn', '기판이 lossless입니다. 논문은 lossy 재질입니다.']); }
  }
  if (pj.dr) { if (!A.drMat) rep.push(['err', 'DR이 없습니다.']); else if (!A.drOk) { rep.push(['err', `DR εr = ${A.drMat.eps} (논문: 10)`]); s *= Math.sqrt(A.drMat.eps / 10); } }
  if (pj.via) { if (!A.viaOk) { rep.push(['err', 'Via가 없거나 위치가 틀려 마이크로스트립과 CPS가 연결되지 않았습니다.']); } else if (!A.viaMesh) rep.push(['warn', 'Via에 Local Mesh를 주지 않아 결과가 약간 어긋날 수 있습니다.']); }
  // 크기 변화 → 주파수 이동
  const G = grid(pj), mc = pj.mainCat, ua = areaOf(A.mask[mc] || []), ra = areaOf(refCatMask(pj, mc, A.bestVar[mc] || 0));
  if (ua > 0 && q > 0.3) s *= clamp(Math.sqrt(ua / ra), 0.6, 1.6);
  if (S.gmesh.cpw < 10) { s *= 1.015; rep.push(['warn', 'Cells per wavelength가 10보다 작아 정확도가 떨어집니다.']); }
  if (pj.via && A.viaOk && !A.viaMesh) s *= 1.006;
  const pc = A.port; let pq = pc.q;
  pc.issues.forEach(t => rep.push([pq < 0.84 ? 'err' : 'warn', '포트: ' + t]));
  if (pj.via && !A.viaOk) pq *= 0.25;
  const d = clamp((q - 0.55) / 0.4, 0, 1) * pq;
  const [f0, f1] = S.freq, N = 601, fs = [];
  for (let i = 0; i < N; i++) fs.push(f0 + (f1 - f0) * i / (N - 1));
  const refS = pj.s11 || pj.vswr.map(([f, v]) => [f, 20 * Math.log10((v - 1) / (v + 1))]);
  const s11 = fs.map(f => { let r = interp(refS, f * s) * (lossless ? 1.06 : 1); const bad = -0.4 - 0.5 * (1 + Math.sin(f * 9.1)) * 0.5; return [f, Math.min(-0.02, d * r + (1 - d) * bad)]; });
  const gain = fs.map(f => [f, interp(pj.gain, f * s) - (1 - d) * 9 + (lossless ? 0.35 : 0)]);
  let ar = null;
  if (pj.ar) { const plates = A.iou.tall; ar = fs.map(f => [f, interp(pj.ar, f * s) + (1 - clamp((q - 0.55) / 0.4, 0, 1)) * 10 + (plates < 0.6 ? 18 : 0)]); if (plates < 0.6) rep.push(['warn', '금속판이 없거나 틀려 원편파(CP)가 만들어지지 않습니다.']); }
  const mons = S.monitors.filter(f => f >= f0 - 1e-9 && f <= f1 + 1e-9);
  if (S.monitors.length && !mons.length) rep.push(['warn', 'Farfield 모니터가 주파수 범위 밖에 있습니다.']);
  if (!S.monitors.length) rep.push(['warn', 'Farfield 모니터가 없어 방사패턴·Gain 결과가 만들어지지 않습니다.']);
  if (q >= 0.95 && pq >= 0.84 && A.subOk && (!pj.dr || A.drOk) && (!pj.via || A.viaOk)) rep.unshift(['ok', '모델이 논문 구조와 일치합니다. 교안 결과와 같은 곡선이 나옵니다.']);
  return { s11, gain, ar, mons, rep, q, d, s, lossless, f: [f0, f1] };
}

/* ---------- 방사패턴 모델 ---------- */
function patLin(kind, d, pol) {
  const [dx, dy, dz] = d;
  if (kind === 'monopole') return Math.max(1 - dy * dy, 0.0015) * (0.8 + 0.2 * dx * dx);
  if (kind === 'yagi') return (Math.pow((1 + dy) / 2, 3) * (1 - 0.8 * dx * dx) + 0.004) / 1.004;
  const tot = (Math.pow((1 + dz) / 2, 2) + 0.03) / 1.03;
  const xpd = Math.pow(10, -(3 + 17 * Math.pow((1 + dz) / 2, 2)) / 10);
  if (pol === 'LHCP') return tot / (1 + xpd);
  if (pol === 'RHCP') return tot * xpd / (1 + xpd);
  return tot;
}
const dirOf = (th, ph) => [Math.sin(th * D2R) * Math.cos(ph * D2R), Math.sin(th * D2R) * Math.sin(ph * D2R), Math.cos(th * D2R)];
function resAt(arr, f) { return interp(arr, f); }
function farVal(f, th, ph, q, pol) {
  const R = S.results, pj = PJ();
  const rg = resAt(R.gain, f), lin = patLin(pj.pattern, dirOf(th, ph), pol);
  const g = rg + 10 * Math.log10(Math.max(lin, 1e-6));
  const s11 = resAt(R.s11, f), mis = 10 * Math.log10(1 - Math.pow(10, s11 / 10));
  if (q === 'Realized Gain') return g;
  if (q === 'Gain (IEEE)') return g - mis;
  if (q === 'Directivity') return g - mis - (R.lossless ? 0 : pj.radEff);
  if (q === 'Axial Ratio') { if (!R.ar) return 40; return resAt(R.ar, f) + Math.pow(th / 30, 2) * 2; }
  return g;
}

/* ---------- 메시지 ---------- */
function msg(type, text) {
  const el = document.createElement('div'); el.className = 'm ' + type;
  el.innerHTML = `<span class="mi">${type === 'err' ? '✕' : type === 'warn' ? '!' : type === 'ok' ? '✓' : 'i'}</span><span>${text}</span>`;
  const L = $('#msglist'); L.appendChild(el); L.scrollTop = L.scrollHeight;
}

/* ---------- 변경 처리 ---------- */
let anTimer = null, lastA = null;
function afterChange(geomChanged) {
  if (geomChanged && S.results) { S.results = null; S.sweep = null; U.tabs = U.tabs.filter(t => t.kind === '3d'); U.tab = '3D'; msg('warn', '모델이 바뀌어 기존 결과를 삭제했습니다. 다시 Start 하세요.'); }
  save(); renderTree(); renderParams(); draw(); renderTabs();
  clearTimeout(anTimer); anTimer = setTimeout(() => { lastA = analyze(); renderMission(); }, 120);
}
function modify(fn, geom = true) { pushUndo(); fn(); afterChange(geom); }
