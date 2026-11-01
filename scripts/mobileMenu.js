/* ==========================================================================
   Mobile Menu Module
   Gaveta lateral suave com backdrop blur e bloqueio de scroll
   ========================================================================== */

export function setupMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navBackdrop = document.querySelector('.nav-backdrop');
  const navLinksItems = document.querySelectorAll('.nav-links li a');

  if (!hamburger || !navLinks) return;

  const toggleMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !navLinks.classList.contains('active');
    hamburger.classList.toggle('active', shouldOpen);
    navLinks.classList.toggle('active', shouldOpen);
    if (navBackdrop) navBackdrop.classList.toggle('active', shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggleMenu());

  if (navBackdrop) {
    navBackdrop.addEventListener('click', () => toggleMenu(false));
  }

  navLinksItems.forEach(item => {
    item.addEventListener('click', () => toggleMenu(false));
  });
}