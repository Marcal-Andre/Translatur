/* ==========================================================================
   Main Application Entrypoint
   Inicialização de módulos e interações globais
   ========================================================================== */

import { initCarousel } from './carousel.js';
import { setupSearch, showToast } from './search.js';
import { initTestimonials } from './testimonials.js';
import { setupMobileMenu } from './mobileMenu.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização de componentes
  initCarousel();
  setupSearch();
  initTestimonials();
  setupMobileMenu();
  handleHeaderScroll();
  setupNewsletter();
});

// Efeito de rolagem do cabeçalho
function handleHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Formulário da Newsletter
function setupNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && input.value) {
      showToast('Obrigado! Você receberá ofertas e cupons exclusivos no seu e-mail.');
      input.value = '';
    }
  });
}