document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = './data.json'; // Путь к вашему JSON файлу
    let jsonData = {}; // Для хранения загруженных данных

    // Кнопки и разделы
    const buttons = {
        push: document.getElementById('pushBtn'),
        inPage: document.getElementById('inPageBtn'),
        pop: document.getElementById('popBtn'),
        native: document.getElementById('nativeBtn')
    };

    const sections = {
        push: document.getElementById('pushSection'),
        inPage: document.getElementById('inPageSection'),
        pop: document.getElementById('popSection'),
        native: document.getElementById('nativeSection')
    };

    // Скрываем все разделы
    function hideAllSections() {
        Object.values(sections).forEach(section => section.classList.remove('active'));
    }

    // Создаем таблицу для отображения данных
    function createTable(data) {
        const table = document.createElement('table');

        // Заголовки таблицы
        const headers = ['Country code', 'Country name', 'CPC mainstream', 'CPM mainstream', 'CPC adult', 'CPM adult'];
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Строки данных
        data.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header] || '-';
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        return table;
    }

    // Загрузка данных из JSON
    async function loadData() {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            jsonData = await response.json();
            console.log('Данные загружены:', jsonData);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }

    // Настраиваем обработчики кнопок
    function setupButtonHandlers() {
        Object.keys(buttons).forEach(format => {
            buttons[format].addEventListener('click', () => {
                hideAllSections(); // Скрываем все разделы

                const section = sections[format];
                section.classList.add('active'); // Показываем текущий раздел

                // Очищаем старый контент и добавляем новый
                section.innerHTML = `<h2>${format.charAt(0).toUpperCase() + format.slice(1)} Section</h2>`;
                if (jsonData[format]) {
                    const table = createTable(jsonData[format]);
                    section.appendChild(table);
                } else {
                    section.innerHTML += '<p>Нет данных для этого раздела.</p>';
                }
            });
        });
    }

    // Инициализация
    async function init() {
        await loadData(); // Загружаем JSON
        setupButtonHandlers(); // Настраиваем кнопки
    }

    init(); // Запуск
});
