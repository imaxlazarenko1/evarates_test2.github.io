document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = './data.json'; // Путь к JSON файлу
    let jsonData = {}; // Для хранения загруженных данных

    /**
     * Скрывает все разделы
     */
    function hideAllSections() {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));
    }

    /**
     * Создаёт таблицу для отображения данных
     * @param {Array} data - Данные для таблицы
     * @param {String} format - Формат (push, inPage, pop, native)
     * @returns {HTMLElement} - Таблица
     */
    function createTable(data, format) {
        const headersMap = {
            push: ['Country code', 'Country name', 'CPC mainstream', 'CPM mainstream', 'CPC adult', 'CPM adult'],
            inPage: ['Country code', 'Country name', 'CPC', 'CPM'],
            native: ['Country code', 'Country name', 'CPC', 'CPM'],
            pop: ['Country code', 'Country name', 'CPM']
        };

        const headers = headersMap[format] || [];
        const table = document.createElement('table');
        table.classList.add('data-table');

        // Создаём заголовки таблицы с кнопками для сортировки
        const headerRow = document.createElement('tr');
        headers.forEach((header, index) => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.cursor = 'pointer';

            // Создаём контейнер для значка сортировки
            const sortIcon = document.createElement('span');
            sortIcon.classList.add('sort-icon', 'asc'); // По умолчанию иконка сортировки по возрастанию
            th.appendChild(sortIcon);

            // Добавляем обработчик клика для сортировки
            th.addEventListener('click', () => {
                const isNumeric = !['Country code', 'Country name'].includes(header);
                const sortedData = [...data].sort((a, b) => {
                    if (isNumeric) {
                        const numA = parseFloat(a[header]) || 0;
                        const numB = parseFloat(b[header]) || 0;
                        return sortIcon.classList.contains('asc') ? numB - numA : numA - numB;
                    } else {
                        return sortIcon.classList.contains('asc')
                            ? b[header].localeCompare(a[header])
                            : a[header].localeCompare(b[header]);
                    }
                });

                // Переключение направления сортировки
                sortIcon.classList.toggle('asc');
                sortIcon.classList.toggle('desc');

                // Перерисовываем таблицу
                const newTable = createTable(sortedData, format);
                table.replaceWith(newTable);
            });

            th.dataset.order = 'desc'; // Начальный порядок сортировки
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Заполняем строки данными
        data.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                const value = row[header];

                if (!isNaN(value)) {
                    const numericValue = parseFloat(value);
                    td.textContent = numericValue.toLocaleString('ru-RU', {
                        minimumFractionDigits: 3,
                        maximumFractionDigits: 3
                    });
                } else {
                    td.textContent = value || '-';
                }

                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        return table;
    }

    /**
     * Загружает данные из JSON файла
     */
    async function loadData() {
        try {
            console.log('Запрашиваю JSON:', jsonUrl);
            const response = await fetch(jsonUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            jsonData = await response.json();
            console.log('Данные успешно загружены:', jsonData);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    }

    /**
     * Настраивает обработчики для кнопок
     */
    function setupButtonHandlers() {
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

        Object.keys(buttons).forEach(format => {
            buttons[format].addEventListener('click', () => {
                hideAllSections();

                const section = sections[format];
                section.classList.add('active');

                console.log(`Активный формат: ${format}`);

                if (jsonData[format]) {
                    section.innerHTML = `<h2>${format} Section</h2>`;
                    const table = createTable(jsonData[format], format);
                    section.appendChild(table);
                } else {
                    section.innerHTML = `<h2>${format} Section</h2><p>Нет данных для этого раздела.</p>`;
                }
            });
        });
    }

    /**
     * Инициализация приложения
     */
    async function init() {
        console.log('Инициализация приложения...');
        await loadData(); // Загружаем данные из JSON
        setupButtonHandlers(); // Настраиваем кнопки
    }

    init();
});
