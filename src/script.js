/**
 * Funk Monk Hostel - Luxury Brand Showcase Script
 * Pure Vanilla JavaScript & Modern Canvas Engraving
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCustomCursor();
  initHeroMotionCanvas();
  initHeaderScroll();
  initScrollReveal();
  initParallax();
  initGalleryLightbox();
  initTestimonialCarousel();
  initBookingSystem();
  initMobileNav();
});

/* ==========================================================================
   1. LOADER OVERLAY CONTROLLER
   ========================================================================== */
function initLoader() {
  const loader = document.getElementById('loader-overlay');
  if (loader) {
    // Elegant exit fade after timing sequence
    setTimeout(() => {
      loader.classList.add('loaded');
      document.body.classList.remove('no-scroll');
    }, 1800);
  }
}

/* ==========================================================================
   2. CUSTOM PRECISION CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursorDot = document.getElementById('cursor-dot');
  const cursorFollower = document.getElementById('cursor-follower');
  
  if (!cursorDot || !cursorFollower) return;
  
  let mouseX = 0, mouseY = 0;
  let posX = 0, posY = 0;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Quick reposition for the centered core dot
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });
  
  // Custom lag/elasticity smoothing for the outer ring follower
  function updateFollower() {
    // Easing formula
    posX += (mouseX - posX) * 0.12;
    posY += (mouseY - posY) * 0.12;
    
    cursorFollower.style.left = `${posX}px`;
    cursorFollower.style.top = `${posY}px`;
    
    requestAnimationFrame(updateFollower);
  }
  requestAnimationFrame(updateFollower);
  
  // Hover listeners across links and action items
  const hoverElements = document.querySelectorAll('a, button, input, select, .gallery-item, .highlight-card');
  hoverElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      document.body.classList.add('hovering');
    });
    elem.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovering');
    });
  });
}

/* ==========================================================================
   3. HERO MOTION GRAPHIC CANVAS (Kinetic Floating Network)
   ========================================================================== */
