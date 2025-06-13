// Theme management system
const themes = {
    orange: {
        name: 'Orange Cyberpunk',
        primary: '#ff6b35',
        secondary: '#f39c12'
    },
    blue: {
        name: 'Electric Blue',
        primary: '#3b82f6',
        secondary: '#1d4ed8'
    },
    green: {
        name: 'Matrix Green',
        primary: '#10b981',
        secondary: '#059669'
    },
    purple: {
        name: 'Neon Purple',
        primary: '#8b5cf6',
        secondary: '#7c3aed'
    },
    red: {
        name: 'Crimson Red',
        primary: '#ef4444',
        secondary: '#dc2626'
    },
    pink: {
        name: 'Hot Pink',
        primary: '#ec4899',
        secondary: '#db2777'
    },
    cyan: {
        name: 'Cyber Cyan',
        primary: '#06b6d4',
        secondary: '#0891b2'
    }
};

// Apply theme to document
function applyTheme(themeName = null) {
    const theme = themeName || localStorage.getItem('carnage_theme') || 'orange';
    
    // Apply to main document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Apply to iframe content if it exists
    const iframe = document.getElementById('content-frame');
    if (iframe && iframe.contentDocument) {
        iframe.contentDocument.documentElement.setAttribute('data-theme', theme);
    }
    
    // Save theme preference
    localStorage.setItem('carnage_theme', theme);
    
    // Update favicon based on theme
    updateFavicon(theme);
    
    // Notify iframe about theme change
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
            type: 'theme-changed',
            theme: theme
        }, '*');
    }
}

// Change theme and save preference
function changeTheme(themeName) {
    applyTheme(themeName);
    
    // Show notification
    const themeData = themes[themeName];
    if (themeData) {
        // Send notification to main window if we're in an iframe
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'notification',
                message: `Theme changed to ${themeData.name}`,
                level: 'success'
            }, '*');
        } else {
            // We're in the main window
            if (typeof showNotification === 'function') {
                showNotification(`Theme changed to ${themeData.name}`, 'success');
            }
        }
    }
}

// Update favicon based on theme
function updateFavicon(theme) {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
        // You can create different favicons for each theme
        // For now, we'll keep the same favicon
        favicon.href = 'favicon.ico';
    }
}

// Get current theme
function getCurrentTheme() {
    return localStorage.getItem('carnage_theme') || 'orange';
}

// Get all available themes
function getAvailableThemes() {
    return themes;
}

// Initialize theme system
function initializeThemes() {
    // Apply saved theme or default
    applyTheme();
    
    // Listen for theme changes from iframe
    window.addEventListener('message', (event) => {
        if (event.data.type === 'theme-change') {
            applyTheme(event.data.theme);
        }
    });
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', initializeThemes);
