// Authentication system with theme support
const WEBSITE_PASSWORD = 'aliisop';

// Check if user is already authenticated
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('carnage_authenticated');
    if (isAuthenticated === 'true') {
        window.location.href = 'pages/home.html';
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');
    const loginBtn = document.querySelector('.login-btn');
    
    const enteredPassword = passwordInput.value;
    
    // Add loading state
    loginBtn.style.opacity = '0.7';
    loginBtn.style.pointerEvents = 'none';
    loginBtn.innerHTML = '<span class="btn-glow"></span>AUTHENTICATING...';
    
    // Simulate authentication delay for better UX
    setTimeout(() => {
        if (enteredPassword === WEBSITE_PASSWORD) {
            // Success
            sessionStorage.setItem('carnage_authenticated', 'true');
            
            // Success animation
            loginBtn.innerHTML = '<span class="btn-glow"></span>ACCESS GRANTED';
            loginBtn.style.background = 'linear-gradient(135deg, var(--success), #059669)';
            
            // Apply current theme to login page
            applyThemeToLogin();
            
            setTimeout(() => {
                window.location.href = 'pages/home.html';
            }, 1000);
            
        } else {
            // Error
            showError(errorMessage, 'Invalid access code. Please try again.');
            
            // Reset button
            loginBtn.style.opacity = '1';
            loginBtn.style.pointerEvents = 'auto';
            loginBtn.innerHTML = '<span class="btn-glow"></span>ACCESS SYSTEM';
            loginBtn.style.background = 'linear-gradient(135deg, var(--primary-accent), var(--secondary-accent))';
            
            // Shake animation for error
            passwordInput.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                passwordInput.style.animation = '';
                passwordInput.value = '';
                passwordInput.focus();
            }, 500);
        }
    }, 1500);
}

// Show error message with animation
function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    setTimeout(() => {
        errorElement.classList.remove('show');
    }, 4000);
}

// Apply saved theme to login page
function applyThemeToLogin() {
    const savedTheme = localStorage.getItem('carnage_theme') || 'orange';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Logout function
function logout() {
    sessionStorage.removeItem('carnage_authenticated');
    localStorage.removeItem('carnage_last_page');
    window.location.href = 'index.html';
}

// Add shake animation for login errors
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}`;

// Inject shake animation
const style = document.createElement('style');
style.textContent = shakeKeyframes;
document.head.appendChild(style);

// Initialize authentication check
document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme immediately
    applyThemeToLogin();
    
    // Focus password input
    const passwordInput = document.getElementById('password-input');
    if (passwordInput) {
        passwordInput.focus();
    }
    
    // Check if already authenticated (only on login page)
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        checkAuth();
    }
});

// Handle Enter key for login
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.getElementById('password-input')) {
        const form = document.querySelector('.login-form');
        if (form) {
            handleLogin(e);
        }
    }
});
