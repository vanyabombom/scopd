document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ПЛАВНЫЙ СКРОЛЛ (LENIS) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', () => {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    });

    // --- 2. МОБИЛЬНОЕ МЕНЮ И ЛОГОТИП ---
    const initializeMobileUI = () => {
        if (window.innerWidth <= 768) {
            const logoPill = document.querySelector('.logo-pill');
            const logoBig = document.querySelector('.logo-big');
            const logoSmall = document.querySelector('.logo-small');

            if (logoPill && logoBig && logoSmall) {
                logoBig.style.opacity = '0';
                logoSmall.style.opacity = '1';
            }
        }
    };

    initializeMobileUI();
    window.addEventListener('resize', initializeMobileUI);

    const mainItems = document.querySelectorAll('.main-nav .nav-item');
    const subMenus = document.querySelectorAll('.sub-nav');
    const subMenuContainer = document.querySelector('.submenu-container');
    let hideTimeout;

    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            disable: false,
            mirror: false,
            offset: 120,
        });
    }

    const hideAllMenus = () => {
        subMenus.forEach(menu => menu.classList.remove('active-sub'));
        mainItems.forEach(item => item.classList.remove('active'));
    };

    hideAllMenus(); 

    const moveSubmenuTo = (item) => {
        if (!subMenuContainer) return;
        const leftPosition = item.offsetLeft;
        subMenuContainer.style.transform = `translateX(${leftPosition}px)`;
    };

    const showMenu = (item) => {
        clearTimeout(hideTimeout);
        mainItems.forEach(el => {
            if (el !== item) el.classList.remove('active');
        });
        subMenus.forEach(menu => menu.classList.remove('active-sub'));

        item.classList.add('active');
        moveSubmenuTo(item);

        const targetId = item.getAttribute('data-target');
        const targetMenu = document.getElementById(targetId);
        if (targetMenu) {
            targetMenu.classList.add('active-sub');
        }
    };

    mainItems.forEach(item => {
        if (item.classList.contains('simple')) {
            item.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout);
                hideAllMenus();
            });
            return;
        }

        item.addEventListener('mouseenter', () => {
            showMenu(item);
        });

        item.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                hideAllMenus();
            }, 250);
        });
    });

    if (subMenuContainer) {
        subMenuContainer.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
        });
        subMenuContainer.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                hideAllMenus();
            }, 250);
        });
    }

    // --- 3. ХЕДЕР ПРИ СКРОЛЛЕ ---
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const threshold = 50;
        if (scrollY > threshold) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });

    // --- 4. КАРТОЧКИ (ГЛАВНАЯ СТРАНИЦА) ---
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        const btn = card.querySelector('.toggle-btn');
        if (!btn) return; // Проверка, есть ли кнопка

        const arrow = card.querySelector('.arrow-icon');
        const content = card.querySelector('.card-content');
        const flash = card.querySelector('.flash-layer');
        let isOpen = false;

        function triggerFlash() {
            if (!flash) return;
            const gradientColors = [
                'rgba(252, 241, 132, 1)',
                'rgba(250, 180, 130, 1)',
                'rgba(255, 160, 100, 1)'
            ];
            const warmColor = gradientColors[Math.floor(Math.random() * gradientColors.length)];
            const randomX = Math.floor(Math.random() * 100);
            const randomY = Math.floor(Math.random() * 100);

            flash.style.background = `radial-gradient(circle at ${randomX}% ${randomY}%, rgba(255,255,255,0.9) 0%, ${warmColor} 20%, transparent 70%)`;

            gsap.fromTo(flash,
                { opacity: 0.7 },
                { opacity: 0, duration: 0.8, ease: "power2.out" }
            );
        }

        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Это важно, чтобы клик не всплывал
            triggerFlash();

            if (!isOpen) {
                gsap.to(card, { height: "auto", duration: 0.6, ease: "power3.out" });
                gsap.to(content, { opacity: 1, y: 0, duration: 0.4, delay: 0.1 });
                gsap.to(arrow, { rotation: 225, duration: 0.3 });
                btn.style.background = "rgba(255,255,255,0.3)";
            } else {
                gsap.to(card, { height: 190, duration: 0.5, ease: "power3.inOut" });
                gsap.to(content, { opacity: 0, y: 10, duration: 0.3 });
                gsap.to(arrow, { rotation: 45, duration: 0.3 });
                btn.style.background = "rgba(255,255,255,0.1)";
            }
            isOpen = !isOpen;
        });
    });

    // --- 5. БОКОВОЕ МЕНЮ ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenuOverlay = document.querySelector('.side-menu-overlay');
    const closeMenuBtn = document.querySelector('.close-menu-btn');

    if (menuToggle && sideMenuOverlay && closeMenuBtn) {
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            sideMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            sideMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeMenuBtn.addEventListener('click', closeMenu);

        sideMenuOverlay.addEventListener('click', (e) => {
            if (e.target === sideMenuOverlay) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sideMenuOverlay.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // --- 6. БИЗНЕС КАРТОЧКИ ---
    const businessCards = document.querySelectorAll('.business-card:not(.business-card-main)');

    businessCards.forEach(card => {
        const btn = card.querySelector('.business-toggle-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                card.classList.toggle('expanded');
            });
        }
    });

    // --- 7. СЛАЙДЕРЫ (МОБИЛЬНЫЕ) ---
    const initSlider = (gridSelector) => {
        const grids = document.querySelectorAll(gridSelector);
        grids.forEach(grid => {
            if (window.innerWidth <= 425) { 
                // Просто инициализация скролла, логика тач событий для нативного скролла не обязательна
            }
        });
    };

    const setupMobileSliders = () => {
        if (window.innerWidth <= 425) {
            initSlider('.software-screenshots-grid');
            initSlider('.solutions-grid');
            initSlider('.business-grid');
            initSlider('.reports-grid');
        }
    };

    setupMobileSliders();
    window.addEventListener('resize', setupMobileSliders);

});