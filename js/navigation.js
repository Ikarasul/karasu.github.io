/* =========================================
   3. NAVIGATION & SCROLL EFFECTS
   ========================================= */
(function () {
    // Reveal Animations
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            const elementBottom = reveal.getBoundingClientRect().bottom;
            if (elementTop < windowHeight - elementVisible && elementBottom > elementVisible) {
                reveal.classList.add('active');
            } else {
                reveal.classList.remove('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Navbar Scroll Spy
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
                });
            }
        });
    }, { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));

    // Navbar Glass Effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (nav) {
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(255,255,255,0.98)';
                nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
            } else {
                nav.style.background = 'rgba(255,255,255,0.95)';
                nav.style.boxShadow = 'none';
            }
        }
    });
})();
