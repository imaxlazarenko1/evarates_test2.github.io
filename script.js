document.addEventListener('DOMContentLoaded', async () => {
    const jsonUrl = './data.json';
    let jsonData = {};
    let currentSortColumn = null;
    let currentSortOrder = 'asc';
    let currentPage = 1;
    let rowsPerPage = 50; // По умолчанию 50 строк

    async function logUserInfo() {
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            if (!ipResponse.ok) throw new Error('Ошибка получения IP');
            const { ip } = await ipResponse.json();

            const logEntry = { date: new Date().toISOString(), ip };
            const response = await fetch('/save-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logEntry)
            });

            if (!response.ok) throw new Error(`Ошибка сохранения лога: ${response.statusText}`);
            console.log('Лог сохранён:', logEntry);
        } catch (error) {
            console.error('Ошибка записи лога:', error);
        }
    }

    logUserInfo();

    function hideAllSections() {
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    }

    function createTable(data, format, page = 1) {
        const headersMap = {
            push: ['Country code', 'Country name', 'CPC mainstream', 'CPM mainstream', 'CPC adult', 'CPM adult'],
            inPage: ['Country code', 'Country name', 'CPC', 'CPM'],
            native: ['Country code', 'Country name', 'CPC', 'CPM'],
            pop: ['Country code', 'Country name', 'CPM']
        };

        const headers = headersMap[format] || [];
        const table = document.createElement('table');
        table.classList.add('data-table');

        const headerRow = document.createElement('tr');

        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.cursor = 'pointer';

            const sortIcon = document.createElement('span');
            sortIcon.classList.add('sort-icon');
            th.appendChild(sortIcon);

            th.addEventListener('click', () => {
                if (currentSortColumn === header) {
                    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSortColumn = header;
                    currentSortOrder = 'asc';
                }

                const isNumeric = !['Country code', 'Country name'].includes(header);
                const sortedData = [...data].sort((a, b) => {
                    let valA = a[header], valB = b[header];
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

                table.replaceWith(createTable(sortedData, format, currentPage));
            });

            if (currentSortColumn === header) {
                sortIcon.textContent = currentSortOrder === 'asc' ? ' ▲' : ' ▼';
            }

            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

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
        createPaginationControls(table, data.length);
    }

    function createPaginationControls(table, totalRows) {
        let paginationContainer = table.nextElementSibling;
        if (!paginationContainer || !paginationContainer.classList.contains('pagination')) {
            paginationContainer = document.createElement('div');
            paginationContainer.classList.add('pagination');
            table.after(paginationContainer);
        }

        paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(totalRows / rowsPerPage);

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Предыдущая';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => changePage(currentPage - 1));

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Следующая';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => changePage(currentPage + 1));

        const selectRowsPerPage = document.createElement('select');
        [50, 100].forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = `Показывать ${value} строк`;
            if (value === rowsPerPage) option.selected = true;
            option.addEventListener('change', (e) => {
                rowsPerPage = parseInt(e.target.value);
                currentPage = 1;
                renderActiveSection();
            });
            selectRowsPerPage.appendChild(option);
        });

        paginationContainer.appendChild(prevButton);
        paginationContainer.appendChild(selectRowsPerPage);
        paginationContainer.appendChild(nextButton);
    }

    function changePage(newPage) {
        currentPage = newPage;
        renderActiveSection();
    }

    async function loadData() {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) throw new Error(`Ошибка загрузки данных: ${response.status}`);
            jsonData = await response.json();
        } catch (error) {
            console.error(error);
        }
    }

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

    async function init() {
        await loadData();
        setupButtonHandlers();
    }

    init();
});
