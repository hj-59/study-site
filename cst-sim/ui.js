'use strict';
/* ---------- 아이콘 ---------- */
const IC = {
  brick: '<path d="M4 9l8-4 8 4v8l-8 4-8-4z" fill="#8fb4e3" stroke="#2a5d9f"/><path d="M4 9l8 4 8-4M12 13v8" fill="none" stroke="#2a5d9f"/>',
  cyl: '<ellipse cx="12" cy="6" rx="7" ry="2.5" fill="#8fb4e3" stroke="#2a5d9f"/><path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" fill="#7aa6dc" stroke="#2a5d9f"/>',
  add: '<rect x="3" y="7" width="11" height="11" fill="#8fb4e3" stroke="#2a5d9f"/><rect x="10" y="4" width="11" height="11" fill="#b8d0ef" stroke="#2a5d9f"/>',
  sub: '<rect x="3" y="7" width="13" height="13" fill="#8fb4e3" stroke="#2a5d9f"/><rect x="10" y="3" width="11" height="11" fill="#fff" stroke="#c00" stroke-dasharray="2 2"/>',
  tf: '<rect x="3" y="11" width="8" height="8" fill="#8fb4e3" stroke="#2a5d9f"/><rect x="13" y="4" width="8" height="8" fill="none" stroke="#2a5d9f" stroke-dasharray="2 2"/><path d="M9 11l5-4" stroke="#c00"/>',
  del: '<path d="M6 6l12 12M18 6L6 18" stroke="#c00" stroke-width="2.5"/>',
  pick: '<path d="M5 3l4 16 3-6 6-2z" fill="#fff" stroke="#333"/><circle cx="18" cy="18" r="3" fill="#d00"/>',
  clr: '<path d="M5 3l4 16 3-6 6-2z" fill="#fff" stroke="#333"/><path d="M14 15l6 6M20 15l-6 6" stroke="#c00" stroke-width="2"/>',
  mat: '<circle cx="12" cy="12" r="8" fill="#e8b98a" stroke="#8a5a2b"/><circle cx="9" cy="9" r="2.5" fill="#fff" opacity=".7"/>',
  newmat: '<circle cx="11" cy="12" r="7" fill="#ffe27a" stroke="#a07c00"/><path d="M17 3v6M14 6h6" stroke="#090" stroke-width="2"/>',
  freq: '<path d="M2 12c2-6 4-6 6 0s4 6 6 0 4-6 6 0" fill="none" stroke="#2a5d9f" stroke-width="2"/>',
  bg: '<rect x="3" y="3" width="18" height="18" fill="#dfe8f5" stroke="#2a5d9f"/>',
  bd: '<rect x="3" y="3" width="18" height="18" fill="none" stroke="#2a5d9f" stroke-dasharray="3 2"/>',
  port: '<rect x="4" y="4" width="16" height="16" fill="#e00" stroke="#900"/><text x="12" y="16" font-size="10" text-anchor="middle" fill="#fff">1</text>',
  dport: '<path d="M12 3v7M12 14v7" stroke="#333" stroke-width="2"/><path d="M7 10h10l-5 4z" fill="#e00"/>',
  mon: '<path d="M12 21V11" stroke="#333" stroke-width="2"/><path d="M6 6a8 8 0 0012 0M3 3a12 12 0 0018 0" fill="none" stroke="#2a5d9f" stroke-width="1.6"/>',
  solver: '<rect x="3" y="4" width="18" height="16" rx="2" fill="#c33"/><text x="12" y="16" font-size="11" text-anchor="middle" fill="#fff" font-weight="bold">T</text>',
  start: '<circle cx="12" cy="12" r="9" fill="#1d5fa8"/><path d="M10 8l6 4-6 4z" fill="#fff"/>',
  sweep: '<path d="M3 20h18M3 20V4" stroke="#333"/><path d="M4 16c4-10 6-10 8 0M8 16c4-10 6-10 8 0" fill="none" stroke="#2a5d9f" stroke-width="1.6"/>',
  mesh: '<path d="M4 4h16v16H4zM4 9h16M4 14h16M9 4v16M14 4v16" fill="none" stroke="#2a5d9f"/>',
  gmesh: '<path d="M4 4h16v16H4zM4 12h16M12 4v16" fill="none" stroke="#2a5d9f"/><circle cx="17" cy="17" r="4" fill="#ffd34d" stroke="#a07c00"/>',
  tpl: '<rect x="5" y="3" width="14" height="18" fill="#fff" stroke="#2a5d9f"/><path d="M8 8h8M8 12h8M8 16h5" stroke="#2a5d9f"/>',
  undo: '<path d="M9 7L4 12l5 5" fill="none" stroke="#2a5d9f" stroke-width="2"/><path d="M4 12h10a6 6 0 010 12" fill="none" stroke="#2a5d9f" stroke-width="2"/>',
  upd: '<path d="M20 12a8 8 0 11-3-6.2" fill="none" stroke="#2a5d9f" stroke-width="2"/><path d="M17 2v5h-5" fill="none" stroke="#2a5d9f" stroke-width="2"/>',
  iso: '<path d="M4 9l8-4 8 4v8l-8 4-8-4z" fill="#dce8f7" stroke="#2a5d9f"/>',
  top: '<rect x="5" y="5" width="14" height="14" fill="#dce8f7" stroke="#2a5d9f"/><text x="12" y="16" font-size="9" text-anchor="middle" fill="#2a5d9f">F</text>',
  bot: '<rect x="5" y="5" width="14" height="14" fill="#dce8f7" stroke="#2a5d9f"/><text x="12" y="16" font-size="9" text-anchor="middle" fill="#2a5d9f">B</text>',
  fit: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="#2a5d9f" stroke-width="2"/>',
  trans: '<rect x="4" y="4" width="12" height="12" fill="#8fb4e3" opacity=".5" stroke="#2a5d9f"/><rect x="8" y="8" width="12" height="12" fill="#8fb4e3" opacity=".5" stroke="#2a5d9f"/>',
  ghost: '<rect x="4" y="4" width="16" height="16" fill="none" stroke="#0077ff" stroke-dasharray="3 2" stroke-width="1.6"/>',
  grid: '<path d="M3 8h18M3 16h18M8 3v18M16 3v18" stroke="#2a5d9f"/>',
  model: '<path d="M4 9l8-4 8 4v8l-8 4-8-4z" fill="#ffe27a" stroke="#a07c00"/>',
  file: '<path d="M6 3h8l4 4v14H6z" fill="#fff" stroke="#2a5d9f"/>'
};
const ico = k => `<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">${IC[k] || ''}</svg>`;

const RIBBON = {
  Home: [['Simulation', [['setupSolver', 'Setup Solver', 'solver'], ['start', 'Start Simulation', 'start'], ['sweep', 'Par. Sweep', 'sweep']]], ['Edit', [['undo', 'Undo', 'undo'], ['update', 'Parametric Update (F7)', 'upd']]], ['연습', [['answer', '정답 모델 불러오기', 'model'], ['project', '예제 바꾸기', 'file']]]],
  Modeling: [['Shapes', [['brick', 'Brick', 'brick'], ['cyl', 'Cylinder', 'cyl']]], ['Tools', [['boolAdd', 'Boolean Add', 'add'], ['boolSub', 'Boolean Subtract', 'sub'], ['transform', 'Transform', 'tf'], ['delete', 'Delete', 'del']]], ['Picks', [['pickEdge', 'Pick Edge', 'pick'], ['clearPicks', 'Clear Picks', 'clr']]], ['Materials', [['matLib', 'Material Library', 'mat'], ['newMat', 'New Material', 'newmat'], ['chMat', 'Change Material', 'mat']]]],
  Simulation: [['Settings', [['freq', 'Frequency', 'freq'], ['background', 'Background', 'bg'], ['boundaries', 'Boundaries', 'bd']]], ['Sources and Loads', [['wgport', 'Waveguide Port', 'port'], ['dport', 'Discrete Port', 'dport']]], ['Monitors', [['fmon', 'Field Monitor', 'mon']]], ['Solver', [['setupSolver', 'Setup Solver', 'solver'], ['start', 'Start', 'start'], ['sweep', 'Par. Sweep', 'sweep']]], ['Mesh', [['meshView', 'Mesh View', 'mesh'], ['globalMesh', 'Global Properties', 'gmesh']]]],
  'Post-Processing': [['Tools', [['templates', 'Result Templates', 'tpl']]], ['Manage Results', [['clearRes', 'Delete Results', 'del']]]],
  View: [['Plot', [['vIso', '3D', 'iso'], ['vTop', 'Front (윗면)', 'top'], ['vBot', 'Back (아랫면)', 'bot'], ['vFit', 'Fit', 'fit']]], ['Visibility', [['vTrans', 'Transparency', 'trans'], ['vGhost', '정답 윤곽 보기', 'ghost'], ['vGrid', 'Working Plane', 'grid']]]]
};
let curTab = 'Modeling';
function renderRibbon() {
  $('#rtabs').innerHTML = ['File', ...Object.keys(RIBBON)].map(k => `<button class="rt ${k === curTab ? 'on' : ''}" data-t="${k}">${k}</button>`).join('');
  const toggles = { meshView: U.mesh, vTrans: U.trans, vGhost: U.ghost, vGrid: U.grid, vIso: U.view === 'iso', vTop: U.view === 'top', vBot: U.view === 'bot', pickEdge: U.mode === 'pickEdge' };
  $('#ribbon').innerHTML = RIBBON[curTab].map(([g, btns]) => `<div class="rg"><div class="rb">${btns.map(([id, l, ic]) => `<button class="rbtn ${toggles[id] ? 'on' : ''}" data-a="${id}" title="${l}">${ico(ic)}<span>${l}</span></button>`).join('')}</div><div class="rgl">${g}</div></div>`).join('');
}
document.addEventListener('click', e => {
  const t = e.target.closest('.rt'); if (t) { if (t.dataset.t === 'File') { projectPicker(); return; } curTab = t.dataset.t; renderRibbon(); return; }
  const b = e.target.closest('.rbtn'); if (b) action(b.dataset.a);
});

