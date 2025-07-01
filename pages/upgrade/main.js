// ========== CARNAGE DASHBOARD - ULTIMATE VERSION ==========

// ------------- CONFIG -----------
const CARNAGE_PASSWORD = "gggamez4252"; // CHANGE THIS!
const PASSWORD_SESSION = "carnage_session_valid";
const ANIMATION_KEY = "carnage_animations";
const THEMES = ["orange", "blue", "green", "purple", "red", "pink", "cyan", "indigo"];

// --------- PASSWORD & PROTECTION ---------
function blockDevTools() {
  window.addEventListener("contextmenu", e => e.preventDefault());
  window.addEventListener("keydown", function (e) {
    if (
      e.keyCode === 123 ||
      (e.ctrlKey && e.shiftKey && ["I", "J"].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && ["U", "S", "P"].includes(e.key.toUpperCase())) ||
      (e.metaKey && e.altKey && e.key.toUpperCase() === "I")
    ) e.preventDefault();
  });
  window.addEventListener("selectstart", e => e.preventDefault());
}
function showPasswordOverlay() {
  const overlay = document.getElementById("password-overlay");
  overlay.classList.remove("hidden"); overlay.innerHTML = `
    <div class="password-modal">
      <img src="logo.svg" class="logo" alt="Carnage Logo">
      <h1>Carnage</h1>
      <input type="password" id="password-input" placeholder="Enter password" autocomplete="off">
      <button id="password-submit">Unlock</button>
      <div id="pass-error"></div>
    </div>`;
  setTimeout(() => document.getElementById("password-input").focus(), 50);
  document.getElementById("password-submit").onclick = tryPass;
  document.getElementById("password-input").onkeydown = e => { if (e.key === "Enter") tryPass(); };
  function tryPass() {
    let val = document.getElementById("password-input").value;
    if (val === CARNAGE_PASSWORD) {
      sessionStorage.setItem(PASSWORD_SESSION, "yes");
      overlay.classList.add("hidden");
      showToast("Welcome to Carnage!", "success");
      document.body.classList.remove("blurred");
    } else {
      document.getElementById("pass-error").textContent = "Incorrect password";
      document.getElementById("password-input").value = "";
      showToast("Wrong password!", "error");
    }
  }
}
function checkPassword() {
  if (sessionStorage.getItem(PASSWORD_SESSION) === "yes") { document.body.classList.remove("blurred"); return true; }
  document.body.classList.add("blurred");
  showPasswordOverlay();
}
blockDevTools();
checkPassword(); // Always ask, every visit

// ----------- PAGE TRANSITIONS -----------
function showTransition(cb) {
  const overlay = document.getElementById("transition-overlay");
  overlay.classList.add("show");
  setTimeout(() => { cb && cb(); setTimeout(() => overlay.classList.remove("show"), 900); }, 700);
}
document.addEventListener("keydown", function (e) {
  if (
    e.key.toLowerCase() === 'h' &&
    e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey &&
    !['INPUT', 'TEXTAREA'].includes((document.activeElement || {}).tagName)
  ) {
    showTransition(() => { window.location.href = "index.html"; });
  }
});

// ----------- THEMES -----------
function applyTheme(theme) {
  if (!THEMES.includes(theme)) theme = "orange";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("carnage_theme", theme);
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}
function loadTheme() { applyTheme(localStorage.getItem("carnage_theme") || "orange"); }
document.addEventListener("DOMContentLoaded", loadTheme);
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("theme-option")) {
    applyTheme(e.target.dataset.theme);
    showToast("Theme changed!", "info");
  }
  if (e.target.classList.contains("theme-toggle")) {
    let now = THEMES.indexOf(localStorage.getItem("carnage_theme") || "orange");
    let next = THEMES[(now + 1) % THEMES.length];
    applyTheme(next);
    showToast("Theme changed!", "info");
  }
});
// Navbar active link
document.addEventListener("DOMContentLoaded", function () {
  let here = location.pathname.split('/').pop();
  document.querySelectorAll(".navbar-link").forEach(link => {
    if (link.getAttribute("href") === here) link.classList.add("active");
  });
});

// ========== TOASTS ==========
function showToast(msg, type = 'info') {
  let toast = document.createElement("div");
  toast.className = "toast " + type;
  toast.textContent = msg;
  document.getElementById("toast").appendChild(toast);
  setTimeout(() => toast.style.opacity = 1, 10);
  setTimeout(() => { toast.style.opacity = 0; setTimeout(() => toast.remove(), 500); }, 2400);
}

