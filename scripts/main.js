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
  setupHeaderSearch();
  
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

// Setup header search functionality
function setupHeaderSearch() {
  const searchInput = document.getElementById('headerSearchInput');
  const searchBtn = document.getElementById('headerSearchBtn');

  const performSearch = () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm) {
      window.location.href = `cruzeiros.html?destino=${encodeURIComponent(searchTerm)}`;
    }
  };

  searchBtn.addEventListener('click', performSearch);

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
}