/* ---------- 액션 ---------- */
function setHint(h) { const el = $('#vpHint'); el.innerHTML = h; el.hidden = !h; }
function selSolids() { return S.solids.filter(s => U.sel.includes(s.id)); }
function action(a) {
  const need3D = ['brick', 'cyl', 'pickEdge', 'vIso', 'vTop', 'vBot', 'vFit'];
  if (need3D.includes(a) && U.tab !== '3D') { U.tab = '3D'; renderTabs(); }
  switch (a) {
    case 'brick': case 'cyl': U.mode = 'awaitEsc'; U.awaitKind = a; setHint(`<b>${a === 'brick' ? 'Brick' : 'Cylinder'}</b>: 작업창에서 점을 찍는 대신 <kbd>Esc</kbd>를 누르면 좌표 입력창이 열립니다. <button class="chip" id="escChip">Esc 누르기</button>`); break;
    case 'boolAdd': case 'boolSub': startBool(a === 'boolAdd' ? 'add' : 'sub'); break;
    case 'transform': if (!U.sel.length) return msg('warn', 'Transform할 객체를 먼저 트리나 화면에서 선택하세요.'); dlgTransform(); break;
    case 'delete': if (!U.sel.length) return msg('warn', '삭제할 객체를 선택하세요.'); modify(() => { S.solids = S.solids.filter(s => !U.sel.includes(s.id)); U.sel = []; }); break;
    case 'pickEdge': U.mode = 'pickEdge'; if (U.view === 'iso') { setView('top'); msg('info', 'Pick을 위해 Front 보기로 바꿨습니다. 아랫면 모서리는 View → Back에서 Pick 하세요.'); } setHint('<b>Pick Edge</b>: 포트를 붙일 금속 모서리를 클릭하세요. 취소: <kbd>Esc</kbd>'); renderRibbon(); break;
    case 'clearPicks': U.pick = null; U.mode = null; setHint(''); draw(); renderRibbon(); break;
    case 'matLib': dlgMatLib(); break;
    case 'newMat': dlgNewMat(); break;
    case 'chMat': if (!U.sel.length) return msg('warn', '재질을 바꿀 객체를 선택하세요.'); dlgChMat(); break;
    case 'freq': dlgFreq(); break;
    case 'background': msg('info', 'Background: Normal (Vacuum). 안테나 템플릿 기본값을 그대로 씁니다.'); break;
    case 'boundaries': msg('info', 'Boundaries: open (add space). 안테나 템플릿 기본값이라 바꿀 필요가 없습니다.'); break;
    case 'wgport': dlgPort(); break;
    case 'dport': msg('info', 'Ch.7 세 예제는 모두 마이크로스트립 급전이라 Waveguide Port를 씁니다. (Discrete Port는 Ch.4 다이폴, Ch.5 패치에서 사용)'); break;
    case 'fmon': dlgMonitor(); break;
    case 'setupSolver': dlgSolver(); break;
    case 'start': startSim(); break;
    case 'sweep': dlgSweep(); break;
    case 'meshView': U.mesh = !U.mesh; if (U.mesh && U.view === 'iso') setView('top'); draw(); renderRibbon(); if (!U.mesh) $('#stMesh').textContent = ''; break;
    case 'globalMesh': dlgGMesh(); break;
    case 'templates': dlgTemplates(); break;
    case 'clearRes': if (!S.results) return; S.results = null; S.sweep = null; U.tabs = []; U.tab = '3D'; afterChange(false); msg('info', '결과를 삭제했습니다.'); break;
    case 'vIso': setView('iso'); break; case 'vTop': setView('top'); break; case 'vBot': setView('bot'); break; case 'vFit': fit(); break;
    case 'vTrans': U.trans = !U.trans; draw(); renderRibbon(); break;
    case 'vGhost': U.ghost = !U.ghost; draw(); renderRibbon(); break;
    case 'vGrid': U.grid = !U.grid; draw(); renderRibbon(); break;
    case 'undo': undo(); break;
    case 'update': msg('info', 'Parametric Update: 파라미터 값을 모델에 반영했습니다.'); draw(); break;
    case 'answer': confirmDlg('정답 모델 불러오기', '지금 모델을 지우고 교안 순서대로 만든 정답 모델(파라미터, 형상, 포트, 모니터 포함)을 불러옵니다. 직접 만든 모델과 비교하고 싶으면 먼저 결과를 확인해 두세요. Undo로 되돌릴 수 있습니다.', () => { pushUndo(); buildAnswer(); afterChange(true); fit(); msg('ok', '정답 모델을 불러왔습니다. Start Simulation으로 결과를 확인하세요.'); }); break;
    case 'project': projectPicker(); break;
  }
}
function setView(v) { U.view = v; if (v === 'iso') { U.az = PJ().view.az; U.el = PJ().view.el; } fit(); renderRibbon(); }
document.addEventListener('click', e => { if (e.target.id === 'escChip') onEsc(); });
function onEsc() {
  if (!$('#modal').hidden) { closeDlg(); return; }
  if (U.mode === 'awaitEsc') { U.mode = null; setHint(''); U.awaitKind === 'brick' ? dlgBrick() : dlgCyl(); return; }
  if (U.mode) { U.mode = null; U.boolOp = null; setHint(''); renderRibbon(); draw(); }
}

/* ---------- Boolean ---------- */
function startBool(op) {
  if (op === 'add' && U.sel.length >= 2) { doBool('add', U.sel[0], U.sel.slice(1)); return; }
  if (U.sel.length !== 1) return msg('warn', op === 'add' ? '합칠 기준 객체 1개(재질을 따를 객체)를 먼저 선택하세요. 여러 개를 Ctrl+클릭으로 고르면 한 번에 합칩니다.' : '남길 객체(예: Ground)를 먼저 1개 선택하세요.');
  U.mode = 'bool'; U.boolOp = { op, base: U.sel[0], tools: [] };
  setHint(`<b>Boolean ${op === 'add' ? 'Add' : 'Subtract'}</b>: ${op === 'add' ? '합칠' : '뺄'} 객체를 트리나 화면에서 클릭한 뒤 <kbd>Enter</kbd>. 취소: <kbd>Esc</kbd> <button class="chip" id="enterChip">Enter</button>`);
}
document.addEventListener('click', e => { if (e.target.id === 'enterChip') boolEnter(); });
function boolTarget(id) {
  const b = U.boolOp; if (!b || id === b.base) return;
  b.tools = b.tools.includes(id) ? b.tools.filter(i => i !== id) : [...b.tools, id]; U.sel = [b.base, ...b.tools]; renderTree(); draw();
}
function boolEnter() { const b = U.boolOp; if (!b) return; if (!b.tools.length) return msg('warn', '두 번째 객체를 선택한 뒤 Enter를 누르세요.'); doBool(b.op, b.base, b.tools); }
function doBool(op, baseId, toolIds) {
  modify(() => {
    const base = S.solids.find(s => s.id === baseId), tools = S.solids.filter(s => toolIds.includes(s.id));
    base.node = { t: 'grp', items: [{ n: base.node, s: 1 }, ...tools.map(t => ({ n: t.node, s: op === 'add' ? 1 : -1 }))] };
    S.solids = S.solids.filter(s => !toolIds.includes(s.id)); U.sel = [baseId];
    msg('info', `Boolean ${op === 'add' ? 'Add' : 'Subtract'}: ${base.name} ${op === 'add' ? '+' : '−'} ${tools.map(t => t.name).join(', ')}`);
  });
  U.mode = null; U.boolOp = null; setHint('');
}

/* ---------- 대화상자 공통 ---------- */
function openDlg(title, body, buttons, wide) {
  const m = $('#modal'); m.hidden = false;
  m.innerHTML = `<div class="dlg ${wide ? 'wide' : ''}" role="dialog" aria-label="${esc(title)}"><div class="dh">${title}<button class="dx" aria-label="닫기">×</button></div><div class="db">${body}<div class="derr" id="derr"></div></div><div class="df">${buttons.map((b, i) => `<button class="btn ${b.primary ? 'pri' : ''}" data-i="${i}">${b.label}</button>`).join('')}</div></div>`;
  m.querySelector('.dx').onclick = closeDlg;
  m.querySelectorAll('.df .btn').forEach(el => el.onclick = () => buttons[+el.dataset.i].fn());
  m._buttons = buttons;
  const f = m.querySelector('input:not([disabled]),select'); if (f) f.focus();
}
function closeDlg() { $('#modal').hidden = true; $('#modal').innerHTML = ''; if (U.preview) { U.preview = null; draw(); } }
function dErr(t) { const e = $('#derr'); if (e) e.textContent = t || ''; }
function confirmDlg(title, text, ok) { openDlg(title, `<p class="dp">${text}</p>`, [{ label: '확인', primary: true, fn: () => { closeDlg(); ok(); } }, { label: '취소', fn: closeDlg }]); }
const fv = id => document.getElementById(id).value.trim();
function checkExpr(list) { const P = curP(); for (const [lab, v] of list) { try { ev(v, P); } catch (e) { dErr(lab + ': ' + e.message); return null; } } return P; }
function matOptions(sel) { return S.mats.map(n => `<option ${n === sel ? 'selected' : ''}>${esc(n)}</option>`).join('') + '<option value="__lib">[Load from Material Library…]</option><option value="__new">[New Material…]</option>'; }
function bindMatSelect(id, back) { const el = document.getElementById(id); el.onchange = () => { if (el.value === '__lib') { const st = back(); dlgMatLib(name => { st.mat = name; reopen(st); }); } else if (el.value === '__new') { const st = back(); dlgNewMat(name => { st.mat = name; reopen(st); }); } }; }
let reopen = () => { };
function compOptions() { const set = new Set(['component1', ...S.solids.map(s => s.comp)]); return [...set].map(c => `<option>${esc(c)}</option>`).join(''); }
function uniqueName(n) { let k = n, i = 1; while (S.solids.some(s => s.name === k)) k = n + '_' + (i++); return k; }