// ========== GAMES PAGE ==========
if (document.getElementById("games-container")) {
  // Sample games: use real HTML/JS game files in your folder!
  const games = [
    { id: 1, title: "2048", description: "Combine tiles to reach 2048.", tags: ["Logic", "Numbers"], file: "game-2048.html" },
    { id: 2, title: "Snake", description: "Classic snake game.", tags: ["Classic", "Arcade"], file: "game-snake.html" },
    { id: 3, title: "Tetris", description: "Stack blocks!", tags: ["Classic", "Puzzle"], file: "game-tetris.html" },
    { id: 4, title: "Minesweeper", description: "Clear the minefield.", tags: ["Puzzle"], file: "game-minesweeper.html" },
    { id: 5, title: "Chess", description: "Play chess vs computer.", tags: ["Strategy"], file: "game-chess.html" },
    { id: 6, title: "Flappy Bird", description: "Flap between pipes!", tags: ["Arcade"], file: "game-flappy.html" },
    { id: 7, title: "Solitaire", description: "Classic patience game.", tags: ["Cards"], file: "game-solitaire.html" },
    { id: 8, title: "Space Invaders", description: "Shoot aliens!", tags: ["Shooter"], file: "game-invaders.html" }
  ];
  let filter = "all", search = "";
  let favorites = JSON.parse(localStorage.getItem("carnage_favorites") || "[]");
  function renderGames() {
    let filtered = games.filter(g => {
      if (filter === "favorites") return favorites.includes(g.id);
      return true;
    }).filter(g => {
      if (!search) return true;
      let q = search.toLowerCase();
      return g.title.toLowerCase().startsWith(q) ||
        g.description.toLowerCase().includes(q) ||
        g.tags.some(t => t.toLowerCase().includes(q));
    });
    let html = '';
    if (filtered.length === 0) html = `<div class="no-results"><div class="no-results-icon">🎮</div><h3>No games found</h3></div>`;
    else html = filtered.map(game => `
      <div class="game-card" data-game-id="${game.id}">
        <div class="game-info">
          <h3 class="game-title">${game.title}</h3>
          <p class="game-description">${game.description}</p>
          <div class="game-tags">${game.tags.map(t => `<span class="game-tag">${t}</span>`).join('')}</div>
          <div class="game-actions">
            <button class="play-btn" onclick="openGame('${game.file}')">Play Now</button>
            <button class="favorite-btn${favorites.includes(game.id) ? ' active' : ''}" onclick="toggleFavorite(${game.id})">${favorites.includes(game.id) ? '❤️' : '🤍'}</button>
          </div>
        </div>
      </div>
    `).join('');
    document.getElementById("games-container").innerHTML = html;
  }
  window.openGame = function (file) {
    let win = window.open("about:blank");
    fetch(file).then(r => r.text()).then(html => win.document.write(html));
    showToast("Game opened!", "info");
  }
  window.toggleFavorite = function (id) {
    let idx = favorites.indexOf(id);
    if (idx > -1) { favorites.splice(idx, 1); showToast("Removed from favorites", "info"); }
    else { favorites.push(id); showToast("Added to favorites", "success"); }
    localStorage.setItem("carnage_favorites", JSON.stringify(favorites));
    renderGames();
  }
  document.addEventListener("DOMContentLoaded", () => {
    renderGames();
    document.querySelectorAll(".filter-tab").forEach(btn => {
      btn.onclick = () => { document.querySelectorAll(".filter-tab").forEach(b => b.classList.remove("active")); btn.classList.add("active"); filter = btn.dataset.category; renderGames(); }
    });
    let searchEl = document.getElementById("game-search");
    searchEl.oninput = e => { search = e.target.value; renderGames(); }
    searchEl.onkeydown = e => { if (e.key === "Enter") renderGames(); };
  });
}

// ========== MUSIC PAGE (UPDATED: Search only on Enter or Button) ==========
if (document.getElementById("music-search")) {
  let searchEl = document.getElementById("music-search");
  let searchBtn = document.getElementById("music-btn");
  function doMusicSearch() {
    let q = searchEl.value.trim();
    if (q.length) window.open("https://www.youtube.com/results?search_query=" + encodeURIComponent(q), "_blank");
  }
  if (searchBtn) searchBtn.addEventListener("click", doMusicSearch);
  searchEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") doMusicSearch();
  });
}

