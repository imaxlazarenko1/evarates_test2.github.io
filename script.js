const jsonUrl = 'data.json';

async function loadData() {
    try {
        const response = await fetch(jsonUrl);

        // Проверяем, успешен ли запрос
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Парсим JSON
        const data = await response.json();

        // Обновляем таблицу
        const tableBody = document.querySelector('#data-table tbody');
        data.forEach(row => {
            const tableRow = document.createElement('tr');
            for (const key in row) {
                const cell = document.createElement('td');
                cell.textContent = row[key] || '-';
                tableRow.appendChild(cell);
            }
            tableBody.appendChild(tableRow);
        });
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

// Загружаем данные при загрузке страницы
document.addEventListener('DOMContentLoaded', loadData);
