// Import modules
import { initCarousel } from './carousel.js';
import { setupSearch } from './search.js';
import { initTestimonials } from './testimonials.js';
import { setupMobileMenu } from './mobileMenu.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initCarousel();
  setupSearch();
  initTestimonials();
  setupMobileMenu();
  
  // Handle header scroll effect
  handleHeaderScroll();
});

// Handle header scroll effect
function handleHeaderScroll() {
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}