'use strict';
/* 세 예제의 정답 형상, 교안 결과 곡선(슬라이드에서 읽은 근사값), 실습 단계 정의 */
const B = (id, x0, x1, y0, y1, rot) => ({ id, x0, x1, y0, y1, rot: rot || 0, s: 1 });
const H = (id, x0, x1, y0, y1, rot) => ({ id, x0, x1, y0, y1, rot: rot || 0, s: -1 });

function boxHTML(rows) {
  // rows: [label, value]
  return '<table class="ans">' + rows.map(r => `<tr><th>${r[0]}</th><td><code>${r[1]}</code></td></tr>`).join('') + '</table>';
}
function brickAns(name, x0, x1, y0, y1, z0, z1, mat) {
  return boxHTML([['Name', name], ['Xmin / Xmax', x0 + ' / ' + x1], ['Ymin / Ymax', y0 + ' / ' + y1], ['Zmin / Zmax', z0 + ' / ' + z1], ['Material', mat]]);
}

const PROJECTS = {
  monopole: {
    key: 'monopole',
    file: 'monopole',
    short: '트리플밴드 모노폴',
    paper: 'A Compact Triple-Band Printed Monopole Antenna for WLAN/WiMAX Applications',
    params: [['L1', 34, '기판 길이'], ['L2', 13.4, '급전선 길이'], ['L3', 3, '넓은 급전부 길이'], ['L4', 17, '루프 높이'], ['L5', 9, '가운데 기둥 길이'], ['L6', 4.4, '루프 아래변 ~ 가로대'], ['L7', 2, '양쪽 팔 길이'], ['L8', 1.2, '그라운드 슬롯 높이'], ['Ls', 8.7, '그라운드 길이'], ['Ld', 6.3, '슬롯 위치'], ['W1', 18, '기판 폭'], ['W2', 3, '급전선 폭'], ['W3', 4, '넓은 급전부 폭'], ['W4', 15.5, '루프 바깥 폭'], ['W5', 1.4, '가운데 기둥 폭'], ['W6', 1.8, '기둥 ~ 팔 간격'], ['W7', 1, '팔·가로대 폭'], ['W8', 8.2, '슬롯 폭'], ['h', 1.6, '기판 두께'], ['a', 1, '루프 선폭']],
    freq: [2, 6.5],
    z: { bot: 0, top: 1.6 },
    view: { az: -32, el: 52 },
    sub: { eps: 4.3, lossy: true, z0: 0, z1: 1.6, matHint: 'FR-4 (lossy)' },
    cats: ['sub', 'top', 'bot'],
    catName: { sub: '기판', top: '앞면 금속 패턴', bot: '뒷면 그라운드' },
    ref: {
      sub: [[B('sub', -9, 9, 0, 34)]],
      bot: [[B('gnd', -9, 9, 0, 8.7), H('slot', -4.1, 4.1, 6.3, 7.5)]],
      top: [[B('feed', -1.5, 1.5, 0, 13.4), B('step', -2, 2, 13.4, 16.4), B('loopB', -7.75, 7.75, 16.4, 17.4), B('loopR', 6.75, 7.75, 16.4, 33.4), B('loopL', -7.75, -6.75, 16.4, 33.4), B('loopT', -7.75, 7.75, 32.4, 33.4), B('stem', -0.7, 0.7, 17.4, 26.4), B('bar', -3.5, 3.5, 21.8, 22.8), B('armR', 2.5, 3.5, 22.8, 24.8), B('armL', -3.5, -2.5, 22.8, 24.8)]]
    },
    port: { axis: 'y', pos: 0, dir: 1, span: [-1.5, 1.5], z: [0, 1.6], feedW: 3 },
    mainCat: 'top',
    radEff: -0.99,
    pattern: 'monopole',
    tpl: { theta: 90, phi: 0, note: 'Theta 90, Phi 0 (기판 정면 방향)' },
    ffCut: 'Phi=0',
    s11: [[2, -3.5], [2.1, -5], [2.2, -7.2], [2.3, -10.5], [2.38, -14.5], [2.42, -17], [2.46, -15.5], [2.55, -11], [2.7, -6], [2.85, -2.5], [3.0, -0.6], [3.07, -0.1], [3.15, -0.8], [3.25, -4], [3.33, -9], [3.4, -12.5], [3.43, -13.5], [3.47, -13], [3.55, -11], [3.65, -9.5], [3.8, -7.8], [4.0, -7.1], [4.3, -6.8], [4.6, -6.9], [4.9, -7.6], [5.1, -9], [5.25, -11.5], [5.4, -16], [5.5, -22], [5.59, -31.5], [5.65, -25], [5.75, -18], [5.9, -13], [6.1, -9.5], [6.3, -7], [6.5, -5.6]],
    gain: [[2, -0.8], [2.25, 1.95], [2.5, 2.45], [2.75, 1.1], [3, -4], [3.25, 0.4], [3.5, 1.8], [3.75, 1.7], [4, 1.6], [4.25, 1.65], [4.5, 1.85], [4.75, 2.25], [5, 2.8], [5.25, 3.45], [5.5, 4.3], [5.75, 4.7], [6, 3.9], [6.25, 2.4], [6.5, 2.0]],
    slides: [['s245', '논문 구조와 파라미터 표'], ['s246', '기판·그라운드 → 슬롯 → Subtract'], ['s247', '스트립 모델링'], ['s248', '루프: Translate(copy) & Mirror'], ['s249', '밴드 소자'], ['s250', '밴드 소자 → Add All'], ['s251', 'Field monitor + Port'], ['s252', 'S11: 공진 3개'], ['s253', 'Realized Gain'], ['s254', '3D 방사패턴 (5.75 GHz)']],
    coord: '교안은 안테나를 y–z 평면에 세웠지만, 이 연습판은 보기 쉽게 <b>x–y 평면에 눕혀서</b> 그립니다. 논문의 폭(W) 방향 = x, 길이(L) 방향 = y, 두께 = z. 기판 아래면 z = 0, 윗면 z = h.'
  },

  dra: {
    key: 'dra',
    file: 'cp_dra',
    short: 'CP 유전체 공진기(DRA)',
    paper: 'A Singly Fed Wideband Circularly Polarized Dielectric Resonator Antenna',
    params: [['g', 76, '기판·그라운드 한 변'], ['t', 0.8, '기판 두께'], ['a', 28, 'DR 한 변'], ['d', 19, 'DR 높이'], ['l', 42, '금속판 길이'], ['h', 19, '금속판 높이'], ['w', 6, '금속판 두께'], ['dx', 15, '금속판 중심 x'], ['dy', 26, '금속판 중심 y'], ['ls1', 18, '슬롯1 길이'], ['ls2', 33, '슬롯2 길이'], ['ws', 2, '슬롯 폭'], ['wm1', 1.8, '마이크로스트립 폭1'], ['wm2', 0.6, '마이크로스트립 폭2'], ['lm1', 23, '마이크로스트립 길이1'], ['lm2', 23, '마이크로스트립 길이2']],
    freq: [2, 3.8],
    z: { bot: -0.8, top: 0 },
    view: { az: -30, el: 40 },
    sub: { eps: 3.38, lossy: true, z0: -0.8, z1: 0, matHint: 'Rogers RO4003C (lossy), εr 3.38' },
    dr: { eps: 10, z0: 0, z1: 19 },
    tall: { z0: 0, z1: 19 },
    cats: ['sub', 'top', 'bot', 'tall', 'dr'],
    catName: { sub: '기판', top: '그라운드(+십자 슬롯)', bot: '뒷면 마이크로스트립', tall: '금속판 4개', dr: '유전체 공진기(DR)' },
    ref: {
      sub: [[B('sub', -38, 38, -38, 38)]],
      dr: [[B('dr', -14, 14, -14, 14)]],
      tall: [[B('p0', -6, 36, 23, 29), B('p1', -6, 36, 23, 29, 90), B('p2', -6, 36, 23, 29, 180), B('p3', -6, 36, 23, 29, 270)]],
      top: [
        [B('gnd', -38, 38, -38, 38), H('s1', -9, 9, -1, 1, 45), H('s2', -1, 1, -16.5, 16.5, 45)],
        [B('gnd', -38, 38, -38, 38), H('s1', -9, 9, -1, 1, -45), H('s2', -1, 1, -16.5, 16.5, -45)]
      ],
      bot: [[B('ms1', -38, -15, -0.9, 0.9), B('ms2', -15, 8, -0.3, 0.3)]]
    },
    port: { axis: 'x', pos: -38, dir: 1, span: [-0.9, 0.9], z: [-0.8, 0], feedW: 1.8 },
    mainCat: 'dr',
    radEff: -0.04,
    pattern: 'dra',
    tpl: { theta: 0, phi: 0, note: 'Theta 0, Phi 0 (정면 +z 방향)' },
    ffCut: 'Phi=0',
    s11: [[2, -4.5], [2.05, -5.6], [2.1, -7], [2.15, -9], [2.2, -11], [2.25, -12.5], [2.3, -13.2], [2.35, -13.4], [2.4, -13], [2.43, -12.8], [2.45, -14.5], [2.47, -17], [2.5, -15], [2.55, -14.2], [2.6, -14], [2.7, -14], [2.8, -14.3], [2.9, -14.7], [3.0, -15], [3.1, -15.6], [3.15, -16.5], [3.2, -19], [3.25, -23], [3.31, -32], [3.35, -24], [3.4, -16], [3.45, -12], [3.5, -9], [3.6, -5.2], [3.7, -2.6], [3.8, -0.6]],
    gain: [[2, 2.7], [2.1, 4.1], [2.2, 4.85], [2.3, 5.1], [2.4, 5.1], [2.5, 5.1], [2.6, 5.1], [2.7, 5.15], [2.8, 5.15], [2.9, 5.2], [3.0, 5.2], [3.1, 5.2], [3.2, 5.1], [3.3, 4.7], [3.4, 4.0], [3.5, 2.8], [3.6, 1.0], [3.7, -2], [3.8, -9]],
    ar: [[2, 11.8], [2.1, 7.5], [2.2, 4], [2.3, 2], [2.4, 1.6], [2.5, 1.6], [2.6, 1.5], [2.7, 1.6], [2.8, 2], [2.9, 2.3], [3.0, 2.4], [3.1, 2.25], [3.2, 2.15], [3.3, 2.15], [3.4, 1.8], [3.5, 1.3], [3.6, 1.5], [3.7, 2.6], [3.8, 12.8]],
    slides: [['s256', '구조와 파라미터 표'], ['s257', '구성: DR + 금속판 4개 + 그라운드(십자 슬롯) + 기판'], ['s258', 'DR·기판 모델링'], ['s259', '파라미터 & 금속판'], ['s260', 'Transform & copy 금속판'], ['s261', '그라운드 + 슬롯 2개'], ['s262', '슬롯 Add → Rotate → Subtract, 마이크로스트립'], ['s263', '앞면·뒷면'], ['s264', 'Port 설정'], ['s265', 'S11'], ['s266', '3D 방사패턴'], ['s268', 'Axial Ratio ≤ 3 dB 구간'], ['s269', 'Realized Gain'], ['s271', 'LHCP / RHCP (2.3 GHz)']],
    coord: '교안과 같은 좌표계입니다. 그라운드 = z 0 평면, 기판은 그 아래 z = −t ~ 0, DR과 금속판은 그라운드 위 z = 0부터. 마이크로스트립은 기판 아래면 z = −t.'
  },

  yagi: {
    key: 'yagi',
    file: 'quasi_yagi',
    short: 'Quasi-Yagi (더블 다이폴)',
    paper: 'Bandwidth Enhancement of Double-Dipole Quasi-Yagi Antenna Using Stepped Slotline Structure',
    params: [['ds1', 8, 'D2 ~ 디렉터1 간격'], ['ds2', 12, '디렉터1 ~ 디렉터2 간격'], ['h', 1.6, '기판 두께'], ['L', 90, '기판 폭'], ['l1', 72, '다이폴1 길이'], ['l2', 61.2, '다이폴2 길이'], ['ld1', 24, '디렉터1 길이'], ['ld2', 24, '디렉터2 길이'], ['lg', 90, '그라운드 폭'], ['s1', 36, '그라운드 ~ 다이폴1'], ['s2', 32.4, '다이폴1 ~ 다이폴2'], ['W', 140, '기판 길이'], ['w1', 7.5, '다이폴1 폭'], ['w2', 7.5, '다이폴2 폭'], ['wcps', 20, 'CPS(가운데 기둥) 폭'], ['wd1', 10, '디렉터1 폭'], ['wd2', 5, '디렉터2 폭'], ['wf', 3, '마이크로스트립 폭'], ['wg', 15, '그라운드 길이'], ['ws1', 0.7, '좁은 슬롯 폭'], ['ws2', 6.7, '넓은 슬롯 폭'], ['xf', 5, '마이크로스트립 x 위치'], ['yf', 23, '(논문 표 값)'], ['v_x', 1.5, 'Via x'], ['v_y', 39.5, 'Via y'], ['r', 0.1, 'Via 반지름']],
    freq: [1.5, 4.5],
    z: { bot: 0, top: 1.6 },
    view: { az: -28, el: 55 },
    sub: { eps: 4.3, lossy: true, z0: 0, z1: 1.6, matHint: 'FR-4 (lossy)' },
    cats: ['sub', 'top', 'bot'],
    catName: { sub: '기판', top: '앞면 (그라운드·CPS·다이폴·디렉터)', bot: '뒷면 마이크로스트립', via: 'Via' },
    via: { x: 1.5, y: 39.5, r: 0.1, z0: 0, z1: 1.6 },
    ref: {
      sub: [[B('sub', -45, 45, 0, 140)]],
      top: [[B('gnd', -45, 45, 0, 15), B('stem', -10, 10, 15, 98.4), B('dip1', -36, 36, 51, 58.5), B('dip2', -30.6, 30.6, 90.9, 98.4), B('dir1', -12, 12, 106.4, 116.4), B('dir2', -12, 12, 128.4, 133.4), H('slotW', -3.35, 3.35, 58.5, 98.4), H('slotN', -0.35, 0.35, 15, 58.5)]],
      bot: [[B('msV', 3.5, 6.5, 0, 41), B('msH', 0.5, 6.5, 38, 41)]]
    },
    port: { axis: 'y', pos: 0, dir: 1, span: [3.5, 6.5], z: [0, 1.6], feedW: 3 },
    mainCat: 'top',
    radEff: -0.55,
    pattern: 'yagi',
    tpl: { theta: 90, phi: 90, note: 'Theta 90, Phi 90 (+y 엔드파이어 방향)' },
    ffCut: 'Theta=90',
    vswr: [[1.5, 4.8], [1.53, 3.0], [1.57, 1.6], [1.6, 1.1], [1.65, 1.3], [1.7, 1.6], [1.8, 1.9], [1.9, 2.0], [2.1, 1.95], [2.4, 1.72], [2.7, 1.5], [2.9, 1.32], [3.0, 1.27], [3.1, 1.35], [3.2, 1.6], [3.3, 1.8], [3.4, 1.55], [3.5, 1.1], [3.55, 1.05], [3.62, 1.6], [3.68, 1.9], [3.75, 1.5], [3.85, 1.02], [3.92, 1.6], [4.0, 2.2], [4.1, 2.7], [4.2, 2.8], [4.3, 2.75], [4.4, 2.2], [4.5, 2.35]],
    gain: [[1.5, 1.0], [1.6, 6.6], [1.8, 6.9], [2.0, 6.2], [2.1, 5.95], [2.4, 5.95], [2.5, 6.15], [2.7, 6.7], [3.0, 7.5], [3.3, 7.85], [3.5, 7.8], [3.6, 8.55], [3.9, 3.5], [4.0, 2.1], [4.2, 2.25], [4.5, 4.3]],
    slides: [['s275', '구조와 파라미터 표'], ['s276', '기판 → 그라운드·Solid1 → 디렉터'], ['s277', '다이폴 1·2 → Add all'], ['s278', '슬롯 Subtract'], ['s279', '뒷면 마이크로스트립'], ['s280', 'Via + 꺾인 부분 (Rotate)'], ['s281', 'Pick Point로 Waveguide Port'], ['s296', 'Realized Gain > 6 dB'], ['s297', 'VSWR < 2']],
    coord: '기판 x = −L/2 ~ L/2, y = 0 ~ W, z = 0 ~ h. 다이폴 쪽 패턴은 윗면(z = h), 마이크로스트립은 아랫면(z = 0)에 그립니다.'
  }
};

