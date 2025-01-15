document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = './data.json'; // Путь к JSON файлу
    let jsonData = {}; // Для хранения загруженных данных

    /** 
     * Функция скрывает все секции
     */
    function hideAllSections() {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));
    }

    /**
     * Форматирует число: заменяет точки на запятые и округляет до 3 знаков
     */
    function formatNumber(value) {
        if (typeof value === 'number') {
            return value.toFixed(3).replace('.', ',');
        }
        return value;
    }

    /**
     * Создаёт таблицу для отображения данных
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

        // Создаём заголовки таблицы
        const headerRow = document.createElement('tr');
        headers.forEach((header) => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.cursor = 'pointer';

            // Сортировка
            const sortIcon = document.createElement('span');
            sortIcon.classList.add('sort-icon');
            th.appendChild(sortIcon);

            // Инициализация порядка сортировки
            let sortOrder = 'asc';

            th.addEventListener('click', () => {
                // Переключение порядка сортировки
                sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                sortIcon.classList.toggle('asc', sortOrder === 'asc');
                sortIcon.classList.toggle('desc', sortOrder === 'desc');

                // Определение типа данных
                const isNumeric = !['Country code', 'Country name'].includes(header);

                // Сортировка данных
                const sortedData = [...data].sort((a, b) => {
                    if (isNumeric) {
                        return sortOrder === 'asc'
                            ? parseFloat(a[header]) - parseFloat(b[header])
                            : parseFloat(b[header]) - parseFloat(a[header]);
                    } else {
                        return sortOrder === 'asc'
                            ? a[header].localeCompare(b[header])
                            : b[header].localeCompare(a[header]);
                    }
                });

                // Перестраиваем таблицу
                const newTable = createTable(sortedData, format);
                table.replaceWith(newTable);
            });

            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Заполняем строки
        data.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = formatNumber(row[header]) || '-';
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        return table;
    }

    /**
     * Настраивает кнопки
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
     * Загружает JSON данные
     */
    async function loadData() {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) throw new Error(`Ошибка загрузки JSON: ${response.status}`);
            jsonData = await response.json();
        } catch (error) {
            console.error('Ошибка загрузки JSON:', error);
        }
    }

    /**
     * Инициализация приложения
     */
    async function init() {
        await loadData();
        setupButtonHandlers();
    }

    init();
});
