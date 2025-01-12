const jsonUrl = 'data.json';  // Путь к файлу JSON

async function loadData() {
    try {
        // Загружаем данные из файла
        const response = await fetch(jsonUrl);
        
        // Проверяем, успешен ли запрос
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Парсим JSON
        const data = await response.json();
        console.log('Data received:', data);  // Логируем полученные данные для диагностики

        // Если данные являются объектом, получаем массив из свойства "data"
        const rows = data.data || [];  // Если данных нет, используем пустой массив
        console.log('Rows to display:', rows);  // Логируем массив, который будет отображен

        // Проверяем, что rows — это массив
        if (Array.isArray(rows)) {
            // Если это массив, проходим по всем элементам и добавляем в таблицу
            const tableBody = document.querySelector('#data-table tbody');  // Находим tbody в таблице
            console.log('Table Body found:', tableBody);  // Проверка, нашли ли мы tbody
            if (!tableBody) {
                console.error('Не удалось найти tbody для таблицы.');
                return;
            }

            rows.forEach(row => {
                const tableRow = document.createElement('tr');
                for (const key in row) {
                    const cell = document.createElement('td');
                    cell.textContent = row[key] || '-';  // Если значение отсутствует, ставим '-'
                    tableRow.appendChild(cell);
                }
                tableBody.appendChild(tableRow);
            });
        } else {
            console.error('Полученные данные не являются массивом!');
        }
    } catch (error) {
        // Если произошла ошибка при загрузке или парсинге
        console.error('Ошибка загрузки данных:', error);
    }
}

// Загружаем данные при загрузке страницы
document.addEventListener('DOMContentLoaded', loadData);
