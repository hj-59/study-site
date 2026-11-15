/* 시험 공부 노트 · 화면 로직 (프레임워크 없음)
 * 주소 형식 (해시 라우팅이라 GitHub Pages·로컬 파일 모두 동작)
 *   #/                                 학기 선택
 *   #/<학기id>                         과목 선택
 *   #/<학기id>/<과목id>/<탭>[/<번호>]  과목 내부
 *
 * 편집 모드: 화면에서 직접 학기·과목·자료를 추가/수정/삭제합니다.
 *   - 수정 내용은 이 브라우저(localStorage)에 자동 저장됩니다.
 *   - [data.js 내보내기] 로 파일을 받아 data/data.js 를 교체하면 영구 반영됩니다.
 *   - 직접 올린 PDF 는 이 브라우저(IndexedDB)에만 저장됩니다.
 */
(function () {
  "use strict";

  const LS_DATA = "studyNotes.data.v1";
  const LS_BASE = "studyNotes.baseSig.v1";
  const LS_EDIT = "studyNotes.editMode";
  const LOCAL_PREFIX = "local:";

  const app = document.getElementById("app");
  const crumbs = document.getElementById("crumbs");

  const TABS = [
    { id: "lectures", label: "교안", key: "lectures", type: "pdf" },
    { id: "ai", label: "AI용 교안", key: "aiNotes", type: "md" },
    { id: "solutions", label: "문제 풀이", key: "solutions", type: "problem" },
    { id: "predictions", label: "예상 문제", key: "predictions", type: "problem" },
    { id: "memorize", label: "시험용 암기", key: "memorize", type: "md" },
  ];

  /* ---------------- 유틸 ---------------- */
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const enc = encodeURIComponent;
  const h = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content;
  };
  const isLocal = (p) => typeof p === "string" && p.startsWith(LOCAL_PREFIX);
  const fileUrl = (p) => (/^(https?:)?\/\//.test(p) ? p : encodeURI(p));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const lsGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };
  const lsDel = (k) => { try { localStorage.removeItem(k); } catch (e) {} };
  function hash(str) {
    let x = 5381;
    for (let i = 0; i < str.length; i++) x = ((x << 5) + x + str.charCodeAt(i)) | 0;
    return String(x >>> 0);
  }
  function slugify(name, taken) {
    let base = String(name || "")
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "item";
    let id = base, n = 2;
    while (taken.includes(id)) id = `${base}-${n++}`;
    return id;
  }
  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------------- 데이터 저장소 ---------------- */
  const BASE = window.STUDY_DATA || { semesters: [] };
  const BASE_SIG = hash(JSON.stringify(BASE));
  const store = {
    data: null,
    local: false, // 브라우저에 저장된 수정본을 쓰는 중인지
    load() {
      const saved = lsGet(LS_DATA);
      if (saved) {
        try {
          this.data = JSON.parse(saved);
          this.local = true;
          return;
        } catch (e) {}
      }
      this.data = clone(BASE);
      this.local = false;
    },
    save() {
      const ok = lsSet(LS_DATA, JSON.stringify(this.data));
      if (!lsGet(LS_BASE)) lsSet(LS_BASE, BASE_SIG);
      this.local = true;
      if (!ok) alert("브라우저 저장 공간이 부족해 저장하지 못했습니다. data.js 로 내보내 주세요.");
      renderEditBar();
    },
    reset() {
      lsDel(LS_DATA);
      lsDel(LS_BASE);
      this.load();
    },
    baseChanged() {
      const s = lsGet(LS_BASE);
      return this.local && s && s !== BASE_SIG;
    },
  };
  store.load();
  if (!Array.isArray(store.data.semesters)) store.data.semesters = [];

  /* ---------------- 업로드한 PDF (IndexedDB) ---------------- */
  const pdfDB = {
    _db: null,
    open() {
      if (this._db) return this._db;
      this._db = new Promise((res, rej) => {
        if (!window.indexedDB) return rej(new Error("IndexedDB 없음"));
        const r = indexedDB.open("studyNotes", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("files");
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
      return this._db;
    },
    async tx(mode, fn) {
      const db = await this.open();
      return new Promise((res, rej) => {
        const t = db.transaction("files", mode);
        const req = fn(t.objectStore("files"));
        t.oncomplete = () => res(req && req.result);
        t.onerror = () => rej(t.error);
      });
    },
    put(key, blob) { return this.tx("readwrite", (s) => s.put(blob, key)); },
    get(key) { return this.tx("readonly", (s) => s.get(key)); },
    del(key) { return this.tx("readwrite", (s) => s.delete(key)); },
  };
  const objectUrls = {};
  // 암호 잠금 버전(lock.js)에서는 서버의 파일이 암호화되어 있어 복호화해서 씁니다.
  const LOCK = window.SITE_LOCK || null;
  const needsResolve = (p) => isLocal(p) || (LOCK && LOCK.isLockedPath(p));
  async function resolveFile(p) {
    if (LOCK && LOCK.isLockedPath(p)) {
      if (!objectUrls[p]) objectUrls[p] = URL.createObjectURL(await LOCK.fetchBlob(p, "application/pdf"));
      return objectUrls[p];
    }
    if (!isLocal(p)) return fileUrl(p);
    if (objectUrls[p]) return objectUrls[p];
    const blob = await pdfDB.get(p.slice(LOCAL_PREFIX.length).split("/")[0]);
    if (!blob) throw new Error("not found");
    return (objectUrls[p] = URL.createObjectURL(blob));
  }
  const fileLabel = (p) => (isLocal(p) ? "이 브라우저에 저장된 파일 · " + p.split("/").slice(1).join("/") : p);

  /* ---------------- 마크다운 + KaTeX ----------------
   * 수식을 먼저 떼어 놓고 마크다운을 변환한 뒤 다시 끼워 넣습니다.
   * (그래야 _ 나 \\ 가 마크다운 문법으로 깨지지 않습니다.) */
  function renderMarkdown(src) {
    src = String(src ?? "").replace(/^\n+/, "");
    const store = [];
    const put = (tex, display) => {
      store.push({ tex, display });
      return `%%MATH${store.length - 1}%%`;
    };
    let s = src.replace(/\\\$/g, "%%DOLLAR%%");
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => "\n\n" + put(t, true) + "\n\n");
    s = s.replace(/\\\[([\s\S]+?)\\\]/g, (_, t) => "\n\n" + put(t, true) + "\n\n");
    s = s.replace(/\\\(([\s\S]+?)\\\)/g, (_, t) => put(t, false));
    s = s.replace(/\$([^\$\n]+?)\$/g, (_, t) => put(t, false));

    let html = window.marked ? marked.parse(s) : "<p>" + esc(s).replace(/\n\n/g, "</p><p>") + "</p>";

    html = html.replace(/%%MATH(\d+)%%/g, (_, i) => {
      const { tex, display } = store[+i];
      if (!window.katex) return esc(display ? `$$${tex}$$` : `$${tex}$`);
      try {
        return katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: "ignore" });
      } catch (e) {
        return `<code>${esc(tex)}</code>`;
      }
    });
    html = html.replace(/<p>\s*(<span class="katex-display">[\s\S]*?<\/span>)\s*<\/p>/g, "$1");
    return html.replace(/%%DOLLAR%%/g, "$");
  }

  /* ---------------- 데이터 찾기 ---------------- */
  const DATA = () => store.data;
  const findSemester = (id) => DATA().semesters.find((s) => s.id === id);
  const findSubject = (sem, id) => (sem?.subjects || []).find((s) => s.id === id);
  const items = (sub, key) => (Array.isArray(sub?.[key]) ? sub[key] : []);
  const ensure = (obj, key) => (Array.isArray(obj[key]) ? obj[key] : (obj[key] = []));

  /* ---------------- 편집 모드 ---------------- */
  let editing = lsGet(LS_EDIT) === "1";
  function setEditing(on) {
    editing = on;
    lsSet(LS_EDIT, on ? "1" : "0");
    document.body.classList.toggle("editing", on);
    route();
  }
  const tool = (act, label, extra = "") =>
    `<button type="button" class="tool" data-act="${act}" ${extra}>${label}</button>`;

  function setCrumbs(parts) {
    crumbs.innerHTML = parts
      .map((p, i) => (i ? '<span class="sep">›</span>' : "") + (p.href ? `<a href="${p.href}">${esc(p.label)}</a>` : `<span>${esc(p.label)}</span>`))
      .join("");
  }
  function setTitle(t) {
    const site = DATA().siteTitle || "시험 공부 노트";
    document.title = t ? `${t} · ${site}` : site;
  }

  /* ---------------- 1) 학기 선택 ---------------- */
  function viewSemesters() {
    setCrumbs([{ label: "학기 선택" }]);
    setTitle("");
    const sems = DATA().semesters;
    const cards = sems
      .map((s, i) => {
        const subs = s.subjects || [];
        return `<div class="card link" data-href="#/${enc(s.id)}" tabindex="0" role="link">
          <h2>${esc(s.name)}</h2>
          <p>과목 ${subs.length}개</p>
          <div class="meta">${subs.slice(0, 4).map((x) => `<span class="pill">${esc(x.name)}</span>`).join("")}${subs.length > 4 ? `<span class="pill">+${subs.length - 4}</span>` : ""}</div>
          ${editing ? `<div class="card-tools">${tool("sem-up", "◀", `data-i="${i}" title="앞으로"`)}${tool("sem-down", "▶", `data-i="${i}" title="뒤로"`)}${tool("sem-edit", "수정", `data-i="${i}"`)}${tool("sem-del", "삭제", `data-i="${i}"`)}</div>` : ""}
        </div>`;
      })
      .join("");
    const add = editing ? `<button type="button" class="card add-card" data-act="sem-add">+ 학기 추가</button>` : "";
    app.innerHTML = `
      <section class="page-head">
        <span class="step">STEP 1</span>
        <h1>연도·학기를 선택하세요</h1>
        <p>공부할 학기를 고르면 과목 목록이 나옵니다.</p>
      </section>
      ${cards || add ? `<div class="grid">${cards}${add}</div>` : emptyBox("등록된 학기가 없습니다", "오른쪽 위 [편집 모드] 를 켜고 학기를 추가하세요.")}`;
  }

  /* ---------------- 2) 과목 선택 ---------------- */
  function viewSubjects(sem) {
    setCrumbs([{ label: "학기 선택", href: "#/" }, { label: sem.name }]);
    setTitle(sem.name);
    const cards = (sem.subjects || [])
      .map((sub, i) => {
        const counts = TABS.map((t) => [t.label, items(sub, t.key).length]).filter(([, n]) => n);
        return `<div class="card link" data-href="#/${enc(sem.id)}/${enc(sub.id)}/lectures" tabindex="0" role="link">
          <h2>${esc(sub.name)}</h2>
          <p>${esc(sub.desc || "")}</p>
          <div class="meta">${counts.map(([l, n]) => `<span class="pill">${esc(l)} ${n}</span>`).join("")}</div>
          ${editing ? `<div class="card-tools">${tool("sub-up", "◀", `data-i="${i}" title="앞으로"`)}${tool("sub-down", "▶", `data-i="${i}" title="뒤로"`)}${tool("sub-edit", "수정", `data-i="${i}"`)}${tool("sub-del", "삭제", `data-i="${i}"`)}</div>` : ""}
        </div>`;
      })
      .join("");
    const add = editing ? `<button type="button" class="card add-card" data-act="sub-add">+ 과목 추가</button>` : "";
    app.innerHTML = `
      <section class="page-head">
        <span class="step">STEP 2 · ${esc(sem.name)}</span>
        <h1>과목을 선택하세요</h1>
      </section>
      ${cards || add ? `<div class="grid">${cards}${add}</div>` : emptyBox("이 학기에 등록된 과목이 없습니다", "오른쪽 위 [편집 모드] 를 켜고 과목을 추가하세요.")}`;
  }

  /* ---------------- 3) 과목 내부 ---------------- */
  function viewSubject(sem, sub, tabId, index) {
    const tab = TABS.find((t) => t.id === tabId) || TABS[0];
    const base = `#/${enc(sem.id)}/${enc(sub.id)}`;
    setCrumbs([{ label: "학기 선택", href: "#/" }, { label: sem.name, href: `#/${enc(sem.id)}` }, { label: sub.name }]);
    setTitle(`${sub.name} · ${tab.label}`);

    const tabs = TABS.map((t) => {
      const n = items(sub, t.key).length;
      return `<a class="tab${t.id === tab.id ? " active" : ""}" href="${base}/${t.id}" role="tab" aria-selected="${t.id === tab.id}">${esc(t.label)}<span class="count">${n}</span></a>`;
    }).join("");

    app.innerHTML = `
      <section class="page-head">
        <span class="step">${esc(sem.name)}</span>
        <h1>${esc(sub.name)} ${editing ? tool("sub-edit-here", "과목 정보 수정") : ""}</h1>
        ${sub.desc ? `<p>${esc(sub.desc)}</p>` : ""}
      </section>
      <nav class="tabs" role="tablist">${tabs}</nav>
      ${editing ? `<div class="add-row"><button type="button" class="btn primary" data-act="item-add">+ ${esc(tab.label)} 추가</button></div>` : ""}
      <section id="tab-body"></section>`;

    const activeTab = app.querySelector(".tab.active");
    if (activeTab) activeTab.parentElement.scrollLeft = activeTab.offsetLeft - 8; // 모바일에서 선택한 탭이 보이도록

    const body = document.getElementById("tab-body");
    const list = items(sub, tab.key);
    if (!list.length) {
      body.appendChild(h(emptyBox(`아직 ${tab.label} 자료가 없습니다`, editing ? "위의 [+ 추가] 버튼으로 넣어 보세요." : "오른쪽 위 [편집 모드] 를 켜면 바로 추가할 수 있어요.")));
      return;
    }
    if (tab.type === "pdf") renderPdfTab(body, list, `${base}/${tab.id}`, index);
    else if (tab.type === "md") renderNoteTab(body, list, `${base}/${tab.id}`, index);
    else renderProblemTab(body, list, tab.id === "predictions");
  }

  const itemTools = (i, n) =>
    editing
      ? `<span class="item-tools">${tool("item-up", "↑", `data-i="${i}" title="위로" ${i === 0 ? "disabled" : ""}`)}${tool("item-down", "↓", `data-i="${i}" title="아래로" ${i === n - 1 ? "disabled" : ""}`)}${tool("item-edit", "수정", `data-i="${i}"`)}${tool("item-del", "삭제", `data-i="${i}"`)}</span>`
      : "";

  /* ----- 교안·교재: PDF ----- */
  function renderPdfTab(body, list, base, index) {
    const rows = list
      .map(
        (it, i) => `<li class="list-item">
          <span class="icon">PDF</span>
          <span class="title">${esc(it.title)}<small>${esc(fileLabel(it.file))}</small></span>
          <span class="actions">
            <a class="btn${String(i) === index ? " primary" : ""}" href="${base}/${i}">뷰어로 보기</a>
            <a class="btn" data-file="${esc(it.file)}" href="${needsResolve(it.file) ? "#" : fileUrl(it.file)}" target="_blank" rel="noopener">새 탭에서 열기 ↗</a>
          </span>
          ${itemTools(i, list.length)}
        </li>`
      )
      .join("");
    body.innerHTML = `<div class="panel"><ul class="list">${rows}</ul></div>`;

    // 브라우저에 저장된 PDF 는 링크를 실제 주소로 바꿔 줍니다.
    body.querySelectorAll("a[data-file]").forEach((a) => {
      if (needsResolve(a.dataset.file)) resolveFile(a.dataset.file).then((u) => (a.href = u)).catch(() => (a.title = "파일을 찾을 수 없습니다"));
    });

    const it = index != null ? list[+index] : null;
    if (it) {
      body.appendChild(h(`<div class="panel viewer" id="viewer">
        <div class="viewer-head"><strong>${esc(it.title)}</strong>
          <span class="actions">
            <a class="btn" id="v-dl" href="#" download="${esc((it.title || "file") + ".pdf")}">다운로드</a>
            <a class="btn" href="${base}">닫기 ✕</a>
          </span>
        </div>
        <div id="v-frame"></div>
      </div>`));
      resolveFile(it.file)
        .then((u) => {
          document.getElementById("v-dl").href = u;
          document.getElementById("v-frame").innerHTML = `<iframe src="${u}#view=FitH" title="${esc(it.title)}"></iframe>`;
        })
        .catch(() => {
          document.getElementById("v-frame").innerHTML = `<div class="empty"><b>파일을 찾을 수 없습니다</b>이 브라우저에 저장된 PDF 가 지워졌을 수 있어요. [수정] 에서 다시 올려 주세요.</div>`;
        });
      requestAnimationFrame(() => document.getElementById("viewer")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  /* ----- AI용 교안: 마크다운 ----- */
  function renderNoteTab(body, list, base, index) {
    const cur = Math.min(Math.max(parseInt(index ?? "0", 10) || 0, 0), list.length - 1);
    const idx = list.map((it, i) => `<a href="${base}/${i}" class="${i === cur ? "active" : ""}">${esc(it.title)}</a>`).join("");
    body.innerHTML = `<div class="note-layout">
        <nav class="panel note-index">${idx}</nav>
        <div>
          ${editing ? `<div class="note-tools">${itemTools(cur, list.length)}</div>` : ""}
          <article class="panel prose" id="note">불러오는 중…</article>
        </div>
      </div>`;
    const el = document.getElementById("note");
    const it = list[cur];
    if (it.markdown != null && String(it.markdown).trim() !== "") {
      el.innerHTML = renderMarkdown(it.markdown);
    } else if (it.file) {
      (LOCK && LOCK.isLockedPath(it.file)
        ? LOCK.fetchBlob(it.file, "text/markdown").then((b) => b.text())
        : fetch(encodeURI(it.file)).then((r) => {
            if (!r.ok) throw new Error(r.status);
            return r.text();
          }))
        .then((t) => (el.innerHTML = renderMarkdown(t)))
        .catch(() => {
          el.innerHTML = `<p><b>마크다운 파일을 불러오지 못했습니다:</b> <code>${esc(it.file)}</code></p>
            <p>파일을 직접 더블클릭해서 연 경우(file://) 브라우저 보안 때문에 .md 파일을 읽을 수 없습니다.
            README 의 "로컬에서 보기" 방법으로 간단한 서버를 띄우거나, GitHub Pages 에 올려서 확인하세요.
            편집 모드에서 [수정] → [.md 파일 불러오기] 로 내용을 직접 넣어도 됩니다.</p>`;
        });
    } else {
      el.innerHTML = `<p class="muted">내용이 비어 있습니다.</p>`;
    }
  }

  /* ----- 문제 풀이 / 예상 문제 ----- */
  function renderProblemTab(body, list, isPrediction) {
    const allTags = [...new Set(list.flatMap((p) => p.points || []))];
    const state = { sort: "default", tag: "" };

    body.innerHTML = `
      <div class="toolbar">
        <span class="hint">총 ${list.length}문제 · 먼저 풀어 본 뒤 버튼을 눌러 확인하세요.</span>
        <span class="actions">
          ${
            isPrediction
              ? `<select class="filter" id="f-sort" aria-label="정렬">
                  <option value="default">기본 순서</option>
                  <option value="imp">중요도 높은 순</option>
                </select>
                ${allTags.length ? `<select class="filter" id="f-tag" aria-label="출제포인트"><option value="">모든 출제포인트</option>${allTags.map((t) => `<option>${esc(t)}</option>`).join("")}</select>` : ""}`
              : ""
          }
          <button class="btn" id="toggle-all" type="button">모두 펼치기</button>
        </span>
      </div>
      <div class="problems" id="problems"></div>`;

    const wrap = document.getElementById("problems");
    const draw = () => {
      let arr = list.map((p, i) => ({ p, i }));
      if (state.tag) arr = arr.filter(({ p }) => (p.points || []).includes(state.tag));
      if (state.sort === "imp") arr.sort((a, b) => (b.p.importance || 0) - (a.p.importance || 0));
      wrap.innerHTML = arr.length ? arr.map(({ p, i }) => problemCard(p, i, isPrediction, list.length)).join("") : emptyBox("조건에 맞는 문제가 없습니다", "");
      document.getElementById("toggle-all").textContent = "모두 펼치기";
    };
    draw();

    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".toggle");
      if (!btn) return;
      setOpen(btn, btn.getAttribute("aria-expanded") !== "true");
    });
    document.getElementById("toggle-all").addEventListener("click", (e) => {
      const btns = wrap.querySelectorAll(".toggle");
      const open = e.currentTarget.textContent === "모두 펼치기";
      btns.forEach((b) => setOpen(b, open));
      e.currentTarget.textContent = open ? "모두 접기" : "모두 펼치기";
    });
    document.getElementById("f-sort")?.addEventListener("change", (e) => { state.sort = e.target.value; draw(); });
    document.getElementById("f-tag")?.addEventListener("change", (e) => { state.tag = e.target.value; draw(); });
  }

  function setOpen(btn, open) {
    const box = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "정답/해설 숨기기" : "정답/해설 보기";
    box.classList.toggle("open", open);
  }

  function stars(n) {
    n = Math.max(0, Math.min(5, Math.round(n || 0)));
    return `<span class="stars" title="중요도 ${n}/5" aria-label="중요도 ${n}점">${"★".repeat(n)}<span class="off">${"★".repeat(5 - n)}</span></span>`;
  }

  let uid = 0;
  function problemCard(p, i, isPrediction, n) {
    const id = `ans-${++uid}`;
    const head = isPrediction
      ? `${p.importance ? `<span class="tag imp">중요도</span>${stars(p.importance)}` : ""}${(p.points || []).map((t) => `<span class="tag">#${esc(t)}</span>`).join("")}`
      : "";
    const hasAns = (p.answer ?? "") !== "" || (p.explanation ?? "") !== "";
    return `<article class="panel problem">
      <div class="problem-head"><h3>${esc(p.title || `문제 ${i + 1}`)}</h3>${head}${itemTools(i, n)}</div>
      <div class="question prose" style="padding:0">${renderMarkdown(p.question)}</div>
      ${hasAns ? `<button class="btn toggle" type="button" aria-expanded="false" aria-controls="${id}">정답/해설 보기</button>
      <div class="answer prose" id="${id}">
        ${(p.answer ?? "") !== "" ? `<h4>정답</h4><div>${renderMarkdown(p.answer)}</div>` : ""}
        ${(p.explanation ?? "") !== "" ? `<h4>해설</h4><div>${renderMarkdown(p.explanation)}</div>` : ""}
      </div>` : ""}
    </article>`;
  }

  function emptyBox(title, sub) {
    return `<div class="panel empty"><b>${esc(title)}</b>${esc(sub)}</div>`;
  }

  /* =========================================================
   * 편집: 입력 폼(대화상자)
   * ========================================================= */
  const dlg = document.createElement("dialog");
  dlg.className = "editor";
  document.body.appendChild(dlg);

  /** fields: [{ name, label, type: text|textarea|md|number|select|file-pdf|file-md, ... }] */
  function openForm({ title, fields, values = {}, preview = false, onSubmit }) {
    const field = (f) => {
      const v = values[f.name] ?? f.default ?? "";
      const help = f.help ? `<small class="help">${f.help}</small>` : "";
      if (f.type === "textarea" || f.type === "md")
        return `<label class="fld${f.type === "md" ? " md" : ""}"><span>${esc(f.label)}</span>
          <textarea name="${f.name}" rows="${f.rows || 4}" placeholder="${esc(f.placeholder || "")}" spellcheck="false">${esc(v)}</textarea>${help}</label>`;
      if (f.type === "select")
        return `<label class="fld"><span>${esc(f.label)}</span><select name="${f.name}">${f.options
          .map(([val, lab]) => `<option value="${esc(val)}" ${String(val) === String(v) ? "selected" : ""}>${esc(lab)}</option>`)
          .join("")}</select>${help}</label>`;
      if (f.type === "file-pdf")
        return `<div class="fld"><span>${esc(f.label)}</span>
          <div class="file-row">
            <input name="${f.name}" value="${esc(v)}" placeholder="pdfs/2026-2/과목/lecture03.pdf 또는 https://…" />
            <label class="btn file-btn">PDF 올리기<input type="file" accept="application/pdf,.pdf" data-pdf-for="${f.name}" hidden /></label>
          </div>
          <small class="help" data-pdf-note>${isLocal(v) ? "현재: " + esc(fileLabel(v)) : "경로/주소를 적거나, 내 컴퓨터의 PDF 를 올리세요. 올린 파일은 이 브라우저에만 저장됩니다."}</small></div>`;
      return `<label class="fld"><span>${esc(f.label)}</span><input name="${f.name}" type="${f.type === "number" ? "number" : "text"}" value="${esc(v)}" placeholder="${esc(f.placeholder || "")}" ${f.required ? "required" : ""} />${help}</label>`;
    };

    dlg.innerHTML = `<form method="dialog" class="editor-form">
      <header><h2>${esc(title)}</h2><button type="button" class="tool close" data-close aria-label="닫기">✕</button></header>
      <div class="editor-body${preview ? " with-preview" : ""}">
        <div class="editor-fields">${fields.map(field).join("")}</div>
        ${preview ? `<div class="editor-preview"><div class="preview-label">미리보기</div><div class="prose" id="pv"></div></div>` : ""}
      </div>
      <footer><span class="help">수식: <code>$x^2$</code> 인라인, <code>$$…$$</code> 블록</span>
        <span class="actions"><button type="button" class="btn" data-close>취소</button><button type="submit" class="btn primary">저장</button></span></footer>
    </form>`;
    const form = dlg.querySelector("form");
    if (!preview) dlg.querySelector("footer .help").style.visibility = "hidden";

    const pending = {}; // 올린 PDF (저장 시 IndexedDB 에 기록)
    dlg.querySelectorAll("[data-pdf-for]").forEach((inp) =>
      inp.addEventListener("change", () => {
        const f = inp.files[0];
        if (!f) return;
        const name = inp.dataset.pdfFor;
        pending[name] = f;
        form.elements[name].value = `${LOCAL_PREFIX}(새 파일)/${f.name}`;
        form.elements[name].readOnly = true;
        dlg.querySelector("[data-pdf-note]").textContent = `선택됨: ${f.name} (${(f.size / 1048576).toFixed(1)} MB) · 저장하면 이 브라우저에 보관됩니다.`;
        const t = form.elements.title;
        if (t && !t.value.trim()) t.value = f.name.replace(/\.pdf$/i, "");
      })
    );

    const updatePreview = () => {
      if (!preview) return;
      const pv = document.getElementById("pv");
      pv.innerHTML = fields
        .filter((f) => f.type === "md")
        .map((f) => {
          const v = form.elements[f.name].value;
          return v.trim() ? `<div class="pv-sec"><div class="pv-title">${esc(f.label)}</div>${renderMarkdown(v)}</div>` : "";
        })
        .join("") || `<p class="muted">입력하면 여기에 바로 보입니다.</p>`;
    };
    let pvTimer;
    form.addEventListener("input", () => { clearTimeout(pvTimer); pvTimer = setTimeout(updatePreview, 150); });
    updatePreview();

    // .md 파일 불러오기 버튼
    dlg.querySelectorAll("[data-md-load]").forEach((inp) =>
      inp.addEventListener("change", async () => {
        const f = inp.files[0];
        if (!f) return;
        form.elements[inp.dataset.mdLoad].value = await f.text();
        const t = form.elements.title;
        if (t && !t.value.trim()) t.value = f.name.replace(/\.(md|markdown|txt)$/i, "");
        updatePreview();
      })
    );

    dlg.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => dlg.close()));
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const out = {};
      fields.forEach((f) => (out[f.name] = form.elements[f.name]?.value ?? ""));
      for (const [name, file] of Object.entries(pending)) {
        const key = "pdf-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        try {
          await pdfDB.put(key, file);
          out[name] = `${LOCAL_PREFIX}${key}/${file.name}`;
        } catch (err) {
          alert("PDF 를 브라우저에 저장하지 못했습니다. 파일이 너무 크거나 사생활 보호 모드일 수 있어요.");
          return;
        }
      }
      const err = onSubmit(out);
      if (err) { alert(err); return; }
      dlg.close();
      store.save();
      route();
      toast("저장했어요");
    });
    dlg.showModal();
    setTimeout(() => form.querySelector("input:not([readonly]),textarea")?.focus(), 30);
  }

  // .md 불러오기 버튼을 붙인 마크다운 입력칸
  function mdField(name, label, rows, extra = {}) {
    return { name, label, type: "md", rows, ...extra };
  }

  /* ----- 학기 ----- */
  function semesterForm(sem) {
    openForm({
      title: sem ? "학기 수정" : "학기 추가",
      values: sem || {},
      fields: [
        { name: "name", label: "학기 이름", placeholder: "예: 2027-1학기", required: true },
        { name: "id", label: "주소용 ID (영문·숫자·하이픈)", placeholder: "비워 두면 이름에서 자동 생성 (예: 2027-1)", help: "주소에 쓰입니다. 바꾸면 기존 즐겨찾기 링크가 깨질 수 있어요." },
      ],
      onSubmit: (v) => {
        const name = v.name.trim();
        if (!name) return "학기 이름을 입력하세요.";
        const taken = DATA().semesters.filter((s) => s !== sem).map((s) => s.id);
        const id = v.id.trim() ? slugify(v.id, []) : slugify(name.replace(/학기$/, ""), taken);
        if (taken.includes(id)) return `ID "${id}" 는 이미 쓰고 있어요.`;
        if (sem) Object.assign(sem, { name, id });
        else DATA().semesters.push({ id, name, subjects: [] });
      },
    });
  }

  /* ----- 과목 ----- */
  function subjectForm(sem, sub) {
    openForm({
      title: sub ? "과목 수정" : `과목 추가 · ${sem.name}`,
      values: sub || {},
      fields: [
        { name: "name", label: "과목 이름", placeholder: "예: 위상수학", required: true },
        { name: "desc", label: "한 줄 설명 (선택)", placeholder: "예: 거리공간, 연결성, 컴팩트성" },
        { name: "id", label: "주소용 ID (선택)", placeholder: "비워 두면 자동 생성" },
      ],
      onSubmit: (v) => {
        const name = v.name.trim();
        if (!name) return "과목 이름을 입력하세요.";
        const subs = ensure(sem, "subjects");
        const taken = subs.filter((s) => s !== sub).map((s) => s.id);
        const id = v.id.trim() ? slugify(v.id, []) : sub ? sub.id : slugify(name, taken);
        if (taken.includes(id)) return `ID "${id}" 는 이미 쓰고 있어요.`;
        if (sub) {
          const moved = sub.id !== id;
          Object.assign(sub, { name, desc: v.desc.trim(), id });
          if (moved && location.hash.includes(`/${enc(sem.id)}/`)) location.hash = `#/${enc(sem.id)}/${enc(id)}/lectures`;
        } else {
          subs.push({ id, name, desc: v.desc.trim(), lectures: [], aiNotes: [], solutions: [], predictions: [], memorize: [] });
        }
      },
    });
  }

  /* ----- 탭 항목 ----- */
  function itemForm(sub, tab, idx) {
    const list = ensure(sub, tab.key);
    const it = idx != null ? list[idx] : null;
    const save = (obj) => {
      if (it) {
        Object.keys(it).forEach((k) => delete it[k]);
        Object.assign(it, obj);
      } else list.push(obj);
    };

    if (tab.type === "pdf") {
      return openForm({
        title: `${tab.label} ${it ? "수정" : "추가"}`,
        values: it || {},
        fields: [
          { name: "title", label: "제목", placeholder: "예: 3주차 · 코시 수열", required: true },
          { name: "file", label: "PDF 파일", type: "file-pdf" },
        ],
        onSubmit: (v) => {
          if (!v.title.trim()) return "제목을 입력하세요.";
          if (!v.file.trim()) return "PDF 경로를 적거나 파일을 올리세요.";
          if (it && isLocal(it.file) && it.file !== v.file) pdfDB.del(it.file.slice(LOCAL_PREFIX.length).split("/")[0]).catch(() => {});
          save({ title: v.title.trim(), file: v.file.trim() });
        },
      });
    }

    if (tab.type === "md") {
      openForm({
        title: `${tab.label} ${it ? "수정" : "추가"}`,
        values: it || {},
        preview: true,
        fields: [
          { name: "title", label: "제목", placeholder: "예: 급수의 수렴 판정법 요약", required: true },
          mdField("markdown", "마크다운 내용", 16, { placeholder: "# 제목\n\nAI 에게 받은 마크다운을 그대로 붙여 넣으세요.\n\n$$\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$" }),
          { name: "file", label: ".md 파일 경로 (선택)", placeholder: "notes/2026-2/과목/파일.md", help: "내용 칸이 비어 있을 때만 이 파일을 불러옵니다." },
        ],
        onSubmit: (v) => {
          if (!v.title.trim()) return "제목을 입력하세요.";
          if (!v.markdown.trim() && !v.file.trim()) return "마크다운 내용을 넣거나 .md 파일 경로를 적으세요.";
          const obj = { title: v.title.trim() };
          if (v.markdown.trim()) obj.markdown = v.markdown;
          if (v.file.trim()) obj.file = v.file.trim();
          save(obj);
        },
      });
      // 마크다운 칸 위에 .md 불러오기 버튼 추가
      const lab = dlg.querySelector('label.md > span');
      lab.insertAdjacentHTML("beforeend", ` <label class="tool file-btn">.md 파일 불러오기<input type="file" accept=".md,.markdown,.txt,text/markdown,text/plain" data-md-load="markdown" hidden /></label>`);
      const inp = lab.querySelector("input");
      inp.addEventListener("change", async () => {
        const f = inp.files[0];
        if (!f) return;
        const form = dlg.querySelector("form");
        form.elements.markdown.value = await f.text();
        if (!form.elements.title.value.trim()) form.elements.title.value = f.name.replace(/\.(md|markdown|txt)$/i, "");
        form.dispatchEvent(new Event("input"));
      });
      return;
    }

    const isPred = tab.id === "predictions";
    const fields = [
      { name: "title", label: "제목", placeholder: `예: ${isPred ? "예상" : "문제"} ${list.length + (it ? 0 : 1)}` },
      mdField("question", "문제", 4, { placeholder: "$\\lim_{n\\to\\infty} \\frac{1}{n} = 0$ 임을 보이시오." }),
      mdField("answer", "정답", 2),
      mdField("explanation", "해설", 6),
    ];
    if (isPred) {
      fields.push(
        { name: "importance", label: "중요도", type: "select", default: "3", options: [["5", "★★★★★ 매우 중요"], ["4", "★★★★ 중요"], ["3", "★★★ 보통"], ["2", "★★ 낮음"], ["1", "★ 참고"], ["0", "표시 안 함"]] },
        { name: "points", label: "출제포인트 (쉼표로 구분)", placeholder: "예: 단조수렴정리, 증명" }
      );
    }
    openForm({
      title: `${tab.label} ${it ? "수정" : "추가"}`,
      values: it ? { ...it, points: (it.points || []).join(", ") } : {},
      preview: true,
      fields,
      onSubmit: (v) => {
        if (!v.question.trim()) return "문제를 입력하세요.";
        const obj = {
          title: v.title.trim() || `${isPred ? "예상" : "문제"} ${it ? idx + 1 : list.length + 1}`,
          question: v.question,
          answer: v.answer,
          explanation: v.explanation,
        };
        if (isPred) {
          obj.importance = Number(v.importance) || 0;
          obj.points = v.points.split(/[,，]/).map((s) => s.trim()).filter(Boolean);
        }
        save(obj);
      },
    });
  }

  /* ----- 클릭 처리 (편집 버튼 + 카드 이동) ----- */
  function currentContext() {
    const [semId, subId, tabId, index] = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
    const sem = semId && findSemester(semId);
    const sub = sem && subId && findSubject(sem, subId);
    const tab = TABS.find((t) => t.id === tabId) || TABS[0];
    return { sem, sub, tab, index };
  }
  const move = (arr, i, d) => {
    const j = i + d;
    if (j < 0 || j >= arr.length) return false;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    return true;
  };

  app.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) {
      const card = e.target.closest(".card.link");
      if (card) location.hash = card.dataset.href;
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const act = btn.dataset.act;
    const i = btn.dataset.i != null ? +btn.dataset.i : null;
    const { sem, sub, tab, index } = currentContext();
    const sems = DATA().semesters;
    let changed = false;

    switch (act) {
      case "sem-add": return semesterForm(null);
      case "sem-edit": return semesterForm(sems[i]);
      case "sem-del":
        if (confirm(`"${sems[i].name}" 학기와 그 안의 과목 ${sems[i].subjects?.length || 0}개를 모두 삭제할까요?`)) { sems.splice(i, 1); changed = true; }
        break;
      case "sem-up": changed = move(sems, i, -1); break;
      case "sem-down": changed = move(sems, i, 1); break;

      case "sub-add": return subjectForm(sem, null);
      case "sub-edit": return subjectForm(sem, sem.subjects[i]);
      case "sub-edit-here": return subjectForm(sem, sub);
      case "sub-del":
        if (confirm(`"${sem.subjects[i].name}" 과목과 그 안의 자료를 모두 삭제할까요?`)) { sem.subjects.splice(i, 1); changed = true; }
        break;
      case "sub-up": changed = move(sem.subjects, i, -1); break;
      case "sub-down": changed = move(sem.subjects, i, 1); break;

      case "item-add": return itemForm(sub, tab, null);
      case "item-edit": return itemForm(sub, tab, i);
      case "item-del": {
        const list = ensure(sub, tab.key);
        if (confirm(`"${list[i].title || "이 항목"}" 을(를) 삭제할까요?`)) {
          const [gone] = list.splice(i, 1);
          if (gone && isLocal(gone.file)) pdfDB.del(gone.file.slice(LOCAL_PREFIX.length).split("/")[0]).catch(() => {});
          changed = true;
          if (index != null && tab.type !== "problem") location.hash = `#/${enc(sem.id)}/${enc(sub.id)}/${tab.id}`;
        }
        break;
      }
      case "item-up":
      case "item-down": {
        const list = ensure(sub, tab.key);
        const d = act === "item-up" ? -1 : 1;
        changed = move(list, i, d);
        if (changed && tab.type === "md") { store.save(); location.hash = `#/${enc(sem.id)}/${enc(sub.id)}/${tab.id}/${i + d}`; return; }
        break;
      }
    }
    if (changed) { store.save(); route(); }
  });
  app.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.matches?.(".card.link")) location.hash = e.target.dataset.href;
  });

  /* =========================================================
   * 편집 바: 내보내기 / 가져오기 / 원래대로
   * ========================================================= */
  const bar = document.createElement("div");
  bar.className = "edit-bar";
  document.body.appendChild(bar);

  function renderEditBar() {
    const show = editing || store.local;
    bar.hidden = !show;
    document.body.classList.toggle("has-bar", show);
    if (!show) return;
    const warn = store.baseChanged()
      ? `<b class="warn">data.js 파일이 바뀌었어요.</b> 지금은 이 브라우저의 수정본을 보여 주는 중입니다. 파일 내용을 보려면 [원래대로] 를 누르세요.`
      : store.local
      ? `수정 내용은 <b>이 브라우저에만</b> 저장돼 있어요. 다른 기기에서도 보려면 data.js 로 내보내 교체하세요.`
      : `편집 모드입니다. 각 화면의 <b>+ 추가</b>, <b>수정</b>, <b>삭제</b> 버튼을 쓰세요.`;
    bar.innerHTML = `<div class="edit-bar-in">
      <span class="edit-msg">${warn}</span>
      <span class="actions">
        <button type="button" class="btn" data-bar="export">data.js 내보내기</button>
        <label class="btn file-btn">가져오기<input type="file" accept=".js,.json,application/json,text/javascript" data-bar="import" hidden /></label>
        ${store.local ? `<button type="button" class="btn" data-bar="reset">원래대로</button>` : ""}
      </span>
    </div>`;
  }

  function exportData() {
    const data = DATA();
    const locals = [];
    data.semesters.forEach((s) => (s.subjects || []).forEach((sub) => ["lectures", "textbooks"].forEach((k) => items(sub, k).forEach((it) => isLocal(it.file) && locals.push(`${s.name} › ${sub.name} › ${it.title}`)))));
    const header = `/* =========================================================
 * 시험 공부 사이트 데이터 파일 (사이트의 [data.js 내보내기] 로 생성: ${new Date().toLocaleString("ko-KR")})
 * 이 파일로 data/data.js 를 교체하면 수정 내용이 영구 반영됩니다.
 * 구조 설명은 README.md 를 참고하세요.
 * ========================================================= */
`;
    const js = `${header}\nwindow.STUDY_DATA = ${JSON.stringify(data, null, 2)};\n`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([js], { type: "text/javascript;charset=utf-8" }));
    a.download = "data.js";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    if (locals.length)
      alert(
        `data.js 를 내보냈어요.\n\n다만 아래 PDF ${locals.length}개는 이 브라우저에만 저장된 파일이라 data.js 에 포함되지 않습니다.\n` +
          `PDF 를 pdfs/ 폴더에 넣고 [수정] 에서 경로를 적어 주세요.\n\n- ` + locals.join("\n- ")
      );
    else toast("data.js 를 내려받았어요. data/data.js 를 이 파일로 교체하세요.");
  }

  async function importData(file) {
    const text = await file.text();
    let obj = null;
    try {
      obj = JSON.parse(text);
    } catch (e) {
      try {
        // data.js 형식: window.STUDY_DATA = {...}
        const sandbox = { STUDY_DATA: null };
        new Function("window", "String", text)(sandbox, String);
        obj = sandbox.STUDY_DATA;
      } catch (err) {}
    }
    if (!obj || !Array.isArray(obj.semesters)) return alert("data.js 또는 JSON 형식이 아니에요.");
    if (!confirm(`학기 ${obj.semesters.length}개가 들어 있는 파일이에요. 지금 내용을 이 파일로 바꿀까요?`)) return;
    store.data = obj;
    store.save();
    location.hash = "#/";
    route();
    toast("가져왔어요");
  }

  bar.addEventListener("click", (e) => {
    const b = e.target.closest("[data-bar]");
    if (!b) return;
    if (b.dataset.bar === "export") exportData();
    if (b.dataset.bar === "reset" && confirm("이 브라우저에 저장된 수정 내용을 지우고 data.js 원본으로 되돌릴까요?\n(먼저 [data.js 내보내기] 로 백업하는 것을 권장해요.)")) {
      store.reset();
      route();
      toast("원래대로 되돌렸어요");
    }
  });
  bar.addEventListener("change", (e) => {
    if (e.target.dataset.bar === "import" && e.target.files[0]) importData(e.target.files[0]).finally(() => (e.target.value = ""));
  });

  /* 상단 편집 모드 버튼 */
  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "btn edit-toggle";
  document.querySelector(".topbar").appendChild(editBtn);
  editBtn.addEventListener("click", () => setEditing(!editing));
  const paintEditBtn = () => {
    editBtn.textContent = editing ? "✓ 편집 끝내기" : "✎ 편집 모드";
    editBtn.classList.toggle("primary", editing);
    editBtn.setAttribute("aria-pressed", String(editing));
  };

  /* ---------------- 라우터 ---------------- */
  function route() {
    const { sem, sub, tab, index } = currentContext();
    const hasSub = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).length >= 2;
    if (!sem) viewSemesters();
    else if (!sub) viewSubjects(sem);
    else viewSubject(sem, sub, hasSub ? tab.id : "lectures", index);
    if (index == null) window.scrollTo(0, 0);
    paintEditBtn();
    renderEditBar();
  }

  document.body.classList.toggle("editing", editing);
  document.getElementById("site-title").textContent = DATA().siteTitle || "시험 공부 노트";
  const footer = document.querySelector(".footer");
  if (footer) footer.innerHTML = `정적 웹사이트 · 오른쪽 위 <b>편집 모드</b> 로 자료를 추가하고, <b>data.js 내보내기</b> 로 저장하세요`;
  window.addEventListener("hashchange", route);
  route();
})();
