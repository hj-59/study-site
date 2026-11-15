/* 암호 잠금 (잠금 빌드 전용)
 * - 모든 자료(data, 노트 .md, PDF)는 서버에 AES-256-GCM 으로 암호화되어 올라가 있습니다.
 * - 암호에서 PBKDF2-SHA256 으로 키를 만들어 브라우저 안에서만 복호화합니다.
 * - 암호가 없으면 파일을 받아도 내용을 볼 수 없습니다.
 */
(function () {
  "use strict";
  const KEY_STORE = "studyNotes.lockKey.v1";
  const app = document.getElementById("app");
  const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const ss = {
    get: (k) => { try { return sessionStorage.getItem(k) || localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v, remember) => { try { (remember ? localStorage : sessionStorage).setItem(k, v); } catch (e) {} },
    clear: (k) => { try { sessionStorage.removeItem(k); localStorage.removeItem(k); } catch (e) {} },
  };

  let meta, key, files = {};

  async function deriveKey(password) {
    const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: b64(meta.salt), iterations: meta.iter, hash: "SHA-256" },
      base, { name: "AES-GCM", length: 256 }, true, ["decrypt"]
    );
  }
  async function decrypt(buf) {
    const u = new Uint8Array(buf);
    return crypto.subtle.decrypt({ name: "AES-GCM", iv: u.slice(0, 12) }, key, u.slice(12));
  }
  async function fetchEnc(name) {
    const r = await fetch(name, { cache: "no-cache" });
    if (!r.ok) throw new Error("파일 없음: " + name);
    return decrypt(await r.arrayBuffer());
  }

  window.SITE_LOCK = {
    isLockedPath: (p) => Object.prototype.hasOwnProperty.call(files, p),
    async fetchBlob(p, type) {
      return new Blob([await fetchEnc(files[p])], { type });
    },
    lock() {
      ss.clear(KEY_STORE);
      location.reload();
    },
  };

  async function unlock() {
    const payload = JSON.parse(new TextDecoder().decode(await fetchEnc("data.enc")));
    files = payload.files || {};
    window.STUDY_DATA = payload.data;
    const s = document.createElement("script");
    s.src = "js/app.js";
    s.onload = addLockButton;
    document.body.appendChild(s);
  }

  function addLockButton() {
    const f = document.querySelector(".footer");
    if (!f) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tool";
    b.style.marginLeft = "8px";
    b.textContent = "🔒 잠그기";
    b.onclick = () => window.SITE_LOCK.lock();
    f.appendChild(b);
  }

  function showGate(msg) {
    document.getElementById("crumbs").innerHTML = "";
    app.innerHTML = `
      <section class="gate panel">
        <div class="gate-icon" aria-hidden="true">🔒</div>
        <h1>비공개 공부 노트</h1>
        <p>암호를 입력하면 열립니다.</p>
        <form id="gate-form" autocomplete="on">
          <input type="text" name="username" value="study" autocomplete="username" hidden />
          <input type="password" id="gate-pw" autocomplete="current-password" placeholder="암호" required />
          <label class="gate-remember"><input type="checkbox" id="gate-remember" /> 이 기기에서 암호 기억하기</label>
          <button class="btn primary" type="submit">열기</button>
          <p class="gate-msg" id="gate-msg" role="alert">${msg || ""}</p>
        </form>
      </section>`;
    const form = document.getElementById("gate-form");
    const pw = document.getElementById("gate-pw");
    pw.focus();
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector("button");
      btn.disabled = true;
      btn.textContent = "확인 중…";
      try {
        key = await deriveKey(pw.value);
        await unlock();
        ss.set(KEY_STORE, toB64(await crypto.subtle.exportKey("raw", key)), document.getElementById("gate-remember").checked);
      } catch (err) {
        key = null;
        btn.disabled = false;
        btn.textContent = "열기";
        document.getElementById("gate-msg").textContent = "암호가 맞지 않아요.";
        pw.select();
      }
    });
  }

  (async function start() {
    if (!window.crypto || !crypto.subtle) {
      app.innerHTML = `<div class="panel empty"><b>이 브라우저에서는 열 수 없어요</b>https 주소로 접속했는지 확인하세요.</div>`;
      return;
    }
    try {
      meta = await (await fetch("lock.json", { cache: "no-cache" })).json();
    } catch (e) {
      app.innerHTML = `<div class="panel empty"><b>사이트 설정 파일(lock.json)을 찾을 수 없어요</b></div>`;
      return;
    }
    const saved = ss.get(KEY_STORE);
    if (saved) {
      try {
        key = await crypto.subtle.importKey("raw", b64(saved), "AES-GCM", false, ["decrypt"]);
        await unlock();
        return;
      } catch (e) {
        ss.clear(KEY_STORE); // 암호가 바뀌었으면 다시 묻기
      }
    }
    showGate();
  })();
})();
