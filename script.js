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
        if (typeof value === 'number' || !isNaN(parseFloat(value))) {
            return parseFloat(value).toFixed(3).replace('.', ','); // Округление до 3 знаков и замена точки на запятую
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
        headers.forEach((header, index) => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.cursor = 'pointer';

            // Инициализация порядка сортировки
            let sortOrder = 'asc';

            th.addEventListener('click', () => {
                // Переключение порядка сортировки
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
    function updateTableRows(data, sortOrder, header, format, table = null) {
        const headersMap = {
            push: ['Country code', 'Country name', 'CPC mainstream', 'CPM mainstream', 'CPC adult', 'CPM adult'],
            inPage: ['Country code', 'Country name', 'CPC', 'CPM'],
            native: ['Country code', 'Country name', 'CPC', 'CPM'],
            pop: ['Country code', 'Country name', 'CPM']
        };

        const headers = headersMap[format] || [];
        const headerIndex = headers.indexOf(header);

        if (headerIndex === -1) return; // Если заголовок не найден, пропускаем

        const isNumeric = headerIndex > 1; // Считаем числовыми все столбцы после 1-го и 2-го
        const sortedData = [...data].sort((a, b) => {
            const aValue = a[headers[headerIndex]];
            const bValue = b[headers[headerIndex]];

            if (isNumeric) {
                return sortOrder === 'asc'
                    ? parseFloat(aValue) - parseFloat(bValue)
                    : parseFloat(bValue) - parseFloat(aValue);
            } else {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
        });

        const tbody = table ? table.querySelector('tbody') : document.createElement('tbody');
        tbody.innerHTML = '';

        sortedData.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach((key, idx) => {
                const td = document.createElement('td');
                const value = row[key];
                td.textContent = isNumeric && idx > 1 ? formatNumber(value) : value || '-';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        if (table) {
            table.appendChild(tbody);
        }
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
