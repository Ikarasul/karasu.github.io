/* =========================================
   3. NAVIGATION & SCROLL EFFECTS
   ========================================= */
(function () {
    // Reveal Animations — use IntersectionObserver for performance
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => revealObserver.observe(el));

    // Navbar Scroll Spy
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const spyObserver = new IntersectionObserver((entries) => {
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

    sections.forEach(section => spyObserver.observe(section));

    // Navbar Glass Effect — use CSS class for dark-mode compat
    const nav = document.querySelector('.navbar');
    let ticking = false;

    const updateNavbar = () => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    updateNavbar();
})();
