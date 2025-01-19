document.addEventListener('DOMContentLoaded', async () => {
    const jsonUrl = './data.json';
    let jsonData = {};
    let currentSortColumn = null;
    let currentSortOrder = 'asc';
    let currentPage = 1;
    let rowsPerPage = 50; // По умолчанию 50 стран

    async function loadData() {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) throw new Error(`Ошибка загрузки данных: ${response.status}`);
            jsonData = await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    function renderActiveSection() {
        const activeSection = document.querySelector('.content-section.active');
        if (!activeSection) return;

        const format = activeSection.id.replace('Section', '');
        activeSection.innerHTML = `<h2>${format} information</h2>`;

        if (Array.isArray(jsonData[format])) {
            const table = createTable(jsonData[format], format, currentPage);
            activeSection.appendChild(table);
        } else {
            activeSection.innerHTML += '<p>Нет данных для этого раздела.</p>';
        }
    }

    function createTable(data, format, page = 1) {
        const headersMap = {
            push: ['Country Code', 'Country Name', 'CPC Mainstream', 'CPM Mainstream', 'CPC Adult', 'CPM Adult'],
            inPage: ['Country Code', 'Country Name', 'CPC', 'CPM'],
            native: ['Country Code', 'Country Name', 'CPC', 'CPM'],
            pop: ['Country Code', 'Country Name', 'CPM']
        };

        const headers = headersMap[format] || [];
        const table = document.createElement('table');
        table.classList.add('data-table');

        // 🔥 Добавляем заголовки таблицы
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.cursor = 'pointer';

            const sortIcon = document.createElement('span');
            sortIcon.classList.add('sort-icon');
            th.appendChild(sortIcon);

            th.addEventListener('click', () => {
                sortTable(table, data, format, header, th, sortIcon);
            });

            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        fillTableBody(table, data, headers, page);
        return table;
    }

    function fillTableBody(table, data, headers, page) {
        const tbody = document.createElement('tbody');
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = data.slice(start, end);

        paginatedData.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                const value = row[header];
                td.textContent = (value !== null && value !== undefined && !isNaN(value)) 
                    ? parseFloat(value).toLocaleString('ru-RU', { minimumFractionDigits: 3 }).replace('.', ',') 
                    : value || '-';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
    }

    function sortTable(table, data, format, column, th, sortIcon) {
        if (currentSortColumn === column) {
            currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortColumn = column;
            currentSortOrder = 'asc';
        }

        const isNumeric = !['Country Code', 'Country Name'].includes(column);
        data.sort((a, b) => {
            let valA = a[column], valB = b[column];
            if (isNumeric) {
                valA = parseFloat(String(valA).replace(',', '.')) || 0;
                valB = parseFloat(String(valB).replace(',', '.')) || 0;
            } else {
                valA = String(valA || '').toLowerCase();
                valB = String(valB || '').toLowerCase();
            }
            return currentSortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });

        document.querySelectorAll('.sort-icon').forEach(icon => icon.textContent = '');
        sortIcon.textContent = currentSortOrder === 'asc' ? ' ▲' : ' ▼';

        table.replaceWith(createTable(data, format, currentPage));
    }

    document.getElementById('rowsPerPage').addEventListener('change', (event) => {
        rowsPerPage = parseInt(event.target.value);
        currentPage = 1;
        renderActiveSection();
    });

    function setupButtonHandlers() {
        const buttons = {
            push: document.getElementById('pushBtn'),
            inPage: document.getElementById('inPageBtn'),
            pop: document.getElementById('popBtn'),
            native: document.getElementById('nativeBtn')
        };

        Object.keys(buttons).forEach(format => {
            buttons[format].addEventListener('click', () => {
                hideAllSections();
                document.getElementById(`${format}Section`).classList.add('active');
                currentPage = 1;
                renderActiveSection();
            });
        });
    }

    function hideAllSections() {
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    }

    async function init() {
        await loadData();
        setupButtonHandlers();

        // Автоматически активируем первую вкладку (Push)
        document.getElementById('pushBtn').click();
    }

    init();
});
