/* ==========================================================================
   Services Carousel Module
   Navegação fluida com scroll suave e suporte a touch natural
   ========================================================================== */

export function initCarousel() {
  const container = document.querySelector('.services-container');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  if (!container || !prevBtn || !nextBtn) return;

  const getScrollDistance = () => {
    const firstCard = container.querySelector('.service-card');
    return firstCard ? firstCard.offsetWidth + 24 : 330;
  };

  prevBtn.addEventListener('click', () => {
    container.scrollBy({
      left: -getScrollDistance(),
      behavior: 'smooth'
    });
  });

  nextBtn.addEventListener('click', () => {
    container.scrollBy({
      left: getScrollDistance(),
      behavior: 'smooth'
    });
  });
}