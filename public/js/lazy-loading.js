// Lazy Loading Utility for Images
class LazyLoader {
  constructor() {
    this.images = [];
    this.observer = null;
    this.init();
  }

  init() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback for older browsers
      this.setupFallback();
    }
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all lazy images
    this.observeImages();
  }

  setupFallback() {
    // Simple scroll-based lazy loading for older browsers
    window.addEventListener('scroll', PerformanceUtils.throttle(() => {
      this.checkImagesInViewport();
    }, 100));
  }

  observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      this.observer.observe(img);
    });
  }

  checkImagesInViewport() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      if (this.isInViewport(img)) {
        this.loadImage(img);
      }
    });
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    // Create a new image to preload
    const tempImage = new Image();

    tempImage.onload = () => {
      img.src = src;
      img.classList.remove('lazy');
      img.classList.add('loaded');

      // Remove data-src attribute
      img.removeAttribute('data-src');

      // Trigger animation
      img.style.opacity = '0';
      setTimeout(() => {
        img.style.transition = 'opacity 0.3s ease-in-out';
        img.style.opacity = '1';
      }, 10);
    };

    tempImage.onerror = () => {
      console.error('Failed to load image:', src);
      img.classList.add('error');
    };

    tempImage.src = src;
  }

  // Convert existing images to lazy loading
  convertImagesToLazy() {
    const images = document.querySelectorAll('img:not([data-src])');
    images.forEach(img => {
      const src = img.src;
      if (src && !src.includes('data:') && !src.includes('base64')) {
        img.setAttribute('data-src', src);
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        img.classList.add('lazy');
      }
    });
  }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.lazyLoader = new LazyLoader();

  // Convert existing images to lazy loading
  setTimeout(() => {
    window.lazyLoader.convertImagesToLazy();
  }, 100);
});

// Add CSS for lazy loading
const lazyLoadingCSS = `
  .lazy {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  
  .lazy.loaded {
    opacity: 1;
  }
  
  .lazy.error {
    opacity: 0.5;
    filter: grayscale(100%);
  }
  
  /* Loading placeholder */
  img[data-src] {
    background: #f0f0f0;
    min-height: 100px;
  }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = lazyLoadingCSS;
document.head.appendChild(style); 