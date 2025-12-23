// script.js
document.addEventListener('DOMContentLoaded', () => {
    const mainItems = document.querySelectorAll('.main-nav .nav-item');
    const subMenus = document.querySelectorAll('.sub-nav');

    mainItems.forEach(item => {
        // Пропускаем пункты без подменю (simple)
        if (item.classList.contains('simple')) return;

        item.addEventListener('click', () => {
            // 1. Убираем активный класс у всех кнопок
            mainItems.forEach(el => el.classList.remove('active'));
            
            // 2. Добавляем активный класс нажатой кнопке
            item.classList.add('active');

            // 3. Скрываем все подменю
            subMenus.forEach(menu => menu.classList.remove('active-sub'));

            // 4. Показываем нужное подменю по data-target
            const targetId = item.getAttribute('data-target');
            const targetMenu = document.getElementById(targetId);
            if (targetMenu) {
                targetMenu.classList.add('active-sub');
            }
        });
    });
});