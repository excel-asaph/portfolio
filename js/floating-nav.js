(function () {
  var navEl = document.querySelector('.navbar-no-shadow-container');
  if (!navEl) return;

  // Apply sticky to the outermost nav wrapper so it spans the full page height.
  // .nav-block (project pages) → direct child of body, full-page sibling of content.
  // [data-wf--nav-bar--variant] (index.html) → direct child of .main-content.
  var stickyTarget = navEl.closest('.nav-block') || navEl.parentElement;
  if (stickyTarget) stickyTarget.classList.add('nav-sticky-wrapper');

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
