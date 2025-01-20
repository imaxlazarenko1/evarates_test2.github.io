document.addEventListener('DOMContentLoaded', async () => {
    const jsonUrl = './data.json';
    let jsonData = {};
    let currentSortColumn = null;
    let currentSortOrder = 'asc';
    let currentPage = 1;
    let rowsPerPage = 50;
    let searchQuery = '';
    let activeFormat = 'push'; // По умолчанию активный формат

    async function loadData() {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) throw new Error(`Ошибка загрузки данных: ${response.status}`);
            jsonData = await response.json();
            renderActiveSection(); // Отобразить первую секцию после загрузки данных
        } catch (error) {
            console.error('Ошибка загрузки JSON:', error);
        }
    }

    function renderActiveSection() {
        const activeSection = document.getElementById(`${activeFormat}Section`);
        if (!activeSection) return;

        activeSection.innerHTML = `<h2>${activeFormat} Information</h2>`;

        if (Array.isArray(jsonData[activeFormat])) {
            const filteredData = filterData(jsonData[activeFormat]);
            if (filteredData.length === 0) {
                activeSection.innerHTML += '<p>Нет данных для этого раздела.</p>';
                return;
            }
            const table = createTable(filteredData, activeFormat);
            activeSection.appendChild(table);
        } else {
            activeSection.innerHTML += '<p>Нет данных для этого раздела.</p>';
        }
    }

    function createTable(data, format) {
        const headersMap = {
            push: ['country_code', 'country_name', 'cpc_ms', 'cpm_ms', 'cpc_adult', 'cpm_adult'],
            inPage: ['country_code', 'country_name', 'cpc', 'cpm'],
            native: ['country_code', 'country_name', 'cpc', 'cpm'],
            pop: ['country_code', 'country_name', 'cpm']
        };

        const columnNames = headersMap[format] || Object.keys(data[0]);
        const headers = columnNames.map(key => key.replace(/_/g, ' ').toUpperCase());

        const table = document.createElement('table');
        table.classList.add('data-table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        headers.forEach((header, index) => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.cursor = 'pointer';

            const sortIcon = document.createElement('span');
            sortIcon.classList.add('sort-icon');
            th.appendChild(sortIcon);

            th.addEventListener('click', () => {
                if (currentSortColumn === columnNames[index]) {
                    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSortColumn = columnNames[index];
                    currentSortOrder = 'asc';
                }

                data.sort((a, b) => {
                    let valA = a[columnNames[index]], valB = b[columnNames[index]];
                    return currentSortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
                });

                document.querySelectorAll('.sort-icon').forEach(icon => icon.textContent = '');
                sortIcon.textContent = currentSortOrder === 'asc' ? ' ▲' : ' ▼';

                table.replaceWith(createTable(data, format));
            });

            if (currentSortColumn === columnNames[index]) {
                sortIcon.textContent = currentSortOrder === 'asc' ? ' ▲' : ' ▼';
            }

            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        fillTableBody(table, data, columnNames);

        return table;
    }

    function fillTableBody(table, data, columnNames) {
        const tbody = document.createElement('tbody');
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = data.slice(start, end);

        paginatedData.forEach(row => {
            const tr = document.createElement('tr');
            columnNames.forEach(key => {
                const td = document.createElement('td');
                td.textContent = row[key] !== undefined && row[key] !== null ? row[key] : '-';
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
            section.innerHTML = ''; // Очистка перед новой загрузкой
        });
    }

    async function init() {
        await loadData();
        setupButtonHandlers();
        document.getElementById('pushBtn').click();
    }

    init();
});
