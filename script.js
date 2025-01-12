document.addEventListener('DOMContentLoaded', () => {
    // Кнопки для каждого раздела
    const pushBtn = document.getElementById('pushBtn');
    const inPageBtn = document.getElementById('inPageBtn');
    const popBtn = document.getElementById('popBtn');
    const nativeBtn = document.getElementById('nativeBtn');

    // Разделы контента
    const pushSection = document.getElementById('pushSection');
    const inPageSection = document.getElementById('inPageSection');
    const popSection = document.getElementById('popSection');
    const nativeSection = document.getElementById('nativeSection');

    // Функция для скрытия всех разделов
    function hideAllSections() {
        pushSection.style.display = 'none';
        inPageSection.style.display = 'none';
        popSection.style.display = 'none';
        nativeSection.style.display = 'none';
    }

    // Обработчики для кнопок
    pushBtn.addEventListener('click', () => {
        hideAllSections();
        pushSection.style.display = 'block';  // Показываем Push
    });

    inPageBtn.addEventListener('click', () => {
        hideAllSections();
        inPageSection.style.display = 'block';  // Показываем In-Page
    });

    popBtn.addEventListener('click', () => {
        hideAllSections();
        popSection.style.display = 'block';  // Показываем Pop
    });

    nativeBtn.addEventListener('click', () => {
        hideAllSections();
        nativeSection.style.display = 'block';  // Показываем Native
    });
});