/* ---------- 실습 단계 ---------- */
PROJECTS.monopole.mission = [
  { t: '주파수 범위 설정', how: '<b>Simulation → Frequency</b>에서 논문 그래프 범위를 넣습니다.', ans: boxHTML([['Fmin', '2'], ['Fmax', '6.5']]), ok: A => A.freqOk },
  { t: '논문 파라미터 등록', how: '아래 <b>Parameter List</b>의 <code>&lt;new parameter&gt;</code> 칸에 표의 20개 값을 이름으로 등록합니다. (빠르게 하려면 "표 한 번에 입력" 버튼)', ans: '논문 정보 탭의 표와 같습니다.', ok: A => A.paramsOk, fill: true },
  { t: '기판 만들기', how: '<b>Modeling → Brick</b> → 작업창에서 <kbd>Esc</kbd> → 좌표 입력. 재질은 <b>[Load from Material Library…]</b>에서 FR-4 (lossy).', ans: brickAns('Substrate', '-W1/2', 'W1/2', '0', 'L1', '0', 'h', 'FR-4 (lossy)'), ok: A => A.iou.sub > 0.95 && A.subOk },
  { t: '뒷면 그라운드', how: '두께 0짜리 PEC 시트를 기판 아래면(z = 0)에 그립니다.', ans: brickAns('Ground', '-W1/2', 'W1/2', '0', 'Ls', '0', '0', 'PEC'), ok: A => A.cover('bot', ['gnd']) > 0.9 },
  { t: '그라운드 슬롯 → Subtract', how: '슬롯 Brick을 그린 뒤, 트리에서 <b>Ground 먼저 선택</b> → <b>Modeling → Boolean Subtract</b> → Slot 선택 → <kbd>Enter</kbd>.', ans: brickAns('Slot', '-W8/2', 'W8/2', 'Ld', 'Ld+L8', '0', '0', 'PEC'), ok: A => A.iou.bot > 0.95 },
  { t: '급전 스트립', how: '앞면(z = h)에 급전선과 넓은 급전부를 그립니다.', ans: brickAns('Feed', '-W2/2', 'W2/2', '0', 'L2', 'h', 'h', 'PEC') + brickAns('Feed2', '-W3/2', 'W3/2', 'L2', 'L2+L3', 'h', 'h', 'PEC'), ok: A => A.cover('top', ['feed', 'step']) > 0.95 },
  { t: '사각 루프 (Mirror + Translate)', how: '아래 변과 오른쪽 변을 그린 뒤, 오른쪽 변 선택 → <b>Transform → Mirror</b> (Normal X, Center 0, Copy) → 왼쪽 변. 아래 변 선택 → <b>Transform → Translate</b> (Copy, Y = L4−a) → 위 변.', ans: brickAns('LoopB', '-W4/2', 'W4/2', 'L2+L3', 'L2+L3+a', 'h', 'h', 'PEC') + brickAns('LoopR', 'W4/2-a', 'W4/2', 'L2+L3', 'L2+L3+L4', 'h', 'h', 'PEC'), ok: A => A.cover('top', ['loopB', 'loopR', 'loopL', 'loopT']) > 0.95 },
  { t: '밴드 소자 (포크 모양)', how: '가운데 기둥, 가로대, 오른쪽 팔을 그리고 오른쪽 팔을 <b>Mirror (Copy)</b>해서 왼쪽 팔을 만듭니다.', ans: brickAns('Stem', '-W5/2', 'W5/2', 'L2+L3+a', 'L2+L3+a+L5', 'h', 'h', 'PEC') + brickAns('Bar', '-(W5/2+W6+W7)', 'W5/2+W6+W7', 'L2+L3+a+L6', 'L2+L3+a+L6+W7', 'h', 'h', 'PEC') + brickAns('ArmR', 'W5/2+W6', 'W5/2+W6+W7', 'L2+L3+a+L6+W7', 'L2+L3+a+L6+W7+L7', 'h', 'h', 'PEC'), ok: A => A.cover('top', ['stem', 'bar', 'armR', 'armL']) > 0.95 },
  { t: 'Add All (앞면 하나로)', how: '트리에서 앞면 금속을 <kbd>Ctrl</kbd>+클릭으로 모두 선택 → <b>Boolean Add</b>. 앞면 금속이 객체 1개가 되면 완료.', ans: '앞면 금속 객체 수 = 1', ok: A => A.iou.top > 0.95 && A.count.top === 1 },
  { t: 'Waveguide Port', how: '<b>Modeling → Pick Edge</b> → 급전선 아래 끝 모서리 클릭 → <b>Simulation → Waveguide Port</b>. Use picks, 여유값은 Xmin −5*h / Xmax +5*h, Zmin −5*h / Zmax +5*h 정도. 포트가 기판 안쪽(+y)을 보도록 Orientation <b>Positive</b>.', ans: boxHTML([['Normal', 'Y'], ['Orientation', 'Positive'], ['위치', 'y = 0 (기판 아래 끝)'], ['z 범위', '그라운드(z = 0)와 급전선(z = h)을 모두 포함']]), ok: A => A.portOk },
  { t: 'Farfield 모니터', how: '<b>Simulation → Field Monitor</b> → Farfield, Min 2 / Max 6.5 / Step 0.25.', ans: boxHTML([['Type', 'Farfield/RCS'], ['Frequency', '2 ~ 6.5, step 0.25']]), ok: A => A.monCount >= 5 },
  { t: '시뮬레이션 실행', how: '<b>Home → Start Simulation</b> (또는 Setup Solver → Start).', ans: '', ok: A => A.hasResults },
  { t: '결과 확인', how: '트리 <b>1D Results → S-Parameters → S1,1</b>에서 공진 3개 확인. <b>Post-Processing → Result Templates</b>로 Realized Gain(Theta 90, Phi 0) 추가 → Evaluate. 트리 <b>Farfields</b>에서 5.75 GHz 패턴 보기.', ans: '교안 p.12~14 그래프와 비교', ok: A => A.hasResults && A.tplCount > 0 }
];

