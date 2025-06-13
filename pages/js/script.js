// Carnage Hub - Main Application Script
class CarnageHub {
    constructor() {
        this.currentPage = 'home';
        this.isLoggedIn = false;
        this.settings = this.loadSettings();
        this.init();
    }

    // Initialize the application
    init() {
        this.checkLogin();
        this.setupEventListeners();
        this.applyTheme();
        this.loadPage(this.settings.defaultPage || 'home');
        this.updateUserInfo();
    }

    // Load settings from localStorage
    loadSettings() {
        const defaultSettings = {
            theme: 'orange',
            username: 'User',
            defaultPage: 'home',
            animationSpeed: 1,
            reduceMotion: false,
            autoSave: true,
            showNotifications: true,
            rememberLogin: true,
            clearOnExit: false,
            analytics: false
        };

        try {
            const saved = localStorage.getItem('carnage_settings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (e) {
            console.error('Failed to load settings:', e);
            return defaultSettings;
        }
    }

    // Save settings to localStorage
    saveSettings() {
        try {
            localStorage.setItem('carnage_settings', JSON.stringify(this.settings));
            localStorage.setItem('carnage_theme', this.settings.theme);
            localStorage.setItem('carnage_username', this.settings.username);
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }

    // Check login status
    checkLogin() {
        const loginStatus = localStorage.getItem('carnage_login');
        const rememberLogin = localStorage.getItem('carnage_remember_login') === 'true';
        
        if (loginStatus === 'true' && rememberLogin) {
            this.isLoggedIn = true;
            this.showMainApp();
        } else {
            this.showLoginScreen();
        }
    }

    // Show login screen
    showLoginScreen() {
        document.body.innerHTML = `
            <div class="login-wrapper">
                <div class="login-background">
                    <div class="animated-bg"></div>
                    <div class="grid-overlay"></div>
                </div>
                <div class="login-box">
                    <div class="login-header">
                        <h1 class="brand-logo">CARNAGE</h1>
                        <p class="brand-subtitle">Hub Access Portal</p>
                    </div>
                    <form class="login-form" onsubmit="carnageHub.handleLogin(event)">
                        <div class="input-group">
                            <input type="password" id="password-input" placeholder="Enter Access Code" required>
                            <div class="input-line"></div>
                        </div>
                        <button type="submit" class="login-btn">
                            <span class="btn-glow"></span>
                            Access Hub
                        </button>
                        <div class="error-text" id="error-text"></div>
                    </form>
                    <div class="login-footer">
                        <div class="security-indicator">
                            <div class="indicator-dot"></div>
                            Secure Connection
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Focus on password input
        setTimeout(() => {
            const passwordInput = document.getElementById('password-input');
            if (passwordInput) passwordInput.focus();
        }, 500);
    }

    // Handle login
    handleLogin(event) {
        event.preventDefault();
        const password = document.getElementById('password-input').value;
        const errorText = document.getElementById('error-text');
        
        // Simple password check (in a real app, this would be more secure)
        const validPasswords = ['carnage', 'admin', 'password', '123456', 'hub'];
        
        if (validPasswords.includes(password.toLowerCase())) {
            this.isLoggedIn = true;
            localStorage.setItem('carnage_login', 'true');
            localStorage.setItem('carnage_remember_login', 'true');
            
            // Animate login success
            document.querySelector('.login-box').style.transform = 'scale(0.9)';
            document.querySelector('.login-box').style.opacity = '0';
            
            setTimeout(() => {                this.showMainApp();
            }, 500);
        } else {
            errorText.textContent = 'Invalid access code. Try: carnage, admin, password, 123456, or hub';
            errorText.classList.add('show');
            
            // Shake animation
            const loginBox = document.querySelector('.login-box');
            loginBox.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                loginBox.style.animation = '';
            }, 500);
            
            // Clear error after 3 seconds
            setTimeout(() => {
                errorText.classList.remove('show');
            }, 3000);
        }
    }

    // Show main application
    showMainApp() {
        document.body.innerHTML = `
            <div class="app-container">
                <nav class="sidebar">
                    <div class="sidebar-header">
                        <h1 class="nav-logo">CARNAGE</h1>
                        <p class="nav-subtitle">Hub Portal</p>
                    </div>
                    <ul class="nav-menu">
                        <li><a href="#" class="nav-link" data-page="home">
                            <div class="nav-icon home-icon"></div>
                            <span>Home</span>
                        </a></li>
                        <li><a href="#" class="nav-link" data-page="games">
                            <div class="nav-icon games-icon"></div>
                            <span>Games</span>
                        </a></li>
                        <li><a href="#" class="nav-link" data-page="music">
                            <div class="nav-icon music-icon"></div>
                            <span>Music</span>
                        </a></li>
                        <li><a href="#" class="nav-link" data-page="tools">
                            <div class="nav-icon tools-icon"></div>
                            <span>Tools</span>
                        </a></li>
                        <li><a href="#" class="nav-link" data-page="system">
                            <div class="nav-icon system-icon"></div>
                            <span>System</span>
                        </a></li>
                        <li><a href="#" class="nav-link" data-page="settings">
                            <div class="nav-icon settings-icon"></div>
                            <span>Settings</span>
                        </a></li>
                    </ul>
                    <div class="sidebar-footer">
                        <div class="user-info">
                            <div class="user-avatar"></div>
                            <div class="user-details">
                                <div class="username">${this.settings.username}</div>
                                <div class="status">Online</div>
                            </div>
                        </div>
                    </div>
                </nav>
                <main class="main-content">
                    <header class="content-header">
                        <h2 class="breadcrumb" id="page-title">Home</h2>
                        <div class="header-actions">
                            <button class="action-btn" onclick="carnageHub.toggleFullscreen()" title="Toggle Fullscreen">
                                <div class="fullscreen-icon"></div>
                            </button>
                            <button class="action-btn" onclick="carnageHub.logout()" title="Logout">
                                <div class="logout-icon"></div>
                            </button>
                        </div>
                    </header>
                    <div class="page-container">
                        <iframe id="content-frame" src="pages/home.html"></iframe>
                    </div>
                </main>
            </div>
        `;
        
        this.setupMainAppEventListeners();
        this.applyTheme();
        this.loadPage(this.settings.defaultPage || 'home');
    }

    // Setup event listeners for main app
    setupMainAppEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.loadPage(page);
            });
        });

        // Listen for messages from iframes
        window.addEventListener('message', (event) => {
            this.handleMessage(event);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    // Setup general event listeners
    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle beforeunload
        window.addEventListener('beforeunload', () => {
            this.handleBeforeUnload();
        });
    }

    // Load a page
    loadPage(pageName) {
        if (!this.isLoggedIn) return;
        
        this.currentPage = pageName;
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageName) {
                link.classList.add('active');
            }
        });
        
        // Update page title
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = this.getPageTitle(pageName);
        }
        
        // Load page content
        const contentFrame = document.getElementById('content-frame');
        if (contentFrame) {
            contentFrame.src = `pages/${pageName}.html`;
        }
        
        // Update URL hash
        window.location.hash = pageName;
    }

    // Get page title
    getPageTitle(pageName) {
        const titles = {
            home: 'Home',
            games: 'Games',
            music: 'Music',
            tools: 'Tools',
            system: 'System Info',
            settings: 'Settings'
        };
        return titles[pageName] || 'Unknown';
    }

    // Handle messages from iframes
    handleMessage(event) {
        const { type, data } = event.data;
        
        switch (type) {
            case 'notification':
                this.showNotification(event.data.message, event.data.level);
                break;
            case 'theme-changed':
                this.settings.theme = event.data.theme;
                this.applyTheme();
                this.saveSettings();
                break;
            case 'settings-changed':
                this.settings = { ...this.settings, ...event.data.settings };
                this.saveSettings();
                this.updateUserInfo();
                break;
            case 'data-cleared':
                this.settings = this.loadSettings();
                this.updateUserInfo();
                break;
            case 'page-change':
                this.loadPage(event.data.page);
                break;
        }
    }

    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + number keys for navigation
        if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            const pages = ['home', 'games', 'music', 'tools', 'system', 'settings'];
            const pageIndex = parseInt(e.key) - 1;
            if (pages[pageIndex]) {
                this.loadPage(pages[pageIndex]);
            }
        }
        
        // F11 for fullscreen
        if (e.key === 'F11') {
            e.preventDefault();
            this.toggleFullscreen();
        }
        
        // Escape to close modals or go back
        if (e.key === 'Escape') {
            this.handleEscape();
        }
    }

    // Handle escape key
    handleEscape() {
        // Close any open modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.remove();
        });
        
        // Send escape to iframe
        const contentFrame = document.getElementById('content-frame');
        if (contentFrame && contentFrame.contentWindow) {
            contentFrame.contentWindow.postMessage({ type: 'escape' }, '*');
        }
    }

    // Apply theme
    applyTheme() {
        const theme = this.settings.theme || 'orange';
        document.documentElement.setAttribute('data-theme', theme);
        
        // Send theme to iframe
        setTimeout(() => {
            const contentFrame = document.getElementById('content-frame');
            if (contentFrame && contentFrame.contentWindow) {
                contentFrame.contentWindow.postMessage({ 
                    type: 'theme-changed', 
                    theme: theme 
                }, '*');
            }
        }, 100);
    }

    // Update user info
    updateUserInfo() {
        const usernameElement = document.querySelector('.username');
        if (usernameElement) {
            usernameElement.textContent = this.settings.username || 'User';
        }
    }

    // Show notification
    showNotification(message, level = 'info') {
        if (!this.settings.showNotifications) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${level}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Toggle fullscreen
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                this.showNotification(`Error attempting to enable fullscreen: ${err.message}`, 'error');
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Logout
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            this.isLoggedIn = false;
            localStorage.removeItem('carnage_login');
            
            if (this.settings.clearOnExit) {
                this.clearSensitiveData();
            }
            
            this.showLoginScreen();
            this.showNotification('Logged out successfully');
        }
    }

    // Clear sensitive data
    clearSensitiveData() {
        const keysToKeep = ['carnage_settings', 'carnage_theme', 'carnage_username'];
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('carnage_') && !keysToKeep.includes(key)) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }

    // Handle window resize
    handleResize() {
        // Responsive adjustments
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (window.innerWidth < 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    // Handle visibility change
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden
            this.handlePageHidden();
        } else {
            // Page is visible
            this.handlePageVisible();
        }
    }

    // Handle page hidden
    handlePageHidden() {
        // Pause any animations or timers
        document.documentElement.style.setProperty('--animation-play-state', 'paused');
    }

    // Handle page visible
    handlePageVisible() {
        // Resume animations
        document.documentElement.style.setProperty('--animation-play-state', 'running');
    }

    // Handle before unload
    handleBeforeUnload() {
        if (this.settings.clearOnExit) {
            this.clearSensitiveData();
        }
        
        // Save current state
        this.saveSettings();
    }

    // Get system info
    getSystemInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screenResolution: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            pixelRatio: window.devicePixelRatio,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            memory: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null
        };
    }

    // Debug mode
    enableDebugMode() {
        console.log('Debug mode enabled');
        window.carnageDebug = {
            settings: this.settings,
            currentPage: this.currentPage,
            systemInfo: this.getSystemInfo(),
            clearData: () => this.clearSensitiveData(),
            showNotification: (msg, level) => this.showNotification(msg, level),
            loadPage: (page) => this.loadPage(page)
        };
        this.showNotification('Debug mode enabled. Check console for carnageDebug object.', 'info');
    }
}

// CSS Animation for shake effect
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

// Add shake animation to document
const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// Initialize the application
let carnageHub;

document.addEventListener('DOMContentLoaded', () => {
    carnageHub = new CarnageHub();
    
    // Enable debug mode with Konami code
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            carnageHub.enableDebugMode();
            konamiCode = [];
        }
    });
});

// Handle hash changes for direct navigation
window.addEventListener('hashchange', () => {
    const page = window.location.hash.substring(1);
    if (page && carnageHub && carnageHub.isLoggedIn) {
        carnageHub.loadPage(page);
    }
});

// Export for global access
window.carnageHub = carnageHub;
