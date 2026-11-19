'use strict';
/* 2026-2 텀프 단일 소자 (적층 패치, 동축 급전, VVG). 사용자 파라미터 이름 그대로. 형상 채점 전용 */
(function () {
  const W4 = 4.28, W2 = 0.84, l1 = 0.86, l2 = 0.18, l3 = 2.56, l4 = 2.20, W5 = 0.59, W6 = 0.76, W7 = 1.80, Wr = 1.35, Wp = 3.80, Wpc = 0.69;
  const Wk = Math.sqrt(W2 * W2 + l1 * l1), th = Math.atan(l1 / W2) * 180 / Math.PI, R = W4 / 2, Pp = Wp / 2;
  const Fu = 2.40, fx = Fu / Math.SQRT2, fy = -Fu / Math.SQRT2;
  const T = (id, x0, x1, y0, y1, tf, s) => ({ id, x0, x1, y0, y1, tf, s });
  const C = (id, x, y, r, s) => ({ id, circ: [x, y, r], s });
  // 패치를 똑바로 그렸을 때 (중간 단계)와 −45° 돌린 뒤(최종) 두 가지
  const radParts = rot => {
    const g = rot ? [[-45, 0, 0]] : [];
    return [
      T('body', -R, R, -R, R, g, 1), T('tab', R, R + W6, -l4 / 2, l4 / 2, g, 1),
      T('s1', R - W5, R, l4 / 2, l3 / 2, g, -1), T('s2', R - W5, R, -l3 / 2, -l4 / 2, g, -1),
      T('hole', -Wr / 2, Wr / 2, -Wr / 2, Wr / 2, g, -1),
      T('ch1', R - W2, R - W2 + Wk, R, R + 0.5, [[-th, R - W2, R], ...g], -1),
      T('ch2', -R, -R + W7 * Math.SQRT2, -R + W7 - 0.5, -R + W7, [[-45, -R, -R + W7], ...g], -1)
    ];
  };
  const parParts = rot => {
    const g = rot ? [[-45, 0, 0]] : [];
    const cut = [[-45, Pp - Wpc, Pp]];
    return [
      T('pbody', -Pp, Pp, -Pp, Pp, g, 1),
      T('pch1', Pp - Wpc, Pp - Wpc + Wpc * Math.SQRT2, Pp, Pp + 0.5, [...cut, ...g], -1),
      T('pch2', Pp - Wpc, Pp - Wpc + Wpc * Math.SQRT2, Pp, Pp + 0.5, [...cut, [180, 0, 0], ...g], -1)
    ];
  };
  const vias = []; const p = 0.54, o = 6 * p;
  for (let i = 0; i < 13; i++) { vias.push(C('v' + vias.length, -o + i * p, o, 0.15, 1)); vias.push(C('v' + vias.length, -o + i * p, -o, 0.15, 1)); }
  for (let i = 1; i < 12; i++) { vias.push(C('v' + vias.length, o, -o + i * p, 0.15, 1)); vias.push(C('v' + vias.length, -o, -o + i * p, 0.15, 1)); }
  const sq = id => T(id, -3.5, 3.5, -3.5, 3.5, [], 1);

  const B2 = (name, x0, x1, y0, y1, z0, z1, mat) => brickAns(name, x0, x1, y0, y1, z0, z1, mat);
  const rotTbl = (a, cx, cy, copy) => boxHTML([['Operation', 'Rotate (Z축)'], ['Angle', a], ['Center X / Y', cx + ' / ' + cy], ['Copy', copy ? '✓ (Repetition 1)' : '해제']]);

  PROJECTS.tp = {
    key: 'tp', file: 'TermProject_Element', short: '텀프: 적층 패치 단일 소자',
    paper: '2026-2 안테나공학 프로젝트 과제 · 단일 소자 (LHCP, 15–19 GHz)',
    gradeOnly: true,
    params: [['W4', 4.28, 'radiating 한 변'], ['W1', 3.44, '윗변 ~ 모따기 시작 (확인용)'], ['W2', 0.84, '오른쪽 위 모따기 가로'], ['l1', 0.86, '오른쪽 위 모따기 세로'], ['Wk', 'sqrt(W2^2+l1^2)', '모따기 빗변 길이'],
      ['l2', 0.18, '슬롯 폭'], ['l3', 2.56, '슬롯 바깥 간격'], ['l4', 2.20, '탭 높이 (슬롯 안쪽 간격)'], ['W5', 0.59, '슬롯 길이'], ['W6', 0.76, '탭 길이'],
      ['l5', 0.18, '아래 슬롯 폭 (확인용)'], ['l6', 0.86, '오른쪽 아래 블록 높이 (확인용)'], ['W7', 1.80, '왼쪽 아래 모따기'], ['Wr', 1.35, '가운데 구멍'],
      ['Wp', 3.80, 'parasitic 한 변'], ['Wpc', 0.69, 'parasitic 모따기'],
      ['Wsub', 7, '기판(셀) 한 변'], ['h', 0.76, 'TLY-5 한 장 두께'],
      ['Fu', 2.40, '급전점 F의 U 좌표'], ['fx', 'Fu/sqrt(2)', 'F의 x (회전 후)'], ['fy', '-Fu/sqrt(2)', 'F의 y (회전 후)'],
      ['r_pin', 0.13, '동축 심선 반지름'], ['r_d', 0.435, '동축 유전체 반지름'], ['r_o', 0.635, '동축 외도체 반지름'], ['lc', 1.5, '동축 길이'],
      ['via_r', 0.15, 'VVG 비아 반지름'], ['via_p', 0.54, 'VVG 비아 간격']],
    freq: [15, 19],
    z: { bot: 0, top: 1.52 },
    fitZ: [-1.5, 1.52],
    view: { az: -30, el: 48 },
    bounds: { x0: -3.5, x1: 3.5, y0: -3.5, y1: 3.5 },
    sub: { matHint: 'TLY-5 (εr 2.2, lossy) 두 장' },
    spec: {
      subL: { kind: 'diel', z: [0, 0.76] }, subU: { kind: 'diel', z: [0.76, 1.52] },
      gnd: { kind: 'metal', z: [0, 0] }, rad: { kind: 'metal', z: [0.76, 0.76] }, par: { kind: 'metal', z: [1.52, 1.52] },
      via: { kind: 'metal', cyl: true, z: [0, 1.52] }, coaxO: { kind: 'metal', cyl: true, z: [-1.5, 0] }, pin: { kind: 'metal', cyl: true, z: [-1.5, 0.76] }, coaxD: { kind: 'diel', z: [-1.5, 0] }
    },
    cats: ['subL', 'subU', 'gnd', 'rad', 'par', 'via'],
    catName: { subL: '아래 기판', subU: '위 기판', gnd: '그라운드(+동축 구멍)', rad: 'Radiating patch', par: 'Parasitic patch', via: 'VVG 비아 48개' },
    ref: {
      subL: [[sq('subL')]], subU: [[sq('subU')]],
      gnd: [[sq('gnd'), C('ghole', fx, fy, 0.435, -1)]],
      rad: [radParts(true), radParts(false)],
      par: [parParts(true), parParts(false)],
      via: [vias]
    },
    coax: { x: fx, y: fy },
    port: { axis: 'z', pos: -1.5, dir: 1, span: [fx - 0.635, fx + 0.635], z: [fy - 0.635, fy + 0.635], noSize: true, posMsg: '동축 끝면(z = −lc)', spanMsg: '포트가 동축 외도체 지름(X)을 다 덮지 않습니다.', vMsg: '포트가 동축 외도체 지름(Y)을 다 덮지 않습니다.' },
    tpl: { theta: 0, phi: 0, note: 'Theta 0, Phi 0 (정면)' },
    pattern: 'dra', radEff: 0, mainCat: 'rad',
    slides: [['h07', '조감도·상면도'], ['h08', '측면도·분해도'], ['h09', '패치 상세 치수'], ['h10', '기판 규격'], ['h11', '동축·VVG 규격'], ['h12', '동축 급전 위치']],
    coord: '전역 원점 = 셀 중심 O. 그라운드 z = 0, 아래 기판 0 ~ h, radiating patch z = h, 위 기판 h ~ 2h, parasitic z = 2h, 동축은 z = −lc ~ 0. <b>패치는 먼저 똑바로(U = x, V = y) 그리고 마지막에 두 패치를 같이 −45° 돌립니다.</b>',
    mission: [
      { t: '주파수 범위', how: '<b>Simulation → Frequency</b>. 보고서 범위(15–19)보다 조금 넓게.', ans: boxHTML([['Fmin / Fmax', '14 / 20']]), ok: A => A.freqOk },
      { t: '파라미터 등록', how: '노트에 정한 이름 그대로 등록. <code>Wk</code>는 수식 <code>sqrt(W2^2+l1^2)</code>, <code>fx</code>는 <code>Fu/sqrt(2)</code>, <code>fy</code>는 <code>-Fu/sqrt(2)</code>.', ans: '논문 정보 탭의 표', ok: A => A.paramsOk, fill: true },
      { t: '재질 2개', how: '<b>Material Library</b>에서 "TLY" 검색 → Taconic TLY-5 (lossy). 같은 방법으로 "PTFE" → PTFE (lossy) (동축 유전체).', ans: boxHTML([['기판', 'Taconic TLY-5 (lossy), εr 2.2'], ['동축 유전체', 'PTFE (lossy), εr 2.1']]), ok: A => A.hasMat(2.2) && A.hasMat(2.1) },
      { t: '기판 2장', how: 'Brick 두 개. 이름 Sub_Lower, Sub_Upper.', ans: B2('Sub_Lower', '-Wsub/2', 'Wsub/2', '-Wsub/2', 'Wsub/2', '0', 'h', 'TLY-5') + B2('Sub_Upper', '-Wsub/2', 'Wsub/2', '-Wsub/2', 'Wsub/2', 'h', '2*h', 'TLY-5'), ok: A => A.iou.subL > 0.95 && A.iou.subU > 0.95 && A.subOk },
      { t: '그라운드 + 동축 구멍', how: '그라운드 Brick(두께 0) → Cylinder로 구멍 도구를 만들고 <b>Ground 먼저 선택 → Boolean Subtract</b>.', ans: B2('Ground', '-Wsub/2', 'Wsub/2', '-Wsub/2', 'Wsub/2', '0', '0', 'PEC') + boxHTML([['Cylinder GndHole', 'Outer r_d, Inner 0, 중심 fx / fy, Z −0.1 ~ 0.1']]), ok: A => A.iou.gnd > 0.97 && A.empty('gnd', ['ghole']) > 0.9 },
      { t: '동축 3개', how: 'Cylinder 세 개, 모두 중심 (<code>fx</code>, <code>fy</code>). 실제 CST에서는 Pin을 만들 때 기판과 겹친다는 창이 뜨면 <b>Insert</b>를 고르세요(연습판은 생략).', ans: boxHTML([['Coax_Outer (PEC)', 'Outer r_o, Inner r_d, Z −lc ~ 0'], ['Coax_Diel (PTFE)', 'Outer r_d, Inner r_pin, Z −lc ~ 0'], ['Pin (PEC)', 'Outer r_pin, Inner 0, Z −lc ~ h']]), ok: A => A.coaxOk },
      { t: 'Radiating: 몸통 + 탭', how: '패치는 <b>똑바로</b> z = h에 그립니다. 두 Brick을 그리고 몸통 먼저 선택 → <b>Boolean Add</b>.', ans: B2('Rad', '-W4/2', 'W4/2', '-W4/2', 'W4/2', 'h', 'h', 'PEC') + B2('Tab', 'W4/2', 'W4/2+W6', '-l4/2', 'l4/2', 'h', 'h', 'PEC'), ok: A => A.cover('rad', ['body']) > 0.7 && A.cover('rad', ['tab']) > 0.9 },
      { t: '슬롯 2개 + 가운데 구멍 빼기', how: '세 Brick을 그리고 Rad 먼저 선택 → <b>Boolean Subtract</b> → 셋 다 클릭 → <kbd>Enter</kbd>.', ans: B2('Slot1', 'W4/2-W5', 'W4/2', 'l4/2', 'l3/2', 'h', 'h', 'PEC') + B2('Slot2', 'W4/2-W5', 'W4/2', '-l3/2', '-l4/2', 'h', 'h', 'PEC') + B2('Hole', '-Wr/2', 'Wr/2', '-Wr/2', 'Wr/2', 'h', 'h', 'PEC'), ok: A => A.empty('rad', ['s1', 's2', 'hole']) > 0.9 },
      { t: '모따기 2개 (돌린 Brick으로 자르기)', how: '자를 Brick을 그리고 → <b>Transform → Rotate</b>로 A점 중심으로 돌려 아랫변을 빗변에 맞춘 뒤 → Rad에서 <b>Subtract</b>. Preview로 빗변에 딱 맞는지 확인.', ans: B2('Cut1', 'W4/2-W2', 'W4/2-W2+Wk', 'W4/2', 'W4/2+0.5', 'h', 'h', 'PEC') + rotTbl('-atn(l1/W2)*180/pi', 'W4/2-W2', 'W4/2', false) + B2('Cut2', '-W4/2', '-W4/2+W7*sqrt(2)', '-W4/2+W7-0.5', '-W4/2+W7', 'h', 'h', 'PEC') + rotTbl('-45', '-W4/2', '-W4/2+W7', false), ok: A => A.empty('rad', ['ch1', 'ch2']) > 0.85 },
      { t: 'Parasitic patch', how: 'z = 2h에 정사각형. 오른쪽 위 자를 Brick을 −45° 돌린 뒤, 그 Brick을 <b>Rotate 180° (Copy)</b> 해서 왼쪽 아래 것을 만들고, 둘 다 Subtract. (90°나 Mirror가 아니라 180°)', ans: B2('Par', '-Wp/2', 'Wp/2', '-Wp/2', 'Wp/2', '2*h', '2*h', 'PEC') + B2('PCut1', 'Wp/2-Wpc', 'Wp/2-Wpc+Wpc*sqrt(2)', 'Wp/2', 'Wp/2+0.5', '2*h', '2*h', 'PEC') + rotTbl('-45', 'Wp/2-Wpc', 'Wp/2', false) + rotTbl('180', '0', '0', true), ok: A => A.cover('par', ['pbody']) > 0.85 && A.empty('par', ['pch1', 'pch2']) > 0.9 },
      { t: '두 패치 −45° 회전', how: 'Rad와 Par를 <kbd>Ctrl</kbd>+클릭으로 같이 선택 → <b>Transform → Rotate</b>. 이게 도면의 "Local 좌표계 −45°". 돌린 뒤 탭이 동축(F) 위에 와야 합니다.', ans: rotTbl('-45', '0', '0', false), ok: A => A.iouV.rad[0] > 0.95 && A.iouV.par[0] > 0.95 },
      { t: 'VVG 비아 48개', how: '비아 하나 → <b>Translate Copy</b>로 윗줄 13개 → 아랫줄로 복사 → 왼쪽 열 11개 → 오른쪽 열로 복사. 실제 CST에서는 비아를 Add로 합친 뒤 두 기판에 <b>Insert</b>.', ans: boxHTML([['첫 비아', 'Cylinder Outer via_r, 중심 (−6*via_p, 6*via_p), Z 0 ~ 2*h, PEC'], ['윗줄', 'Translate X = via_p, Copy, Repetition 12'], ['아랫줄', '13개 선택 → Y = −12*via_p, Copy'], ['왼쪽 열', '중심 (−6*via_p, 5*via_p)에 하나 → Y = −via_p, Repetition 10'], ['오른쪽 열', '11개 선택 → X = 12*via_p, Copy']]), ok: A => A.iou.via > 0.95 },
      { t: 'Waveguide Port (동축 끝)', how: '<b>Simulation → Waveguide Port</b>, Normal <b>Z</b>, Orientation <b>Positive</b>(+z, 안테나 쪽), 동축 끝면 전체를 덮게. (실제 CST에선 Pick Face로 동축 바닥을 집어도 됨)', ans: boxHTML([['Normal / Orientation', 'Z / Positive'], ['X', 'fx-r_o ~ fx+r_o'], ['Y', 'fy-r_o ~ fy+r_o'], ['Zpos', '-lc']]), ok: A => A.portOk },
      { t: 'Farfield 모니터', how: '15 ~ 19, Step 0.5 → 9개 (16.5, 17, 17.5 포함).', ans: boxHTML([['Frequency', '15 ~ 19, step 0.5']]), ok: A => A.monCount >= 9 },
      { t: 'Start (형상 점검)', how: '<b>Home → Start Simulation</b>. 연습판은 결과 그래프 없이 형상 점검 보고서만 Messages에 띄웁니다. 실제 결과는 CST에서.', ans: '', ok: A => !!S.ran }
    ],
    extra(A, byCat) {
      const mats = c => byCat(c).map(i => getMat(i.s.mat));
      const okSub = c => { const m = mats(c); return m.length > 0 && m.every(x => Math.abs(x.eps - 2.2) < 0.15 && x.tand > 0); };
      A.subOk = okSub('subL') && okSub('subU');
      const near = (a, b, t = 0.05) => Math.abs(a - b) < t;
      const atF = (c, ro, ri, z0, z1) => byCat(c).some(i => { const l = leaves(i.en)[0].l; return l.t === 'cyl' && near(l.c[0], fx) && near(l.c[1], fy) && near(l.ro, ro, 0.02) && near(l.ri, ri, 0.02) && near(i.bb.z0, z0) && near(i.bb.z1, z1); });
      A.outerOk = atF('coaxO', 0.635, 0.435, -1.5, 0);
      A.pinOk = atF('pin', 0.13, 0, -1.5, 0.76);
      A.dielOk = byCat('coaxD').some(i => { const l = leaves(i.en)[0].l; return l.t === 'cyl' && near(l.c[0], fx) && near(l.c[1], fy) && near(l.ro, 0.435, 0.02) && near(l.ri, 0.13, 0.02) && Math.abs(getMat(i.s.mat).eps - 2.1) < 0.15; });
      A.coaxOk = A.outerOk && A.pinOk && A.dielOk;
      const rep = [];
      if (!A.subOk) rep.push(['err', '기판 2장의 재질이 TLY-5 (lossy, εr 2.2)가 아니거나 기판이 없습니다.']);
      if (!A.outerOk) rep.push(['err', '동축 외도체가 없거나 위치·반지름이 틀립니다 (r_o, 안쪽 r_d, z −lc ~ 0, 중심 F).']);
      if (!A.dielOk) rep.push(['err', '동축 유전체(PTFE, r_d, 안쪽 r_pin)가 없거나 틀립니다.']);
      if (!A.pinOk) rep.push(['err', '심선(Pin)이 없거나 z 범위가 틀립니다 (−lc ~ h, radiating patch까지).']);
      if (A.iouV.rad[1] > A.iouV.rad[0] && A.iouV.rad[1] > 0.9) rep.push(['warn', 'Radiating patch가 아직 똑바로 있습니다. 마지막에 −45° 회전하세요.']);
      return rep;
    }
  };
  window.TPGEO = { radParts, parParts, vias, sq, C, T, fx, fy, B2, rotTbl };
})();
