document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = './data.json'; // Путь к JSON-файлу
    let jsonData = {}; // Данные из JSON

    function hideAllSections() {
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    }

    function getSafeData(data) {
        return Array.isArray(data) ? [...data] : []; // Безопасное копирование массива
    }

    function createTable(data, format) {
        data = getSafeData(data);

        const headersMap = {
            push: ['Country code', 'Country name', 'CPC mainstream', 'CPM mainstream', 'CPC adult', 'CPM adult'],
            inPage: ['Country code', 'Country name', 'CPC', 'CPM'],
            native: ['Country code', 'Country name', 'CPC', 'CPM'],
            pop: ['Country code', 'Country name', 'CPM']
        };

        const headers = headersMap[format] || [];
        const table = document.createElement('table');
        table.classList.add('data-table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        headers.forEach((header) => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.cursor = 'pointer';

            const sortIcon = document.createElement('span');
            sortIcon.classList.add('sort-icon');
            th.appendChild(sortIcon);

            th.addEventListener('click', () => sortTable(table, data, format, header, th, sortIcon));

            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        fillTableBody(tbody, data, headers);
        table.appendChild(tbody);

        return table;
    }

    function fillTableBody(tbody, data, headers) {
        data = getSafeData(data);

        tbody.innerHTML = ''; // Очищаем перед обновлением
        data.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                const value = row[header];

                td.textContent = (!isNaN(value) && value !== null && value !== undefined)
                    ? parseFloat(value).toLocaleString('ru-RU', { minimumFractionDigits: 3 }).replace('.', ',')
                    : value || '-';

                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }

    function sortTable(table, data, format, column, th, sortIcon) {
        data = getSafeData(data);

        const isNumeric = !['Country code', 'Country name'].includes(column);
        const tbody = table.querySelector('tbody');

        const currentOrder = th.dataset.order === 'asc' ? 'desc' : 'asc';
        th.dataset.order = currentOrder;

        document.querySelectorAll('.sort-icon').forEach(icon => icon.textContent = '');
        sortIcon.textContent = currentOrder === 'asc' ? ' ▲' : ' ▼';

        data.sort((a, b) => {
            if (isNumeric) {
                const numA = parseFloat(String(a[column]).replace(',', '.')) || 0;
                const numB = parseFloat(String(b[column]).replace(',', '.')) || 0;
                return currentOrder === 'asc' ? numA - numB : numB - numA;
            } else {
                return currentOrder === 'asc'
                    ? String(a[column] || '').localeCompare(String(b[column] || ''))
                    : String(b[column] || '').localeCompare(String(a[column] || ''));
            }
        });

        fillTableBody(tbody, data);
    }

    async function loadData() {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) throw new Error(`Ошибка загрузки данных: ${response.status}`);
            jsonData = await response.json();

            // Проверяем, действительно ли jsonData содержит нужные массивы
            Object.keys(jsonData).forEach(key => {
                if (!Array.isArray(jsonData[key])) {
                    console.warn(`Ошибка: jsonData[${key}] не массив`, jsonData[key]);
                    jsonData[key] = []; // Подставляем пустой массив, чтобы избежать ошибок
                }
            });

        } catch (error) {
            console.error('Ошибка загрузки:', error);
        }
    }

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

                if (Array.isArray(jsonData[format])) {
                    section.innerHTML = `<h2>${format} information</h2>`;
                    const table = createTable(getSafeData(jsonData[format]), format);
                    section.appendChild(table);
                } else {
                    section.innerHTML = `<h2>${format} information</h2><p>Нет данных для этого раздела.</p>`;
                }
            });
        });
    }

    async function init() {
        await loadData();
        setupButtonHandlers();
    }

    init();
});
