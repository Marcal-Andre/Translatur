// Services carousel functionality
export function initCarousel() {
  const servicesContainer = document.querySelector('.services-container');
  const prevBtn = document.querySelector('.carousel-nav.prev');
  const nextBtn = document.querySelector('.carousel-nav.next');
  const serviceCards = document.querySelectorAll('.service-card');
  
  if (!servicesContainer || !prevBtn || !nextBtn || serviceCards.length === 0) return;
  
  // Calculate the width to scroll
  const cardWidth = serviceCards[0].offsetWidth + 20; // card width + margin
  const visibleCards = Math.floor(servicesContainer.offsetWidth / cardWidth);
  const scrollAmount = cardWidth * Math.min(visibleCards, 3);
  
  // Add click event listeners to the navigation buttons
  prevBtn.addEventListener('click', () => {
    servicesContainer.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  });
  
  nextBtn.addEventListener('click', () => {
    servicesContainer.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });
  
  // Add touch/swipe functionality for mobile
  let startX, scrollLeft;
  
  const startDrag = (e) => {
    startX = e.type === 'touchstart' ? e.touches[0].pageX : e.pageX;
    scrollLeft = servicesContainer.scrollLeft;
    servicesContainer.style.cursor = 'grabbing';
  };
  
  const drag = (e) => {
    if (startX === undefined) return;
    
    const x = e.type === 'touchmove' ? e.touches[0].pageX : e.pageX;
    const dist = startX - x;
    servicesContainer.scrollLeft = scrollLeft + dist;
  };
  
  const endDrag = () => {
    startX = undefined;
    servicesContainer.style.cursor = 'grab';
  };
  
  // Add event listeners for both mouse and touch
  servicesContainer.addEventListener('mousedown', startDrag);
  servicesContainer.addEventListener('mousemove', drag);
  servicesContainer.addEventListener('mouseup', endDrag);
  servicesContainer.addEventListener('mouseleave', endDrag);
  
  servicesContainer.addEventListener('touchstart', startDrag);
  servicesContainer.addEventListener('touchmove', drag);
  servicesContainer.addEventListener('touchend', endDrag);
  
  // Add hover effect for cards
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = '#search';
    });
  });
}