// ========== SYSTEM PAGE ==========
if (document.getElementById("system-info")) {
  // Battery widget!
  function batteryLevelWidget(pct) {
    pct = Math.max(0, Math.min(100, Math.round(pct)));
    let level = "high";
    if (pct < 33) level = "low"; else if (pct < 67) level = "medium";
    return `
      <div class="battery-widget" data-level="${level}">
        <div class="battery-bar" style="width:${pct * 0.85}px; background:${level === "high" ? "#27d14f" : level === "medium" ? "#e5e532" : "#ff6b35"
      }"></div>
        <div class="battery-tip"></div>
      </div>
      <div class="battery-pct">${pct}%</div>
    `;
  }
  function getBatteryInfo(cb) {
    if (!navigator.getBattery) return cb({ level: null, charging: null });
    navigator.getBattery().then(bat => {
      cb({ level: Math.round(bat.level * 100), charging: bat.charging });
    }).catch(() => cb({ level: null, charging: null }));
  }
  function fetchLocation(cb) {
    fetch("https://ipapi.co/json/").then(r => r.json()).then(data => {
      cb({ city: data.city, country: data.country_name, ip: data.ip });
    }).catch(() => cb({ city: "?", country: "?", ip: "?" }));
  }
  function renderSys() {
    getBatteryInfo(bat => {
      fetchLocation(loc => {
        let info = [
          { label: "User Agent", value: navigator.userAgent },
          { label: "Platform", value: navigator.platform },
          { label: "Language", value: navigator.language },
          { label: "Online", value: navigator.onLine ? "Yes" : "No" },
          { label: "Screen", value: `${screen.width} x ${screen.height}` },
          { label: "Window", value: `${window.innerWidth} x ${window.innerHeight}` },
          { label: "Timezone", value: Intl.DateTimeFormat().resolvedOptions().timeZone },
          { label: "Memory", value: navigator.deviceMemory ? navigator.deviceMemory + " GB" : "?" },
          { label: "CPU Cores", value: navigator.hardwareConcurrency || "?" },
          { label: "Connection", value: (navigator.connection || {}).effectiveType || "?" },
          { label: "Location", value: `${loc.city}, ${loc.country} [${loc.ip}]` }
        ];
        let html = "";
        html += `<div class="system-card">
          <div class="system-label">Battery</div>
          ${bat.level !== null ? batteryLevelWidget(bat.level) : "?"}
          <div style="text-align:center;color:var(--text-muted);font-size:0.97em;">Charging: ${bat.charging === null ? "?" : bat.charging ? "Yes" : "No"}</div>
        </div>`;
        for (let i = 0; i < info.length; i += 2) {
          html += `<div class="system-card">
            <div class="system-label">${info[i].label}</div>
            <div>${info[i].value}</div>
            ${info[i + 1] ? `<div class="system-label" style="margin-top:1.3em">${info[i + 1].label}</div><div>${info[i + 1].value}</div>` : ""}
          </div>`;
        }
        document.getElementById("system-info").innerHTML = html;
      });
    });
  }
  renderSys();
  window.addEventListener("resize", renderSys);
}

