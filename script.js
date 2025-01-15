document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = './data.json'; // Путь к JSON файлу
    let jsonData = {}; // Для хранения загруженных данных

    /**
     * Функция для записи информации о дате, времени и IP пользователя
     */
    async function logUserInfo() {
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            if (!ipResponse.ok) throw new Error('Ошибка получения IP');
            const ipData = await ipResponse.json();

            const logEntry = {
                date: new Date().toISOString(),
                ip: ipData.ip
            };

            const response = await fetch('/save-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logEntry)
            });

            if (!response.ok) throw new Error(`Ошибка сохранения лога: ${response.statusText}`);
            console.log('Лог сохранён:', logEntry);
        } catch (error) {
            console.error('Ошибка записи лога:', error);
        }
    }

    logUserInfo();

    /**
     * Скрывает все разделы
     */
    function hideAllSections() {
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    }

    /**
     * Создаёт таблицу для отображения данных
     * @param {Array} data - Данные для таблицы
     * @param {String} format - Формат (push, inPage, pop, native)
     * @returns {HTMLElement} - Таблица
     */
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

        const headerRow = document.createElement('tr');

        headers.forEach((header) => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.cursor = 'pointer';

            const sortIcon = document.createElement('span');
            sortIcon.classList.add('sort-icon', 'asc'); // По умолчанию сортировка по возрастанию
            th.appendChild(sortIcon);

            // Добавляем обработчик клика для сортировки
            th.addEventListener('click', () => {
                const isNumeric = !['Country code', 'Country name'].includes(header);

                // Определяем текущий порядок сортировки
                const currentOrder = sortIcon.classList.contains('asc') ? 'asc' : 'desc';

                // Сортируем данные
                const sortedData = [...data].sort((a, b) => {
                    if (isNumeric) {
                        // Преобразуем к числам, заменяя запятые на точки
                        const numA = parseFloat(String(a[header]).replace(',', '.')) || 0;
                        const numB = parseFloat(String(b[header]).replace(',', '.')) || 0;
                        return currentOrder === 'asc' ? numA - numB : numB - numA;
                    } else {
                        // Приводим к строкам и сравниваем
                        const valA = String(a[header] || '').toLowerCase();
                        const valB = String(b[header] || '').toLowerCase();
                        return currentOrder === 'asc'
                            ? valA.localeCompare(valB)
                            : valB.localeCompare(valA);
                    }
                });

                // Переключаем порядок сортировки
                sortIcon.classList.toggle('asc');
                sortIcon.classList.toggle('desc');

                // Перерисовываем таблицу
                const newTable = createTable(sortedData, format);
                table.replaceWith(newTable);
            });

            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        data.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                const value = row[header];

                if (!isNaN(value) && value !== null && value !== undefined) {
                    td.textContent = parseFloat(value)
                        .toLocaleString('ru-RU', { minimumFractionDigits: 3 })
                        .replace('.', ',');
                } else {
                    td.textContent = value || '-';
                }

                tr.appendChild(td);
            });
            table.appendChild(tr);
        });

        return table;
    }

    /**
     * Загружает данные из JSON файла
     */
    async function loadData() {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            jsonData = await response.json();
            console.log('Данные загружены:', jsonData);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }

    /**
     * Настраивает обработчики для кнопок
     */
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

                if (jsonData[format]) {
                    section.innerHTML = `<h2>${format} information</h2>`;
                    const table = createTable(jsonData[format], format);
                    section.appendChild(table);
                } else {
                    section.innerHTML = `<h2>${format} information</h2><p>Нет данных для этого раздела.</p>`;
                }
            });
        });
    }

    async function init() {
        console.log('Инициализация приложения...');
        await loadData();
        setupButtonHandlers();
    }

    init();
});