/* ---------- Brick / Cylinder ---------- */
function dlgBrick(st) {
  st = st || { name: uniqueName('solid' + S.nextId), x0: '', x1: '', y0: '', y1: '', z0: '', z1: '', comp: 'component1', mat: 'PEC' };
  const editing = st.editId;
  const fld = (k, l) => `<label>${l}<input id="b_${k}" value="${esc(st[k])}" spellcheck="false"></label>`;
  openDlg(editing ? 'Brick (편집)' : 'Brick', `<div class="g2"><label class="full">Name<input id="b_name" value="${esc(st.name)}"></label>${fld('x0', 'Xmin')}${fld('x1', 'Xmax')}${fld('y0', 'Ymin')}${fld('y1', 'Ymax')}${fld('z0', 'Zmin')}${fld('z1', 'Zmax')}<label>Component<select id="b_comp">${compOptions()}</select></label><label>Material<select id="b_mat">${matOptions(st.mat)}</select></label></div><p class="hint">숫자 대신 파라미터 이름과 수식(예: <code>-W1/2</code>, <code>L2+L3</code>)을 쓸 수 있습니다.</p>`,
    [{ label: 'OK', primary: true, fn: () => okBrick(false) }, { label: 'Preview', fn: () => okBrick(true) }, { label: 'Cancel', fn: closeDlg }]);
  const back = () => ({ ...read(), editId: editing });
  reopen = dlgBrick; bindMatSelect('b_mat', back);
  function read() { return { name: fv('b_name'), x0: fv('b_x0'), x1: fv('b_x1'), y0: fv('b_y0'), y1: fv('b_y1'), z0: fv('b_z0'), z1: fv('b_z1'), comp: fv('b_comp'), mat: document.getElementById('b_mat').value }; }
  function okBrick(prev) {
    const r = read(); if (!r.name) return dErr('Name을 입력하세요.');
    if (!checkExpr([['Xmin', r.x0], ['Xmax', r.x1], ['Ymin', r.y0], ['Ymax', r.y1], ['Zmin', r.z0], ['Zmax', r.z1]])) return;
    const P = curP(); if (ev(r.x0, P) > ev(r.x1, P) || ev(r.y0, P) > ev(r.y1, P) || ev(r.z0, P) > ev(r.z1, P)) return dErr('min 값이 max 값보다 큽니다.');
    if (r.mat.startsWith('__')) return dErr('재질을 고르세요.');
    const node = { t: 'brick', e: { x0: r.x0, x1: r.x1, y0: r.y0, y1: r.y1, z0: r.z0, z1: r.z1 }, tf: [] };
    if (prev) { U.preview = node; draw(); dErr(''); return; }
    closeDlg();
    if (editing) modify(() => { const s = S.solids.find(q => q.id === editing); s.node = node; s.name = r.name; s.mat = r.mat; s.comp = r.comp; });
    else modify(() => { const id = 's' + S.nextId++; S.solids.push({ id, name: uniqueName(r.name), comp: r.comp || 'component1', mat: r.mat, node }); U.sel = [id]; msg('info', `Brick '${r.name}' created (${r.mat}).`); });
  }
}
function dlgCyl(st) {
  st = st || { name: uniqueName('solid' + S.nextId), ro: '', ri: '0', xc: '', yc: '', z0: '', z1: '', comp: 'component1', mat: 'PEC' };
  const fld = (k, l) => `<label>${l}<input id="c_${k}" value="${esc(st[k])}" spellcheck="false"></label>`;
  openDlg('Cylinder', `<div class="g2"><label class="full">Name<input id="c_name" value="${esc(st.name)}"></label><label class="full">Orientation<span class="radio"><label><input type="radio" disabled>X</label><label><input type="radio" disabled>Y</label><label><input type="radio" checked>Z</label></span></label>${fld('ro', 'Outer radius')}${fld('ri', 'Inner radius')}${fld('xc', 'Xcenter')}${fld('yc', 'Ycenter')}${fld('z0', 'Zmin')}${fld('z1', 'Zmax')}<label>Component<select id="c_comp">${compOptions()}</select></label><label>Material<select id="c_mat">${matOptions(st.mat)}</select></label></div><p class="hint">연습판은 Z축 방향 원기둥만 지원합니다 (Via 용).</p>`,
    [{ label: 'OK', primary: true, fn: () => ok(false) }, { label: 'Preview', fn: () => ok(true) }, { label: 'Cancel', fn: closeDlg }]);
  reopen = dlgCyl; bindMatSelect('c_mat', read);
  function read() { return { name: fv('c_name'), ro: fv('c_ro'), ri: fv('c_ri') || '0', xc: fv('c_xc'), yc: fv('c_yc'), z0: fv('c_z0'), z1: fv('c_z1'), comp: fv('c_comp'), mat: document.getElementById('c_mat').value }; }
  function ok(prev) {
    const r = read(); if (!checkExpr([['Outer radius', r.ro], ['Inner radius', r.ri], ['Xcenter', r.xc], ['Ycenter', r.yc], ['Zmin', r.z0], ['Zmax', r.z1]])) return;
    if (r.mat.startsWith('__')) return dErr('재질을 고르세요.');
    const node = { t: 'cyl', e: { ro: r.ro, ri: r.ri, xc: r.xc, yc: r.yc, z0: r.z0, z1: r.z1 }, tf: [] };
    if (prev) { U.preview = node; draw(); return; }
    closeDlg(); modify(() => { const id = 's' + S.nextId++; S.solids.push({ id, name: uniqueName(r.name), comp: r.comp, mat: r.mat, node }); U.sel = [id]; msg('info', `Cylinder '${r.name}' created.`); });
  }
}

/* ---------- Transform ---------- */
function dlgTransform() {
  const names = selSolids().map(s => s.name).join(', ');
  openDlg('Transform Selected Object', `<p class="hint">대상: <b>${esc(names)}</b></p>
  <div class="g2"><label class="full">Operation<span class="radio" id="t_op"><label><input type="radio" name="op" value="tr" checked>Translate</label><label><input type="radio" name="op" value="rot">Rotate</label><label><input type="radio" name="op" value="mir">Mirror</label></span></label>
  <label class="chk"><input type="checkbox" id="t_copy" checked> Copy (원래 객체 유지)</label><label class="chk"><input type="checkbox" id="t_unite"> Unite (복사본과 합치기)</label>
  <label>Repetition factor<input id="t_rep" value="1"></label><span></span></div>
  <fieldset id="fs_tr"><legend>Translation vector</legend><div class="g3"><label>X<input id="t_vx" value="0"></label><label>Y<input id="t_vy" value="0"></label><label>Z<input id="t_vz" value="0"></label></div></fieldset>
  <fieldset id="fs_rot" hidden><legend>Rotation (Z축)</legend><div class="g3"><label>Angle (deg)<input id="t_ang" value="90"></label><label>Center X<input id="t_cx" value="0"></label><label>Center Y<input id="t_cy" value="0"></label></div><p class="hint">연습판은 Z축 회전만 지원합니다. 양수 = 반시계 방향.</p></fieldset>
  <fieldset id="fs_mir" hidden><legend>Mirror plane</legend><div class="g3"><label>Normal<select id="t_mn"><option value="x">X (좌우 대칭)</option><option value="y">Y (위아래 대칭)</option></select></label><label>Center<input id="t_mc" value="0"></label></div></fieldset>`,
    [{ label: 'OK', primary: true, fn: () => ok(false) }, { label: 'Preview', fn: () => ok(true) }, { label: 'Cancel', fn: closeDlg }], true);
  document.querySelectorAll('input[name=op]').forEach(r => r.onchange = () => { const v = document.querySelector('input[name=op]:checked').value; ['tr', 'rot', 'mir'].forEach(k => $('#fs_' + k).hidden = k !== v); if (v === 'rot') $('#t_copy').checked = false; });
  function ok(prev) {
    const op = document.querySelector('input[name=op]:checked').value, copy = $('#t_copy').checked, unite = $('#t_unite').checked;
    const rep = copy ? Math.max(1, Math.round(+fv('t_rep') || 1)) : 1;
    let tf;
    if (op === 'tr') { if (!checkExpr([['X', fv('t_vx')], ['Y', fv('t_vy')], ['Z', fv('t_vz')]])) return; tf = { k: 'tr', v: [fv('t_vx'), fv('t_vy'), fv('t_vz')] }; }
    if (op === 'rot') { if (!checkExpr([['Angle', fv('t_ang')], ['Center X', fv('t_cx')], ['Center Y', fv('t_cy')]])) return; tf = { k: 'rot', a: fv('t_ang'), c: [fv('t_cx'), fv('t_cy')] }; }
    if (op === 'mir') { if (!checkExpr([['Center', fv('t_mc')]])) return; tf = { k: 'mir', ax: fv('t_mn'), c: fv('t_mc') }; }
    if (prev) { const s = selSolids()[0]; const n = JSON.parse(JSON.stringify(s.node)); applyTf(n, { ...tf, n: 1 }); U.preview = n; draw(); return; }
    closeDlg();
    modify(() => {
      for (const s of selSolids()) {
        if (!copy) { applyTf(s.node, { ...tf, n: 1 }); continue; }
        const copies = [];
        for (let k = 1; k <= rep; k++) { const n = JSON.parse(JSON.stringify(s.node)); applyTf(n, op === 'mir' ? { ...tf, n: 1 } : { ...tf, n: k }); copies.push(n); if (op === 'mir') break; }
        if (unite) s.node = { t: 'grp', items: [{ n: s.node, s: 1 }, ...copies.map(n => ({ n, s: 1 }))] };
        else copies.forEach((n, i) => { const id = 's' + S.nextId++; S.solids.push({ id, name: uniqueName(s.name + '_' + (i + 1)), comp: s.comp, mat: s.mat, node: n }); });
      }
      msg('info', `Transform (${op === 'tr' ? 'Translate' : op === 'rot' ? 'Rotate' : 'Mirror'}${copy ? ', copy ×' + (op === 'mir' ? 1 : rep) : ''}) 완료.`);
    });
  }
}

/* ---------- 재질 ---------- */
function dlgMatLib(cb) {
  const list = () => MAT_LIB.filter(m => m.name.toLowerCase().includes((fv('ml_q') || '').toLowerCase()));
  openDlg('Load from Material Library', `<label>Search<input id="ml_q" placeholder="예: FR-4, Rogers"></label><div class="mlist" id="ml_list"></div><div class="minfo" id="ml_info">재질을 고르면 정보가 여기에 나옵니다.</div>`,
    [{ label: 'Load', primary: true, fn: load }, { label: 'Cancel', fn: closeDlg }], true);
  let pick = null;
  const paint = () => { $('#ml_list').innerHTML = list().map(m => `<div class="mi2 ${pick === m.name ? 'on' : ''}" data-n="${esc(m.name)}"><span class="sw" style="background:${m.color}"></span>${esc(m.name)}</div>`).join(''); };
  paint(); $('#ml_q').oninput = paint;
  $('#ml_list').onclick = e => { const it = e.target.closest('.mi2'); if (!it) return; pick = it.dataset.n; const m = getMat(pick); $('#ml_info').innerHTML = `<b>${esc(m.name)}</b><br>${m.kind === 'metal' ? '금속' : '유전체'} · ${esc(m.info)}`; paint(); };
  $('#ml_list').ondblclick = load;
  function load() { if (!pick) return dErr('재질을 고르세요.'); if (!S.mats.includes(pick)) { S.mats.push(pick); save(); renderTree(); } msg('info', `Material '${pick}' loaded.`); const n = pick; closeDlg(); if (cb) cb(n); }
}
function dlgNewMat(cb) {
  openDlg('New Material', `<div class="g2"><label class="full">Material name<input id="nm_n" value="DR"></label><label class="full">Type<select id="nm_t"><option value="diel">Normal (유전체)</option><option value="metal">PEC / Lossy metal</option></select></label><label>Epsilon (εr)<input id="nm_e" value="10"></label><label>tan δ<input id="nm_d" value="0"></label><label>Color<input id="nm_c" type="color" value="#f2d34a"></label></div>`,
    [{ label: 'OK', primary: true, fn: ok }, { label: 'Cancel', fn: closeDlg }]);
  function ok() {
    const n = fv('nm_n'); if (!n) return dErr('이름을 입력하세요.'); if (MAT_LIB.some(m => m.name === n)) return dErr('라이브러리 재질과 같은 이름입니다.');
    const e = +fv('nm_e'), d = +fv('nm_d'); if (!(e >= 1)) return dErr('εr은 1 이상이어야 합니다.');
    S.custom[n] = { name: n, kind: fv('nm_t'), eps: e, tand: d || 0, color: fv('nm_c'), info: `εr = ${e}, tanδ = ${d || 0}` };
    if (!S.mats.includes(n)) S.mats.push(n); save(); renderTree(); closeDlg(); msg('info', `New material '${n}' (εr ${e}).`); afterChange(true); if (cb) cb(n);
  }
}
function dlgChMat() {
  openDlg('Change Material and Color', `<label>Material<select id="cm_m">${matOptions(selSolids()[0].mat)}</select></label>`, [{ label: 'OK', primary: true, fn: () => { const v = $('#cm_m').value; if (v.startsWith('__')) return dErr('재질을 고르세요.'); closeDlg(); modify(() => selSolids().forEach(s => s.mat = v)); } }, { label: 'Cancel', fn: closeDlg }]);
  reopen = () => dlgChMat(); bindMatSelect('cm_m', () => ({}));
}

