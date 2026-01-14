document.addEventListener('DOMContentLoaded', () => {
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

    const setupNavHover = (navElement) => {
        if (!navElement) return;
        const navBackground = navElement.querySelector('.nav-background');
        const items = navElement.querySelectorAll('.nav-item');

        const updateNavBackground = (item) => {
            if (!navBackground || !item) return;
            navBackground.style.width = `${item.offsetWidth}px`;
            navBackground.style.left = `${item.offsetLeft}px`;
            navBackground.style.opacity = '1';
        };

        const resetNavBackground = () => {
            if (!navBackground) return;
            const activeItem = navElement.querySelector('.nav-item.active');
            if (activeItem) {
                updateNavBackground(activeItem);
            } else {
                navBackground.style.opacity = '0';
            }
        };

        setTimeout(resetNavBackground, 100);

        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                updateNavBackground(item);
                if (navElement.classList.contains('main-nav')) {
                    if (item.classList.contains('simple')) {
                        clearTimeout(hideTimeout);
                        hideAllMenus();
                    } else {
                        showMenu(item);
                    }
                }
            });

            item.addEventListener('mouseleave', () => {
                if (navElement.classList.contains('main-nav')) {
                    hideTimeout = setTimeout(() => {
                        hideAllMenus();
                        resetNavBackground();
                    }, 250);
                } else {
                    resetNavBackground();
                }
            });
        });

        if (navElement.classList.contains('main-nav') && subMenuContainer) {
            subMenuContainer.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout);
            });
            subMenuContainer.addEventListener('mouseleave', () => {
                hideTimeout = setTimeout(() => {
                    hideAllMenus();
                    resetNavBackground();
                }, 250);
            });
        }
    };

    const mainNav = document.querySelector('.main-nav');
    setupNavHover(mainNav);

    document.querySelectorAll('.sub-nav').forEach(sub => setupNavHover(sub));



    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        const btn = card.querySelector('.toggle-btn');
        if (!btn) return;

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
            e.stopPropagation();
            triggerFlash();

            if (!isOpen) {
                // Ensure visibility for expansion
                gsap.set(content, { display: 'block', visibility: 'visible' });
                gsap.to(card, { height: "auto", duration: 0.6, ease: "power3.out" });
                gsap.to(content, { opacity: 1, y: 0, duration: 0.4, delay: 0.1 });
                gsap.to(arrow, { rotation: 225, duration: 0.3 });
                btn.style.background = "rgba(255,255,255,0.3)";
            } else {
                // To get the collapsed height, we temporarily hide content
                gsap.set(content, { display: 'none', visibility: 'hidden' });
                const collapsedHeight = card.offsetHeight;
                gsap.set(content, { display: 'block', visibility: 'visible' });

                gsap.to(card, { height: collapsedHeight, duration: 0.5, ease: "power3.inOut" });
                gsap.to(content, {
                    opacity: 0,
                    y: 10,
                    duration: 0.3,
                    onComplete: () => {
                        gsap.set(content, { display: 'none', visibility: 'hidden' });
                        // Optional: reset card height to auto if it was auto in CSS
                        // but it's safer to keep it at the measured height to avoid jumps
                    }
                });
                gsap.to(arrow, { rotation: 45, duration: 0.3 });
                btn.style.background = "rgba(255,255,255,0.1)";
            }
            isOpen = !isOpen;
        });
    });

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

    const initSlider = (gridSelector) => {
        const grids = document.querySelectorAll(gridSelector);
        grids.forEach(grid => {
            if (window.innerWidth <= 425) {
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

    const setupPagination = () => {
        const paginationPill = document.querySelector('.pagination-pill');
        if (!paginationPill) return;

        const navBackground = paginationPill.querySelector('.nav-background');
        const items = paginationPill.querySelectorAll('.page-numbers');

        const updateNavBackground = (item) => {
            if (!navBackground || !item) return;
            navBackground.style.width = `${item.offsetWidth}px`;
            navBackground.style.left = `${item.offsetLeft}px`;
            navBackground.style.opacity = '1';

            items.forEach(i => {
                if (i === item) {
                    i.style.color = 'rgba(18, 14, 12, 1)';
                } else {
                    i.style.color = '#fff';
                }
            });
        };

        const resetNavBackground = () => {
            const activeItem = paginationPill.querySelector('.page-numbers.active');
            if (activeItem) {
                updateNavBackground(activeItem);
            }
        };

        items.forEach(item => {
            item.addEventListener('mouseenter', () => updateNavBackground(item));
            item.addEventListener('mouseleave', resetNavBackground);
            item.addEventListener('click', (e) => {
                e.preventDefault();
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Update implementation to ensure visual state sync
                updateNavBackground(item);

                // Double check in next frame to prevent race conditions
                requestAnimationFrame(() => {
                    updateNavBackground(item);
                });
            });
        });

        // Initialize position
        setTimeout(resetNavBackground, 100);

        // Handle window resize
        window.addEventListener('resize', resetNavBackground);
    };

    setupPagination();

});
document.addEventListener('DOMContentLoaded', () => {
    const scrollTopBtn = document.querySelector('.scroll-top-btn');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        });


        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();


            if (typeof lenis !== 'undefined') {
                lenis.scrollTo(0);
            } else {

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('demoModal');
    const closeBtn = document.querySelector('.demo-modal-close');
    const requestBtns = document.querySelectorAll('.request-demo-overlay, .demo-cta-btn');
    const body = document.body;

    if (modal) {
        requestBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            body.style.overflow = '';
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    const messengerCombo = document.querySelector('.demo-modal-messenger-combo');

    if (messengerCombo) {
        const selector = messengerCombo.querySelector('.demo-modal-messenger-selector');
        const selectorIcon = selector.querySelector('.demo-modal-messenger-selector-icon');
        const dropdown = selector.querySelector('.demo-modal-messenger-dropdown');
        const options = dropdown.querySelectorAll('.demo-modal-messenger-dropdown-option');
        const inputField = messengerCombo.querySelector('.demo-modal-messenger-input-field');
        const hiddenInput = messengerCombo.querySelector('input[name="messenger_type"]');

        selector.addEventListener('click', (e) => {
            e.stopPropagation();
            selector.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();

                const value = option.getAttribute('data-value');
                const placeholder = option.getAttribute('data-placeholder');
                const iconSvg = option.querySelector('svg').outerHTML;

                selectorIcon.innerHTML = iconSvg;
                selectorIcon.setAttribute('data-messenger', value);

                inputField.setAttribute('placeholder', placeholder);
                inputField.setAttribute('data-messenger', value);
                if (hiddenInput) {
                    hiddenInput.value = value;
                }

                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                selector.classList.remove('open');
                inputField.focus();
            });
        });

        document.addEventListener('click', (e) => {
            if (!selector.contains(e.target)) {
                selector.classList.remove('open');
            }
        });
    }
});


