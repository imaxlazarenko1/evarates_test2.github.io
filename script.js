document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = './data.json'; // Путь к JSON файлу
    let jsonData = {}; // Для хранения загруженных данных

    // Кнопки и разделы
    const buttons = {
        push: document.getElementById('pushBtn'),
        inPage: document.getElementById('inPageBtn'),
        pop: document.getElementById('popBtn'),
        native: document.getElementById('nativeBtn')
    };

    const sections = {
        push: document.getElementById('pushSection'),
        inPage: document.getElementById('inPageSection'),
        pop: document.getElementById('popSection'),
        native: document.getElementById('nativeSection')
    };

    // Заголовки для каждого формата
    const headersMap = {
        push: ['Country code', 'Country name', 'CPC mainstream', 'CPM mainstream', 'CPC adult', 'CPM adult'],
        inPage: ['Country code', 'Country name', 'CPC', 'CPM'],
        native: ['Country code', 'Country name', 'CPC', 'CPM'],
        pop: ['Country code', 'Country name', 'CPM']
    };

    // Скрываем все разделы
    function hideAllSections() {
        Object.values(sections).forEach(section => section.classList.remove('active'));
    }

    // Создаем таблицу для отображения данных
    function createTable(data, format) {
        const headers = headersMap[format] || []; // Получаем заголовки для текущего формата
        const table = document.createElement('table');
        table.classList.add('data-table');

        // Заголовки таблицы
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Строки данных
        data.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                const value = row[header];

                // Проверяем, является ли значение числом
                if (typeof value === 'number') {
                    td.textContent = value.toFixed(3); // Округляем до 3 знаков
                } else {
                    td.textContent = value || '-'; // Выводим текстовые значения или "-"
                }

                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        return table;
    }

    // Загрузка данных из JSON
    async function loadData() {
        try {
            console.log('Запрашиваю JSON:', jsonUrl);
            const response = await fetch(jsonUrl);
            console.log('Ответ от сервера:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            jsonData = await response.json();
            console.log('Данные успешно загружены:', JSON.stringify(jsonData, null, 2));
            console.log('Ключи в jsonData:', Object.keys(jsonData)); // Проверяем доступные ключи
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    }

    // Настраиваем обработчики кнопок
    function setupButtonHandlers() {
        Object.keys(buttons).forEach(format => {
            buttons[format].addEventListener('click', () => {
                hideAllSections(); // Скрываем все разделы

                const section = sections[format];
                section.classList.add('active'); // Показываем текущий раздел

                console.log(`Активный формат: ${format}`);

                // Проверяем наличие данных
                if (jsonData[format]) {
                    console.log(`Данные найдены для ключа: ${format}`, jsonData[format]);
                    section.innerHTML = `<h2>${format} Section</h2>`;
                    const table = createTable(jsonData[format], format); // Передаём формат
                    section.appendChild(table);
                } else {
                    console.warn(`Нет данных для формата: ${format}`);
                    section.innerHTML = `<h2>${format} Section</h2><p>Нет данных для этого раздела.</p>`;
                }
            });
        });
    }

    // Инициализация
    async function init() {
        console.log('Инициализация приложения...');
        await loadData(); // Загружаем JSON
        setupButtonHandlers(); // Настраиваем кнопки
    }

    init(); // Запуск
});
