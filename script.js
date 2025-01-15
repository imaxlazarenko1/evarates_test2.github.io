document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = './data.json'; // Путь к JSON файлу
    let jsonData = {}; // Для хранения загруженных данных

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

    /**
     * Функция скрывает все секции
     */
    function hideAllSections() {
        Object.values(sections).forEach(section => section.classList.remove('active'));
    }

    /**
     * Форматирует число: заменяет точки на запятые и округляет до 3 знаков
     */
    function formatNumber(value) {
        if (!isNaN(parseFloat(value))) {
            return parseFloat(value).toFixed(3).replace('.', ',');
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
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.cursor = 'pointer';

            // Инициализация порядка сортировки
            let sortOrder = 'asc';

            th.addEventListener('click', () => {
                sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                updateTableRows(data, sortOrder, header, format, table);
            });

            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Заполняем строки
        updateTableRows(data, 'asc', headers[0], format, table);

        return table;
    }

    /**
     * Обновление строк таблицы с учетом порядка сортировки
     */
    function updateTableRows(data, sortOrder, header, format, table) {
        const headersMap = {
            push: ['Country code', 'Country name', 'CPC mainstream', 'CPM mainstream', 'CPC adult', 'CPM adult'],
            inPage: ['Country code', 'Country name', 'CPC', 'CPM'],
            native: ['Country code', 'Country name', 'CPC', 'CPM'],
            pop: ['Country code', 'Country name', 'CPM']
        };

        const headers = headersMap[format];
        const headerIndex = headers.indexOf(header);

        if (headerIndex === -1) return;

        const isNumeric = headerIndex > 1; // Числовые столбцы начинаются с 2-го индекса
        const sortedData = [...data].sort((a, b) => {
            const aValue = a[headers[headerIndex]];
            const bValue = b[headers[headerIndex]];

            if (isNumeric) {
                return sortOrder === 'asc'
                    ? parseFloat(aValue) - parseFloat(bValue)
                    : parseFloat(bValue) - parseFloat(aValue);
            } else {
                return sortOrder === 'asc'
                    ? (aValue || '').localeCompare(bValue || '')
                    : (bValue || '').localeCompare(aValue || '');
            }
        });

        let tbody = table.querySelector('tbody');
        if (!tbody) {
            tbody = document.createElement('tbody');
            table.appendChild(tbody);
        }

        tbody.innerHTML = '';

        sortedData.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach((key, index) => {
                const td = document.createElement('td');
                const value = row[key];
                td.textContent = isNumeric && index > 1 ? formatNumber(value) : value || '-';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }

    /**
     * Настраивает кнопки
     */
    function setupButtonHandlers() {
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
