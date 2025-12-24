document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LOGIC FOR MENU ---
    const mainItems = document.querySelectorAll('.main-nav .nav-item');
    const subMenus = document.querySelectorAll('.sub-nav');
    const subMenuContainer = document.querySelector('.submenu-container');
    let hideTimeout;

    const hideAllMenus = () => {
        subMenus.forEach(menu => menu.classList.remove('active-sub'));
        mainItems.forEach(item => item.classList.remove('active'));
    };

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

    // Scroll effect for body class
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const threshold = 50;
        if (scrollY > threshold) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });


    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        const btn = card.querySelector('.toggle-btn');
        const arrow = card.querySelector('.arrow-icon');
        const content = card.querySelector('.card-content');
        const flash = card.querySelector('.flash-layer');
        let isOpen = false;

        // Функция вспышки
        function triggerFlash() {
            // Colors from .gradient-section in styles.css
            const gradientColors = [
                'rgba(252, 241, 132, 1)', // Yellow
                'rgba(250, 180, 130, 1)', // Peach
                'rgba(255, 160, 100, 1)'  // Orange
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
            e.stopPropagation();
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

    // --- SIDE MENU LOGIC ---
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenuOverlay = document.querySelector('.side-menu-overlay');
    const closeMenuBtn = document.querySelector('.close-menu-btn');

    if (menuToggle && sideMenuOverlay && closeMenuBtn) {
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            sideMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scroll
        });

        const closeMenu = () => {
            sideMenuOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Unlock scroll
        };

        closeMenuBtn.addEventListener('click', closeMenu);

        // Close on backdrop click (optional)
        sideMenuOverlay.addEventListener('click', (e) => {
            if (e.target === sideMenuOverlay) {
                closeMenu();
            }
        });

        // Close on Esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sideMenuOverlay.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // --- BUSINESS CARDS TOGGLE ---
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
});