document.addEventListener("DOMContentLoaded", () => {
    // === BAGIAN 1: KODE ASLI ANDA YANG SUDAH BENAR (TIDAK DIUBAH) ===
    const body = document.body;
    const modeToggle = document.getElementById("modeToggle");
    const langToggle = document.getElementById("langToggle");
    const hamburger = document.getElementById("hamburger");
    const mobileNav = document.getElementById("mobileNav");

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("/service-worker.js")
                .then(() => console.log("ServiceWorker registered"))
                .catch((err) => console.log("ServiceWorker failed: ", err));
        });
    }

    if (modeToggle) {
        function applyTheme(theme) {
            if (theme === "dark") {
                body.classList.add("dark-mode");
                modeToggle.classList.add("active-right");
            } else {
                body.classList.remove("dark-mode");
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
            modeToggle.classList.toggle("active-right");
            localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        });
    }

    if (langToggle) {
        const currentLang = document.documentElement.lang;
        if (currentLang === 'en') {
            langToggle.classList.add('active-right');
        } else {
            langToggle.classList.remove('active-right');
        }
        langToggle.addEventListener("click", () => {
            window.location.href = currentLang === "id" ? "index-eng.html" : "index.html";
        });
    }
    
    if (hamburger && mobileNav) {
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
        document.addEventListener("click", (e) => {
            if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

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

    // === INI BAGIAN PENTING YANG HILANG: ANIMASI UNTUK HERO SECTION ===
    const scrollElements = document.querySelectorAll(".animate-on-scroll");
    if (scrollElements.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            }
        );
        scrollElements.forEach((el) => observer.observe(el));
    }


    // === BAGIAN 2: KODE BARU UNTUK PORTFOLIO & ANIMASI BERULANG (DIGABUNG DENGAN BENAR) ===
    
    // 2.1 LOGIKA UNTUK SLIDER PORTFOLIO, OPSI KLIK & LIGHTBOX
    if (typeof Swiper !== 'undefined') {
        const portfolioData = {
            id: [
                { title: 'Retouching Produk', description: 'Retouching produk komersial...', projectUrl: '#' },
                { title: 'Fotografi Urban', description: 'Menangkap esensi kehidupan kota...', projectUrl: '#' },
                { title: 'Desain Branding', description: 'Membangun identitas visual yang kuat...', projectUrl: '#' }
            ],
            en: [
                { title: 'Product Retouching', description: 'Commercial product retouching...', projectUrl: '#' },
                { title: 'Urban Photography', description: 'Capturing the essence of city life...', projectUrl: '#' },
                { title: 'Branding Design', description: 'Building a strong visual identity...', projectUrl: '#' }
            ]
        };
        const portfolioSwiper = new Swiper('.portfolio-swiper', {
            loop: true, grabCursor: false,
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            on: {
                slideChange: function (swiperInstance) {
                    updatePortfolioText(swiperInstance.realIndex);
                    closeAllOptionOverlays();
                    updateAllProjectLinks(swiperInstance);
                },
                afterInit: function(swiperInstance) {
                     updateAllProjectLinks(swiperInstance);
                }
            }
        });
        function updatePortfolioText(index) {
            const lang = document.documentElement.lang || 'id';
            const data = portfolioData[lang][index];
            const titleEl = document.getElementById('portfolio-title');
            const descriptionEl = document.getElementById('portfolio-description');
            if (data && titleEl && descriptionEl) {
                titleEl.textContent = data.title;
                descriptionEl.textContent = data.description;
            }
        }
        function updateAllProjectLinks(swiperInstance) {
            const lang = document.documentElement.lang || 'id';
            swiperInstance.slides.forEach(slide => {
                const slideIndex = parseInt(slide.getAttribute('data-swiper-slide-index'), 10);
                const projectLink = slide.querySelector('.view-project-btn');
                if(projectLink && portfolioData[lang] && portfolioData[lang][slideIndex]){
                    projectLink.href = portfolioData[lang][slideIndex].projectUrl;
                }
            });
        }
        const portfolioSwiperEl = document.querySelector('.portfolio-swiper');
        function closeAllOptionOverlays() {
            document.querySelectorAll('.swiper-slide.options-visible').forEach(s => {
                s.classList.remove('options-visible');
            });
        }
        if (portfolioSwiperEl) {
            portfolioSwiperEl.addEventListener('click', (e) => {
                const slide = e.target.closest('.swiper-slide');
                if (!slide) return;
                const viewImageBtn = e.target.closest('.view-image-btn');
                const viewProjectBtn = e.target.closest('.view-project-btn');
                if (viewImageBtn) {
                    const imgSrc = slide.querySelector('img').src;
                    openLightbox(imgSrc);
                    return;
                }
                if (viewProjectBtn) { return; }
                const isAlreadyVisible = slide.classList.contains('options-visible');
                closeAllOptionOverlays();
                if (!isAlreadyVisible) {
                    slide.classList.add('options-visible');
                }
            });
        }
        const lightbox = document.getElementById('lightbox'), lightboxImg = document.getElementById('lightbox-img'),
              lightboxClose = document.getElementById('lightbox-close');
        if (lightbox) {
            function openLightbox(imgSrc) { lightboxImg.src = imgSrc; lightbox.classList.add('show'); }
            function closeLightbox() { lightbox.classList.remove('show'); }
            lightboxClose.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => { if (e.target === lightbox) { closeLightbox(); } });
        }
        updatePortfolioText(0);
    }

