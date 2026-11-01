/* ==========================================================================
   Testimonials Module
   Carrossel de depoimentos verificados com setas, dots e rotação automática
   ========================================================================== */

export function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  const prevBtn = document.querySelector('.test-nav-arrow.prev');
  const nextBtn = document.querySelector('.test-nav-arrow.next');
  const wrapper = document.querySelector('.testimonials-wrapper');

  if (slides.length === 0) return;

  let currentIndex = 0;
  let timer = null;

  const goToSlide = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides.forEach(slide => {
      slide.style.transform = `translateX(-${index * 100}%)`;
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });

    currentIndex = index;
  };

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      restartAuto();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      restartAuto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      restartAuto();
    });
  }

  const startAuto = () => {
    timer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 6000);
  };

  const restartAuto = () => {
    if (timer) clearInterval(timer);
    startAuto();
  };

  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => clearInterval(timer));
    wrapper.addEventListener('mouseleave', () => startAuto());
  }

  // Inicializa o primeiro slide
  goToSlide(0);
  startAuto();
}