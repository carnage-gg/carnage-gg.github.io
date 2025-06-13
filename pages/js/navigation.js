// Navigation functionality
function loadPage(pageName) {
    const pageContent = document.getElementById('page-content');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Update active nav link
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    
    // Load page content
    switch(pageName) {
        case 'home':
            pageContent.innerHTML = getHomePage();
            break;
        case 'games':
            pageContent.innerHTML = getGamesPage();
            break;
        case 'music':
            pageContent.innerHTML = getMusicPage();
            break;
        case 'system':
            pageContent.innerHTML = getSystemPage();
            loadSystemInfo();
            break;
        case 'settings':
            pageContent.innerHTML = getSettingsPage();
            loadSettings();
            break;
        default:
            pageContent.innerHTML = getHomePage();
    }
}

function getHomePage() {
    return `
        <div class="hero-section">
            <h1 class="hero-title">CARNAGE</h1>
            <p class="hero-subtitle">Ultimate Gaming Hub</p>
            <p class="hero-description">
                Welcome to Carnage, your ultimate gaming destination. Access your favorite games, 
                discover new music, monitor your system, and customize your experience. 
                Everything you need in one powerful platform.
            </p>
        </div>
        
        <div class="games-grid">
            <div class="game-card">
                <h3>🎮 Games Library</h3>
                <p>Access your complete collection of games with easy-to-use interface and quick launch capabilities.</p>
            </div>
            <div class="game-card">
                <h3>🎵 Music Search</h3>
                <p>Search and discover music instantly with our integrated YouTube search functionality.</p>
            </div>
            <div class="game-card">
                <h3>💻 System Monitor</h3>
                <p>Keep track of your system performance, battery life, and hardware information in real-time.</p>
            </div>
            <div class="game-card">
                <h3>⚙️ Customization</h3>
                <p>Personalize your experience with theme options, tab disguise features, and more settings.</p>
            </div>
        </div>
    `;
}

function getGamesPage() {
    return `
        <h2 class="page-title">GAMES LIBRARY</h2>
        <div class="games-grid" id="games-container">
            <!-- Games will be loaded here -->
        </div>
    `;
}

function getMusicPage() {
    return `
        <h2 class="page-title">MUSIC SEARCH</h2>
        <div class="music-search">
            <div class="search-container">
                <input type="text" class="search-input" id="music-search" placeholder="Search for music on YouTube..." />
                <button class="search-btn" onclick="searchMusic()">🔍 SEARCH</button>
            </div>
        </div>
    `;
}

function getSystemPage() {
    return `
        <h2 class="page-title">SYSTEM INFORMATION</h2>
        <div class="system-info" id="system-info-container">
            <!-- System info will be loaded here -->
        </div>
    `;
}

function getSettingsPage() {
    return `
        <h2 class="page-title">SETTINGS</h2>
        
        <div class="settings-section">
            <h3>🎭 Tab Disguise</h3>
            <div class="setting-item">
                <span class="setting-label">Tab Title:</span>
                <div class="setting-control">
                    <input type="text" id="tab-title" placeholder="Enter custom tab title">
                    <button onclick="updateTabTitle()">Apply</button>
                </div>
            </div>
            <div class="setting-item">
                <span class="setting-label">Favicon:</span>
                <div class="setting-control">
                    <select id="favicon-select" onchange="updateFavicon()">
                        <option value="default">Carnage (Default)</option>
                        <option value="google">Google</option>
                        <option value="youtube">YouTube</option>
                        <option value="github">GitHub</option>
                        <option value="discord">Discord</option>
                        <option value="netflix">Netflix</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="settings-section">
            <h3>🎨 Theme Settings</h3>
            <div class="setting-item">
                <span class="setting-label">Color Theme:</span>
                <div class="setting-control">
                    <select id="theme-select" onchange="updateTheme()">
                        <option value="orange">Orange (Default)</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="purple">Purple</option>
                        <option value="red">Red</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="settings-section">
            <h3>🔧 General Settings</h3>
            <div class="setting-item">
                <span class="setting-label">Reset All Settings:</span>
                <div class="setting-control">
                    <button onclick="resetSettings()" style="background: #ff3333;">Reset</button>
                </div>
            </div>
        </div>
    `;
}