(function () {
  var navEl = document.querySelector('.navbar-no-shadow-container');
  if (!navEl) return;

  // If a child dropdown link is active, mark the parent toggle too
  var activeDropLink = navEl.querySelector('.nav-dropdown-link.w--current');
  if (activeDropLink) {
    var parentToggle = activeDropLink.closest('.nav-dropdown').querySelector('.nav-dropdown-toggle');
    if (parentToggle) parentToggle.classList.add('nav-active');
  }

  function onNavScroll() {
    if (window.scrollY > 60) {
      navEl.classList.add('nav-is-scrolled');
    } else {
      navEl.classList.remove('nav-is-scrolled');
    }
  }

  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();
})();
