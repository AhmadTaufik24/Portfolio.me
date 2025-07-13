document.addEventListener('DOMContentLoaded', function() {

    // Fungsi untuk Light/Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        document.body.classList.remove('dark-mode'); 
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }

    // Fungsi untuk Image Slideshow
    const photos = document.querySelectorAll('.hero-photo');
    if (photos.length > 0) {
        let currentPhotoIndex = 0;
        setInterval(() => {
            photos[currentPhotoIndex].classList.remove('active');
            currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
            photos[currentPhotoIndex].classList.add('active');
        }, 4000);
    }

    // Fungsi untuk Typing Effect
    const typingElement = document.getElementById('typing-effect');
    if (typingElement) {
        const professions = ['Fotografer', 'Retoucher', 'Desainer']; // Versi Indonesia
        let professionIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentProfession = professions[professionIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentProfession.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentProfession.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 100 : 200;

            if (!isDeleting && charIndex === currentProfession.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                professionIndex = (professionIndex + 1) % professions.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        
        type();
    }
    
    // Logika untuk membuka/menutup Dropdown Menu
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');

    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Logika untuk menutup menu saat klik di luar area menu
    document.addEventListener('click', function(event) {
        if (mobileNav && mobileNav.classList.contains('active')) {
            const isClickInsideMenu = mobileNav.contains(event.target);
            const isClickOnHamburger = hamburgerBtn.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnHamburger) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // --- TAMBAHAN: Logika untuk Animasi Saat Scroll ---
    const animatedElements = document.querySelectorAll('.fade-in-up');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // observer.unobserve(entry.target); // Hapus komentar ini jika ingin animasi hanya berjalan sekali
                }
            });
        }, {
            threshold: 0.1 
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

});