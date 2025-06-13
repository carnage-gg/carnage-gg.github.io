// System information functionality
function loadSystemInfo() {
    const container = document.getElementById('system-info-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="info-card">
            <h3>🌐 Browser Information</h3>
            <div class="info-item">
                <span class="info-label">Browser:</span>
                <span class="info-value" id="browser-name">Loading...</span>
            </div>
            <div class="info-item">
                <span class="info-label">Version:</span>
                <span class="info-value" id="browser-version">Loading...</span>
            </div>
            <div class="info-item">
                <span class="info-label">Platform:</span>
                <span class="info-value" id="platform">Loading...</span>
            </div>
            <div class="info-item">
                <span class="info-label">Language:</span>
                <span class="info-value" id="language">Loading...</span>
            </div>
        </div>
        
        <div class="info-card">
            <h3>📱 Device Information</h3>
            <div class="info-item">
                <span class="info-label">Screen Resolution:</span>
                <span class="info-value" id="screen-resolution">Loading...</span>
            </div>
            <div class="info-item">
                <span class="info-label">Color Depth:</span>
                <span class="info-value" id="color-depth">Loading...</span>
            </div>
            <div class="info-item">
                <span class="info-label">Timezone:</span>
                <span class="info-value" id="timezone">Loading...</span>
            </div>
            <div class="info-item">
                <span class="info-label">Online Status:</span>
                <span class="info-value" id="online-status">Loading...</span>
            </div>
        </div>
        
        <div class="info-card">
            <h3>🔋 Battery Information</h3>
            <div class="info-item">
                <span class="info-label">Battery Level:</span>
                <span class="info-value" id="battery-level">Loading...</span>
            </div>
            <div class="info-item">
                <span class="info-label">Charging Status:</span>
                <span class="info-value" id="charging-status">Loading...</span>
            </div>
            <div class="info-item">
                <span class="info-label">Charging Time:</span>
                <span class="info-value" id="charging-time">Loading...</span>
            </div>
            <div class="info-item">
                <span class="info-label">Discharging Time:</span>
                <span class="info-value" id="discharging-time">Loading...</span>
            </div>
        </div>
        
        <div class="info-card">
            <h3>🌍 Location Information</h3>
            <div class="info-item">
                <span class="info-label">IP Address:</span>
                <span class="info-value" id="ip-address">Loading...</span>
            </div>
            <div class="info-item">
                <span class="info-label">Country:</span>
                <span class="info-value" id="country">Loading...</span>
            </div>
            <div class="info-item">
                <span class="info-label">City:</span>
                <span class="info-value" id="city">Loading...</span>
            </div>
            <div class="info-item">
                <span class="info-label">ISP:</span>
                <span class="info-value" id="isp">Loading...</span>
            </div>
        </div>
        
        <div class="info-card">
            <h3>⏰ Time Information</h3>
            <div class="info-item">
                <span class="info-label">Current Time:</span>
                <span class="info-value" id="current-time">Loading...</span>
            </div>
            <div class="info-item">
                <span class="info-label">Session Duration:</span>
                <span class="info-value" id="session-duration">Loading...</span>
            </div>
            <div class="info-item">
                <span class="info-label">Page Load Time:</span>
                <span class="info-value" id="page-load-time">Loading...</span>
            </div>
        </div>
    `;
    
    // Load all system information
    loadBrowserInfo();
    loadDeviceInfo();
    loadBatteryInfo();
    loadLocationInfo();
    loadTimeInfo();
}

function loadBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "Unknown";
    
    if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Google Chrome";
        browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Mozilla Firefox";
        browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
        browserVersion = userAgent.match(/Version\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("Edge") > -1) {
        browserName = "Microsoft Edge";
        browserVersion = userAgent.match(/Edge\/([0-9.]+)/)[1];
    }
    
    document.getElementById('browser-name').textContent = browserName;
    document.getElementById('browser-version').textContent = browserVersion;
    document.getElementById('platform').textContent = navigator.platform;
    document.getElementById('language').textContent = navigator.language;
}

function loadDeviceInfo() {
    document.getElementById('screen-resolution').textContent = 
        `${screen.width} x ${screen.height}`;
    document.getElementById('color-depth').textContent = 
        `${screen.colorDepth} bits`;
    document.getElementById('timezone').textContent = 
        Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById('online-status').textContent = 
        navigator.onLine ? "Online" : "Offline";
}

function loadBatteryInfo() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            updateBatteryInfo(battery);
            
            // Update battery info when it changes
            battery.addEventListener('chargingchange', () => updateBatteryInfo(battery));
            battery.addEventListener('levelchange', () => updateBatteryInfo(battery));
        });
    } else {
        document.getElementById('battery-level').textContent = "Not supported";
        document.getElementById('charging-status').textContent = "Not supported";
        document.getElementById('charging-time').textContent = "Not supported";
        document.getElementById('discharging-time').textContent = "Not supported";
    }
}

function updateBatteryInfo(battery) {
    document.getElementById('battery-level').textContent = 
        `${Math.round(battery.level * 100)}%`;
    document.getElementById('charging-status').textContent = 
        battery.charging ? "Charging" : "Not charging";
    document.getElementById('charging-time').textContent = 
        battery.chargingTime === Infinity ? "N/A" : `${Math.round(battery.chargingTime / 60)} minutes`;
    document.getElementById('discharging-time').textContent = 
        battery.dischargingTime === Infinity ? "N/A" : `${Math.round(battery.dischargingTime / 60)} minutes`;
}

function loadLocationInfo() {
    // Using a free IP geolocation service
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('ip-address').textContent = data.ip || "Unknown";
            document.getElementById('country').textContent = data.country_name || "Unknown";
            document.getElementById('city').textContent = data.city || "Unknown";
            document.getElementById('isp').textContent = data.org || "Unknown";
        })
        .catch(error => {
            document.getElementById('ip-address').textContent = "Unable to fetch";
            document.getElementById('country').textContent = "Unable to fetch";
            document.getElementById('city').textContent = "Unable to fetch";
            document.getElementById('isp').textContent = "Unable to fetch";
        });
}

function loadTimeInfo() {
    const startTime = Date.now();
    
    function updateTime() {
        const now = new Date();
        document.getElementById('current-time').textContent = now.toLocaleString();
        
        const sessionDuration = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(sessionDuration / 60);
        const seconds = sessionDuration % 60;
        document.getElementById('session-duration').textContent = 
            `${minutes}m ${seconds}s`;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
    
    // Page load time
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        document.getElementById('page-load-time').textContent = `${loadTime}ms`;
    });
}