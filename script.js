document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = 'data.json'; // Путь к вашему JSON файлу
    let jsonData = {}; // Для хранения загруженных данных

    // Элементы кнопок
    const buttons = {
        push: document.getElementById('pushBtn'),
        inPage: document.getElementById('inPageBtn'),
        pop: document.getElementById('popBtn'),
        native: document.getElementById('nativeBtn')
    };

    // Элементы разделов
    const sections = {
        push: document.getElementById('pushSection'),
        inPage: document.getElementById('inPageSection'),
        pop: document.getElementById('popSection'),
        native: document.getElementById('nativeSection')
    };

    // Скрыть все разделы
    function hideAllSections() {
        Object.values(sections).forEach(section => (section.style.display = 'none'));
    }

    // Создание таблицы для отображения данных
    function createTable(data) {
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        // Создаем заголовок таблицы
        const headerRow = document.createElement('tr');
        ['Country code', 'Country name', 'CPC mainstream', 'CPM mainstream', 'CPC adult', 'CPM adult'].forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.border = '1px solid black';
            th.style.padding = '8px';
            th.style.textAlign = 'left';
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Заполняем таблицу данными
        data.forEach(row => {
            const tableRow = document.createElement('tr');
            Object.keys(row).forEach(key => {
                const td = document.createElement('td');
                td.textContent = row[key];
                td.style.border = '1px solid black';
                td.style.padding = '8px';
                tableRow.appendChild(td);
            });
            table.appendChild(tableRow);
        });

        return table;
    }

    // Загрузка данных из JSON
    async function loadData() {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            jsonData = await response.json();
            console.log('Данные успешно загружены:', jsonData);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }

    // Обработчик для кнопок
    function setupButtonHandlers() {
        Object.keys(buttons).forEach(format => {
            buttons[format].addEventListener('click', () => {
                hideAllSections(); // Скрываем все разделы

                const section = sections[format]; // Показываем выбранный раздел
                section.style.display = 'block';

                // Удаляем старый контент
                section.innerHTML = `<h2>${format.charAt(0).toUpperCase() + format.slice(1)} Section</h2>`;

                // Создаем таблицу с данными
                if (jsonData[format]) {
                    const table = createTable(jsonData[format]);
                    section.appendChild(table);
                } else {
                    section.innerHTML += '<p>Нет данных для этого раздела.</p>';
                }
            });
        });
    }

    // Инициализация
    async function init() {
        await loadData(); // Загружаем JSON данные
        setupButtonHandlers(); // Настраиваем обработчики для кнопок
    }

    init(); // Запуск
});
