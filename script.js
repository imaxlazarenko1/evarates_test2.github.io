// Динамическая таблица
const tableContainer = document.getElementById('tableContainer');

// Кнопки форматов
const pushBtn = document.getElementById('pushBtn');
const inPageBtn = document.getElementById('inPageBtn');
const popBtn = document.getElementById('popBtn');
const nativeBtn = document.getElementById('nativeBtn');

// Функция для скрытия текущего контента (очистка контейнера)
function hideAllSections() {
    tableContainer.innerHTML = ''; // Удаляет содержимое контейнера
}

// Функция для создания таблицы
function createTable(headers, rows) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Создание заголовков таблицы
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Создание строк данных
    rows.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            if (typeof cell === 'number') {
                td.textContent = cell.toLocaleString('ru-RU', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
            } else {
                td.textContent = cell;
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

// Функции для отображения данных форматов
function showPushData() {
    hideAllSections();
    const headers = ['Country Code', 'Country Name', 'CPC Mainstream', 'CPM Mainstream', 'CPC Adult', 'CPM Adult'];
    const rows = pushData.map(item => [
        item.country_code,
        item.country_name,
        item.cpc_mainstream,
        item.cpm_mainstream,
        item.cpc_adult,
        item.cpm_adult
    ]);
    const table = createTable(headers, rows);
    tableContainer.appendChild(table);
}

function showInPageData() {
    hideAllSections();
    const headers = ['Country Code', 'Country Name', 'CPC', 'CPM'];
    const rows = inPageData.map(item => [
        item.country_code,
        item.country_name,
        item.cpc,
        item.cpm
    ]);
    const table = createTable(headers, rows);
    tableContainer.appendChild(table);
}

function showPopData() {
    hideAllSections();
    const headers = ['Country Code', 'Country Name', 'CPM'];
    const rows = popData.map(item => [
        item.country_code,
        item.country_name,
        item.cpm
    ]);
    const table = createTable(headers, rows);
    tableContainer.appendChild(table);
}

function showNativeData() {
    hideAllSections();
    const headers = ['Country Code', 'Country Name', 'CPC', 'CPM'];
    const rows = nativeData.map(item => [
        item.country_code,
        item.country_name,
        item.cpc,
        item.cpm
    ]);
    const table = createTable(headers, rows);
    tableContainer.appendChild(table);
}

// Привязка обработчиков к кнопкам
pushBtn.addEventListener('click', showPushData);
inPageBtn.addEventListener('click', showInPageData);
popBtn.addEventListener('click', showPopData);
nativeBtn.addEventListener('click', showNativeData);

// Данные (замените на загрузку из файла data.json)
const pushData = [
    { country_code: 'US', country_name: 'United States', cpc_mainstream: 0.045, cpm_mainstream: 0.89, cpc_adult: 0.12, cpm_adult: 1.24 },
    // Другие записи...
];

const inPageData = [
    { country_code: 'US', country_name: 'United States', cpc: 0.067, cpm: 1.02 },
    // Другие записи...
];

const popData = [
    { country_code: 'US', country_name: 'United States', cpm: 0.45 },
    // Другие записи...
];

const nativeData = [
    { country_code: 'US', country_name: 'United States', cpc: 0.033, cpm: 0.85 },
    // Другие записи...
];

// Инициализация: показать данные Push при загрузке
showPushData();