/* ---------- 주파수 / 모니터 / 포트 / 솔버 ---------- */
function dlgFreq() {
  const f = S.freq || ['', ''];
  openDlg('Frequency Range Settings', `<div class="g2"><label>Fmin (GHz)<input id="f0" value="${f[0]}"></label><label>Fmax (GHz)<input id="f1" value="${f[1]}"></label></div>`, [{ label: 'OK', primary: true, fn: () => { const a = +fv('f0'), b = +fv('f1'); if (!(a > 0 && b > a)) return dErr('Fmin < Fmax인 양수를 넣으세요.'); closeDlg(); modify(() => { S.freq = [a, b]; msg('info', `Frequency range: ${a} – ${b} GHz`); }); } }, { label: 'Cancel', fn: closeDlg }]);
}
function dlgMonitor() {
  openDlg('Monitor', `<div class="g2"><label class="full">Type<span class="radio"><label><input type="radio" disabled>E-Field</label><label><input type="radio" disabled>H-Field</label><label><input type="radio" checked>Farfield/RCS</label></span></label><label class="chk full"><input type="checkbox" id="m_multi" checked> 여러 주파수 (Min / Max / Step width)</label><label>Frequency / Min<input id="m_f0" value="${S.freq ? S.freq[0] : ''}"></label><label>Max<input id="m_f1" value="${S.freq ? S.freq[1] : ''}"></label><label>Step width<input id="m_st" value="0.25"></label></div>`,
    [{ label: 'OK', primary: true, fn: ok }, { label: 'Cancel', fn: closeDlg }]);
  function ok() {
    const multi = $('#m_multi').checked, a = +fv('m_f0'), b = +fv('m_f1'), st = +fv('m_st');
    if (!(a > 0)) return dErr('주파수를 넣으세요.');
    const list = []; if (multi) { if (!(b >= a && st > 0)) return dErr('Min ≤ Max, Step > 0'); for (let f = a; f <= b + 1e-9; f += st) list.push(+f.toFixed(4)); if (list.length > 80) return dErr('모니터가 너무 많습니다 (최대 80개).'); } else list.push(a);
    closeDlg(); modify(() => { list.forEach(f => { if (!S.monitors.includes(f)) S.monitors.push(f); }); S.monitors.sort((p, q) => p - q); msg('info', `Farfield monitors: ${list.length}개 생성`); }, false);
  }
}
function dlgPort(editIdx) {
  const pj = PJ(), ex = editIdx != null ? S.ports[editIdx] : null;
  let p = ex ? JSON.parse(JSON.stringify(ex)) : null, usePick = false;
  if (!p) {
    if (U.pick) {
      const { p1, p2, z } = U.pick, horiz = Math.abs(p1[1] - p2[1]) < 1e-6;
      p = horiz ? { normal: 'y', pos: fmt(p1[1]), u: [fmt(Math.min(p1[0], p2[0])), fmt(Math.max(p1[0], p2[0]))], v: [fmt(z), fmt(z)] } : { normal: 'x', pos: fmt(p1[0]), u: [fmt(Math.min(p1[1], p2[1])), fmt(Math.max(p1[1], p2[1]))], v: [fmt(z), fmt(z)] };
      p.ue = ['0', '0']; p.ve = ['0', '0']; p.dir = 1; usePick = true;
    } else p = { normal: 'y', pos: '0', u: ['0', '0'], v: ['0', '0'], ue: ['0', '0'], ve: ['0', '0'], dir: 1 };
  }
  const [ua, va] = inPlane(p.normal).map(s => s.toUpperCase());
  openDlg(ex ? 'Modify Waveguide Port' : 'Waveguide Port', `
   <div class="g2"><label>Name<input value="${(editIdx ?? S.ports.length) + 1}" disabled></label><span></span>
   <label class="full">Normal<span class="radio">${['x', 'y', 'z'].map(n => `<label><input type="radio" name="pn" value="${n}" ${p.normal === n ? 'checked' : ''}>${n.toUpperCase()}</label>`).join('')}</span></label>
   <label class="full">Orientation<span class="radio"><label><input type="radio" name="pd" value="1" ${p.dir > 0 ? 'checked' : ''}>Positive</label><label><input type="radio" name="pd" value="-1" ${p.dir < 0 ? 'checked' : ''}>Negative</label></span></label></div>
   <fieldset><legend>Position ${usePick ? '(Use picks: 선택한 모서리 값이 들어갔습니다)' : '(Free)'}</legend>
   <div class="pg"><span></span><b>min</b><b>− 여유</b><b>max</b><b>+ 여유</b>
   <span id="pl_u">${ua}</span><input id="p_u0" value="${esc(p.u[0])}"><input id="p_ue0" value="${esc(p.ue[0])}"><input id="p_u1" value="${esc(p.u[1])}"><input id="p_ue1" value="${esc(p.ue[1])}">
   <span id="pl_v">${va}</span><input id="p_v0" value="${esc(p.v[0])}"><input id="p_ve0" value="${esc(p.ve[0])}"><input id="p_v1" value="${esc(p.v[1])}"><input id="p_ve1" value="${esc(p.ve[1])}"></div>
   <label class="inl"><span id="pl_n">${p.normal.toUpperCase()}pos</span><input id="p_pos" value="${esc(p.pos)}"></label></fieldset>
   <div class="g2"><label>Number of modes<input value="1" disabled></label></div>
   <p class="hint">여유값에 <code>5*h</code>처럼 수식을 쓸 수 있습니다. Orientation은 포트에서 안테나 쪽을 보는 방향(+축이면 Positive).</p>`,
    [{ label: 'OK', primary: true, fn: ok }, { label: 'Cancel', fn: closeDlg }], true);
  document.querySelectorAll('input[name=pn]').forEach(r => r.onchange = () => { const n = document.querySelector('input[name=pn]:checked').value, [a, b] = inPlane(n); $('#pl_u').textContent = a.toUpperCase(); $('#pl_v').textContent = b.toUpperCase(); $('#pl_n').textContent = n.toUpperCase() + 'pos'; });
  function ok() {
    const np = { normal: document.querySelector('input[name=pn]:checked').value, dir: +document.querySelector('input[name=pd]:checked').value, pos: fv('p_pos'), u: [fv('p_u0'), fv('p_u1')], ue: [fv('p_ue0') || '0', fv('p_ue1') || '0'], v: [fv('p_v0'), fv('p_v1')], ve: [fv('p_ve0') || '0', fv('p_ve1') || '0'] };
    if (!checkExpr([['pos', np.pos], ['min', np.u[0]], ['max', np.u[1]], ['min', np.v[0]], ['max', np.v[1]], ['여유', np.ue[0]], ['여유', np.ue[1]], ['여유', np.ve[0]], ['여유', np.ve[1]]])) return;
    closeDlg(); modify(() => { if (ex) S.ports[editIdx] = np; else S.ports.push(np); U.pick = null; msg('info', `Waveguide port ${ex ? editIdx + 1 : S.ports.length} ${ex ? 'modified' : 'defined'} (Normal ${np.normal.toUpperCase()}, ${np.dir > 0 ? 'Positive' : 'Negative'}).`); if (S.ports.length > 1) msg('warn', '이 예제는 포트가 1개면 됩니다. 첫 번째 포트만 사용합니다.'); });
  }
}
function dlgSolver() {
  openDlg('Time Domain Solver Parameters', `<div class="g2"><label>Accuracy<select><option>-40 dB</option><option>-30 dB</option></select></label><label>Source type<select><option>All Ports</option><option>Port 1</option></select></label><label class="chk full"><input type="checkbox" checked disabled> S-parameter normalization (50 Ω)</label></div><p class="hint">Start를 누르면 모의 계산을 시작합니다.</p>`,
    [{ label: 'Start', primary: true, fn: () => { closeDlg(); startSim(); } }, { label: 'Close', fn: closeDlg }]);
}
function dlgGMesh() {
  openDlg('Mesh Properties – Hexahedral', `<div class="g2"><label>Cells per wavelength<input id="gm_a" value="${S.gmesh.cpw}"></label><label>Cells per max model box edge<input id="gm_b" value="${S.gmesh.cpe}"></label></div><p class="hint">값을 올리면 메쉬가 촘촘해집니다. 10 미만이면 정확도가 떨어집니다.</p>`,
    [{ label: 'OK', primary: true, fn: () => { const a = +fv('gm_a'), b = +fv('gm_b'); if (!(a >= 4 && b >= 4)) return dErr('4 이상'); closeDlg(); modify(() => { S.gmesh = { cpw: a, cpe: b }; }); } }, { label: 'Cancel', fn: closeDlg }]);
}
function dlgLocalMesh(id) {
  const s = S.solids.find(q => q.id === id);
  openDlg('Local Mesh Properties – ' + esc(s.name), `<label class="chk"><input type="checkbox" id="lm_on" ${s.localMesh ? 'checked' : ''}> Number of cells across object</label><label>Value<input id="lm_v" value="${s.localMesh || 3}"></label>`,
    [{ label: 'OK', primary: true, fn: () => { const on = $('#lm_on').checked, v = +fv('lm_v'); closeDlg(); modify(() => { s.localMesh = on ? Math.max(1, v || 1) : 0; msg('info', `Local mesh: ${s.name} → ${on ? v + ' cells across' : 'off'}`); }); } }, { label: 'Cancel', fn: closeDlg }]);
}