// =====================================================================
// === KODE BARU - ANIMASI SCROLL (DENGAN ZIGZAG)                    ===
// =====================================================================

const repeatingAnimationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            if (entry.target.classList.contains('stats-grid')) {
                animateStatCounters();
            }
        } else {
            entry.target.classList.remove('in-view');
            if (entry.target.classList.contains('stats-grid')) {
                resetStatCounters();
            }
        }
    });
}, { 
    threshold: 0.2
});

// DI SINI KUNCINYA: Kita tambahkan .animate-slide-up & .animate-slide-down
document.querySelectorAll(
    '.animate-zoom-in, .stats-grid, .animate-slide-in-left, .animate-slide-in-right, .animate-slide-up, .animate-slide-down'
).forEach(el => {
    if(el) {
        repeatingAnimationObserver.observe(el);
    }
});

// Fungsi untuk mereset angka ke 0
function resetStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(counter => {
        counter.innerText = '0+';
    });
}

// Fungsi untuk animasi angka
function animateStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        counter.innerText = '0+';
        const speed = 1500;
        const increment = target / (speed / 16);
        const updateCount = () => {
            const count = parseFloat(counter.innerText) + increment;
            if (count < target) {
                counter.innerText = Math.ceil(count) + '+';
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target + '+';
            }
        };
        updateCount();
    });
}

// =======================================================
// ===      LOGIKA FINAL - GARIS PROSES (RESPONSIF)      ===
// =======================================================

// --- Logika untuk Desktop (Hover) ---
const processGrid = document.querySelector('.process-grid');
const processItems = document.querySelectorAll('.process-item');
const processLinePathDesktop = document.getElementById('process-line-path-desktop');

if (processGrid && processItems.length > 0 && processLinePathDesktop) {
    const lineStops = [0.12, 0.40, 0.68, 1.0]; 
    const totalLength = processLinePathDesktop.getTotalLength();

    function drawLineTo(stopIndex) {
        if (window.innerWidth < 992) return; // Hanya jalankan di desktop
        if (stopIndex < 0) {
            processLinePathDesktop.style.strokeDashoffset = totalLength;
        } else {
            const percentage = lineStops[stopIndex];
            processLinePathDesktop.style.strokeDashoffset = totalLength * (1 - percentage);
        }
    }

    processLinePathDesktop.style.strokeDasharray = totalLength;
    drawLineTo(-1);

    processItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => drawLineTo(index));
    });

    processGrid.addEventListener('mouseleave', () => drawLineTo(-1));
}


