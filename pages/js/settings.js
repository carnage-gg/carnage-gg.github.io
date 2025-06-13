// Settings functionality
function loadSettings() {
    // Load saved settings
    const savedTitle = localStorage.getItem('carnage_tab_title');
    const savedFavicon = localStorage.getItem('carnage_favicon');
    const savedTheme = localStorage.getItem('carnage_theme');
    
    if (savedTitle) {
        document.getElementById('tab-title').value = savedTitle;
    }
    
    if (savedFavicon) {
        document.getElementById('favicon-select').value = savedFavicon;
    }
    
    if (savedTheme) {
        document.getElementById('theme-select').value = savedTheme;
        applyTheme(savedTheme);
    }
}

function updateTabTitle() {
    const titleInput = document.getElementById('tab-title');
    const newTitle = titleInput.value.trim();
    
    if (newTitle) {
        document.title = newTitle;
        localStorage.setItem('carnage_tab_title', newTitle);
        showNotification('Tab title updated successfully!');
    } else {
        document.title = 'Carnage - Gaming Hub';
        localStorage.removeItem('carnage_tab_title');
        showNotification('Tab title reset to default!');
    }
}

function updateFavicon() {
    const faviconSelect = document.getElementById('favicon-select');
    const selectedFavicon = faviconSelect.value;
    
    const faviconUrls = {
        'default': 'favicon.ico',
        'google': 'https://www.google.com/favicon.ico',
        'youtube': 'https://www.youtube.com/favicon.ico',
        'github': 'https://github.com/favicon.ico',
        'discord': 'https://discord.com/assets/f8389ca1a741a115313bede9ac02e2c0.ico',
        'netflix': 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico'
    };
    
    const faviconUrl = faviconUrls[selectedFavicon];
    
    // Remove existing favicon
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
        existingFavicon.remove();
    }
    
    // Add new favicon
    const newFavicon = document.createElement('link');
    newFavicon.rel = 'icon';
    newFavicon.type = 'image/x-icon';
    newFavicon.href = faviconUrl;
    document.head.appendChild(newFavicon);
    
    localStorage.setItem('carnage_favicon', selectedFavicon);
    showNotification('Favicon updated successfully!');
}

function updateTheme() {
    const themeSelect = document.getElementById('theme-select');
    const selectedTheme = themeSelect.value;
    
    applyTheme(selectedTheme);
    localStorage.setItem('carnage_theme', selectedTheme);
    showNotification('Theme updated successfully!');
}

function applyTheme(theme) {
    const root = document.documentElement;
    
    const themes = {
        'orange': {
            '--accent-orange': '#ff6600',
            '--accent-orange-hover': '#ff8533'
        },
        'blue': {
            '--accent-orange': '#0066ff',
            '--accent-orange-hover': '#3385ff'
        },
        'green': {
            '--accent-orange': '#00ff66',
            '--accent-orange-hover': '#33ff85'
        },
        'purple': {
            '--accent-orange': '#6600ff',
            '--accent-orange-hover': '#8533ff'
        },
        'red': {
            '--accent-orange': '#ff0066',
            '--accent-orange-hover': '#ff3385'
        }
    };
    
    const themeColors = themes[theme];
    if (themeColors) {
        Object.keys(themeColors).forEach(property => {
            root.style.setProperty(property, themeColors[property]);
        });
    }
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings? This action cannot be undone.')) {
        // Clear all stored settings
        localStorage.removeItem('carnage_tab_title');
        localStorage.removeItem('carnage_favicon');
        localStorage.removeItem('carnage_theme');
        
        // Reset to defaults
        document.title = 'Carnage - Gaming Hub';
        
        // Reset favicon
        const existingFavicon = document.querySelector('link[rel="icon"]');
        if (existingFavicon) {
            existingFavicon.href = 'favicon.ico';
        }
        
        // Reset theme
        applyTheme('orange');
        
        // Reset form values
        document.getElementById('tab-title').value = '';
        document.getElementById('favicon-select').value = 'default';
        document.getElementById('theme-select').value = 'orange';
        
        showNotification('All settings have been reset to default!');
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-orange);
        color: var(--primary-bg);
        padding: 1rem 2rem;
        border-radius: 8px;
        font-family: 'Orbitron', monospace;
        font-weight: 700;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Add slide-out animation
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(slideOutStyle);
}

// Load settings on page load
document.addEventListener('DOMContentLoaded', () => {
    // Apply saved settings immediately
    const savedTitle = localStorage.getItem('carnage_tab_title');
    const savedFavicon = localStorage.getItem('carnage_favicon');
    const savedTheme = localStorage.getItem('carnage_theme');
    
    if (savedTitle) {
        document.title = savedTitle;
    }
    
    if (savedFavicon && savedFavicon !== 'default') {
        updateFavicon();
    }
    
    if (savedTheme) {
        applyTheme(savedTheme);
    }
});
