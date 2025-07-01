// --- Utility functions for localStorage ---
const LS_KEY = 'cyberSchoolData';
function loadData() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
    catch { return {}; }
}
function saveData(data) {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
}
let data = loadData();
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
// --- ANIMATION ---
function showCyberAnim(name) {
    $('#cyber-name').textContent = name ? name : 'Welcome';
    $('#cyber-animation').classList.remove('hidden');
    setTimeout(() => {
        $('#cyber-animation').classList.add('hidden');
    }, 2000);
}
// --- SETUP / LOGIN ---
function showSetup() {
    $('#setup-screen').classList.remove('hidden');
    $('#login-screen').classList.add('hidden');
    $('#main-app').classList.add('hidden');
}
function showLogin() {
    $('#login-screen').classList.remove('hidden');
    $('#setup-screen').classList.add('hidden');
    $('#main-app').classList.add('hidden');
}
function showApp() {
    $('#main-app').classList.remove('hidden');
    $('#setup-screen').classList.add('hidden');
    $('#login-screen').classList.add('hidden');
    showCyberAnim(data.name);
    setSidebar();
    loadPage(currentPage);
}
function setSidebar() {
    $('#sidebar-name').textContent = data.name || '';
    $('#sidebar-school').textContent = data.school || '';
    $('#sidebar-grade').textContent = data.grade ? `Grade: ${data.grade}` : '';
    $('#sidebar-age').textContent = data.age ? `Age: ${data.age}` : '';
}
// --- Routing ---
let currentPage = localStorage.getItem('cyberSchoolCurrentPage') || 'home';
function loadPage(page) {
    currentPage = page;
    localStorage.setItem('cyberSchoolCurrentPage', page);
    $$('#sidebar nav li').forEach(li => {
        li.classList.toggle('active', li.dataset.page === page);
    });
    fetch(`pages/${page}.html`)
        .then(resp => resp.text())
        .then(html => {
            $('#content').innerHTML = html;
            if (window[`init_${page}`]) window[`init_${page}`]();
        });
}
// --- LOGIC ENTRY ---
function mainInit() {
    if (!data.name || !data.password) {
        showSetup();
    } else {
        showCyberAnim(data.name);
        setTimeout(() => showLogin(), 1500);
    }
    $('#setup-form').onsubmit = e => {
        e.preventDefault();
        data = {
            name: $('#setup-name').value.trim(),
            school: $('#setup-school').value.trim(),
            grade: $('#setup-grade').value.trim(),
            age: $('#setup-age').value.trim(),
            password: $('#setup-password').value,
            assignments: [],
            schedule: [],
            calendar: {},
            links: [],
            notes: []
        };
        saveData(data);
        showCyberAnim(data.name);
        setTimeout(() => showApp(), 1600);
    };
    $('#login-form').onsubmit = e => {
        e.preventDefault();
        $('#login-error').textContent = '';
        if ($('#login-password').value === data.password) {
            window.location.href = 'pages/home.html';
        } else {
            $('#login-error').textContent = 'Incorrect password.';
        }
    };

    // Use buttons for navigation instead of links
    $$('#sidebar nav li[data-page]').forEach(li => {
        li.onclick = () => {
            // Redirect to the actual page file
            window.location.href = `pages/${li.dataset.page}.html`;
        };
    });

    $('#logout-btn').onclick = () => {
        $('#login-password').value = '';
        showLogin();
    };
}
window.onload = mainInit;

// --- PAGE-SPECIFIC LOGIC ---

// Assignments
window.init_assignments = function () {
    $('#assignment-form').onsubmit = e => {
        e.preventDefault();
        const t = $('#assign-title').value.trim();
        const d = $('#assign-due').value;
        if (!t || !d) return;
        (data.assignments = data.assignments || []).push({ title: t, due: d, done: false });
        saveData(data); loadPage('assignments');
    };
    $$('.assign-check').forEach(cb => {
        cb.onchange = e => {
            const idx = +cb.dataset.idx;
            data.assignments[idx].done = cb.checked;
            saveData(data); loadPage('assignments');
        };
    });
    $$('.delete-btn').forEach(btn => {
        btn.onclick = _ => {
            const idx = +btn.dataset.delidx;
            data.assignments.splice(idx, 1);
            saveData(data); loadPage('assignments');
        }
    });
};

// Schedule
window.init_schedule = function () {
    $('#schedule-form').onsubmit = e => {
        e.preventDefault();
        const p = $('#sch-period').value.trim();
        const c = $('#sch-class').value.trim();
        const t = $('#sch-time').value.trim();
        if (!p || !c || !t) return;
        (data.schedule = data.schedule || []).push({ period: p, class: c, time: t });
        saveData(data); loadPage('schedule');
    };
    $$('.delete-btn').forEach(btn => {
        btn.onclick = _ => {
            const idx = +btn.dataset.delidx;
            data.schedule.splice(idx, 1);
            saveData(data); loadPage('schedule');
        }
    });
};

// Links
window.init_links = function () {
    $('#link-form').onsubmit = e => {
        e.preventDefault();
        const name = $('#link-name').value.trim();
        const url = $('#link-url').value.trim();
        if (!name || !url) return;
        (data.links = data.links || []).push({ name, url });
        saveData(data); loadPage('links');
    };
    $$('.remove-link').forEach(btn => {
        btn.onclick = _ => {
            const idx = +btn.dataset.delidx;
            data.links.splice(idx, 1);
            saveData(data); loadPage('links');
        }
    });
};

// Notes
window.init_notes = function () {
    $('#note-form').onsubmit = e => {
        e.preventDefault();
        const txt = $('#note-content').value.trim();
        if (!txt) return;
        (data.notes = data.notes || []).push({ text: txt, date: (new Date()).toLocaleString() });
        saveData(data);
        loadPage('notes');
    };
    $$('.sticky-note').forEach((noteDiv, i) => {
        noteDiv.querySelector('.note-delete').onclick = _ => {
            data.notes.splice(i, 1);
            saveData(data);
            loadPage('notes');
        };
        noteDiv.querySelector('textarea').onchange = function () {
            data.notes[i].text = this.value;
            saveData(data);
        }
    });
};

// Calendar
window.init_calendar = function () {
    // Calendar modal logic is omitted for brevity; add your modal code here as in previous answer.
};