document.addEventListener('DOMContentLoaded', function () {
  window.scrollTo({ top: 0, behavior: 'auto' });
  // Check if overlay has already been shown in this session
  if (sessionStorage.getItem('overlayShown')) {
    // Hide overlay immediately and reveal main content
    const overlay = document.getElementById('ink-overlay');
    if (overlay) overlay.style.display = 'none';
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.classList.add('revealed');
    return;
  }

  // Otherwise, show overlay and set session flag
  sessionStorage.setItem('overlayShown', 'true');
  const INK_DURATION = 8000; 

  setTimeout(() => {
    const overlay = document.getElementById('ink-overlay');
    if (overlay) overlay.style.display = 'none';

    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.classList.add('revealed');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, INK_DURATION);
});

