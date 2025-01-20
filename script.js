document.addEventListener('DOMContentLoaded', async () => {
    const jsonUrl = './data.json';
    let jsonData = {};
    let currentSortColumn = null;
    let currentSortOrder = 'asc';
    let currentPage = 1;
    let rowsPerPage = 50;
    let searchQuery = '';
    let activeFormat = 'push'; // По умолчанию

    async function loadData() {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) throw new Error(`Ошибка загрузки данных: ${response.status}`);
            jsonData = await response.json();
            renderActiveSection(); // Отрисовать первый раздел после загрузки данных
        } catch (error) {
            console.error(error);
        }
    }

    function renderActiveSection() {
        const activeSection = document.getElementById(`${activeFormat}Section`);
        if (!activeSection) return;

        activeSection.innerHTML = `<h2>${activeFormat} Information</h2>`;

        if (Array.isArray(jsonData[activeFormat])) {
            const filteredData = filterData(jsonData[activeFormat]);
            const table = createTable(filteredData, activeFormat, currentPage);
            activeSection.appendChild(table);
        } else {
            activeSection.innerHTML += '<p>Нет данных для этого раздела.</p>';
        }
    }

    function createTable(data, format, page = 1) {
        const headersMap = {
            push: ['Country Code', 'Country Name', 'CPC ms', 'CPM ms', 'CPC Adult', 'CPM Adult'],
            inPage: ['Country Code', 'Country Name', 'CPC', 'CPM'],
            native: ['Country Code', 'Country Name', 'CPC', 'CPM'],
            pop: ['Country Code', 'Country Name', 'CPM']
        };

        const headers = headersMap[format] || [];
        const table = document.createElement('table');
        table.classList.add('data-table');

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
                if (currentSortColumn === header) {
                    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSortColumn = header;
                    currentSortOrder = 'asc';
                }

                data.sort((a, b) => {
                    let valA = a[header], valB = b[header];
                    return currentSortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
                });

                document.querySelectorAll('.sort-icon').forEach(icon => icon.textContent = '');
                sortIcon.textContent = currentSortOrder === 'asc' ? ' ▲' : ' ▼';

                table.replaceWith(createTable(data, format, currentPage));
            });

            if (currentSortColumn === header) {
                sortIcon.textContent = currentSortOrder === 'asc' ? ' ▲' : ' ▼';
            }

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
                td.textContent = row[header] || '-';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
    }

    function filterData(data) {
        return data.filter(row => Object.values(row).some(value => String(value).toLowerCase().includes(searchQuery.toLowerCase())));
    }

    document.getElementById('searchInput').addEventListener('input', (event) => {
        searchQuery = event.target.value;
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
                activeFormat = format;
                hideAllSections();
                document.getElementById(`${format}Section`).classList.add('active');
                renderActiveSection();
            });
        });
    }

    function hideAllSections() {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
            section.innerHTML = ''; // Очистка содержимого
        });
    }

    async function init() {
        await loadData();
        setupButtonHandlers();

        // Убедиться, что первая вкладка (Push) активируется правильно
        document.getElementById('pushBtn').click();
    }

    init();
});