PROJECTS.dra.mission = [
  { t: '주파수 범위 설정', how: '<b>Simulation → Frequency</b>', ans: boxHTML([['Fmin', '2'], ['Fmax', '3.8']]), ok: A => A.freqOk },
  { t: '논문 파라미터 등록', how: '표의 16개 값을 Parameter List에 등록합니다.', ans: '논문 정보 탭 참고', ok: A => A.paramsOk, fill: true },
  { t: '재질 준비', how: '<b>Modeling → New Material</b>로 DR 재질(εr 10)을 만들고, <b>Load from Material Library</b>에서 Rogers RO4003C (lossy)(εr 3.38)를 불러옵니다.', ans: boxHTML([['DR', 'New Material, εr = 10'], ['기판', 'Rogers RO4003C (lossy)']]), ok: A => A.hasMat(10) && A.hasMat(3.38) },
  { t: 'DR 모델링', how: 'Brick, 재질은 방금 만든 DR(εr 10).', ans: brickAns('DR', '-a/2', 'a/2', '-a/2', 'a/2', '0', 'd', 'DR (εr 10)'), ok: A => A.iou.dr > 0.95 && A.drOk },
  { t: '기판 모델링', how: 'Brick, 그라운드 아래쪽 z = −t ~ 0.', ans: brickAns('Substrate', '-g/2', 'g/2', '-g/2', 'g/2', '-t', '0', 'Rogers RO4003C (lossy)'), ok: A => A.iou.sub > 0.95 && A.subOk },
  { t: '금속판 1개', how: '중심 (dx, dy), 길이 l(x 방향), 두께 w(y 방향), 높이 h인 PEC Brick.', ans: brickAns('Plate', 'dx-l/2', 'dx+l/2', 'dy-w/2', 'dy+w/2', '0', 'h', 'PEC'), ok: A => A.cover('tall', ['p0']) > 0.95 },
  { t: '금속판 회전 복사 (×3)', how: 'Plate 선택 → <b>Transform → Rotate</b>, Axis Z, Angle 90, Center (0, 0), <b>Copy</b>, Repetition factor 3.', ans: boxHTML([['Operation', 'Rotate (Z축)'], ['Angle', '90'], ['Center', '0, 0'], ['Copy / Repetition', '✓ / 3']]), ok: A => A.iou.tall > 0.95 },
  { t: '그라운드', how: '그라운드는 z = 0 평면의 PEC 시트.', ans: brickAns('Ground', '-g/2', 'g/2', '-g/2', 'g/2', '0', '0', 'PEC'), ok: A => A.cover('top', ['gnd']) > 0.9 },
  { t: '십자 슬롯 → Rotate 45° → Subtract', how: '슬롯 2개를 그리고 → 둘을 <b>Boolean Add</b> → <b>Transform → Rotate</b> 45° (Copy 해제) → 그라운드 먼저 선택 후 <b>Boolean Subtract</b>.', ans: brickAns('Slot1', '-ls1/2', 'ls1/2', '-ws/2', 'ws/2', '0', '0', 'PEC') + brickAns('Slot2', '-ws/2', 'ws/2', '-ls2/2', 'ls2/2', '0', '0', 'PEC'), ok: A => A.iou.top > 0.95 },
  { t: '마이크로스트립 (뒷면)', how: '기판 아래면 z = −t에 폭이 다른 두 구간. 왼쪽 끝(x = −g/2)에서 시작.', ans: brickAns('MS1', '-g/2', '-g/2+lm1', '-wm1/2', 'wm1/2', '-t', '-t', 'PEC') + brickAns('MS2', '-g/2+lm1', '-g/2+lm1+lm2', '-wm2/2', 'wm2/2', '-t', '-t', 'PEC'), ok: A => A.iou.bot > 0.95 },
  { t: 'Waveguide Port', how: '<b>View → Back</b>으로 뒤집어 MS1 왼쪽 끝 모서리를 <b>Pick Edge</b> → <b>Waveguide Port</b>. Normal X, Positive. 여유: Y ±5*t, Z −5*t / +t (교안 p.24와 같음).', ans: boxHTML([['Normal', 'X'], ['Orientation', 'Positive'], ['위치', 'x = −g/2'], ['z 범위', '−t − 5t ~ 0 (그라운드 포함)']]), ok: A => A.portOk },
  { t: 'Farfield 모니터', how: '2 ~ 3.8 GHz, step 0.1.', ans: boxHTML([['Frequency', '2 ~ 3.8, step 0.1']]), ok: A => A.monCount >= 5 },
  { t: '시뮬레이션 실행', how: '<b>Home → Start Simulation</b>', ans: '', ok: A => A.hasResults },
  { t: '결과: S11 · Axial Ratio · LHCP', how: '<b>Result Templates</b>에서 Axial Ratio(Theta 0, Phi 0)와 Realized Gain을 추가 → Evaluate. AR ≤ 3 dB 구간 = CP 대역. Farfields에서 2.3 GHz → LHCP/RHCP 비교.', ans: '교안 p.25~32와 비교', ok: A => A.hasResults && A.tplAR }
];

