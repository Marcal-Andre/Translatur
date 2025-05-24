// Testimonials carousel
export function initTestimonials() {
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.dot');
  
  if (testimonials.length === 0 || dots.length === 0) return;
  
  let currentSlide = 0;
  let interval;
  
  // Function to show a specific slide
  const showSlide = (index) => {
    // Hide all testimonials
    testimonials.forEach(testimonial => {
      testimonial.style.transform = `translateX(-${index * 100}%)`;
    });
    
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    
    currentSlide = index;
  };
  
  // Add click event to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetInterval();
    });
  });
  
  // Auto rotate testimonials
  const startInterval = () => {
    interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % testimonials.length;
      showSlide(nextSlide);
    }, 5000); // Change slide every 5 seconds
  };
  
  const resetInterval = () => {
    clearInterval(interval);
    startInterval();
  };
  
  // Initialize the carousel
  showSlide(0);
  startInterval();
  
  // Pause on hover
  const testimonialsContainer = document.querySelector('.testimonials-container');
  if (testimonialsContainer) {
    testimonialsContainer.addEventListener('mouseenter', () => {
      clearInterval(interval);
    });
    
    testimonialsContainer.addEventListener('mouseleave', () => {
      startInterval();
    });
  }
}