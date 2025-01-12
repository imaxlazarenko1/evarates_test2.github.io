// script.js

// URL или путь к вашему JSON-файлу
const jsonUrl = 'Rates_recommended_Evadav_January25.json';

// Функция для загрузки данных из JSON
async function loadData() {
    try {
        const response = await fetch(jsonUrl);
        const data = await response.json();

        // Вставить данные в таблицу
        populateTable(data);
    } catch (error) {
        console.error('Ошибка загрузки JSON:', error);
    }
}

// Функция для добавления данных в таблицу
function populateTable(data) {
    const tableBody = document.querySelector('#data-table tbody');

    // Пример: Добавляем данные из первого листа JSON
    const sheetName = Object.keys(data)[0]; // Имя первого листа
    const rows = data[sheetName];

    rows.forEach(row => {
        const tableRow = document.createElement('tr');

        // Создание ячеек таблицы на основе столбцов
        const columns = [
            'Country Code',
            'Country Name',
            'CPC Mainstream',
            'CPM Mainstream',
            'CPC Adult',
            'CPM Adult'
        ];

        columns.forEach(column => {
            const cell = document.createElement('td');
            cell.textContent = row[column] || '-'; // Значение или "-"
            tableRow.appendChild(cell);
        });

        tableBody.appendChild(tableRow);
    });
}

// Вызов функции загрузки данных при загрузке страницы
document.addEventListener('DOMContentLoaded', loadData);
