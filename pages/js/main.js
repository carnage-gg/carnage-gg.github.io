// Main application functionality
let currentPage = 'home';

// Check authentication on dashboard
function checkDashboardAuth() {
    const isAuthenticated = sessionStorage.getItem('carnage_authenticated');
    if (isAuthenticated !== 'true') {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Load page in iframe
function loadPage(pageName) {
    if (!checkDashboardAuth()) return;
    
    const contentFrame = document.getElementById('content-frame');
    const pageTitle = document.getElementById('page-title');
    const navLinks = document.querySelectorAll('.navbar-link');
    
    // Update active navigation
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(pageName)) {
            link.classList.add('active');
        }
    });
    
    // Update page title
    const titles = {
        'home': 'Home',
        'games': 'Games Library',
        'music': 'Music Search',
        'tools': 'Tools & Utilities',
        'system': 'System Information',
        'settings': 'Settings'
    };
    
    pageTitle.textContent = titles[pageName] || 'Home';
    
    // Load page with smooth transition
    contentFrame.style.opacity = '0.5';
    contentFrame.src = `pages/${pageName}.html`;
    
    // Store current page
    currentPage = pageName;
    localStorage.setItem('carnage_last_page', pageName);
    
    // Restore opacity after load
    contentFrame.onload = () => {
        setTimeout(() => {
            contentFrame.style.opacity = '1';
            contentFrame.style.transition = 'opacity 0.3s ease';
        }, 100);
    };
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            showNotification('Fullscreen not supported', 'error');
        });
    } else {
        document.exitFullscreen();
    }
}

// Show notification
function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (!checkDashboardAuth()) return;
    
    // Alt + number keys for quick navigation
    if (e.altKey) {
        switch(e.key) {
            case '1':
                loadPage('home');
                break;
            case '2':
                loadPage('games');
                break;
            case '3':
                loadPage('music');
                break;
            case '4':
                loadPage('tools');
                break;
            case '5':
                loadPage('system');
                break;
            case '6':
                loadPage('settings');
                break;
        }
    }
    
    // Escape key to go back to home
    if (e.key === 'Escape') {
        loadPage('home');
    }
    
    // F11 for fullscreen
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
});

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (!checkDashboardAuth()) return;
    
    // Apply saved theme
    applyTheme();
    
    // Load last visited page or home
    const lastPage = localStorage.getItem('carnage_last_page') || 'home';
    loadPage(lastPage);
    
    // Update user info
    updateUserInfo();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to Carnage Gaming Hub!', 'success');
    }, 1000);
});

// Update user information
function updateUserInfo() {
    const username = document.querySelector('.navbar-username');
    const status = document.querySelector('.navbar-status');
    
    if (username) {
        username.textContent = 'Gamer';
    }
    
    if (status) {
        status.textContent = 'Online';
    }
}

// Handle iframe communication
window.addEventListener('message', (event) => {
    if (event.data.type === 'notification') {
        showNotification(event.data.message, event.data.level || 'info');
    } else if (event.data.type === 'theme-change') {
        applyTheme(event.data.theme);
    }
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('carnage_authenticated');
        localStorage.removeItem('carnage_last_page');
        showNotification('Logging out...', 'info', 1000);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Error handling for iframe
document.getElementById('content-frame').addEventListener('error', () => {
    showNotification('Failed to load page content', 'error');
});

// Prevent right-click context menu (optional security feature)
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
        // Refresh current page when returning
        if (currentPage) {
            setTimeout(() => {
                loadPage(currentPage);
            }, 100);
        }
    }
});
