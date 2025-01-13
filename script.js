document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = './data.json'; // Путь к JSON файлу
    let jsonData = {}; // Для хранения загруженных данных

    // Функция для получения IP пользователя и записи данных в info.json
    async function logUserInfo() {
        try {
            // Получение IP пользователя через API
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            const userIp = ipData.ip;

            // Формирование объекта с текущими данными
            const now = new Date();
            const logEntry = {
                date: now.toISOString(),
                ip: userIp
            };

            // Отправка данных на сервер
            await fetch('/save-log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logEntry)
            });

            console.log('Информация о пользователе записана:', logEntry);
        } catch (error) {
            console.error('Ошибка при записи информации о пользователе:', error);
        }
    }

    // Вызов функции для записи информации о пользователе
    logUserInfo();

    // Скрываем все разделы
    function hideAllSections() {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));
    }

    // Создаем таблицу для отображения данных
    function createTable(data, format) {
        const headersMap = {
            push: ['Country code', 'Country name', 'CPC mainstream', 'CPM mainstream', 'CPC adult', 'CPM adult'],
            inPage: ['Country code', 'Country name', 'CPC', 'CPM'],
            native: ['Country code', 'Country name', 'CPC', 'CPM'],
            pop: ['Country code', 'Country name', 'CPM']
        };

        const headers = headersMap[format] || [];
        const table = document.createElement('table');
        table.classList.add('data-table');

        // Создаем заголовки таблицы
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Заполняем строки данными
        data.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                const value = row[header];

                if (!isNaN(value)) {
                    const numericValue = parseFloat(value);
                    td.textContent = numericValue.toFixed(3);
                } else {
                    td.textContent = value || '-';
                }

                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        return table;
    }

    // Загрузка данных из JSON
    async function loadData() {
        try {
            console.log('Запрашиваю JSON:', jsonUrl);
            const response = await fetch(jsonUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            jsonData = await response.json();
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    }

    // Настройка обработчиков для кнопок
    function setupButtonHandlers() {
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

        Object.keys(buttons).forEach(format => {
            buttons[format].addEventListener('click', () => {
                hideAllSections();

                const section = sections[format];
                section.classList.add('active');

                console.log(`Активный формат: ${format}`);

                if (jsonData[format]) {
                    section.innerHTML = `<h2>${format} Section</h2>`;
                    const table = createTable(jsonData[format], format);
                    section.appendChild(table);
                } else {
                    section.innerHTML = `<h2>${format} Section</h2><p>Нет данных для этого раздела.</p>`;
                }
            });
        });
    }

    // Инициализация
    async function init() {
        console.log('Инициализация приложения...');
        await loadData(); // Загружаем данные из JSON
        setupButtonHandlers(); // Настраиваем кнопки
    }

    init();
});
