/* ========================================
   AMPHOREUS - Honkai: Star Rail
   Character Introduction Website
   JavaScript Interactions
   ======================================== */

// ============ STARFIELD PARTICLE SYSTEM ============
class StarField {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stars = [];
    this.numStars = 200;
    this.resize();
    this.init();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  draw(time) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (const star of this.stars) {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
      const opacity = star.opacity * (0.5 + twinkle * 0.5);
      
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(240, 215, 140, ${opacity})`;
      this.ctx.fill();

      // Add subtle glow to larger stars
      if (star.radius > 1) {
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
        const gradient = this.ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.radius * 3
        );
        gradient.addColorStop(0, `rgba(240, 215, 140, ${opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(240, 215, 140, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      }
    }
  }

  animate(time = 0) {
    this.draw(time);
    requestAnimationFrame((t) => this.animate(t));
  }
}

// ============ NAVBAR SCROLL EFFECT ============
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ============ MOBILE MENU ============
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('navHamburger');
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('navHamburger').classList.remove('active');
  });
});

// ============ SCROLL REVEAL ANIMATION ============
function initScrollReveal() {
  const cards = document.querySelectorAll('.character-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation based on card position in the viewport batch
        const allVisible = [...entries].filter(e => e.isIntersecting);
        const staggerIndex = allVisible.indexOf(entry);
        
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, staggerIndex * 100);
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  cards.forEach(card => observer.observe(card));
}

// ============ CHARACTER FILTER ============
function filterCards(filterValue) {
  const cards = document.querySelectorAll('.character-card');
  const buttons = document.querySelectorAll('.filter-btn');

  // Update active button
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filterValue);
  });

  // Filter cards with animation
  cards.forEach(card => {
    const element = card.dataset.element;
    const shouldShow = filterValue === 'all' || element === filterValue;

    if (shouldShow) {
      card.style.display = '';
      // Re-trigger animation
      card.classList.remove('visible');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.classList.add('visible');
        });
      });
    } else {
      card.style.display = 'none';
    }
  });
}

// ============ CHARACTER MODAL ============
function openModal(cardElement) {
  const modal = document.getElementById('characterModal');
  const modalImage = document.getElementById('modalImage');
  const modalDetails = document.getElementById('modalDetails');

  // Get card data
  const name = cardElement.dataset.name;
  const element = cardElement.dataset.element;
  const path = cardElement.dataset.path;
  const title = cardElement.querySelector('.card-title').textContent;
  const modalData = cardElement.querySelector('.card-modal-data');
  const version = modalData?.dataset.version || '';
  const fullDesc = modalData?.dataset.descFull || cardElement.querySelector('.card-description').textContent;
  
  // Get image
  const cardImg = cardElement.querySelector('.card-image-wrapper img');
  const hasImage = cardImg && !cardImg.closest('.card-image-placeholder');

  // Element emoji map
  const elementEmojis = {
    lightning: '⚡',
    ice: '❄️',
    wind: '🌿',
    fire: '🔥',
    imaginary: '✨',
    quantum: '💠',
    physical: '⚔️'
  };

  // Element display name
  const elementNames = {
    lightning: 'Lightning',
    ice: 'Ice',
    wind: 'Wind',
    fire: 'Fire',
    imaginary: 'Imaginary',
    quantum: 'Quantum',
    physical: 'Physical'
  };

  // Path display name
  const pathNames = {
    remembrance: 'Remembrance',
    erudition: 'Erudition',
    destruction: 'Destruction',
    harmony: 'Harmony',
    abundance: 'Abundance',
    hunt: 'The Hunt',
    nihility: 'Nihility',
    preservation: 'Preservation'
  };

  // Set modal image
  if (cardImg && cardImg.src && !cardImg.src.includes('undefined')) {
    modalImage.innerHTML = `<img src="${cardImg.src}" alt="${name}" style="background: var(--card-gradient);">`;
  } else {
    const gradientMap = {
      lightning: 'linear-gradient(135deg, #1a1035, #2d1550, #1a1035)',
      ice: 'linear-gradient(135deg, #0d1a2e, #152840, #0d1a2e)',
      wind: 'linear-gradient(135deg, #0d2018, #153028, #0d2018)',
      fire: 'linear-gradient(135deg, #2a1510, #3d1d12, #2a1510)',
      imaginary: 'linear-gradient(135deg, #1f1d0d, #302d15, #1f1d0d)',
      quantum: 'linear-gradient(135deg, #10102e, #1a1a50, #10102e)',
      physical: 'linear-gradient(135deg, #181820, #252530, #181820)'
    };
    modalImage.innerHTML = `<div class="modal-placeholder" style="background: ${gradientMap[element] || gradientMap.lightning}">${elementEmojis[element] || '⭐'}</div>`;
  }
  modalImage.style.background = 'var(--bg-card)';

  // Set modal details
  modalDetails.innerHTML = `
    <div class="modal-rarity">
      <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span>
    </div>
    <h2 class="modal-name">${name}</h2>
    <p class="modal-title-text">${title}</p>
    <div class="modal-stats">
      <div class="modal-stat">
        <div class="modal-stat-label">ธาตุ</div>
        <div class="modal-stat-value">${elementEmojis[element] || ''} ${elementNames[element] || element}</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-label">เส้นทาง</div>
        <div class="modal-stat-value">${pathNames[path] || path}</div>
      </div>
    </div>
    <p class="modal-description">${fullDesc}</p>
    ${version ? `<div class="modal-version">เปิดตัวใน Version ${version}</div>` : ''}
  `;

  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('characterModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.getElementById('characterModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    closeModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
  // Init starfield
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const starfield = new StarField(canvas);
    starfield.animate();
  }

  // Init navbar
  initNavbar();

  // Init scroll reveal
  initScrollReveal();

  // Trigger initial scroll check
  window.dispatchEvent(new Event('scroll'));
});
