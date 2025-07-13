document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const modeToggle = document.getElementById("modeToggle");
  const langToggle = document.getElementById("langToggle");
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  // === DEKLARASI VARIABEL UTAMA (PERBAIKAN) ===
  const serviceCards = document.querySelectorAll('.service-card');
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  // === 1. PWA: SERVICE WORKER REGISTRATION ===
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("ServiceWorker registered"))
        .catch((err) => console.log("ServiceWorker failed: ", err));
    });
  }

  // === 2. DARK/LIGHT MODE TOGGLE ===
  function applyTheme(theme) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      modeToggle.classList.remove("active-left");
      modeToggle.classList.add("active-right");
    } else {
      body.classList.remove("dark-mode");
      modeToggle.classList.add("active-left");
      modeToggle.classList.remove("active-right");
    }
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  modeToggle.addEventListener("click", () => {
    const isDarkMode = body.classList.toggle("dark-mode");
    modeToggle.classList.toggle("active-left");
    modeToggle.classList.toggle("active-right");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  });

  // === 3. LANGUAGE TOGGLE ===
  const currentLang = document.documentElement.lang;

  if (currentLang === "id") {
    langToggle.classList.add("active-left");
  } else {
    langToggle.classList.add("active-right");
  }

  langToggle.addEventListener("click", () => {
    window.location.href = currentLang === "id" ? "index-eng.html" : "index.html";
  });

  // === 4. HAMBURGER MENU TOGGLE ===
  function closeMobileMenu() {
    hamburger.classList.remove("active");
    mobileNav.classList.remove("show");
  }

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileNav.classList.toggle("show");
  });

  mobileNav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      closeMobileMenu();
    }
  });

  // === 5. HERO SECTION: TYPING & IMAGE SLIDESHOW ===
  const roleTextElement = document.getElementById("role-text");
  const heroImages = document.querySelectorAll(".hero-image");

  if (roleTextElement && heroImages.length > 0) {
    const rolesID = ["Fotografer", "Retoucher", "Desainer"];
    const rolesEN = ["Photographer", "Retoucher", "Designer"];
    const roles = document.documentElement.lang === "id" ? rolesID : rolesEN;
    let roleIndex = 0;

    function typeEffect(element, text, i = 0) {
      if (i < text.length) {
        element.textContent = text.substring(0, i + 1);
        setTimeout(() => typeEffect(element, text, i + 1), 100);
      }
    }

    function changeRoleAndImage() {
      heroImages.forEach(img => img.classList.remove("active"));
      roleIndex = (roleIndex + 1) % roles.length;
      heroImages[roleIndex].classList.add("active");
      typeEffect(roleTextElement, roles[roleIndex]);
    }

    typeEffect(roleTextElement, roles[roleIndex]);
    setInterval(changeRoleAndImage, 4000);
  }
  
  // === 6. SISTEM ANIMASI SCROLL KUSTOM ===
  let lastScrollY = window.scrollY;
  let scrollDirection = 'down';

  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
      scrollDirection = 'down';
    } else {
      scrollDirection = 'up';
    }
    lastScrollY = window.scrollY;
  }, { passive: true });

  const animatedElements = document.querySelectorAll(
    '.animate-directional-y, .animate-zoom-in, .animate-group'
  );

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target;
        if (entry.isIntersecting) {
          if (target.classList.contains('animate-directional-y')) {
            if (scrollDirection === 'down') {
              target.classList.add('from-bottom');
            } else {
              target.classList.add('from-top');
            }
            void target.offsetHeight;
            target.classList.add('is-visible');
          } else if (target.classList.contains('animate-group')) {
            const childrenToAnimate = target.querySelectorAll('[data-animation]');
            childrenToAnimate.forEach((child, index) => {
              child.style.transitionDelay = `${index * 150}ms`;
              child.classList.add('is-visible');
            });
          } else {
            target.classList.add('is-visible');
          }
        } else {
          if (target.classList.contains('animate-group')) {
            target.querySelectorAll('[data-animation]').forEach(child => {
              child.classList.remove('is-visible');
            });
          } else {
            target.classList.remove('is-visible', 'from-top', 'from-bottom');
          }
        }
      });
    }, { threshold: 0.15 });

    animatedElements.forEach((el) => {
      observer.observe(el);
    });
  }
  
  // === 7. PORTFOLIO SLIDER & TEXT UPDATE ===
  const portfolioTitle = document.getElementById('portfolio-title');
  const portfolioDescription = document.getElementById('portfolio-description');
  const portfolioDataID = [
    { title: 'Retouching Foto Model', description: 'Retouching foto model dengan pendekatan beauty-retouch. Menghaluskan detail tanpa menghilangkan tekstur alami.' },
    { title: 'Fotografi Gaya Urban', description: 'Menangkap esensi kehidupan kota yang dinamis melalui lensa. Setiap foto menceritakan kisah jalanan dan arsitektur.' },
    { title: 'Desain Branding Kreatif', description: 'Membangun identitas visual yang kuat untuk merek. Dari logo hingga materi pemasaran yang berkesan.' }
  ];
  const portfolioDataEN = [
    { title: 'Model Photo Retouching', description: 'Model photo retouching with a beauty-retouch approach. Smoothing details without losing natural texture.' },
    { title: 'Urban Style Photography', description: 'Capturing the essence of a dynamic city life through the lens. Each photo tells a story of the streets and architecture.' },
    { title: 'Creative Branding Design', description: 'Building a strong visual identity for brands. From logos to marketing materials that leave a lasting impression.' }
  ];
  const portfolioData = currentLang === 'id' ? portfolioDataID : portfolioDataEN;

  if (document.querySelector('.portfolio-swiper')) {
    const portfolioSwiper = new Swiper('.portfolio-swiper', {
      loop: true, effect: 'slide', speed: 800, grabCursor: true, centeredSlides: true, slidesPerView: 'auto',
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      pagination: { el: '.swiper-pagination', clickable: true },
    });
    
    function updatePortfolioText(index) {
      if (portfolioTitle && portfolioDescription && portfolioData[index]) {
        portfolioTitle.style.opacity = 0;
        portfolioDescription.style.opacity = 0;
        setTimeout(() => {
          portfolioTitle.textContent = portfolioData[index].title;
          portfolioDescription.textContent = portfolioData[index].description;
          portfolioTitle.style.opacity = 1;
          portfolioDescription.style.opacity = 1;
        }, 300);
      }
    }
    if (portfolioTitle && portfolioDescription) {
      portfolioTitle.style.transition = 'opacity 0.3s ease-out';
      portfolioDescription.style.transition = 'opacity 0.3s ease-out';
    }
    portfolioSwiper.on('slideChange', function () { updatePortfolioText(this.realIndex); });
    updatePortfolioText(portfolioSwiper.realIndex);
  }

  // === 8. LOGIKA KARTU LAYANAN ===
  if (serviceCards.length > 0) {
    serviceCards.forEach(card => {
      card.addEventListener('click', () => {
        if (card.classList.contains('selected')) {
          const url = card.dataset.url;
          if (url) {
            window.open(url, '_blank');
          }
        } else {
          serviceCards.forEach(otherCard => {
            otherCard.classList.remove('selected');
          });
          card.classList.add('selected');
        }
      });
    });
  }

  // === 9. TESTIMONIAL SLIDER & LOGIC ===
  if (document.querySelector('.testimonial-swiper')) {
    const testimonialSwiper = new Swiper('.testimonial-swiper', {
      loop: true,
      grabCursor: true,
      spaceBetween: 24,
      pagination: {
        el: '.testimonial-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.testimonial-next',
        prevEl: '.testimonial-prev',
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }
    });

    if (testimonialCards.length > 0) {
      testimonialCards.forEach(card => {
        card.addEventListener('click', () => {
          if (card.classList.contains('selected')) {
            const url = card.dataset.url;
            if (url) {
              window.open(url, '_blank');
            }
          } else {
            testimonialCards.forEach(otherCard => {
              otherCard.classList.remove('selected');
            });
            card.classList.add('selected');
          }
        });
      });
    }
  }

  // === 10. DESELECT CARD ON OUTSIDE CLICK ===
  document.addEventListener('click', function(e) {
    const isClickInsideServiceCard = e.target.closest('.service-card');
    const isClickInsideTestimonialCard = e.target.closest('.testimonial-card');

    if (!isClickInsideServiceCard && !isClickInsideTestimonialCard) {
      serviceCards.forEach(card => card.classList.remove('selected'));
      testimonialCards.forEach(card => card.classList.remove('selected'));
    }
  });
  
  // ... (akhir dari DOMContentLoaded)
  document.addEventListener('click', function(e) {
    const target = e.target;
    if (!target.closest('.service-card') && !target.closest('.testimonial-card')) {
      const selectedCards = document.querySelectorAll('.service-card.selected, .testimonial-card.selected');
      selectedCards.forEach(card => {
        card.classList.remove('selected');
      });
    }
  });
});

// === 11. FAQ ACCORDION LOGIC ===
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  if (accordionHeaders.length > 0) {
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        
        // Cek apakah item ini sudah aktif
        const isActive = accordionItem.classList.contains('active');

        // Opsional: Tutup semua item lain sebelum membuka yang baru
        // Hapus bagian ini jika Anda ingin beberapa jawaban bisa terbuka bersamaan
        accordionHeaders.forEach(otherHeader => {
          otherHeader.parentElement.classList.remove('active');
        });

        // Jika item yang diklik tidak aktif, maka buka
        if (!isActive) {
          accordionItem.classList.add('active');
        }
      });
    });
  }