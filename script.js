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
        const table = document.createElement('table');
        table.classList.add('data-table');

        fillTableBody(table, data, format, page);
        return table;
    }

    function fillTableBody(table, data, format, page) {
        const tbody = document.createElement('tbody');
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = data.slice(start, end);

        paginatedData.forEach(row => {
            const tr = document.createElement('tr');
            Object.keys(row).forEach(header => {
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
