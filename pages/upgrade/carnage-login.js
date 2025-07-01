const THEMES = ["orange", "blue", "green", "purple", "red", "pink", "cyan", "indigo"];
const CARNAGE_PASSWORD = "gggamez4252"; // Change to your password!
const PASSWORD_SESSION = "carnage_session_valid";

// THEME HANDLING
function setTheme(theme) {
    if (!THEMES.includes(theme)) theme = "orange";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("carnage_theme", theme);
    document.querySelectorAll('.theme-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.theme === theme);
    });
}
function loadTheme() {
    setTheme(localStorage.getItem("carnage_theme") || "orange");
}
document.addEventListener("DOMContentLoaded", loadTheme);
document.querySelectorAll('.theme-dot').forEach(dot => {
    dot.onclick = () => setTheme(dot.dataset.theme);
});

// Prevent auto-redirect if on login page (index.html or upgrade/index.html)
function isLoginPage() {
    const path = window.location.pathname.replace(/^\//, '').toLowerCase();
    return path.endsWith("index.html") || path.endsWith("upgrade/index.html");
}

const pwInput = document.getElementById("login-password");
const pwBtn = document.getElementById("login-btn");
const pwErr = document.getElementById("login-error");
const toggleBtn = document.getElementById("toggle-password");
const loginForm = document.getElementById("carnage-login-form");

// Only redirect if already logged in and NOT on login page
if (sessionStorage.getItem(PASSWORD_SESSION) === "yes" && !isLoginPage()) {
    window.location = "home.html";
}

// PASSWORD SHOW/HIDE
if (toggleBtn && pwInput) {
    toggleBtn.onclick = function () {
        if (pwInput.type === "password") {
            pwInput.type = "text";
            toggleBtn.textContent = "🙈";
        } else {
            pwInput.type = "password";
            toggleBtn.textContent = "👁️";
        }
        pwInput.focus();
    };
}

// LOGIN LOGIC
function tryPass() {
    if (pwInput.value === CARNAGE_PASSWORD) {
        sessionStorage.setItem(PASSWORD_SESSION, "yes");
        window.location = "home.html";
    } else {
        pwErr.textContent = "Incorrect password";
        pwInput.value = "";
        pwInput.focus();
        loginForm.classList.remove("shake");
        void loginForm.offsetWidth;
        loginForm.classList.add("shake");
    }
}

// SHAKE FOR ERROR
const shakeCSS = document.createElement('style');
shakeCSS.innerHTML = `
@keyframes shake {10%, 90% {transform: translateX(-2px);}20%, 80% {transform: translateX(3px);}30%, 50%, 70% {transform: translateX(-6px);}40%, 60% {transform: translateX(6px);}}
.shake {animation: shake .45s cubic-bezier(.36,.07,.19,.97) both;}
`;
document.head.appendChild(shakeCSS);

// SUBMIT
if (loginForm && pwInput && pwBtn) {
    loginForm.onsubmit = function (e) {
        e.preventDefault();
        tryPass();
    };
    pwInput.onkeydown = (e) => { if (e.key === "Enter") tryPass(); };
    pwBtn.onclick = tryPass;
    pwInput.focus();
}