/* ---------- 실행 ---------- */
let running = false;
function startSim() {
  if (running) return;
  const r = simulate();
  if (r.err) { msg('err', r.err); return; }
  running = true; msg('info', 'Time domain solver started.');
  const stages = ['Mesh generation', 'Port mode calculation', 'Transient solver', 'Farfield calculation'], bar = $('#pbar'), lab = $('#plab');
  let t = 0; const tot = 2200;
  const iv = setInterval(() => {
    t += 60; const k = Math.min(1, t / tot); bar.style.width = (k * 100) + '%'; lab.textContent = stages[Math.min(3, Math.floor(k * 4))] + ' … ' + Math.round(k * 100) + '%';
    if (k >= 1) {
      clearInterval(iv); running = false; lab.textContent = 'Solver finished';
      if (r.gradeOnly) {
        S.ran = true; save();
        msg(r.allOk ? 'ok' : 'warn', '<b>형상 점검 결과</b> (이 예제는 결과 그래프 없이 형상만 채점합니다. S11·AR·패턴은 실제 CST에서 확인하세요.)');
        r.rep.forEach(([ty, tx]) => msg(ty, tx));
        clearTimeout(anTimer); lastA = analyze(); renderMission(); return;
      }
      S.results = { s11: r.s11, gain: r.gain, ar: r.ar, mons: r.mons, lossless: r.lossless, f: r.f, d: r.d }; S.sweep = null;
      msg('ok', 'Solver finished successfully.');
      msg('info', '<b>모델 점검 결과</b> (연습용 모의: 실제 CST 계산이 아니라 정답 형상과의 일치도로 결과를 만듭니다)');
      r.rep.forEach(([ty, tx]) => msg(ty, tx));
      save(); renderTree(); openResult('s11'); clearTimeout(anTimer); lastA = analyze(); renderMission();
    }
  }, 60);
}
function dlgSweep() {
  const opts = S.params.map(p => `<option>${esc(p.name)}</option>`).join('');
  if (!S.params.length) return msg('warn', 'Parameter List에 파라미터가 없습니다.');
  openDlg('Parameter Sweep', `<div class="g2"><label class="full">Parameter<select id="sw_p">${opts}</select></label><label>From<input id="sw_a"></label><label>To<input id="sw_b"></label><label>Step width<input id="sw_s"></label><label>Runs<input id="sw_n" disabled></label></div><p class="hint">연습판 근사: 크기가 커지면 공진이 낮아지는 경향을 보여 줍니다. 실제 CST처럼 공진마다 다르게 움직이지는 않습니다.</p>`,
    [{ label: 'Start', primary: true, fn: run }, { label: 'Close', fn: closeDlg }]);
  const P = curP(), setDef = () => { const v = P[fv('sw_p')]; $('#sw_a').value = fmt(v * 0.9); $('#sw_b').value = fmt(v * 1.1); $('#sw_s').value = fmt(v * 0.1); upd(); };
  const upd = () => { const a = +fv('sw_a'), b = +fv('sw_b'), s = +fv('sw_s'); $('#sw_n').value = s > 0 && b >= a ? Math.floor((b - a) / s + 1e-9) + 1 : '-'; };
  $('#sw_p').onchange = setDef; ['sw_a', 'sw_b', 'sw_s'].forEach(i => document.getElementById(i).oninput = upd); setDef();
  function run() {
    const name = fv('sw_p'), a = +fv('sw_a'), b = +fv('sw_b'), st = +fv('sw_s');
    if (!(st > 0 && b >= a)) return dErr('From ≤ To, Step > 0'); const vals = []; for (let v = a; v <= b + 1e-9; v += st) vals.push(+v.toFixed(6)); if (vals.length > 8) return dErr('최대 8회까지 실행합니다.');
    const base = simulate(); if (base.err) return dErr(base.err); const curves = []; for (const v of vals) { const r = simulate({ [name]: v }, base.q); if (r.err) return dErr(r.err); curves.push({ v, s11: r.s11 }); }
    closeDlg(); S.sweep = { name, curves }; save(); renderTree(); msg('ok', `Parameter sweep (${name}: ${vals.join(', ')}) finished.`); openResult('sweep');
  }
}
function dlgTemplates() {
  const pj = PJ();
  openDlg('Result Templates', `<p class="hint">Farfield Result 템플릿: 모니터를 만든 주파수마다 값을 뽑아 주파수에 따른 그래프를 만듭니다. 이 예제 권장 방향: <b>${pj.tpl.note}</b></p>
   <div class="g2"><label class="full">Template<select disabled><option>Farfield Result</option></select></label><label class="full">Result<select id="tp_q"><option>Realized Gain</option><option>Gain (IEEE)</option><option>Directivity</option><option>Axial Ratio</option></select></label><label>Theta<input id="tp_t" value="${pj.tpl.theta}"></label><label>Phi<input id="tp_p" value="${pj.tpl.phi}"></label><label class="full">Frequency settings<select disabled><option>Broadband (all monitors)</option></select></label></div>
   <div class="tlist">${S.tpls.map((t, i) => `<div>${i + 1}. ${esc(t.q)} (θ=${t.th}, φ=${t.ph}) <button class="lnk" data-del="${i}">삭제</button></div>`).join('') || '<i>아직 템플릿이 없습니다.</i>'}</div>`,
    [{ label: 'Add & Evaluate', primary: true, fn: add }, { label: 'Close', fn: closeDlg }], true);
  $('#modal').querySelectorAll('[data-del]').forEach(b => b.onclick = () => { S.tpls.splice(+b.dataset.del, 1); save(); renderTree(); dlgTemplates(); });
  function add() {
    const t = { q: fv('tp_q'), th: +fv('tp_t'), ph: +fv('tp_p') }; if (!isFinite(t.th) || !isFinite(t.ph)) return dErr('Theta, Phi는 숫자');
    S.tpls.push(t); save(); renderTree(); closeDlg(); msg('info', `Template '${t.q}' added.`);
    if (!S.results) msg('warn', '결과가 없어 아직 계산할 수 없습니다. 시뮬레이션 후 자동으로 계산됩니다.'); else openResult('tpl' + (S.tpls.length - 1));
    clearTimeout(anTimer); lastA = analyze(); renderMission();
  }
}

/* ---------- 결과 보기 ---------- */
function openResult(id) { if (!U.tabs.includes(id)) U.tabs.push(id); U.tab = id; renderTabs(); renderTree(); }
function tabLabel(id) {
  if (id === 's11') return '1D Results\\S-Parameters\\S1,1';
  if (id === 'vswr') return '1D Results\\VSWR';
  if (id === 'sweep') return 'S1,1 (Par. Sweep)';
  if (id.startsWith('tpl')) { const t = S.tpls[+id.slice(3)]; return t ? 'Tables\\' + t.q : '?'; }
  if (id.startsWith('ff')) return 'farfield (f=' + id.slice(2) + ')';
  return id;
}
function renderTabs() {
  U.tabs = U.tabs.filter(id => resultExists(id)); if (U.tab !== '3D' && !U.tabs.includes(U.tab)) U.tab = '3D';
  $('#vtabs').innerHTML = `<button class="vt ${U.tab === '3D' ? 'on' : ''}" data-v="3D">${esc(PJ().file)}</button>` + U.tabs.map(id => `<button class="vt ${U.tab === id ? 'on' : ''}" data-v="${id}">${esc(tabLabel(id))}<span class="vx" data-x="${id}">×</span></button>`).join('');
  $('#cv').style.display = U.tab === '3D' ? 'block' : 'none'; $('#resPane').hidden = U.tab === '3D';
  if (U.tab === '3D') draw(); else renderResult();
}
function resultExists(id) {
  if (!S.results) return false;
  if (id === 'sweep') return !!S.sweep;
  if (id.startsWith('tpl')) return !!S.tpls[+id.slice(3)];
  if (id.startsWith('ff')) return S.results.mons.includes(+id.slice(2));
  return true;
}
$('#vtabs') && 0;
document.addEventListener('click', e => {
  const x = e.target.closest('[data-x]'); if (x) { U.tabs = U.tabs.filter(t => t !== x.dataset.x); if (U.tab === x.dataset.x) U.tab = '3D'; renderTabs(); e.stopPropagation(); return; }
  const v = e.target.closest('.vt'); if (v) { U.tab = v.dataset.v; renderTabs(); }
});
let chartCfg = null;
function renderResult() {
  const pane = $('#resPane'), R = S.results, pj = PJ(), id = U.tab;
  if (!R) return;
  const banner = `<div class="simnote">연습용 모의 결과 · 실제 CST 계산이 아니라 교안 결과 곡선을 형상 일치도에 맞춰 변형한 근사입니다.</div>`;
  if (id.startsWith('ff')) {
    const f = +id.slice(2), pols = pj.pattern === 'dra' ? ['Abs', 'LHCP', 'RHCP'] : ['Abs'];
    const cuts = ['Phi=0', 'Phi=90', 'Theta=90'];
    U.ffCut = U.ffCut || pj.ffCut; U.ffPol = pols.includes(U.ffPol) ? U.ffPol : 'Abs';
    const s11 = interp(R.s11, f), tot = (R.lossless ? 0 : pj.radEff) + 10 * Math.log10(1 - Math.pow(10, s11 / 10));
    pane.innerHTML = banner + `<div class="ffbar">Cut <select id="ffc">${cuts.map(c => `<option ${c === U.ffCut ? 'selected' : ''}>${c}</option>`).join('')}</select> Polarization <select id="ffp">${pols.map(c => `<option ${c === U.ffPol ? 'selected' : ''}>${c}</option>`).join('')}</select> ${pj.pattern === 'dra' ? '<label class="chk"><input type="checkbox" id="ffb"' + (U.ffBoth ? ' checked' : '') + '> LHCP·RHCP 같이</label>' : ''}</div><div class="ffinfo"><b>farfield (f=${f}) [1]</b><br>Type: Farfield<br>Output: Realized Gain<br>Frequency: ${f} GHz<br>Rad. Effic.: ${fmt(R.lossless ? 0 : pj.radEff, 3)} dB<br>Tot. Effic.: ${fmt(tot, 3)} dB<br>Rlzd. Gain: ${fmt(interp(R.gain, f), 3)} dBi</div><canvas id="rc"></canvas>`;
    $('#ffc').onchange = e => { U.ffCut = e.target.value; renderResult(); }; $('#ffp').onchange = e => { U.ffPol = e.target.value; renderResult(); };
    if ($('#ffb')) $('#ffb').onchange = e => { U.ffBoth = e.target.checked; renderResult(); };
    const c = sizeRc(); const ser = []; const polList = U.ffBoth ? ['LHCP', 'RHCP'] : [U.ffPol];
    polList.forEach((pol, i) => {
      const pts = []; for (let a = 0; a <= 360; a += 2) {
        let th, ph;
        if (U.ffCut === 'Theta=90') { th = 90; ph = a; }
        else { const p0 = U.ffCut === 'Phi=0' ? 0 : 90; th = a <= 180 ? a : 360 - a; ph = a <= 180 ? p0 : p0 + 180; }
        pts.push([a, farVal(f, th, ph, 'Realized Gain', pol === 'Abs' ? null : pol)]);
      }
      ser.push({ name: `${pol} ${U.ffCut} ${f}GHz`, pts, color: COLORS[i ? 1 : 0] });
    });
    const mx = Math.ceil(Math.max(...ser.flatMap(s => s.pts.map(p => p[1]))) / 5) * 5;
    drawPolar(c, { title: `Farfield Realized Gain ${U.ffCut === 'Theta=90' ? 'Abs (Theta=90)' : U.ffCut} (dBi)`, series: ser, rmax: mx, axisLabel: U.ffCut === 'Theta=90' ? 'Phi / deg' : 'Theta / deg' });
    chartCfg = null; return;
  }
  let cfg;
  if (id === 's11') cfg = { title: 'S-Parameters [Magnitude]', yl: 'dB', series: [{ name: 'S1,1', pts: R.s11 }], hlines: [{ y: -10, label: '-10 dB' }] };
  else if (id === 'vswr') cfg = { title: 'Voltage Standing Wave Ratio (VSWR)', yl: 'VSWR', series: [{ name: 'VSWR1', pts: R.s11.map(([f, d]) => { const g = Math.pow(10, d / 20); return [f, Math.min((1 + g) / (1 - g), 20)]; }), color: '#333' }], yr: [0, 6], hlines: [{ y: 2, label: 'VSWR = 2' }] };
  else if (id === 'sweep') cfg = { title: `S-Parameters [Magnitude] – Par. Sweep (${S.sweep.name})`, yl: 'dB', series: S.sweep.curves.map(c => ({ name: `${S.sweep.name}=${c.v}`, pts: c.s11 })), hlines: [{ y: -10, label: '-10 dB' }] };
  else if (id.startsWith('tpl')) {
    const t = S.tpls[+id.slice(3)];
    if (!R.mons.length) { pane.innerHTML = banner + '<div class="empty">Farfield 모니터가 없어 템플릿을 계산할 수 없습니다. Simulation → Field Monitor로 만든 뒤 다시 Start 하세요.</div>'; return; }
    const pts = R.mons.map(f => [f, farVal(f, t.th, t.ph, t.q)]);
    cfg = { title: t.q, yl: t.q === 'Axial Ratio' ? 'dB' : 'dBi', series: [{ name: `${t.q} (θ=${t.th}, φ=${t.ph})`, pts, marker: true }], hlines: t.q === 'Axial Ratio' ? [{ y: 3, label: 'AR = 3 dB' }] : (pj.key === 'yagi' ? [{ y: 6, label: '6 dB' }] : []), yr: t.q === 'Axial Ratio' ? [0, Math.max(14, Math.min(40, Math.max(...pts.map(p => p[1])) + 1))] : null };
    if (pts.length === 1) cfg.note = '모니터가 1개라 점 하나뿐입니다. 여러 주파수에 모니터를 만드세요.';
  }
  cfg.xr = R.f;
  pane.innerHTML = banner + '<canvas id="rc"></canvas>';
  const c = sizeRc(); chartCfg = cfg; drawLineChart(c, cfg, null);
  c.onmousemove = e => { const r = c.getBoundingClientRect(); drawLineChart(c, cfg, (e.clientX - r.left) * U.dpr); };
  c.onmouseleave = () => drawLineChart(c, cfg, null);
}
function sizeRc() { const c = $('#rc'), p = $('#resPane'); const used = [...p.children].filter(ch => ch !== c && getComputedStyle(ch).position !== 'absolute').reduce((a, ch) => a + ch.offsetHeight, 0); const w = p.clientWidth, h = Math.max(200, p.clientHeight - used - 2); c.width = w * U.dpr; c.height = h * U.dpr; c.style.width = w + 'px'; c.style.height = h + 'px'; return c; }

