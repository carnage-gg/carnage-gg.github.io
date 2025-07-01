document.addEventListener('keydown', function (e) {
  // Check for Ctrl+Shift+H (not in input/textarea)
  if (
    e.key.toLowerCase() === 'h' &&
    e.ctrlKey && e.shiftKey &&
    !e.altKey &&
    !e.metaKey &&
    !['INPUT', 'TEXTAREA'].includes((document.activeElement || {}).tagName)
  ) {
    // You may need to adjust this path depending on your hosting setup
    window.location.href = 'upgrade/index.html';
  }
});