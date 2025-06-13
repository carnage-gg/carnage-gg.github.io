// Disable right-click context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
document.addEventListener('keydown', function(e) {
    // F12
    if (e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+I (Inspector)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+C (Element selector)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+U (View source)
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+S (Save page)
    if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
    }
});

// Disable text selection
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

// Disable drag
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
});

// Detect if DevTools is open
let devtools = {
    open: false,
    orientation: null
};

const threshold = 160;

setInterval(function() {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
            devtools.open = true;
            // Redirect or show warning when devtools detected
            document.body.innerHTML = '<h1 style="color: red; text-align: center; margin-top: 50vh; transform: translateY(-50%);">Access Denied</h1>';
            // Optional: redirect to another page
            // window.location.href = 'about:blank';
        }
    } else {
        devtools.open = false;
    }
}, 500);

// Additional DevTools detection method
let startTime = new Date();
debugger;
let endTime = new Date();
if (endTime - startTime > 100) {
    document.body.innerHTML = '<h1 style="color: red; text-align: center; margin-top: 50vh; transform: translateY(-50%);">Developer Tools Detected</h1>';
}

// Disable console
(function() {
    try {
        var $_console$$ = console;
        Object.defineProperty(window, "console", {
            get: function() {
                if ($_console$$._commandLineAPI)
                    throw "Console is disabled";
                return $_console$$
            },
            set: function(val) {
                $_console$$ = val
            }
        })
    } catch (ex) {}
})();

// Clear console periodically
setInterval(function() {
    console.clear();
}, 1000);

// Disable common developer shortcuts
document.onkeydown = function(e) {
    // Disable Ctrl+A (Select All)
    if (e.ctrlKey && e.keyCode === 65) {
        return false;
    }
    
    // Disable Ctrl+P (Print)
    if (e.ctrlKey && e.keyCode === 80) {
        return false;
    }
    
    return true;
};

// Blur window when focus is lost (prevents some bypass methods)
window.addEventListener('blur', function() {
    setTimeout(function() {
        window.focus();
    }, 100);
});

// Disable image dragging
document.addEventListener('DOMContentLoaded', function() {
    const images = document.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
        images[i].addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });
    }
});