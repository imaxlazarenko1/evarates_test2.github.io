document.addEventListener('DOMContentLoaded', () => {
    // Путь к вашему файлу JSON
    const jsonUrl = 'data.json';

    async function loadData() {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Data received:', data);

            const tableBody = document.querySelector('#data-table tbody');
            console.log(tableBody);  // Проверка, нашли ли tbody
            if (!tableBody) {
                console.error('Не удалось найти tbody для таблицы.');
                return;  // Если не нашли tbody, останавливаем выполнение
            }

            // Проверка структуры данных
            if (Array.isArray(data)) {
                data.forEach(row => {
                    const tableRow = document.createElement('tr');
                    for (const key in row) {
                        const cell = document.createElement('td');
                        cell.textContent = row[key] || '-';  // Если значения нет, отображаем '-'
                        tableRow.appendChild(cell);
                    }
                    tableBody.appendChild(tableRow);
                });
            } else {
                console.error('Полученные данные не являются массивом!');
            }
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }

    // Загружаем данные при загрузке страницы
    loadData();
});