// --- Logika untuk Mobile (Animasi Scroll) ---
const processSection = document.getElementById('process');
const processLinePathMobile = document.getElementById('process-line-path-mobile');

if (processSection && processLinePathMobile) {
    const lineAnimationObserverMobile = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (window.innerWidth < 992) { // Hanya jalankan di mobile/tablet
                    const length = processLinePathMobile.getTotalLength();
                    processLinePathMobile.style.strokeDasharray = length;
                    processLinePathMobile.style.strokeDashoffset = length;
                    
                    setTimeout(() => {
                        processSection.classList.add('draw-line-mobile');
                    }, 300);
                    
                    observer.unobserve(processSection);
                }
            }
        });
    }, {
        threshold: 0.3 // Animasi berjalan saat 30% section terlihat
    });

    lineAnimationObserverMobile.observe(processSection);
}


// =======================================================
// ===      LOGIKA FINAL - LAYANAN (SAMA DI SEMUA PERANGKAT) ===
// =======================================================

const radialContainer = document.querySelector('.radial-selector-container');
if (radialContainer) {
    const serviceData = [
        { title: 'Fotografi', description: 'Menangkap momen dengan kualitas visual...', image: 'https://images.pexels.com/photos/225157/pexels-photo-225157.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '#' },
        { title: 'Retouch', description: 'Menyempurnakan setiap detail foto...', image: 'https://images.pexels.com/photos/716276/pexels-photo-716276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '#' },
        { title: 'Videografi', description: 'Memproduksi sinematik yang menarik...', image: 'https://images.pexels.com/photos/2022797/pexels-photo-2022797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '#' },
        { title: 'Desain UI/UX', description: 'Merancang antarmuka yang fungsional...', image: 'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', link: '#' },
    ];

    const orbit = document.querySelector('.radial-orbit');
    const icons = document.querySelectorAll('.orbit-icon');
    const mainImage = document.getElementById('radial-service-image');
    const titleEl = document.getElementById('radial-service-title');
    const descEl = document.getElementById('radial-service-description');
    const linkEl = document.getElementById('radial-service-link');

    // Fungsi untuk menata ikon di orbitnya
    function setupRadialLayout() {
        const radius = 150;
        icons.forEach((icon, i) => {
            const angle = (i / icons.length) * 2 * Math.PI - (Math.PI / 2);
            const x = 50 + Math.cos(angle) * 50;
            const y = 50 + Math.sin(angle) * 50;
            icon.style.top = `${y}%`;
            icon.style.left = `${x}%`;
            icon.style.margin = '-25px 0 0 -25px';
        });
    }

    // Fungsi utama untuk update konten
    function updateContent(index) {
        if (index < 0 || index >= serviceData.length) return;
        const data = serviceData[index];
        
        titleEl.style.opacity = '0'; descEl.style.opacity = '0';
        setTimeout(() => {
            titleEl.textContent = data.title;
            descEl.textContent = data.description;
            linkEl.href = data.link;
            titleEl.style.opacity = '1'; descEl.style.opacity = '1';
        }, 200);

        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = data.image;
            mainImage.style.opacity = '1';
        }, 200);

        icons.forEach(icon => icon.classList.remove('active'));
        icons[index].classList.add('active');

        // Rotasi orbit di SEMUA perangkat
        const rotationAngle = -index * (360 / icons.length);
        orbit.style.transform = `rotate(${rotationAngle}deg)`;
    }

    // Tambahkan event listener ke setiap ikon
    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            const serviceIndex = parseInt(icon.dataset.service);
            updateContent(serviceIndex);
        });
    });

    // Jalankan saat halaman dimuat
    setupRadialLayout();
    updateContent(0);
}


}); // <-- Penutup dari addEventListener 'DOMContentLoaded'


