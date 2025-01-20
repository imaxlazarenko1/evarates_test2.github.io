document.addEventListener('DOMContentLoaded', async () => {
    const jsonUrl = './data.json';
    let jsonData = {};
    let currentSortColumn = null;
    let currentSortOrder = 'asc';
    let currentPage = 1;
    let rowsPerPage = 50;
    let searchQuery = "";

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

        // Фильтруем данные по введённому поисковому запросу
        let filteredData = jsonData[format] || [];
        if (searchQuery) {
            filteredData = filteredData.filter(row =>
                row["country_code"].toLowerCase().includes(searchQuery) ||
                row["country_name"].toLowerCase().includes(searchQuery)
            );
        }

        activeSection.innerHTML = `<h2>${format} information</h2>`;

        if (filteredData.length > 0) {
            const table = createTable(filteredData, format);
            activeSection.appendChild(table);
        } else {
            activeSection.innerHTML += '<p>Нет данных для этого запроса.</p>';
        }
    }

    function createTable(data, format) {
        const headersMap = {
            push: ['country_code', 'country_name', 'cpc_ms', 'cpm_ms', 'cpc_adult', 'cpm_adult'],
            inPage: ['country_code', 'country_name', 'cpc', 'cpm'],
            native: ['country_code', 'country_name', 'cpc', 'cpm'],
            pop: ['country_code', 'country_name', 'cpm']
        };

        const headersDisplay = {
            country_code: "Country Code",
            country_name: "Country Name",
            cpc_ms: "CPC ms",
            cpm_ms: "CPM ms",
            cpc_adult: "CPC Adult",
            cpm_adult: "CPM Adult",
            cpc: "CPC",
            cpm: "CPM"
        };

        const headers = headersMap[format] || [];
        const table = document.createElement('table');
        table.classList.add('data-table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = headersDisplay[header] || header;
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
                    const isNumeric = !['country_code', 'country_name'].includes(header);
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

                table.replaceWith(createTable(data, format));
            });

            if (currentSortColumn === header) {
                sortIcon.textContent = currentSortOrder === 'asc' ? ' ▲' : ' ▼';
            }

            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = data.slice(start, end);

        paginatedData.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                let value = row[header];

                if (value !== null && value !== undefined && !isNaN(value)) {
                    value = parseFloat(value).toLocaleString('ru-RU', { minimumFractionDigits: 3 }).replace('.', ',');
                } else if (value === null || value === undefined) {
                    value = "-";  // Замена пустых значений на прочерк
                }

                td.textContent = value;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        return table;
    }

    document.getElementById('rowsPerPage')?.addEventListener('change', (event) => {
        rowsPerPage = parseInt(event.target.value);
        currentPage = 1;
        renderActiveSection();
    });

    document.getElementById('searchInput')?.addEventListener('input', (event) => {
        searchQuery = event.target.value.toLowerCase().trim();
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
            buttons[format]?.addEventListener('click', () => {
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

    await loadData();
    setupButtonHandlers();
    document.getElementById('pushBtn')?.click();
});
