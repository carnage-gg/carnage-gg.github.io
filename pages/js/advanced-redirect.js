// Advanced protection with logging and multiple redirect strategies
class FileProtection {
    constructor() {
        this.protectedFiles = new Set([
            'advanced-redirect.js',
            'auth.js',
            'disable-devtools.js',
            'main.js',
            'navigation.js',
            'script.js',
            'settings.js',
            'system.js',
            'themes.js',
            'utils.js'
        ]);
        
        this.protectedPaths = new Set([
            'js/advanced-redirect.js',
            'js/auth.js',
            'js/disable-devtools.js',
            'js/main.js',
            'js/navigation.js',
            'js/script.js',
            'js/settings.js',
            'js/system.js',
            'js/themes.js',
            'js/utils.js'
        ]);
        
        this.redirectTarget = 'index.html';
        this.init();
    }
    
    init() {
        this.checkCurrentPage();
        this.setupURLMonitoring();
        this.preventBackButton();
    }
    
    checkCurrentPage() {
        const currentFile = this.getCurrentFileName();
        const currentPath = window.location.pathname;
        
        if (this.isFileProtected(currentFile) || this.isPathProtected(currentPath)) {
            this.performRedirect('Direct access blocked');
        }
    }
    
    getCurrentFileName() {
        return window.location.pathname.split('/').pop();
    }
    
    isFileProtected(filename) {
        return this.protectedFiles.has(filename);
    }
    
    isPathProtected(path) {
        return Array.from(this.protectedPaths).some(protectedPath => 
            path.includes(protectedPath)
        );
    }
    
    performRedirect(reason = 'Access denied') {
        // Log the attempt (optional)
        this.logAccessAttempt(reason);
        
        // Clear history to prevent back button
        history.replaceState(null, null, this.redirectTarget);
        
        // Multiple redirect methods for better coverage
        window.location.replace(this.redirectTarget);
        window.location.href = this.redirectTarget;
        
        // Fallback redirect
        setTimeout(() => {
            if (window.location.pathname !== '/' + this.redirectTarget) {
                document.location = this.redirectTarget;
            }
        }, 100);
    }
    
    setupURLMonitoring() {
        // Monitor for URL changes
        let lastURL = window.location.href;
        
        const observer = new MutationObserver(() => {
            if (lastURL !== window.location.href) {
                lastURL = window.location.href;
                this.checkCurrentPage();
            }
        });
        
        observer.observe(document, {
            subtree: true,
            childList: true
        });
        
        // Also monitor with interval as backup
        setInterval(() => {
            this.checkCurrentPage();
        }, 500);
    }
    
    preventBackButton() {
        // Prevent using back button to access protected pages
        window.addEventListener('popstate', (event) => {
            const currentFile = this.getCurrentFileName();
            const currentPath = window.location.pathname;
            
            if (this.isFileProtected(currentFile) || this.isPathProtected(currentPath)) {
                this.performRedirect('Back button access blocked');
            }
        });
    }
    
    logAccessAttempt(reason) {
        // Optional: Log access attempts
        const logData = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            reason: reason
        };
        
        console.warn('Protected file access attempt:', logData);
        
        // Optional: Send to server for logging
        // this.sendLogToServer(logData);
    }
    
    sendLogToServer(logData) {
        // Optional: Send access attempt logs to server
        fetch('/log-access-attempt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logData)
        }).catch(err => console.error('Logging failed:', err));
    }
}

// Initialize protection
const fileProtection = new FileProtection();