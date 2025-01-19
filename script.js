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
        const table = activeSection.querySelector('table');
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = ''; // Очищаем старые данные

        if (Array.isArray(jsonData[format])) {
            fillTableBody(tbody, jsonData[format], format, currentPage);
        } else {
            tbody.innerHTML = '<tr><td colspan="6">Нет данных</td></tr>';
        }
    }

    function fillTableBody(tbody, data, format, page) {
        const headersMap = {
            push: ['Country Code', 'Country Name', 'CPC Mainstream', 'CPM Mainstream', 'CPC Adult', 'CPM Adult'],
            inPage: ['Country Code', 'Country Name', 'CPC', 'CPM'],
            native: ['Country Code', 'Country Name', 'CPC', 'CPM'],
            pop: ['Country Code', 'Country Name', 'CPM']
        };

        const headers = headersMap[format] || [];
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
    }

    function sortTable(tbody, data, format, column, th, sortIcon) {
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

        tbody.innerHTML = '';
        fillTableBody(tbody, data, format, currentPage);
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
