// Utility functions for Carnage Hub

// Format file sizes
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format time duration
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Get system information
function getSystemInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        screenResolution: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        memory: navigator.deviceMemory || 'Unknown',
        cores: navigator.hardwareConcurrency || 'Unknown'
    };
}

// Get browser information
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';
    
    if (ua.includes('Chrome')) {
        browser = 'Chrome';
        version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Firefox')) {
        browser = 'Firefox';
        version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Safari')) {
        browser = 'Safari';
        version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Edge')) {
        browser = 'Edge';
        version = ua.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
    }
    
    return { browser, version };
}

// Generate random ID
function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Local storage with expiration
const storage = {
    set: (key, value, expireInMinutes = null) => {
        const item = {
            value: value,
            timestamp: Date.now(),
            expire: expireInMinutes ? Date.now() + (expireInMinutes * 60 * 1000) : null
        };
        localStorage.setItem(key, JSON.stringify(item));
    },
    
    get: (key) => {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        
        try {
            const item = JSON.parse(itemStr);
            if (item.expire && Date.now() > item.expire) {
                localStorage.removeItem(key);
                return null;
            }
            return item.value;
        } catch (e) {
            return null;
        }
    },
    
    remove: (key) => {
        localStorage.removeItem(key);
    },
    
    clear: () => {
        localStorage.clear();
    }
};

// Performance monitoring
const performance = {
    start: (label) => {
        console.time(label);
    },
    
    end: (label) => {
        console.timeEnd(label);
    },
    
    mark: (name) => {
        if (window.performance && window.performance.mark) {
            window.performance.mark(name);
        }
    },
    
    measure: (name, startMark, endMark) => {
        if (window.performance && window.performance.measure) {
            window.performance.measure(name, startMark, endMark);
        }
    }
};

// Network status
function getNetworkStatus() {
    return {
        online: navigator.onLine,
        connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection,
        effectiveType: navigator.connection?.effectiveType || 'Unknown',
        downlink: navigator.connection?.downlink || 'Unknown',
        rtt: navigator.connection?.rtt || 'Unknown'
    };
}

// Device detection
function getDeviceInfo() {
    const ua = navigator.userAgent;
    return {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
        isTablet: /iPad|Android(?!.*Mobile)/i.test(ua),
        isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        orientation: screen.orientation?.type || 'Unknown'
    };
}

// Color utilities
const colorUtils = {
    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    rgbToHex: (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    
    lighten: (color, amount) => {
        const rgb = colorUtils.hexToRgb(color);
        if (!rgb) return color;
        
        return colorUtils.rgbToHex(
            Math.min(255, rgb.r + amount),
            Math.min(255, rgb.g + amount),
            Math.min(255, rgb.b + amount)
        );
    },
    
    darken: (color, amount) => {
        const rgb = colorUtils.hexToRgb(color);
        if (!rgb) return color;
        
        return colorUtils.rgbToHex(
            Math.max(0, rgb.r - amount),
            Math.max(0, rgb.g - amount),
            Math.max(0, rgb.b - amount)
        );
    }
};

// Animation utilities
const animationUtils = {
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    fadeOut: (element, duration = 300) => {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    slideDown: (element, duration = 300) => {
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        
        const targetHeight = element.scrollHeight;
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.height = (targetHeight * progress) + 'px';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.height = 'auto';
                element.style.overflow = 'visible';
            }
        }
        
        requestAnimationFrame(animate);
    }
};

// Export utilities for use in other scripts
window.CarnageUtils = {
    formatFileSize,
    formatDuration,
    getSystemInfo,
    getBrowserInfo,
    generateId,
    debounce,
    throttle,
    storage,
    performance,
    getNetworkStatus,
    getDeviceInfo,
    colorUtils,
    animationUtils
};