function initHeroMotionCanvas() {
  const canvas = document.getElementById('hero-motion-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let animationFrameId;
  
  // Handle layout resizing safely
  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  setCanvasSize();
  window.addEventListener('resize', setCanvasSize);
  
  const particles = [];
  const maxParticles = window.innerWidth < 768 ? 40 : 80;
  const connectionRadius = 120;
  
  let mouse = { x: null, y: null, radius: 200 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  // Generate particles based on our earthy luxury color scheme
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      
      // Node colors are a range of subtle champagne gold and terracotta hues
      const randomTone = Math.random();
      if (randomTone < 0.6) {
        this.color = 'rgba(195, 155, 98, 0.45)'; // Gold
      } else if (randomTone < 0.85) {
        this.color = 'rgba(204, 90, 55, 0.35)';   // Terracotta
      } else {
        this.color = 'rgba(255, 255, 255, 0.15)';  // Muted light
      }
    }
    
    update() {
      // Basic movement bounds check
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      
      // Interaction with mouse element
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          // Push particles gently away from cursor
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = dx / distance;
          const directionY = dy / distance;
          
          this.x += directionX * force * 1.5;
          this.y += directionY * force * 1.5;
        }
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  // Populate
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
  
  // Update and draw loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw interconnected connections first
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < connectionRadius) {
          // Connection strength depends on vicinity
          const opacity = (1 - dist / connectionRadius) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          
          // Style line with fine gold gradient
          ctx.strokeStyle = `rgba(195, 155, 98, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    
    // Render and process circles
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    animationFrameId = requestAnimationFrame(animate);
  }
  
  animate();
}

/* ==========================================================================
   4. SCROLL DETECTOR FOR TRANSPARENT HEADER
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   5. INTERSECTION OBSERVER FOR CHIC SCROLL REVEALS
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visual transition class
        entry.target.classList.add('revealed');
        // Stop checking this element
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px' // offset so trigger happens before element hits center screen
  });
  
  revealElements.forEach(elem => {
    revealObserver.observe(elem);
  });
}

/* ==========================================================================
   6. PARALLAX EFFECT FOR CONTEMPORARY IMAGES
   ========================================================================== */
function initParallax() {
  const parallaxWrappers = document.querySelectorAll('.image-frame, .room-visual');
  
  window.addEventListener('scroll', () => {
    parallaxWrappers.forEach(wrapper => {
      const img = wrapper.querySelector('img');
      if (!img) return;
      
      const bounds = wrapper.getBoundingClientRect();
      const inView = bounds.top < window.innerHeight && bounds.bottom > 0;
      
      if (inView) {
        // Calculate scroll displacement ratio
        const shiftY = (window.innerHeight - bounds.top) * 0.05;
        // Apply smooth relative translate shift down inside mask
        img.style.transform = `scale(1.04) translateY(${-shiftY}px)`;
      }
    });
  });
}

/* ==========================================================================
   7. MASONRY GALLERY FILTERING & CINEMATIC LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  
  if (!lightbox) return;
  
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxTag = lightbox.querySelector('.lightbox-tag');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  
  let activeIndex = 0;
  let visibleActiveItems = [...galleryItems];
  
  // Gallery Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active states
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      // Reset array of visible active photos
      visibleActiveItems = [];
      
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          // Small delays for staggered entrance
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
          visibleActiveItems.push(item);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 350);
        }
      });
    });
  });
  
  // Open Lightbox
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      activeIndex = visibleActiveItems.indexOf(item);
      updateLightboxContent();
      lightbox.classList.add('active');
      document.body.classList.add('no-scroll');
    });
  });
  
  // Update resources on flip
  function updateLightboxContent() {
    const targetItem = visibleActiveItems[activeIndex];
    if (!targetItem) return;
    
    const imgSource = targetItem.querySelector('img').getAttribute('src');
    const nameText = targetItem.querySelector('.gallery-name').textContent;
    const tagText = targetItem.querySelector('.gallery-tag').textContent;
    
    // Smooth opacity fadeout before switching imagery
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.setAttribute('src', imgSource);
      lightboxCaption.textContent = nameText;
      lightboxTag.textContent = tagText;
      lightboxImg.style.opacity = '1';
    }, 200);
  }
  
  // Event handlers
  function showNext() {
    activeIndex = (activeIndex + 1) % visibleActiveItems.length;
    updateLightboxContent();
  }
  
  function showPrev() {
    activeIndex = (activeIndex - 1 + visibleActiveItems.length) % visibleActiveItems.length;
    updateLightboxContent();
  }
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
  
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', closeLightbox);
  
  // Keyboard commands
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'Escape') closeLightbox();
  });
}

/* ==========================================================================
   8. TESTIMONIAL SLIDER INTERACTIVE CONTROLS
   ========================================================================== */
function initTestimonialCarousel() {
  const track = document.getElementById('testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('testimonial-dots');
  
  if (!track || slides.length === 0 || !dotsContainer) return;
  
  let currentIdx = 0;
  let autoTimer;
  
  // Generate dots dynamic grid
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (idx === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
    dotsContainer.appendChild(dot);
    
    dot.addEventListener('click', () => {
      gotoSlide(idx);
      resetAutoplay();
    });
  });
  
  const dots = dotsContainer.querySelectorAll('.carousel-dot');
  
  function gotoSlide(index) {
    currentIdx = index;
    // Slide translate animation
    track.style.transform = `translateX(-${currentIdx * 100}%)`;
    
    // Opacity fades
    slides.forEach((slide, idx) => {
      if (idx === currentIdx) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
    
    // Dots highlight
    dots.forEach((dot, idx) => {
      if (idx === currentIdx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  function startAutoplay() {
    autoTimer = setInterval(() => {
      const nextIdx = (currentIdx + 1) % slides.length;
      gotoSlide(nextIdx);
    }, 6000);
  }
  
  function resetAutoplay() {
    clearInterval(autoTimer);
    startAutoplay();
  }
  
  // Launch initial slideshow loop
  slides[0].classList.add('active');
  startAutoplay();
}

/* ==========================================================================
   9. BOUTIQUE PORTAL / BOOKING SYSTEM & CHIME OVERLAYS
   ========================================================================== */
function initBookingSystem() {
  const form = document.getElementById('booking-portal-form');
  const confirmPopup = document.getElementById('popup-confirm');
  const closePopupBtn = document.getElementById('btn-popup-close');
  
  if (!form || !confirmPopup || !closePopupBtn) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const roomType = document.getElementById('room-select');
    const selectedRoomName = roomType.options[roomType.selectedIndex].text;
    const guests = document.getElementById('guests-select').value;
    
    if (!checkin || !checkout) {
      alert('Please select both Check-In and Check-Out dates for your sanctuary space.');
      return;
    }
    
    // Dynamic price breakdown calculations for extreme perceived reality!
    const inDate = new Date(checkin);
    const outDate = new Date(checkout);
    const nightDiff = Math.max(1, Math.round((outDate - inDate) / (1000 * 60 * 60 * 24)));
    
    let basePricePerNight = 1200; // Dorm price
    if (roomType.value === 'monk-suite') {
      basePricePerNight = 3500; // Suite private price
    }
    
    const calculatedTotal = basePricePerNight * nightDiff * guests;
    
    // Dynamic insertion into target HTML confirmation blocks
    document.getElementById('confirm-room-name').textContent = selectedRoomName;
    document.getElementById('confirm-nights').textContent = `${nightDiff} Night${nightDiff > 1 ? 's' : ''}`;
    document.getElementById('confirm-total-estimate').textContent = `₹${calculatedTotal.toLocaleString('en-IN')}`;
    
    // Button Loader Animation during submission
    const submitBtn = form.querySelector('.btn-primary');
    const origText = submitBtn.textContent;
    submitBtn.textContent = 'TRANSMITTING INQUIRY...';
    submitBtn.style.pointerEvents = 'none';
    submitBtn.style.opacity = '0.7';
    
    setTimeout(() => {
      // Restore CTA
      submitBtn.textContent = origText;
      submitBtn.style.pointerEvents = 'auto';
      submitBtn.style.opacity = '1';
      
      // Beautiful Audio-Visual Chime (Synthesizing tone using AudioContext)
      playSanctuaryChime();
      
      // Show Luxury Confirmation Card
      confirmPopup.classList.add('active');
      document.body.classList.add('no-scroll');
      
      // Reset details
      form.reset();
    }, 1500);
  });
  
  // Close handler
  closePopupBtn.addEventListener('click', () => {
    confirmPopup.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });
  
  confirmPopup.addEventListener('click', (e) => {
    if (e.target === confirmPopup) {
      confirmPopup.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });
}

// Sophisticated digital chime generator in synth-style
function playSanctuaryChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const audioCtx = new AudioContext();
    
    // Sound segment 1 (F#5 - Golden bright note)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(739.99, audioCtx.currentTime); // F#5
    gain1.gain.setValueAtTime(0, audioCtx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
    
    osc1.start();
    osc1.stop(audioCtx.currentTime + 1.2);
    
    // Sound segment 2 (C#6 - High peaceful harmony) after 150ms delay
    setTimeout(() => {
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1109.73, audioCtx.currentTime); // C#6
      gain2.gain.setValueAtTime(0, audioCtx.currentTime);
      gain2.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
      
      osc2.start();
      osc2.stop(audioCtx.currentTime + 1.5);
    }, 120);
    
  } catch(err) {
    // Graceful block if browser restricts audio context autoplay
  }
}

/* ==========================================================================
   10. MOBILE NAV DRAWER CONTROLLER
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobile-nav-toggle');
  const links = document.getElementById('nav-links');
  
  if (!toggle || !links) return;
  
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('active');
    
    // Lock background scrolling when overlay active
    if (links.classList.contains('active')) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  });
  
  // Close when option option item is clicked
  const navItems = links.querySelectorAll('a');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });
}
