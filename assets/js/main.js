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

  // ============ SHOPPING CART SYSTEM ============
  const Cart = {
    KEY: 'pp_cart',

    getItems() {
      try {
        return JSON.parse(localStorage.getItem(this.KEY)) || [];
      } catch { return []; }
    },

    save(items) {
      localStorage.setItem(this.KEY, JSON.stringify(items));
      this.updateBadge();
    },

    addItem(id, name, price, qty = 1) {
      const items = this.getItems();
      const existing = items.find(i => i.id === id);
      if (existing) {
        existing.qty += qty;
      } else {
        items.push({ id, name, price: parseFloat(price), qty });
      }
      this.save(items);
    },

    removeItem(id) {
      const items = this.getItems().filter(i => i.id !== id);
      this.save(items);
    },

    updateQty(id, qty) {
      const items = this.getItems();
      const item = items.find(i => i.id === id);
      if (item) {
        item.qty = Math.max(1, parseInt(qty) || 1);
        this.save(items);
      }
    },

    getTotal() {
      return this.getItems().reduce((sum, i) => sum + i.price * i.qty, 0);
    },

    getCount() {
      return this.getItems().reduce((sum, i) => sum + i.qty, 0);
    },

    updateBadge() {
      const badges = document.querySelectorAll('.cart-badge');
      const count = this.getCount();
      badges.forEach(badge => {
        badge.textContent = count;
        badge.classList.toggle('empty', count === 0);
      });
    }
  };

  // Init badge on every page
  Cart.updateBadge();

  // Add mobile cart icon (visible when navbar__right is hidden)
  const navbarEl = document.querySelector('.navbar');
  const toggleBtn = document.querySelector('.navbar__toggle');
  if (navbarEl && toggleBtn) {
    const mobileCart = document.createElement('a');
    mobileCart.href = 'cart.html';
    mobileCart.className = 'navbar__cart mobile-cart';
    mobileCart.setAttribute('aria-label', 'Shopping cart');
    mobileCart.innerHTML = '<i class="fas fa-shopping-cart"></i><span class="cart-badge">0</span>';
    navbarEl.insertBefore(mobileCart, toggleBtn);
    Cart.updateBadge();
  }

  // ============ ADD TO CART BUTTONS ============
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const { id, name, price } = btn.dataset;
      Cart.addItem(id, name, price);

      // Animate button
      const origHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Added!';
      btn.classList.add('added');
      setTimeout(() => {
        btn.innerHTML = origHTML;
        btn.classList.remove('added');
      }, 1500);

      // Bounce badge
      const badge = document.querySelector('.cart-badge');
      if (badge) {
        badge.classList.remove('bounce');
        void badge.offsetWidth;
        badge.classList.add('bounce');
      }

      // Show toast
      showCartToast();
    });
  });

  // ============ CART TOAST ============
  function showCartToast() {
    const toast = document.getElementById('cartToast');
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ============ QUICK VIEW MODAL ============
  const productData = {
    'itin-ssn-toolkit': { icon: 'fas fa-exchange-alt', title: 'DIY Toolkit \u2014 ITIN to SSN Transition', desc: 'Step-by-step instructions for updating your ITIN to SSN with the SSA. Fillable PDF and Word templates. Prevents IRS delays and wage mismatches.', price: 19.99 },
    'cert-naturalization': { icon: 'fas fa-flag-usa', title: 'DIY Toolkit \u2014 Replace or Correct Certificate of Naturalization/Citizenship', desc: 'Form N-565 preparation guide. Smart checklists for lost/stolen, damaged, name changes, and USCIS errors. Fill-in templates and mailing guide.', price: 24.99 },
    'us-citizenship': { icon: 'fas fa-passport', title: 'DIY Toolkit \u2014 Application for U.S. Citizenship', desc: 'ZIP file with 4 PDFs: Form N-400 Guide, Section-by-Section Instructions, Evidence Checklist, and Cover Letter Template.', price: 24.99 },
    'green-card-renewal': { icon: 'fas fa-id-card', title: 'DIY Toolkit \u2014 Renew or Replace Your Green Card', desc: '8 documents: I-90 Guide, section-by-section instructions, assembly/mailing checklist, filing tips, cover letter template, sworn statement, and more.', price: 25.00 },
    'itin-ssn-guide': { icon: 'fas fa-file-lines', title: 'ITIN to SSN Transition Guide (Bilingual)', desc: 'Everything you need to transition from ITIN to SSN, in plain language. English and Spanish.', price: 17.00 },
    'first-itin': { icon: 'fas fa-book-open', title: 'Your ITIN, Step by Step \u2014 First-Time ITIN Application Guide', desc: 'Bilingual guide (English/Spanish), 9 pages. Covers ITIN definition, eligibility, Form W-7 instructions, 3 submission methods, common mistakes, and FAQ.', price: 14.99 },
    'work-permit-roadmap': { icon: 'fas fa-road', title: 'Work Permit Next Steps Roadmap (Bilingual)', desc: 'Steps to take in your first 30, 60, and 90 days after receiving your EAD.', price: 14.00 },
    'livescan-prep': { icon: 'fas fa-fingerprint', title: 'Live Scan Fingerprinting Prep Guide (Bilingual)', desc: 'What to bring, what to expect, and how to get the best results for your first-time Live Scan appointment.', price: 12.00 },
    'doc-organizer': { icon: 'fas fa-folder-open', title: 'Immigrant Document Organizer (Fillable PDF, Bilingual)', desc: 'Fillable PDF to track immigration, identity, and tax documents. Fields for expiration dates, document numbers, and storage locations.', price: 19.00 },
    'citizenship-interview': { icon: 'fas fa-clipboard-check', title: 'US Citizenship Interview Prep Checklist (Bilingual)', desc: 'Covers required documents, civics test, English test, and common mistakes to avoid.', price: 12.00 }
  };

  const qvModal = document.getElementById('quickViewModal');
  let qvCurrentId = null;

  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const data = productData[id];
      if (!data || !qvModal) return;

      qvCurrentId = id;
      document.getElementById('qvIcon').innerHTML = `<i class="${data.icon}"></i>`;
      document.getElementById('qvTitle').textContent = data.title;
      document.getElementById('qvDesc').textContent = data.desc;
      document.getElementById('qvPrice').textContent = '$' + data.price.toFixed(2);
      document.getElementById('qvQty').value = 1;
      qvModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  if (qvModal) {
    qvModal.querySelector('.quick-view-modal__close').addEventListener('click', closeQV);
    qvModal.querySelector('.quick-view-modal__overlay').addEventListener('click', closeQV);
  }
  function closeQV() {
    if (!qvModal) return;
    qvModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Qty +/- in modal
  const qvQtyInput = document.getElementById('qvQty');
  if (qvModal) {
    qvModal.querySelector('.qty-minus')?.addEventListener('click', () => {
      qvQtyInput.value = Math.max(1, parseInt(qvQtyInput.value) - 1);
    });
    qvModal.querySelector('.qty-plus')?.addEventListener('click', () => {
      qvQtyInput.value = parseInt(qvQtyInput.value) + 1;
    });
  }

  // Add to cart from modal
  const qvAddBtn = document.getElementById('qvAddToCart');
  if (qvAddBtn) {
    qvAddBtn.addEventListener('click', () => {
      const data = productData[qvCurrentId];
      if (!data) return;
      const qty = parseInt(qvQtyInput.value) || 1;
      Cart.addItem(qvCurrentId, data.title, data.price, qty);

      // Bounce badge
      const badge = document.querySelector('.cart-badge');
      if (badge) {
        badge.classList.remove('bounce');
        void badge.offsetWidth;
        badge.classList.add('bounce');
      }

      closeQV();
      showCartToast();
    });
  }

  // ============ CART PAGE RENDERING ============
  const cartEmpty = document.getElementById('cartEmpty');
  const cartContent = document.getElementById('cartContent');
  const cartTableBody = document.getElementById('cartTableBody');
  const cartSubtotal = document.getElementById('cartSubtotal');

  function renderCartPage() {
    if (!cartTableBody) return; // Not on cart page

    const items = Cart.getItems();

    if (items.length === 0) {
      cartEmpty.style.display = 'block';
      cartContent.style.display = 'none';
      return;
    }

    cartEmpty.style.display = 'none';
    cartContent.style.display = 'block';

    const iconMap = {
      'itin-ssn-toolkit': 'fas fa-exchange-alt',
      'cert-naturalization': 'fas fa-flag-usa',
      'us-citizenship': 'fas fa-passport',
      'green-card-renewal': 'fas fa-id-card',
      'itin-ssn-guide': 'fas fa-file-lines',
      'first-itin': 'fas fa-book-open',
      'work-permit-roadmap': 'fas fa-road',
      'livescan-prep': 'fas fa-fingerprint',
      'doc-organizer': 'fas fa-folder-open',
      'citizenship-interview': 'fas fa-clipboard-check'
    };

    cartTableBody.innerHTML = items.map(item => `
      <tr data-cart-id="${item.id}">
        <td>
          <div class="cart-td-product">
            <div class="cart-item-icon"><i class="${iconMap[item.id] || 'fas fa-box'}"></i></div>
            <span class="cart-item-name">${item.name}</span>
          </div>
        </td>
        <td class="cart-td-price">$${item.price.toFixed(2)}</td>
        <td class="cart-td-qty">
          <div class="cart-qty-wrap">
            <button class="qty-btn cart-qty-minus" data-id="${item.id}"><i class="fas fa-minus"></i></button>
            <input type="number" class="qty-input cart-qty-input" data-id="${item.id}" value="${item.qty}" min="1" max="99">
            <button class="qty-btn cart-qty-plus" data-id="${item.id}"><i class="fas fa-plus"></i></button>
          </div>
        </td>
        <td class="cart-td-total">$${(item.price * item.qty).toFixed(2)}</td>
        <td class="cart-td-remove">
          <button class="cart-remove-btn" data-id="${item.id}" title="Remove">&times;</button>
        </td>
      </tr>
    `).join('');

    cartSubtotal.textContent = '$' + Cart.getTotal().toFixed(2);

    // Bind events
    cartTableBody.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Cart.removeItem(btn.dataset.id);
        renderCartPage();
      });
    });

    cartTableBody.querySelectorAll('.cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = cartTableBody.querySelector(`.cart-qty-input[data-id="${btn.dataset.id}"]`);
        const newVal = Math.max(1, parseInt(input.value) - 1);
        input.value = newVal;
        Cart.updateQty(btn.dataset.id, newVal);
        renderCartPage();
      });
    });

    cartTableBody.querySelectorAll('.cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = cartTableBody.querySelector(`.cart-qty-input[data-id="${btn.dataset.id}"]`);
        const newVal = parseInt(input.value) + 1;
        input.value = newVal;
        Cart.updateQty(btn.dataset.id, newVal);
        renderCartPage();
      });
    });

    cartTableBody.querySelectorAll('.cart-qty-input').forEach(input => {
      input.addEventListener('change', () => {
        const val = Math.max(1, parseInt(input.value) || 1);
        input.value = val;
        Cart.updateQty(input.dataset.id, val);
        renderCartPage();
      });
    });
  }

  renderCartPage();

  // Checkout button
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      alert('Thank you for your interest! Checkout integration coming soon. Please contact us at info@proximopaso.com to complete your purchase.');
    });
  }

});
