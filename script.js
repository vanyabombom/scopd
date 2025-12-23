document.addEventListener('DOMContentLoaded', () => {
    const mainItems = document.querySelectorAll('.main-nav .nav-item');
    const subMenus = document.querySelectorAll('.sub-nav');
    const subMenuContainer = document.querySelector('.submenu-container');
    let hideTimeout;

    // Сброс всех активных классов
    const hideAllMenus = () => {
        subMenus.forEach(menu => menu.classList.remove('active-sub'));
        mainItems.forEach(item => item.classList.remove('active'));
    };

    // Главная функция: двигает контейнер к активной кнопке
    const moveSubmenuTo = (item) => {
        if (!subMenuContainer) return;

        // Получаем координату X активной кнопки относительно родителя
        const leftPosition = item.offsetLeft;

        // Сдвигаем контейнер подменю
        subMenuContainer.style.transform = `translateX(${leftPosition}px)`;
    };

    // Функция показа меню
    const showMenu = (item) => {
        clearTimeout(hideTimeout);

        // Убираем активность у других кнопок
        mainItems.forEach(el => {
            if (el !== item) el.classList.remove('active');
        });
        subMenus.forEach(menu => menu.classList.remove('active-sub'));

        // Активируем текущую кнопку
        item.classList.add('active');

        // Двигаем подменю под кнопку
        moveSubmenuTo(item);

        // Находим и показываем нужное содержимое подменю
        const targetId = item.getAttribute('data-target');
        const targetMenu = document.getElementById(targetId);
        if (targetMenu) {
            targetMenu.classList.add('active-sub');
        }
    };

    mainItems.forEach(item => {
        // Если это простая ссылка (без подменю)
        if (item.classList.contains('simple')) {
            item.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout);
                hideAllMenus();
            });
            return;
        }

        // Наведение мыши на пункт
        item.addEventListener('mouseenter', () => {
            showMenu(item);
        });

        // Уход мыши с пункта
        item.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                hideAllMenus();
            }, 250); // Небольшая задержка, чтобы успеть перевести мышь
        });
    });

    // Логика для самого контейнера подменю (чтобы не пропадало при наведении на него)
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
});