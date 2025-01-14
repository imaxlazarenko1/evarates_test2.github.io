document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = './data.json'; // Путь к JSON файлу
    let jsonData = {}; // Для хранения загруженных данных

    /**
     * Функция для записи информации о дате, времени и IP пользователя
     */
    async function logUserInfo() {
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            if (!ipResponse.ok) {
                throw new Error('Ошибка получения IP');
            }
            const ipData = await ipResponse.json();
            const userIp = ipData.ip;

            const now = new Date();
            const logEntry = {
                date: now.toISOString(),
                ip: userIp
            };

            const response = await fetch('/save-log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(logEntry)
            });

            if (!response.ok) {
                throw new Error(`Ошибка сохранения лога: ${response.statusText}`);
            }

            console.log('Информация о пользователе записана:', logEntry);
        } catch (error) {
            console.error('Ошибка при записи информации о пользователе:', error);
        }
    }

    // Вызываем функцию для записи информации о пользователе
    logUserInfo();

    /**
     * Скрывает все разделы
     */
    function hideAllSections() {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));
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

        // Создаём заголовки таблицы с кнопками для сортировки
        const headerRow = document.createElement('tr');
        headers.forEach((header) => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.cursor = 'pointer';

            // Создаём значок сортировки
            const sortIcon = document.createElement('span');
            sortIcon.classList.add('sort-icon');
            th.appendChild(sortIcon);

            // Добавляем обработчик клика для сортировки
            th.addEventListener('click', () => {
                // Убираем классы сортировки у всех столбцов
                headerRow.querySelectorAll('th .sort-icon').forEach(icon => {
                    icon.classList.remove('asc', 'desc');
                });

                // Определяем текущий порядок сортировки
                const currentOrder = sortIcon.classList.contains('asc') ? 'asc' : 'desc';

                // Устанавливаем новый порядок сортировки
                sortIcon.classList.toggle('asc', currentOrder === 'desc');
                sortIcon.classList.toggle('desc', currentOrder === 'asc');

                // Определяем, строковый или числовой столбец
                const isNumeric = !['Country code', 'Country name'].includes(header);

                // Сортируем данные
                const sortedData = [...data].sort((a, b) => {
                    if (isNumeric) {
                        const numA = parseFloat(a[header]) || 0;
                        const numB = parseFloat(b[header]) || 0;
                        return currentOrder === 'asc' ? numA - numB : numB - numA;
                    } else {
                        const strA = a[header] || '';
                        const strB = b[header] || '';
                        return currentOrder === 'asc'
                            ? strA.localeCompare(strB)
                            : strB.localeCompare(strA);
                    }
                });

                // Перерисовываем таблицу
                const newTable = createTable(sortedData, format);
                table.replaceWith(newTable);
            });

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
                    td.textContent = numericValue.toLocaleString('ru-RU', {
                        minimumFractionDigits: 3,
                        maximumFractionDigits: 3
                    });
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
            console.log('Запрашиваю JSON:', jsonUrl);
            const response = await fetch(jsonUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            jsonData = await response.json();
            console.log('Данные успешно загружены:', jsonData);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
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

    /**
     * Инициализация приложения
     */
    async function init() {
        console.log('Инициализация приложения...');
        await loadData(); // Загружаем данные из JSON
        setupButtonHandlers(); // Настраиваем кнопки
    }

    init();
});
