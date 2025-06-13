// Games loader that dynamically finds all folders in games directory
class GamesLoader {
    constructor() {
        this.games = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.favorites = JSON.parse(localStorage.getItem('carnage_favorites') || '[]');
        this.gameCategories = ['action', 'puzzle', 'arcade', 'strategy', 'sports', 'racing'];
        this.gameIcons = ['🎮', '🕹️', '🎯', '🏆', '⚡', '🚀', '🎲', '🎪', '🎨', '🎭', '🌟', '💎'];
    }

    async init() {
        console.log('Starting games scan...');
        await this.scanForAllGameFolders();
        this.renderGames();
        this.setupEventListeners();
    }

    async scanForAllGameFolders() {
        const foundFolders = [];
        
        try {
            // Method 1: Try to get directory listing from server
            const response = await fetch('games/', {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            });
            
            if (response.ok) {
                const html = await response.text();
                console.log('Got directory listing, parsing...');
                
                // Parse the HTML to find folder links
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Look for links that could be folders
                const links = doc.querySelectorAll('a');
                
                for (const link of links) {
                    const href = link.getAttribute('href');
                    const text = link.textContent.trim();
                    
                    // Skip parent directory and common non-game files
                    if (href && 
                        href !== '../' && 
                        href !== '.' && 
                        href !== '..' &&
                        !href.startsWith('http') &&
                        !href.includes('.html') &&
                        !href.includes('.css') &&
                        !href.includes('.js') &&
                        !href.includes('.json') &&
                        !href.includes('.txt') &&
                        !href.includes('.md')) {
                        
                        let folderName = href.replace(/\/$/, ''); // Remove trailing slash
                        
                        if (folderName && folderName.length > 0) {
                            console.log(`Found potential folder: ${folderName}`);
                            
                            // Verify it's actually a game folder by checking for index.html
                            try {
                                const gameCheck = await fetch(`games/${folderName}/index.html`, { method: 'HEAD' });
                                if (gameCheck.ok) {
                                    foundFolders.push(folderName);
                                    console.log(`Confirmed game folder: ${folderName}`);
                                }
                            } catch (e) {
                                console.log(`No index.html in ${folderName}`);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log('Directory listing failed, trying brute force method...');
        }

        // Method 2: If directory listing doesn't work, try brute force scanning
        if (foundFolders.length === 0) {
            console.log('Using brute force folder detection...');
            foundFolders.push(...await this.bruteForceGameScan());
        }

        // Method 3: If still nothing found, try a more comprehensive scan
        if (foundFolders.length === 0) {
            console.log('Trying comprehensive scan...');
            foundFolders.push(...await this.comprehensiveGameScan());
        }

        console.log('Final found folders:', foundFolders);

        // Convert found folders to game objects
        if (foundFolders.length > 0) {
            this.games = foundFolders.map((folderName, index) => ({
                id: index + 1,
                title: this.formatGameTitle(folderName),
                description: `Play ${this.formatGameTitle(folderName)} - Click to start playing!`,
                category: this.getRandomCategory(),
                icon: this.getRandomIcon(),
                tags: this.generateTags(folderName),
                url: `games/${folderName}/index.html`,
                folderName: folderName
            }));
        } else {
            // No games found, show instructions
            this.games = [{
                id: 1,
                title: 'No Games Found',
                description: 'Create folders in the games directory with index.html files. Example: games/my-game/index.html',
                category: 'info',
                icon: '📁',
                tags: ['Setup', 'Instructions'],
                url: '#',
                folderName: 'none'
            }];
        }
    }

    async bruteForceGameScan() {
        const foundFolders = [];
        
        // Try common folder naming patterns
        const patterns = [
            // Single characters
            ...'abcdefghijklmnopqrstuvwxyz'.split(''),
            ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            // Numbers
            ...Array.from({length: 100}, (_, i) => (i + 1).toString()),
            // Common game names
            'snake', '2048', 'tetris', 'pacman', 'pong', 'breakout', 'asteroids',
            'chess', 'checkers', 'sudoku', 'solitaire', 'minesweeper',
            'flappy-bird', 'flappybird', 'space-invaders', 'spaceinvaders',
            'bubble-shooter', 'bubbleshooter', 'tower-defense', 'towerdefense',
            // Common folder patterns
            'game1', 'game2', 'game3', 'game4', 'game5',
            'game-1', 'game-2', 'game-3', 'game-4', 'game-5',
            'game_1', 'game_2', 'game_3', 'game_4', 'game_5',
            'test', 'demo', 'sample', 'example',
            'my-game', 'mygame', 'awesome-game', 'cool-game',
            'html5-game', 'web-game', 'browser-game'
        ];

        console.log(`Checking ${patterns.length} potential folder names...`);

        for (const pattern of patterns) {
            try {
                const response = await fetch(`games/${pattern}/index.html`, { 
                    method: 'HEAD',
                    cache: 'no-cache'
                });
                
                if (response.ok) {
                    foundFolders.push(pattern);
                    console.log(`Found game: ${pattern}`);
                }
            } catch (error) {
                // Folder doesn't exist, continue
            }
        }

        return foundFolders;
    }

    async comprehensiveGameScan() {
        const foundFolders = [];
        
        // Try even more patterns including special characters and combinations
        const morePatterns = [
            // Two character combinations
            'aa', 'ab', 'ac', 'ba', 'bb', 'bc', 'ca', 'cb', 'cc',
            // Game types
            'puzzle', 'action', 'arcade', 'strategy', 'sports', 'racing',
            // Random common folder names
            'app', 'src', 'build', 'dist', 'public', 'assets',
            'index', 'main', 'home', 'start', 'play',
            // Date patterns
            '2023', '2024', '2025',
            // More game names
            'mario', 'sonic', 'zelda', 'pokemon', 'minecraft',
            'fortnite', 'among-us', 'fall-guys'
        ];

        for (const pattern of morePatterns) {
            try {
                const response = await fetch(`games/${pattern}/index.html`, { method: 'HEAD' });
                if (response.ok) {
                    foundFolders.push(pattern);
                    console.log(`Found game: ${pattern}`);
                }
            } catch (error) {
                // Continue
            }
        }

        return foundFolders;
    }

    formatGameTitle(folderName) {
        if (folderName === 'none') return 'Setup Instructions';
        
        return folderName
            .replace(/[-_]/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/\b\w/g, l => l.toUpperCase())
            .trim();
    }

    getRandomCategory() {
        return this.gameCategories[Math.floor(Math.random() * this.gameCategories.length)];
    }

    getRandomIcon() {
        return this.gameIcons[Math.floor(Math.random() * this.gameIcons.length)];
    }

    generateTags(folderName) {
        const allTags = ['Fun', 'Arcade', 'Classic', 'Retro', 'Challenging', 'Addictive', 'Quick Play', 'Browser Game'];
        const shuffled = [...allTags].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }

    renderGames() {
        const container = document.getElementById('games-container');
        let filteredGames = [...this.games];

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filteredGames = filteredGames.filter(game => game.category === this.currentFilter);
        }

        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filteredGames = filteredGames.filter(game => 
                game.title.toLowerCase().includes(query) ||
                game.description.toLowerCase().includes(query) ||
                game.folderName.toLowerCase().includes(query) ||
                game.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        container.innerHTML = filteredGames.map(game => `
            <div class="game-card" data-game-id="${game.id}">
                <div class="game-image">
                    ${game.icon}
                </div>
                <div class="game-info">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-description">${game.description}</p>
                    <div class="game-tags">
                        ${game.tags.map(tag => `<span class="game-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="game-actions">
                        <button class="play-btn" onclick="gamesLoader.playGame('${game.folderName}', '${game.title}')">
                            ${game.folderName === 'none' ? 'Learn More' : 'Play Now'}
                        </button>
                        <button class="favorite-btn ${this.favorites.includes(game.id) ? 'active' : ''}" 
                                onclick="gamesLoader.toggleFavorite(${game.id})">
                            ${this.favorites.includes(game.id) ? '❤️' : '🤍'}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    playGame(folderName, title) {
        if (folderName === 'none') {
            alert('To add games:\n1. Create a folder in the "games" directory\n2. Put an index.html file inside that folder\n3. Refresh this page');
            return;
        }
        
        const gameUrl = `games/${folderName}/index.html`;
        console.log(`Playing game: ${gameUrl}`);
        window.location.href = gameUrl;
    }

    toggleFavorite(gameId) {
        const index = this.favorites.indexOf(gameId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(gameId);
        }
        
        localStorage.setItem('carnage_favorites', JSON.stringify(this.favorites));
        this.renderGames();
    }

    filterGames(category) {
        this.currentFilter = category;
        
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            }
        });
        
        this.renderGames();
    }

    searchGames(query) {
        this.searchQuery = query;
        this.renderGames();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('game-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchGames(e.target.value);
            });
        }
        
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.filterGames(tab.dataset.category);
            });
        });
    }

    applyTheme() {
        const theme = localStorage.getItem('carnage_theme') || 'orange';
        document.documentElement.setAttribute('data-theme', theme);
    }
}

// Initialize
let gamesLoader;

document.addEventListener('DOMContentLoaded', async () => {
    gamesLoader = new GamesLoader();
    gamesLoader.applyTheme();
    await gamesLoader.init();
});

window.addEventListener('message', (event) => {
    if (event.data.type === 'theme-changed') {
        gamesLoader.applyTheme();
    }
});