/* ---------- 네비게이션 트리 ---------- */
function node(key, label, kids, opts = {}) {
  const open = !U.closed.has(key), has = kids && kids.length;
  return `<li><div class="tn ${opts.sel ? 'sel' : ''}" data-k="${key}" ${opts.attr || ''}>${has ? `<span class="tw" data-tog="${key}">${open ? '▾' : '▸'}</span>` : '<span class="tw"></span>'}${opts.icon || ''}<span>${label}</span></div>${has && open ? `<ul>${kids.join('')}</ul>` : ''}</li>`;
}
function renderTree() {
  const sw = c => `<span class="sw" style="background:${c}"></span>`;
  const comps = [...new Set(S.solids.map(s => s.comp))];
  const compNodes = comps.map(c => node('c:' + c, esc(c), S.solids.filter(s => s.comp === c).map(s => node('s:' + s.id, esc(s.name) + (s.hidden ? ' <i style="color:#999">(hidden)</i>' : ''), null, { sel: U.sel.includes(s.id), icon: sw(getMat(s.mat).color), attr: `data-sid="${s.id}"` }))));
  const R = S.results;
  const res = R ? [node('sp', 'S-Parameters', [node('r:s11', 'S1,1', null, { attr: 'data-r="s11"' })].concat(S.sweep ? [node('r:sweep', `S1,1 (Par. Sweep: ${esc(S.sweep.name)})`, null, { attr: 'data-r="sweep"' })] : [])), node('r:vswr', 'VSWR', null, { attr: 'data-r="vswr"' })] : [];
  const tbl = R && S.tpls.length ? S.tpls.map((t, i) => node('r:tpl' + i, `${esc(t.q)} (θ=${t.th}, φ=${t.ph})`, null, { attr: `data-r="tpl${i}"` })) : [];
  const ffs = R ? R.mons.map(f => node('r:ff' + f, `farfield (f=${f}) [1]`, null, { attr: `data-r="ff${f}"` })) : [];
  $('#tree').innerHTML = '<ul>' + [
    node('comp', 'Components', compNodes),
    node('mats', 'Materials', S.mats.map(n => node('m:' + n, esc(n), null, { icon: sw(getMat(n).color) }))),
    node('ports', 'Ports', S.ports.map((p, i) => node('p:' + i, 'port' + (i + 1), null, { attr: `data-port="${i}"` }))),
    node('mon', 'Field Monitors', S.monitors.map(f => node('f:' + f, `farfield (f=${f})`, null, { attr: `data-mon="${f}"` }))),
    node('res', '1D Results', res),
    node('tbl', 'Tables', tbl.length ? [node('tbl1', '1D Results', tbl)] : []),
    node('ff', 'Farfields', ffs)
  ].join('') + '</ul>';
}
document.addEventListener('click', e => {
  const tg = e.target.closest('[data-tog]'); if (tg) { const k = tg.dataset.tog; U.closed.has(k) ? U.closed.delete(k) : U.closed.add(k); renderTree(); return; }
  const tn = e.target.closest('#tree .tn'); if (!tn) return;
  if (tn.dataset.sid) {
    const id = tn.dataset.sid;
    if (U.mode === 'bool') { boolTarget(id); return; }
    if (e.ctrlKey || e.metaKey || e.shiftKey) U.sel = U.sel.includes(id) ? U.sel.filter(i => i !== id) : [...U.sel, id]; else U.sel = [id];
    renderTree(); if (U.tab !== '3D') { U.tab = '3D'; renderTabs(); } else draw();
  } else if (tn.dataset.r) openResult(tn.dataset.r);
});
document.addEventListener('dblclick', e => {
  const tn = e.target.closest('#tree .tn'); if (!tn) return;
  if (tn.dataset.port) dlgPort(+tn.dataset.port);
  if (tn.dataset.sid) editSolid(tn.dataset.sid);
});
document.addEventListener('contextmenu', e => {
  const tn = e.target.closest('#tree .tn'); if (!tn) return; e.preventDefault();
  let items = [];
  if (tn.dataset.sid) { const id = tn.dataset.sid; if (!U.sel.includes(id)) { U.sel = [id]; renderTree(); draw(); }
    items = [['Transform…', () => dlgTransform()], ['Boolean Add', () => startBool('add')], ['Boolean Subtract', () => startBool('sub')], ['Change Material…', () => dlgChMat()], ['Local Mesh Properties…', () => dlgLocalMesh(id)], ['Edit (좌표 수정)…', () => editSolid(id)], ['Rename…', () => renameSolid(id)], [S.solids.find(q => q.id === id).hidden ? 'Show' : 'Hide', () => { const so = S.solids.find(q => q.id === id); so.hidden = !so.hidden; save(); renderTree(); draw(); }], ['Delete', () => action('delete')]]; }
  else if (tn.dataset.port) items = [['Edit…', () => dlgPort(+tn.dataset.port)], ['Delete', () => modify(() => S.ports.splice(+tn.dataset.port, 1))]];
  else if (tn.dataset.mon) items = [['Delete', () => modify(() => { S.monitors = S.monitors.filter(f => f !== +tn.dataset.mon); }, false)]];
  else return;
  const m = $('#ctx'); m.innerHTML = items.map((it, i) => `<div data-ci="${i}">${it[0]}</div>`).join(''); m.hidden = false; m.style.left = e.clientX + 'px'; m.style.top = e.clientY + 'px'; m._items = items;
});
document.addEventListener('click', e => { const m = $('#ctx'); if (m.hidden) return; const it = e.target.closest('[data-ci]'); m.hidden = true; if (it) m._items[+it.dataset.ci][1](); });
function editSolid(id) {
  const s = S.solids.find(q => q.id === id);
  if (s.node.t !== 'brick' || s.node.tf.length) return msg('warn', `'${s.name}'은 Boolean/Transform이 적용되어 좌표를 직접 고칠 수 없습니다. Ctrl+Z로 되돌리거나 지우고 다시 만드세요.`);
  dlgBrick({ name: s.name, ...s.node.e, comp: s.comp, mat: s.mat, editId: id });
}
function renameSolid(id) {
  const s = S.solids.find(q => q.id === id);
  openDlg('Rename', `<label>Name<input id="rn" value="${esc(s.name)}"></label>`, [{ label: 'OK', primary: true, fn: () => { const n = fv('rn'); if (!n) return; closeDlg(); modify(() => { s.name = n; }, false); } }, { label: 'Cancel', fn: closeDlg }]);
}

/* ---------- 파라미터 ---------- */
function renderParams() {
  const P = curP();
  $('#ptab').innerHTML = '<tr><th>Name</th><th>Expression</th><th>Value</th><th>Description</th><th></th></tr>' + S.params.map((p, i) => `<tr><td>${esc(p.name)}</td><td><input class="pe" data-pi="${i}" value="${esc(p.expr)}" spellcheck="false"></td><td class="${isNaN(P[p.name]) ? 'bad' : ''}">${isNaN(P[p.name]) ? 'error' : fmt(P[p.name], 4)}</td><td class="pd">${esc(p.desc || '')}</td><td><button class="lnk" data-pdel="${i}" aria-label="삭제">×</button></td></tr>`).join('') +
    `<tr class="newp"><td><input id="np_n" placeholder="<new parameter>" spellcheck="false"></td><td><input id="np_e" placeholder="값 또는 수식" spellcheck="false"></td><td colspan="3" class="pd">Name, Expression 입력 후 Enter</td></tr>`;
}
document.addEventListener('change', e => {
  if (e.target.classList.contains('pe')) { const i = +e.target.dataset.pi, v = e.target.value.trim(); modify(() => { S.params[i].expr = v; }); msg('info', `${S.params[i].name} = ${v}  (F7: Parametric Update)`); }
});
document.addEventListener('keydown', e => {
  if ((e.target.id === 'np_n' || e.target.id === 'np_e') && e.key === 'Enter') {
    const n = fv('np_n'), x = fv('np_e');
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(n)) { msg('err', '파라미터 이름은 영문자로 시작해야 합니다.'); return; }
    if (S.params.some(p => p.name === n)) { msg('err', `'${n}'은 이미 있습니다.`); return; }
    if (!x) { document.getElementById('np_e').focus(); return; }
    const desc = (PJ().params.find(p => p[0] === n) || [])[2] || '';
    modify(() => S.params.push({ name: n, expr: x, desc })); setTimeout(() => document.getElementById('np_n').focus(), 10);
    e.stopPropagation();
  }
}, true);
document.addEventListener('click', e => { const d = e.target.closest('[data-pdel]'); if (d) modify(() => S.params.splice(+d.dataset.pdel, 1)); });
function fillParams() { modify(() => { for (const [n, v, d] of PJ().params) { const p = S.params.find(q => q.name === n); if (p) p.expr = String(v); else S.params.push({ name: n, expr: String(v), desc: d }); } }); msg('info', '논문 파라미터 표를 Parameter List에 입력했습니다.'); }