PROJECTS.yagi.mission = [
  { t: '주파수 범위 설정', how: '<b>Simulation → Frequency</b>', ans: boxHTML([['Fmin', '1.5'], ['Fmax', '4.5']]), ok: A => A.freqOk },
  { t: '논문 파라미터 등록', how: '표의 값과 Via 위치(v_x, v_y, r)를 등록합니다.', ans: '논문 정보 탭 참고', ok: A => A.paramsOk, fill: true },
  { t: '기판', how: 'Brick, FR-4 (lossy).', ans: brickAns('Substrate', '-L/2', 'L/2', '0', 'W', '0', 'h', 'FR-4 (lossy)'), ok: A => A.iou.sub > 0.95 && A.subOk },
  { t: '그라운드 + Solid1 (CPS 기둥)', how: '윗면 z = h에 그라운드 반사판과 가운데 넓은 기둥.', ans: brickAns('Ground', '-lg/2', 'lg/2', '0', 'wg', 'h', 'h', 'PEC') + brickAns('Solid1', '-wcps/2', 'wcps/2', 'wg', 'wg+s1+w1+s2+w2', 'h', 'h', 'PEC'), ok: A => A.cover('top', ['gnd']) > 0.9 && A.cover('top', ['stem']) > 0.75 },
  { t: '디렉터 1 · 2', how: '다이폴2 위쪽에 간격 ds1, ds2로.', ans: brickAns('Director1', '-ld1/2', 'ld1/2', 'wg+s1+w1+s2+w2+ds1', 'wg+s1+w1+s2+w2+ds1+wd1', 'h', 'h', 'PEC') + brickAns('Director2', '-ld2/2', 'ld2/2', 'wg+s1+w1+s2+w2+ds1+wd1+ds2', 'wg+s1+w1+s2+w2+ds1+wd1+ds2+wd2', 'h', 'h', 'PEC'), ok: A => A.cover('top', ['dir1', 'dir2']) > 0.95 },
  { t: '다이폴 1 · 2 → Add all', how: '두 다이폴을 그린 뒤 그라운드·Solid1·다이폴을 선택해 <b>Boolean Add</b>.', ans: brickAns('Dipole1', '-l1/2', 'l1/2', 'wg+s1', 'wg+s1+w1', 'h', 'h', 'PEC') + brickAns('Dipole2', '-l2/2', 'l2/2', 'wg+s1+w1+s2', 'wg+s1+w1+s2+w2', 'h', 'h', 'PEC'), ok: A => A.cover('top', ['dip1', 'dip2']) > 0.85 },
  { t: '계단형 슬롯 Subtract', how: '넓은 슬롯과 좁은 슬롯을 그려 앞면 금속에서 <b>Subtract</b>.', ans: brickAns('SlotWide', '-ws2/2', 'ws2/2', 'wg+s1+w1', 'wg+s1+w1+s2+w2', 'h', 'h', 'PEC') + brickAns('SlotNarrow', '-ws1/2', 'ws1/2', 'wg', 'wg+s1+w1', 'h', 'h', 'PEC'), ok: A => A.iou.top > 0.95 },
  { t: '뒷면 마이크로스트립', how: '아랫면 z = 0. 세로 선과 Via 쪽으로 꺾이는 가로 선. (교안처럼 꺾이는 모서리를 45° 회전 Brick으로 다듬는 건 선택)', ans: brickAns('MS', 'xf-wf/2', 'xf+wf/2', '0', 'v_y+wf/2', '0', '0', 'PEC') + brickAns('MS2', 'v_x-1', 'xf+wf/2', 'v_y-wf/2', 'v_y+wf/2', '0', '0', 'PEC'), ok: A => A.iou.bot > 0.9 },
  { t: 'Via', how: '<b>Modeling → Cylinder</b> → <kbd>Esc</kbd>, Z축, PEC. 마이크로스트립과 윗면 CPS를 연결.', ans: boxHTML([['Outer radius', 'r'], ['Xcenter / Ycenter', 'v_x / v_y'], ['Zmin / Zmax', '0 / h'], ['Material', 'PEC']]), ok: A => A.viaOk },
  { t: 'Via Local Mesh', how: 'Via를 트리에서 우클릭 → <b>Local Mesh Properties</b> → Number of cells across object 값 입력.', ans: boxHTML([['Number of cells across object', '예: 3']]), ok: A => A.viaMesh },
  { t: 'Waveguide Port', how: '<b>View → Back</b> → 마이크로스트립 아래 끝(y = 0) 모서리 <b>Pick Edge</b> → <b>Waveguide Port</b>. Normal Y, Positive, z 범위가 기판 두께 전체를 덮게.', ans: boxHTML([['Normal', 'Y'], ['Orientation', 'Positive'], ['위치', 'y = 0'], ['z 범위', '0 ~ h 포함 (+여유)']]), ok: A => A.portOk },
  { t: 'Farfield 모니터', how: '1.5 ~ 4.5 GHz, step 0.5 (교안) 또는 더 촘촘히.', ans: boxHTML([['Frequency', '1.5 ~ 4.5, step 0.5']]), ok: A => A.monCount >= 4 },
  { t: '시뮬레이션 실행', how: '<b>Home → Start Simulation</b>', ans: '', ok: A => A.hasResults },
  { t: '결과: VSWR · Realized Gain', how: '트리 <b>1D Results → VSWR</b>에서 VSWR < 2 구간 확인. <b>Result Templates</b>로 Realized Gain(Theta 90, Phi 90) → 6 dB 이상 구간 확인.', ans: '교안 p.56~57과 비교', ok: A => A.hasResults && A.tplCount > 0 }
];
