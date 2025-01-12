const jsonUrl = 'data.json'; // Путь к файлу JSON

async function loadData() {
    try {
        const response = await fetch(jsonUrl);

        // Проверяем, успешен ли запрос
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Парсим JSON
        const data = await response.json();

        // Проверяем, что данные получили в правильном формате
        if (!Array.isArray(data)) {
            throw new Error('Полученные данные не являются массивом.');
        }

        // Обновляем таблицу
        const tableBody = document.querySelector('#data-table tbody');
        data.forEach(row => {
            const tableRow = document.createElement('tr');
            for (const key in row) {
                const cell = document.createElement('td');
                cell.textContent = row[key] || '-'; // Если данные отсутствуют, показываем '-'
                tableRow.appendChild(cell);
            }
            tableBody.appendChild(tableRow);
        });
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        alert('Произошла ошибка при загрузке данных. См. консоль для подробностей.');
    }
}

// Загружаем данные при загрузке страницы
document.addEventListener('DOMContentLoaded', loadData);