/* ---------- 실습 패널 ---------- */
function renderMission() {
  const pj = PJ(), A = lastA || analyze(), steps = pj.mission, done = steps.map(s => { try { return !!s.ok(A); } catch (e) { return false; } });
  const cur = done.indexOf(false), n = done.filter(Boolean).length;
  if (U.openStep === -1 || (U.openStep < steps.length && done[U.openStep] && U.autoFollow)) { U.openStep = cur; U.autoFollow = true; }
  const head = `<div class="mh"><div class="mt">${esc(pj.short)}</div><div class="mp"><div class="mpb" style="width:${n / steps.length * 100}%"></div></div><div class="mpt">${n} / ${steps.length} 단계 완료</div><div class="mtabs"><button class="${U.missionTab === 'steps' ? 'on' : ''}" data-mt="steps">실습 단계</button><button class="${U.missionTab === 'paper' ? 'on' : ''}" data-mt="paper">논문 정보</button></div></div>`;
  let body;
  if (U.missionTab === 'steps') {
    body = `<div class="coord"><b>좌표 약속</b> ${pj.coord}</div>` + steps.map((s, i) => `<div class="st ${done[i] ? 'done' : ''} ${i === cur ? 'cur' : ''} ${U.openStep === i ? 'open' : ''}"><button class="sth" data-step="${i}"><span class="sn">${done[i] ? '✓' : i + 1}</span><span class="stt">${s.t}</span></button>${U.openStep === i ? `<div class="stb"><p>${s.how}</p>${s.fill ? '<button class="btn sm" id="fillP">표 한 번에 입력</button>' : ''}${s.ans ? `<details><summary>정답 값 보기</summary>${s.ans}</details>` : ''}</div>` : ''}</div>`).join('') +
      (n === steps.length ? '<div class="alldone">모든 단계를 끝냈습니다. 파라미터를 바꾸거나 Par. Sweep을 돌려 결과가 어떻게 변하는지도 확인해 보세요.</div>' : '');
    if (lastA) {
      const rows = pj.cats.map(c => `<tr><td>${pj.catName[c]}</td><td>${(A.iou[c] * 100).toFixed(0)}%</td></tr>`).join('');
      body += `<details class="live"><summary>지금 모델의 정답 일치도</summary><table>${rows}</table><p class="hint">객체의 z 위치가 좌표 약속과 같아야 비교됩니다.</p></details>`;
    }
  } else {
    body = `<div class="paper"><p class="pt">${esc(pj.paper)}</p><table class="ptab2"><tr><th>Parameter</th><th>Value (mm)</th><th></th></tr>${pj.params.map(([n, v, d]) => `<tr><td>${n}</td><td>${v}</td><td>${d}</td></tr>`).join('')}</table>${pj.sub ? `<p>기판: <b>${pj.sub.matHint}</b>${pj.dr ? ', DR: εr = 10' : ''}</p>` : ''}${window.NO_SLIDES ? '<p class="hint">교안·과제 그림은 공개용 버전에서 뺐습니다. 교안 Ch.7 또는 과제 PDF를 같이 보세요.</p>' : `<div class="gal">${pj.slides.map(([f, c]) => `<figure><img src="img/${f}.jpg" alt="${esc(c)}" data-zoom><figcaption>${c}</figcaption></figure>`).join('')}</div>`}</div>`;
  }
  $('#mission').innerHTML = head + `<div class="mb">${body}</div>`;
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-mt]'); if (t) { U.missionTab = t.dataset.mt; renderMission(); return; }
  const s = e.target.closest('[data-step]'); if (s) { const i = +s.dataset.step; U.openStep = U.openStep === i ? -2 : i; U.autoFollow = false; renderMission(); return; }
  if (e.target.id === 'fillP') fillParams();
  const z = e.target.closest('[data-zoom]'); if (z) { const lb = $('#lb'); lb.innerHTML = `<img src="${z.src}" alt=""><button class="btn">닫기</button>`; lb.hidden = false; }
  if (e.target.closest('#lb')) $('#lb').hidden = true;
});

/* ---------- 키보드 ---------- */
document.addEventListener('keydown', e => {
  const typing = /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName);
  if (e.key === 'Escape') { onEsc(); return; }
  if (!$('#modal').hidden) { if (e.key === 'Enter' && !e.isComposing) { const b = $('#modal')._buttons; if (b && b[0]) { e.preventDefault(); b[0].fn(); } } return; }
  if (typing) return;
  if (e.key === 'Enter' && U.mode === 'bool') { boolEnter(); return; }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); return; }
  if (e.key === 'F7') { e.preventDefault(); action('update'); return; }
  if (e.key === 'Delete' && U.sel.length) { action('delete'); return; }
  if (e.key.toLowerCase() === 'd' && !e.ctrlKey) { action('clearPicks'); return; }
  if (e.key === ' ' && U.tab === '3D') { e.preventDefault(); fit(); }
});

