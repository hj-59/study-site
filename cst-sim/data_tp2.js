'use strict';
/* 2026-2 텀프 과제 2: RHCP 소자 5×2 배열 + x 방향 0°·15°·30° 조향 (16.5 GHz). 형상 채점 + 배열인자 근사 */
(function () {
  const G = window.TPGEO, D = 7, MIR = ['m', 1, 1, 0, 0];
  const cells = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) cells.push({ c, r, x: c * D, y: r * D, k: r * 5 + c });
  const withTf = (parts, extra, suffix) => parts.map(p => ({ ...p, id: p.id + suffix, tf: [...(p.tf || []), ...extra] }));
  const tile = (parts, mirror) => cells.flatMap(cl => withTf(parts, [...(mirror ? [MIR] : []), ['t', cl.x, cl.y]], '@' + cl.k));
  const one = (parts, mirror) => withTf(parts, mirror ? [MIR] : [], '');
  const gnd = [G.sq('gnd'), G.C('ghole', G.fx, G.fy, 0.435, -1)];
  const KD = 360 * D * 16.5 / 299.792458; // 인접 소자 위상 지연 (deg), 138.7°
  const pFor = th => -KD * Math.sin(th * Math.PI / 180);

  const tp = PROJECTS.tp;
  PROJECTS.tp2 = {
    ...tp,
    key: 'tp2', file: 'TermProject_Array', short: '텀프 2: RHCP 5×2 배열·조향',
    paper: '2026-2 안테나공학 프로젝트 과제 · RHCP 소자 5×2 배열, x 방향 0° / 15° / 30° 조향 (16.5 GHz)',
    gradeOnly: true, array: { D, cells, KD, pFor },
    freq: [15, 19],
    bounds: { x0: -3.5, x1: 4 * D + 3.5, y0: -3.5, y1: D + 3.5 },
    view: { az: -24, el: 52 },
    ref: {
      subL: [tile([G.sq('subL')]), [G.sq('subL')]],
      subU: [tile([G.sq('subU')]), [G.sq('subU')]],
      gnd: [tile(gnd), gnd],
      rad: [tile(G.radParts(true), true), one(G.radParts(true), true), one(G.radParts(true), false)],
      par: [tile(G.parParts(true), true), one(G.parParts(true), true), one(G.parParts(true), false)],
      via: [tile(G.vias), G.vias]
    },
    coax: null,
    slides: [['h13', '배열 소자 번호'], ['h07', '단일 소자 조감도·상면도'], ['h09', '패치 상세 치수']],
    coord: '과제 1 정답 소자(LHCP)가 불러와져 있습니다. 소자 #1이 원점, 배열은 <b>+x로 5개, +y로 2줄</b> (간격 Wsub = 7 mm, 과제에 간격이 없어 셀 크기로 가정). #1~#5가 아랫줄, #6~#10이 윗줄.',
    mission: [
      { t: '비아를 하나로 합치기', how: '배열로 복사하기 전에 객체 수를 줄입니다. 트리에서 비아 48개를 <kbd>Shift</kbd>/<kbd>Ctrl</kbd>로 전부 선택 → <b>Boolean Add</b>. (실제 CST에서도 같이 해 두면 복사가 빨라집니다.)', ans: '비아 객체 1개', ok: A => A.count.via === 1 || A.iouV.via[0] > 0.95 },
      { t: 'RHCP로 바꾸기 (Mirror)', how: 'Rad와 Par만 선택 → <b>Transform → Mirror</b>. 대칭면 법선(Normal)을 <b>(1, 1)</b>로, 중심 (0, 0), Copy 해제. 급전점 F가 있는 U축을 기준으로 뒤집혀서 F 위치는 그대로입니다.', ans: boxHTML([['Operation', 'Mirror'], ['Normal X / Y', '1 / 1'], ['Center X / Y', '0 / 0'], ['Copy', '해제']]), ok: A => A.iouV.rad[1] > 0.95 && A.iouV.par[1] > 0.95 || A.iouV.rad[0] > 0.95 },
      { t: '가로 5개로 복사', how: '<kbd>Ctrl</kbd>+A 대신 트리에서 도형을 전부 선택 → <b>Transform → Translate</b>, X = <code>Wsub</code>, <b>Copy</b>, Repetition <b>4</b>.', ans: boxHTML([['Translate', 'X = Wsub, Y = 0'], ['Copy / Repetition', '✓ / 4']]), ok: A => A.cover('rad', [0, 1, 2, 3, 4].map(k => 'tab@' + k)) > 0.9 },
      { t: '두 줄로 복사', how: '다시 도형을 전부(5개 소자) 선택 → Translate, Y = <code>Wsub</code>, Copy, Repetition 1.', ans: boxHTML([['Translate', 'X = 0, Y = Wsub'], ['Copy / Repetition', '✓ / 1']]), ok: A => ['subL', 'subU', 'gnd', 'rad', 'par', 'via'].every(c => A.iouV[c][0] > 0.95) && A.coaxCount === 10 },
      { t: '포트도 10개로', how: '포트는 도형 복사에 따라오지 않습니다. 트리 <b>Ports → port1</b> 선택 → Transform Translate X = <code>Wsub</code>, Copy ×4 → 포트 5개 선택 → Y = <code>Wsub</code>, Copy ×1.', ans: '포트 10개, 각 동축 끝면 위', ok: A => A.portCells === 10 },
      { t: '16.5 GHz Farfield 모니터', how: '배열은 16.5 GHz 패턴만 필요합니다. 15~19 모니터가 이미 있으면 그대로 두어도 됩니다.', ans: boxHTML([['Frequency', '16.5']]), ok: A => S.monitors.some(f => Math.abs(f - 16.5) < 1e-6) },
      { t: '조향 위상 p 계산', how: '열(column)마다 위상을 p씩 늘립니다. p = −360° × (d/λ) × sin θ0, d = 7 mm, λ = 18.17 mm → 360·d/λ = 138.7°. Parameter List에 <code>p15</code>, <code>p30</code>을 등록해 두면 편합니다.', ans: boxHTML([['p (0°)', '0'], ['p15', `${pFor(15).toFixed(1)}`], ['p30', `${pFor(30).toFixed(1)}`]]), ok: A => A.excBy(0) || A.excBy(15) || A.excBy(30) },
      { t: 'Excitation: 0° (조향 없음)', how: '<b>Home → Setup Solver → Excitation List</b> → Simultaneous. 10개 포트 모두 Amplitude 1, Phase 0 → 이름 "Steer0"으로 저장.', ans: '모든 포트 위상 0', ok: A => A.excBy(0) },
      { t: 'Excitation: +15°', how: '같은 창에서 새 조합. 열 1~5(#1·#6, #2·#7, …)에 0, p15, 2*p15, 3*p15, 4*p15. 이름 "Steer15".', ans: boxHTML([['#1, #6', '0'], ['#2, #7', 'p15'], ['#3, #8', '2*p15'], ['#4, #9', '3*p15'], ['#5, #10', '4*p15']]), ok: A => A.excBy(15) },
      { t: 'Excitation: +30°', how: '같은 방법으로 p30. 이름 "Steer30".', ans: boxHTML([['#1, #6', '0'], ['#2, #7', 'p30'], ['#3, #8', '2*p30'], ['#4, #9', '3*p30'], ['#5, #10', '4*p30']]), ok: A => A.excBy(30) },
      { t: 'Start (형상 점검 + 배열인자 패턴)', how: '<b>Home → Start Simulation</b>. 형상 점검 보고서와 함께, 입력한 위상으로 계산한 배열인자 패턴(phi = 0°)이 열립니다. 최대점이 0° / 15° / 30°에 오는지 확인하세요. 실제 CST에서는 소자 간 결합 때문에 1~3° 어긋날 수 있어 p를 조금 조절합니다(교안 예제: 이론 −90° → −97°).', ans: '', ok: A => !!S.ran }
    ],
    extra(A, byCat) {
      const rep = tp.extra.call(this, A, byCat).filter(x => !/동축|심선|Radiating patch가 아직/.test(x[1]));
      const near = (a, b, t = 0.05) => Math.abs(a - b) < t;
      const at = (c, x, y, ro, ri, z0, z1, eps) => byCat(c).some(i => leaves(i.en).some(({ l }) => l.t === 'cyl' && near(l.c[0], x) && near(l.c[1], y) && near(l.ro, ro, 0.02) && near(l.ri, ri, 0.02) && near(l.z0, z0) && near(l.z1, z1)) && (eps == null || Math.abs(getMat(i.s.mat).eps - eps) < 0.15));
      A.coaxCount = cells.filter(cl => { const x = G.fx + cl.x, y = G.fy + cl.y; return at('coaxO', x, y, 0.635, 0.435, -1.5, 0) && at('pin', x, y, 0.13, 0, -1.5, 0.76) && at('coaxD', x, y, 0.435, 0.13, -1.5, 0, 2.1); }).length;
      A.coaxOk = A.coaxCount === 10;
      if (A.coaxCount < 10) rep.push(['err', `동축 세트가 ${A.coaxCount}/10 칸에만 있습니다.`]);
      // 포트
      const P = A.P, portAt = [];
      A.portCells = 0; A.portMap = {};
      S.ports.forEach((pt, i) => {
        let b; try { b = portBox(pt, P); } catch (e) { return; }
        if (pt.normal !== 'z' || pt.dir !== 1 || Math.abs(b.pos + 1.5) > 0.06) return;
        const cx = (b.u0 + b.u1) / 2 - G.fx, cy = (b.v0 + b.v1) / 2 - G.fy, col = Math.round(cx / D), row = Math.round(cy / D);
        if (col < 0 || col > 4 || row < 0 || row > 1) return;
        const X = G.fx + col * D, Y = G.fy + row * D;
        if (b.u0 <= X - 0.635 + 1e-6 && b.u1 >= X + 0.635 - 1e-6 && b.v0 <= Y - 0.635 + 1e-6 && b.v1 >= Y + 0.635 - 1e-6) A.portMap[i] = { col, row };
      });
      A.portCells = new Set(Object.values(A.portMap).map(m => m.row * 5 + m.col)).size;
      A.portOk = A.portCells === 10;
      if (A.portCells < 10) rep.push(['err', `동축 끝면을 제대로 덮는 포트(Normal Z, Positive)가 ${A.portCells}/10 칸에만 있습니다.`]);
      // 조향
      A.exc = (S.exc || []).map(e => excInfo(e, A));
      A.excBy = th => A.exc.some(x => x.ok && Math.abs(x.theta - th) <= 3);
      A.exc.forEach(x => rep.push([x.ok ? 'ok' : 'warn', `Excitation "${x.name}": ${x.ok ? `열 간 위상차 ${x.p.toFixed(1)}° → 배열인자 최대 방향 θ ≈ ${x.theta.toFixed(1)}°` : x.why}`]));
      return rep;
    }
  };

  // 여기 계산은 배열인자(소자 간 결합 무시)만 씁니다
  window.excInfo = function (e, A) {
    const out = { name: e.name, ok: false };
    const cols = {};
    let bad = null;
    S.ports.forEach((pt, i) => {
      const m = A.portMap[i], ph = e.ph[i];
      if (!m) return;
      if (!e.on[i]) { bad = bad || `port ${i + 1}이 빠져 있습니다`; return; }
      let v; try { v = ev(ph, A.P); } catch (err) { bad = `port ${i + 1} 위상 오류: ${err.message}`; return; }
      (cols[m.col] = cols[m.col] || []).push(v);
    });
    if (bad) { out.why = bad; return out; }
    if (Object.keys(A.portMap).length < 10) { out.why = '포트가 10개 다 준비되지 않았습니다'; return out; }
    const colPh = [];
    for (let c = 0; c < 5; c++) { const a = cols[c] || []; if (a.length < 2) { out.why = `${c + 1}열 포트가 2개가 아닙니다`; return out; } if (Math.abs(a[0] - a[1]) > 1) { out.why = `${c + 1}열 두 포트(#${c + 1}, #${c + 6})의 위상이 다릅니다`; return out; } colPh.push(a[0]); }
    const d = []; for (let c = 1; c < 5; c++) d.push(colPh[c] - colPh[c - 1]);
    const p = d.reduce((s, v) => s + v, 0) / 4;
    if (d.some(v => Math.abs(v - p) > 1)) { out.why = '열마다 위상이 같은 간격(p, 2p, 3p…)으로 늘지 않습니다'; return out; }
    const sn = -p / KD;
    if (Math.abs(sn) > 1) { out.why = 'p가 너무 커서 빔 방향을 만들 수 없습니다'; return out; }
    out.p = p; out.theta = Math.asin(sn) * 180 / Math.PI; out.colPh = colPh; out.ok = true;
    if (out.theta < -0.5) out.note = '빔이 −x 쪽으로 갑니다. 부호를 확인하세요 (교안: 음수 p → +x 방향).';
    return out;
  };
})();