// ========== SETTINGS PAGE ==========
if (document.getElementById("clear-favorites")) {
  document.getElementById("clear-favorites").onclick = function () {
    localStorage.removeItem("carnage_favorites");
    showToast("All favorites cleared!", "success");
  };
}
if (document.getElementById("reset-all")) {
  document.getElementById("reset-all").onclick = function () {
    localStorage.clear(); sessionStorage.clear();
    showToast("All data reset. Reloading...", "success");
    setTimeout(() => location.reload(), 500);
  };
}
if (document.getElementById("toggle-animations")) {
  document.getElementById("toggle-animations").onclick = function () {
    let now = localStorage.getItem(ANIMATION_KEY) === "off";
    localStorage.setItem(ANIMATION_KEY, now ? "on" : "off");
    document.body.classList.toggle("no-animations", !now);
    showToast((now ? "Animations on" : "Animations off"), "info");
  };
}
if (document.getElementById("show-about")) {
  document.getElementById("show-about").onclick = function () {
    document.getElementById("about-modal").classList.remove("hidden");
  };
}
if (document.getElementById("about-close")) {
  document.getElementById("about-close").onclick = function () {
    document.getElementById("about-modal").classList.add("hidden");
  };
}
if (document.getElementById("export-favorites")) {
  document.getElementById("export-favorites").onclick = function () {
    let data = localStorage.getItem("carnage_favorites") || "[]";
    let blob = new Blob([data], { type: "application/json" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "favorites.json";
    a.click();
  };
}
if (document.getElementById("import-favorites-btn")) {
  document.getElementById("import-favorites-btn").onclick = function () {
    document.getElementById("import-favorites").click();
  };
  document.getElementById("import-favorites").onchange = function (e) {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function (evt) {
      try {
        let arr = JSON.parse(evt.target.result);
        if (Array.isArray(arr)) {
          localStorage.setItem("carnage_favorites", JSON.stringify(arr));
          showToast("Favorites imported!", "success");
        } else throw "Invalid";
      } catch { showToast("Invalid file!", "error"); }
    };
    reader.readAsText(file);
  };
}
if (document.getElementById("set-password-btn")) {
  document.getElementById("set-password-btn").onclick = function () {
    let newpass = prompt("Set new password:");
    if (newpass && newpass.length >= 3) {
      localStorage.setItem("carnage_password", newpass);
      showToast("Password changed! (refresh to use)", "success");
    } else showToast("Password not changed.", "error");
  };
}
if (document.getElementById("lock-now-btn")) {
  document.getElementById("lock-now-btn").onclick = function () {
    // Use variable or fallback to string if undefined
    var sessionKey = typeof PASSWORD_SESSION !== "undefined" ? PASSWORD_SESSION : "carnage_session_valid";
    sessionStorage.removeItem(sessionKey);
    // Optionally also clear localStorage session for stricter security:
    // localStorage.removeItem(sessionKey);

    // Redirect to login page for a proper lock (not just reload)
    window.location = "index.html";
  };
}

// ========== TOOLS PAGE ==========
if (document.getElementById("tools-cards")) {
  function toolCard(title, html, handler) {
    let el = document.createElement("div");
    el.className = "tool-card";
    el.innerHTML = `<h3>${title}</h3>` + html + `<div class="tool-result"></div>`;
    if (handler) handler(el);
    return el;
  }
  let cards = [
    toolCard("Calculator", `<input type="text" class="tool-input" placeholder="2+2*5">
      <button class="tool-btn">Calculate</button>`, el => {
      el.querySelector(".tool-btn").onclick = () => {
        let input = el.querySelector(".tool-input").value;
        try { el.querySelector(".tool-result").textContent = "= " + eval(input); }
        catch { el.querySelector(".tool-result").textContent = "Invalid!"; }
      };
    }),
    toolCard("Unit Converter", `<input type="number" class="tool-input" placeholder="Value">
      <select class="tool-select">
        <option value="cm">cm</option><option value="m">m</option><option value="km">km</option>
      </select> to
      <select class="tool-select">
        <option value="cm">cm</option><option value="m">m</option><option value="km">km</option>
      </select>
      <button class="tool-btn">Convert</button>`, el => {
      el.querySelector(".tool-btn").onclick = () => {
        let val = parseFloat(el.querySelectorAll(".tool-input")[0].value);
        let from = el.querySelectorAll(".tool-select")[0].value;
        let to = el.querySelectorAll(".tool-select")[1].value;
        if (isNaN(val)) el.querySelector(".tool-result").textContent = "Invalid!";
        else {
          let meters = (from === "cm" ? val / 100 : from === "km" ? val * 1000 : val);
          let out = (to === "cm" ? meters * 100 : to === "km" ? meters / 1000 : meters);
          el.querySelector(".tool-result").textContent = "= " + out + " " + to;
        }
      };
    }),
    toolCard("Timer", `<input type="number" class="tool-input" placeholder="Seconds">
      <button class="tool-btn">Start</button>`, el => {
      let timerRef;
      el.querySelector(".tool-btn").onclick = () => {
        let sec = parseInt(el.querySelector(".tool-input").value);
        let out = el.querySelector(".tool-result");
        if (isNaN(sec) || sec <= 0) { out.textContent = "Invalid!"; return; }
        out.textContent = "Timer: " + sec + "s";
        clearInterval(timerRef);
        timerRef = setInterval(() => {
          sec--; out.textContent = "Timer: " + sec + "s";
          if (sec <= 0) { clearInterval(timerRef); out.textContent = "Time's up! ⏰"; showToast("Time's up!", "info"); }
        }, 1000);
      };
    }),
    toolCard("Stopwatch", `<button class="tool-btn">Start</button> <button class="tool-btn">Reset</button>`, el => {
      let running = false, t = 0, ref, out = el.querySelector(".tool-result");
      el.querySelectorAll(".tool-btn")[0].onclick = () => {
        if (running) return;
        running = true; out.textContent = "0.00s";
        ref = setInterval(() => { t += .1; out.textContent = t.toFixed(2) + "s"; }, 100);
      };
      el.querySelectorAll(".tool-btn")[1].onclick = () => {
        running = false; clearInterval(ref); t = 0; out.textContent = "0.00s";
      };
    }),
    toolCard("QR Generator", `<input type="text" class="tool-input" placeholder="Text or URL">
      <button class="tool-btn">Make QR</button> <br><img style="display:none;" class="qr-img" width="120">`, el => {
      el.querySelector(".tool-btn").onclick = () => {
        let val = el.querySelector(".tool-input").value;
        let img = el.querySelector(".qr-img");
        if (val.length < 1) return;
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(val)}`;
        img.style.display = "block";
      };
    }),
    toolCard("Color Picker", `<input type="color" class="tool-input"><span class="color-val"></span>`, el => {
      let inp = el.querySelector(".tool-input");
      let out = el.querySelector(".color-val");
      inp.oninput = () => { out.textContent = " " + inp.value; };
    }),
    toolCard("Password Generator", `<input type="number" class="tool-input" placeholder="Length" value="12" min="4" max="32">
      <button class="tool-btn">Generate</button>`, el => {
      el.querySelector(".tool-btn").onclick = () => {
        let len = parseInt(el.querySelector(".tool-input").value) || 12, chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let pass = Array(len).fill().map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
        el.querySelector(".tool-result").textContent = pass;
      };
    }),
    toolCard("Random Number", `<input type="number" class="tool-input" placeholder="Min" value="1">
      <input type="number" class="tool-input" placeholder="Max" value="100">
      <button class="tool-btn">Roll</button>`, el => {
      el.querySelector(".tool-btn").onclick = () => {
        let min = parseInt(el.querySelectorAll(".tool-input")[0].value) || 1;
        let max = parseInt(el.querySelectorAll(".tool-input")[1].value) || 100;
        let n = Math.floor(Math.random() * (max - min + 1)) + min;
        el.querySelector(".tool-result").textContent = n;
      };
    }),
    toolCard("Text Case Converter", `<input type="text" class="tool-input" placeholder="Text">
      <button class="tool-btn">UPPERCASE</button>
      <button class="tool-btn">lowercase</button>`, el => {
      el.querySelectorAll(".tool-btn")[0].onclick = () => {
        let txt = el.querySelector(".tool-input").value;
        el.querySelector(".tool-result").textContent = txt.toUpperCase();
      };
      el.querySelectorAll(".tool-btn")[1].onclick = () => {
        let txt = el.querySelector(".tool-input").value;
        el.querySelector(".tool-result").textContent = txt.toLowerCase();
      };
    }),
    toolCard("Base64 Encoder/Decoder", `<input type="text" class="tool-input" placeholder="Text">
      <button class="tool-btn">Encode</button><button class="tool-btn">Decode</button>`, el => {
      el.querySelectorAll(".tool-btn")[0].onclick = () => {
        let txt = el.querySelector(".tool-input").value;
        try { el.querySelector(".tool-result").textContent = btoa(txt); }
        catch { el.querySelector(".tool-result").textContent = "Invalid!"; }
      };
      el.querySelectorAll(".tool-btn")[1].onclick = () => {
        let txt = el.querySelector(".tool-input").value;
        try { el.querySelector(".tool-result").textContent = atob(txt); }
        catch { el.querySelector(".tool-result").textContent = "Invalid!"; }
      };
    })
  ];
  let container = document.getElementById("tools-cards");
  cards.forEach(c => container.appendChild(c));
}

// ========== ANIMATIONS SETTING ==========
if (localStorage.getItem(ANIMATION_KEY) === "off") document.body.classList.add("no-animations");