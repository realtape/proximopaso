/* ============================================
   PROXIMO PASO - Dynamic Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============ HERO SLIDESHOW ============
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const progressBar = document.querySelector('.hero-progress');
  const counterCurrent = document.querySelector('.hero-counter .current');
  let currentSlide = 0;
  let slideInterval;
  let progressInterval;
  const SLIDE_DURATION = 6000;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    currentSlide = index;
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    if (counterCurrent) counterCurrent.textContent = String(currentSlide + 1).padStart(2, '0');
    resetProgress();
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function resetProgress() {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progressBar.style.transition = `width ${SLIDE_DURATION}ms linear`;
        progressBar.style.width = '100%';
      });
    });
  }

  function startSlideshow() {
    if (slides.length < 2) return;
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    resetProgress();
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      clearInterval(slideInterval);
      startSlideshow();
    });
  });

  if (slides.length > 0) {
    goToSlide(0);
    startSlideshow();
  }

  // ============ FLOATING PARTICLES ============
  const particleContainer = document.querySelector('.hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      const size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      particleContainer.appendChild(particle);
    }
  }

  // ============ MOBILE MENU ============
  const toggle = document.querySelector('.navbar__toggle');
  const menu = document.querySelector('.navbar__menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ============ STICKY HEADER ============
  const header = document.querySelector('.header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
      lastScroll = window.scrollY;
    });
  }

  // ============ BACK TO TOP ============
  const backBtn = document.querySelector('.back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('show', window.scrollY > 500);
    });
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============ SCROLL ANIMATIONS ============
  const animatedElements = document.querySelectorAll('.fade-up, .slide-left, .slide-right, .scale-in, .stagger-children');
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -30px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));

  // ============ CARD MOUSE GLOW EFFECT ============
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  // ============ TILT EFFECT ON CARDS ============
  const tiltCards = document.querySelectorAll('.product-card, .network-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============ ANIMATED COUNTER ============
  const counters = document.querySelectorAll('.hero__stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const num = parseInt(text);
        if (!isNaN(num) && num > 0) {
          let current = 0;
          const increment = Math.ceil(num / 40);
          const suffix = text.replace(/\d+/, '');
          const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
              current = num;
              clearInterval(timer);
            }
            el.textContent = current + suffix;
          }, 30);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ============ COOKIE BANNER ============
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieBtn = document.querySelector('.cookie-accept');
  if (cookieBanner && !localStorage.getItem('pp_cookies_accepted')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1500);
  }
  if (cookieBtn) {
    cookieBtn.addEventListener('click', () => {
      localStorage.setItem('pp_cookies_accepted', 'true');
      cookieBanner.classList.remove('show');
    });
  }

  // ============ ACTIVE NAV LINK ============
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ============ SMOOTH SCROLL ============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============ FORM WITH SUCCESS ANIMATION ============
  const form = document.querySelector('.contact__form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]');
      const email = form.querySelector('[name="email"]');
      const phone = form.querySelector('[name="phone"]');
      if (name && email && phone && name.value && email.value && phone.value) {
        const btn = form.querySelector('.btn');
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = '#2a7b88';
        btn.style.transform = 'scale(1.05)';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = 'Send Message';
          btn.style.background = '';
          btn.style.transform = '';
        }, 3000);
      }
    });
  }

  // ============ PRODUCT FILTER ============
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.product-card').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ============ PARALLAX ON SCROLL (subtle) ============
  const parallaxElements = document.querySelectorAll('.why-us__image img, .page-header::before');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    document.querySelectorAll('.why-us__image img').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = 0.05;
        el.style.transform = `translateY(${(rect.top - window.innerHeight / 2) * speed}px) scale(1.02)`;
      }
    });
  });

});