/* ---------- 정답 모델 (교안 순서) ---------- */
function buildAnswer() {
  const pj = PJ(); S = blankState(pj.key);
  S.params = pj.params.map(([n, v, d]) => ({ name: n, expr: String(v), desc: d })); S.freq = pj.freq.slice();
  const add = (name, mat, e) => { const id = 's' + S.nextId++; S.solids.push({ id, name, comp: 'component1', mat, node: { t: 'brick', e: { x0: e[0], x1: e[1], y0: e[2], y1: e[3], z0: e[4], z1: e[5] }, tf: [] } }); return S.solids[S.solids.length - 1]; };
  const unite = (base, ...tools) => { base.node = { t: 'grp', items: [{ n: base.node, s: 1 }, ...tools.map(t => ({ n: t.node, s: 1 }))] }; S.solids = S.solids.filter(s => !tools.includes(s)); };
  const subtract = (base, ...tools) => { base.node = { t: 'grp', items: [{ n: base.node, s: 1 }, ...tools.map(t => ({ n: t.node, s: -1 }))] }; S.solids = S.solids.filter(s => !tools.includes(s)); };
  const copy = (s, tf, n, name) => { const c = JSON.parse(JSON.stringify(s.node)); applyTf(c, { ...tf, n }); const id = 's' + S.nextId++; const o = { id, name, comp: 'component1', mat: s.mat, node: c }; S.solids.push(o); return o; };
  if (pj.key === 'monopole') {
    S.mats.push('FR-4 (lossy)');
    add('Substrate', 'FR-4 (lossy)', ['-W1/2', 'W1/2', '0', 'L1', '0', 'h']);
    const g = add('Ground', 'PEC', ['-W1/2', 'W1/2', '0', 'Ls', '0', '0']), sl = add('Slot', 'PEC', ['-W8/2', 'W8/2', 'Ld', 'Ld+L8', '0', '0']); subtract(g, sl);
    const f = add('Feed', 'PEC', ['-W2/2', 'W2/2', '0', 'L2', 'h', 'h']), f2 = add('Feed2', 'PEC', ['-W3/2', 'W3/2', 'L2', 'L2+L3', 'h', 'h']);
    const lb = add('LoopB', 'PEC', ['-W4/2', 'W4/2', 'L2+L3', 'L2+L3+a', 'h', 'h']), lr = add('LoopR', 'PEC', ['W4/2-a', 'W4/2', 'L2+L3', 'L2+L3+L4', 'h', 'h']);
    const ll = copy(lr, { k: 'mir', ax: 'x', c: '0' }, 1, 'LoopL'), lt = copy(lb, { k: 'tr', v: ['0', 'L4-a', '0'] }, 1, 'LoopT');
    const st = add('Stem', 'PEC', ['-W5/2', 'W5/2', 'L2+L3+a', 'L2+L3+a+L5', 'h', 'h']), bar = add('Bar', 'PEC', ['-(W5/2+W6+W7)', 'W5/2+W6+W7', 'L2+L3+a+L6', 'L2+L3+a+L6+W7', 'h', 'h']);
    const ar = add('ArmR', 'PEC', ['W5/2+W6', 'W5/2+W6+W7', 'L2+L3+a+L6+W7', 'L2+L3+a+L6+W7+L7', 'h', 'h']), al = copy(ar, { k: 'mir', ax: 'x', c: '0' }, 1, 'ArmL');
    unite(f, f2, lb, lr, ll, lt, st, bar, ar, al); f.name = 'Patch';
    S.ports.push({ normal: 'y', dir: 1, pos: '0', u: ['-W2/2', 'W2/2'], ue: ['5*h', '5*h'], v: ['h', 'h'], ve: ['5*h', '5*h'] });
    for (let x = 2; x <= 6.5 + 1e-9; x += 0.25) S.monitors.push(+x.toFixed(4));
  } else if (pj.key === 'dra') {
    S.custom.DR = { name: 'DR', kind: 'diel', eps: 10, tand: 0, color: '#f2d34a', info: 'εr = 10' }; S.mats.push('DR', 'Rogers RO4003C (lossy)');
    add('DR', 'DR', ['-a/2', 'a/2', '-a/2', 'a/2', '0', 'd']);
    add('Substrate', 'Rogers RO4003C (lossy)', ['-g/2', 'g/2', '-g/2', 'g/2', '-t', '0']);
    const p = add('Plate', 'PEC', ['dx-l/2', 'dx+l/2', 'dy-w/2', 'dy+w/2', '0', 'h']);
    for (let k = 1; k <= 3; k++) copy(p, { k: 'rot', a: '90', c: ['0', '0'] }, k, 'Plate_' + k);
    const g = add('Ground', 'PEC', ['-g/2', 'g/2', '-g/2', 'g/2', '0', '0']);
    const s1 = add('Slot1', 'PEC', ['-ls1/2', 'ls1/2', '-ws/2', 'ws/2', '0', '0']), s2 = add('Slot2', 'PEC', ['-ws/2', 'ws/2', '-ls2/2', 'ls2/2', '0', '0']);
    unite(s1, s2); applyTf(s1.node, { k: 'rot', a: '45', c: ['0', '0'], n: 1 }); subtract(g, s1);
    const m1 = add('MS1', 'PEC', ['-g/2', '-g/2+lm1', '-wm1/2', 'wm1/2', '-t', '-t']), m2 = add('MS2', 'PEC', ['-g/2+lm1', '-g/2+lm1+lm2', '-wm2/2', 'wm2/2', '-t', '-t']); unite(m1, m2);
    S.ports.push({ normal: 'x', dir: 1, pos: '-g/2', u: ['-wm1/2', 'wm1/2'], ue: ['5*t', '5*t'], v: ['-t', '-t'], ve: ['5*t', 't'] });
    for (let x = 2; x <= 3.8 + 1e-9; x += 0.1) S.monitors.push(+x.toFixed(4));
  } else if (pj.key === 'tp') {
    S.freq = [14, 20]; S.mats.push('Taconic TLY-5 (lossy)', 'PTFE (lossy)');
    const T = 'Taconic TLY-5 (lossy)';
    add('Sub_Lower', T, ['-Wsub/2', 'Wsub/2', '-Wsub/2', 'Wsub/2', '0', 'h']); add('Sub_Upper', T, ['-Wsub/2', 'Wsub/2', '-Wsub/2', 'Wsub/2', 'h', '2*h']);
    const cylA = (name, mat, e) => { const id = 's' + S.nextId++; const o = { id, name, comp: 'component1', mat, node: { t: 'cyl', e: { ro: e[0], ri: e[1], xc: e[2], yc: e[3], z0: e[4], z1: e[5] }, tf: [] } }; S.solids.push(o); return o; };
    const g = add('Ground', 'PEC', ['-Wsub/2', 'Wsub/2', '-Wsub/2', 'Wsub/2', '0', '0']); subtract(g, cylA('GndHole', 'PEC', ['r_d', '0', 'fx', 'fy', '-0.1', '0.1']));
    cylA('Coax_Outer', 'PEC', ['r_o', 'r_d', 'fx', 'fy', '-lc', '0']); cylA('Coax_Diel', 'PTFE (lossy)', ['r_d', 'r_pin', 'fx', 'fy', '-lc', '0']); cylA('Pin', 'PEC', ['r_pin', '0', 'fx', 'fy', '-lc', 'h']);
    const rad = add('Rad', 'PEC', ['-W4/2', 'W4/2', '-W4/2', 'W4/2', 'h', 'h']); unite(rad, add('Tab', 'PEC', ['W4/2', 'W4/2+W6', '-l4/2', 'l4/2', 'h', 'h']));
    subtract(rad, add('Slot1', 'PEC', ['W4/2-W5', 'W4/2', 'l4/2', 'l3/2', 'h', 'h']), add('Slot2', 'PEC', ['W4/2-W5', 'W4/2', '-l3/2', '-l4/2', 'h', 'h']), add('Hole', 'PEC', ['-Wr/2', 'Wr/2', '-Wr/2', 'Wr/2', 'h', 'h']));
    const c1 = add('Cut1', 'PEC', ['W4/2-W2', 'W4/2-W2+Wk', 'W4/2', 'W4/2+0.5', 'h', 'h']); applyTf(c1.node, { k: 'rot', a: '-atn(l1/W2)*180/pi', c: ['W4/2-W2', 'W4/2'], n: 1 });
    const c2 = add('Cut2', 'PEC', ['-W4/2', '-W4/2+W7*sqrt(2)', '-W4/2+W7-0.5', '-W4/2+W7', 'h', 'h']); applyTf(c2.node, { k: 'rot', a: '-45', c: ['-W4/2', '-W4/2+W7'], n: 1 });
    subtract(rad, c1, c2);
    const par = add('Par', 'PEC', ['-Wp/2', 'Wp/2', '-Wp/2', 'Wp/2', '2*h', '2*h']);
    const pc1 = add('PCut1', 'PEC', ['Wp/2-Wpc', 'Wp/2-Wpc+Wpc*sqrt(2)', 'Wp/2', 'Wp/2+0.5', '2*h', '2*h']); applyTf(pc1.node, { k: 'rot', a: '-45', c: ['Wp/2-Wpc', 'Wp/2'], n: 1 });
    const pc2 = copy(pc1, { k: 'rot', a: '180', c: ['0', '0'] }, 1, 'PCut1_1'); subtract(par, pc1, pc2);
    for (const s2 of [rad, par]) applyTf(s2.node, { k: 'rot', a: '-45', c: ['0', '0'], n: 1 });
    const v0 = cylA('Via', 'PEC', ['via_r', '0', '-6*via_p', '6*via_p', '0', '2*h']);
    const row = [v0]; for (let k = 1; k <= 12; k++) row.push(copy(v0, { k: 'tr', v: ['via_p', '0', '0'] }, k, 'Via_' + k));
    row.forEach((v, i) => copy(v, { k: 'tr', v: ['0', '-12*via_p', '0'] }, 1, 'ViaB_' + i));
    const l0 = cylA('ViaL', 'PEC', ['via_r', '0', '-6*via_p', '5*via_p', '0', '2*h']);
    const col = [l0]; for (let k = 1; k <= 10; k++) col.push(copy(l0, { k: 'tr', v: ['0', '-via_p', '0'] }, k, 'ViaL_' + k));
    col.forEach((v, i) => copy(v, { k: 'tr', v: ['12*via_p', '0', '0'] }, 1, 'ViaR_' + i));
    S.ports.push({ normal: 'z', dir: 1, pos: '-lc', u: ['fx-r_o', 'fx+r_o'], ue: ['0', '0'], v: ['fy-r_o', 'fy+r_o'], ve: ['0', '0'] });
    for (let x = 15; x <= 19 + 1e-9; x += 0.5) S.monitors.push(+x.toFixed(4));
    U.sel = []; return;
  } else {
    S.mats.push('FR-4 (lossy)');
    add('Substrate', 'FR-4 (lossy)', ['-L/2', 'L/2', '0', 'W', '0', 'h']);
    const g = add('Ground', 'PEC', ['-lg/2', 'lg/2', '0', 'wg', 'h', 'h']), s1 = add('Solid1', 'PEC', ['-wcps/2', 'wcps/2', 'wg', 'wg+s1+w1+s2+w2', 'h', 'h']);
    add('Director1', 'PEC', ['-ld1/2', 'ld1/2', 'wg+s1+w1+s2+w2+ds1', 'wg+s1+w1+s2+w2+ds1+wd1', 'h', 'h']);
    add('Director2', 'PEC', ['-ld2/2', 'ld2/2', 'wg+s1+w1+s2+w2+ds1+wd1+ds2', 'wg+s1+w1+s2+w2+ds1+wd1+ds2+wd2', 'h', 'h']);
    const d1 = add('Dipole1', 'PEC', ['-l1/2', 'l1/2', 'wg+s1', 'wg+s1+w1', 'h', 'h']), d2 = add('Dipole2', 'PEC', ['-l2/2', 'l2/2', 'wg+s1+w1+s2', 'wg+s1+w1+s2+w2', 'h', 'h']);
    unite(g, s1, d1, d2);
    const sw = add('SlotWide', 'PEC', ['-ws2/2', 'ws2/2', 'wg+s1+w1', 'wg+s1+w1+s2+w2', 'h', 'h']), sn = add('SlotNarrow', 'PEC', ['-ws1/2', 'ws1/2', 'wg', 'wg+s1+w1', 'h', 'h']); subtract(g, sw, sn);
    const ms = add('MS', 'PEC', ['xf-wf/2', 'xf+wf/2', '0', 'v_y+wf/2', '0', '0']), ms2 = add('MS2', 'PEC', ['v_x-1', 'xf+wf/2', 'v_y-wf/2', 'v_y+wf/2', '0', '0']); unite(ms, ms2);
    const id = 's' + S.nextId++; S.solids.push({ id, name: 'Via', comp: 'component1', mat: 'PEC', localMesh: 3, node: { t: 'cyl', e: { ro: 'r', ri: '0', xc: 'v_x', yc: 'v_y', z0: '0', z1: 'h' }, tf: [] } });
    S.ports.push({ normal: 'y', dir: 1, pos: '0', u: ['xf-wf/2', 'xf+wf/2'], ue: ['5*h', '5*h'], v: ['0', '0'], ve: ['5*h', '5*h'] });
    for (let x = 1.5; x <= 4.5 + 1e-9; x += 0.5) S.monitors.push(+x.toFixed(4));
  }
  S.tpls.push({ q: pj.key === 'dra' ? 'Axial Ratio' : 'Realized Gain', th: pj.tpl.theta, ph: pj.tpl.phi });
  if (pj.key === 'dra') S.tpls.push({ q: 'Realized Gain', th: 0, ph: 0 });
  U.sel = [];
}

/* ---------- 프로젝트 선택 ---------- */
function projectPicker(first) {
  const cards = Object.values(PROJECTS).map(p => { const sv = loadSaved(p.key); return `<div class="pcard">${window.NO_SLIDES ? '' : `<img src="img/${p.slides[0][0]}.jpg" alt="">`}<div class="pc"><b>${esc(p.short)}</b><small>${esc(p.paper)}</small><div class="pcb"><button class="btn pri" data-open="${p.key}">${sv ? '이어서 하기' : '시작하기'}</button>${sv ? `<button class="btn" data-reset="${p.key}">처음부터</button>` : ''}</div></div></div>`; }).join('');
  openDlg('Ch.7 예제 고르기', `<p class="dp">교안 Ch.7의 세 안테나를 CST처럼 직접 모델링하고 시뮬레이션해 보는 연습판입니다. 작업은 이 브라우저에 자동 저장됩니다.</p><div class="pcards">${cards}</div><p class="hint">실제 전자기 계산은 하지 않습니다. 만든 형상을 교안 정답과 비교해, 맞으면 교안 결과 곡선을, 틀리면 그만큼 어긋난 곡선을 보여 줍니다.</p>`, first ? [] : [{ label: '닫기', fn: closeDlg }], true);
  $('#modal').querySelectorAll('[data-open]').forEach(b => b.onclick = () => { closeDlg(); openProject(b.dataset.open, false); });
  $('#modal').querySelectorAll('[data-reset]').forEach(b => b.onclick = () => { closeDlg(); openProject(b.dataset.reset, true); });
}
function openProject(key, reset) {
  S = (!reset && loadSaved(key)) || blankState(key); undoStack = [];
  if (!S.custom) S.custom = {};
  U.sel = []; U.pick = null; U.mode = null; U.tabs = []; U.tab = '3D'; U.openStep = -1; U.missionTab = 'steps'; U.view = 'iso'; U.az = PJ().view.az; U.el = PJ().view.el; U.ffCut = null;
  setHint(''); $('#msglist').innerHTML = ''; $('#ttl').textContent = `${PJ().file} - CST Studio Suite 2025 - [Learning Edition]`;
  msg('info', `프로젝트 '${PJ().file}' 열림. 오른쪽 실습 단계를 따라 해 보세요.`);
  lastA = null; renderRibbon(); afterChange(false); fit();
}

/* ---------- 시작 ---------- */
window.addEventListener('resize', () => { resizeCanvas(); });
window.addEventListener('DOMContentLoaded', () => {
  initMouse(); renderRibbon();
  let last = null; try { last = localStorage.getItem('cstsim2:last'); } catch (e) { }
  resizeCanvas();
  if (last && PROJECTS[last]) openProject(last, false); else { openProject('monopole', false); projectPicker(true); }
  new ResizeObserver(() => resizeCanvas()).observe($('#vp'));
});
