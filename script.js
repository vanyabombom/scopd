document.addEventListener('DOMContentLoaded', () => {
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

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const threshold = 50;

        if (scrollY > threshold) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });
});