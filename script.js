document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = './data.json'; // Путь к JSON файлу
    let jsonData = {}; // Для хранения загруженных данных

    // Кнопки для переключения форматов
    const buttons = {
        push: document.getElementById('pushBtn'),
        inPage: document.getElementById('inPageBtn'),
        pop: document.getElementById('popBtn'),
        native: document.getElementById('nativeBtn')
    };

    // Секции для отображения информации
    const sections = {
        push: document.getElementById('pushSection'),
        inPage: document.getElementById('inPageSection'),
        pop: document.getElementById('popSection'),
        native: document.getElementById('nativeSection')
    };

    /**
     * Функция скрывает все секции
     */
    function hideAllSections() {
        Object.values(sections).forEach(section => section.classList.remove('active'));
    }

    /**
     * Создаёт строки для таблицы на основе данных
     */
    function createTableRows(data, table) {
        const tbody = table.querySelector('tbody');
        if (!tbody) {
            console.error("Table body (tbody) не найден.");
            return;
        }
        tbody.innerHTML = ''; // Очистка таблицы перед заполнением
        data.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach(value => {
                const td = document.createElement('td');
                td.textContent = value || '-'; // Если данных нет, выводится "-"
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }

    /**
     * Загружает данные из JSON файла
     */
    async function loadData() {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) throw new Error(`Ошибка загрузки JSON: ${response.status}`);
            jsonData = await response.json();
        } catch (error) {
            console.error('Ошибка загрузки JSON:', error);
        }
    }

    /**
     * Настраивает обработчики событий для кнопок
     */
    function setupButtons() {
        Object.keys(buttons).forEach(format => {
            buttons[format].addEventListener('click', () => {
                hideAllSections();
                const section = sections[format];
                section.classList.add('active');

                const table = section.querySelector('table');
                if (!table) {
                    console.error(`Таблица для формата "${format}" не найдена.`);
                    return;
                }

                if (jsonData[format]) {
                    createTableRows(jsonData[format], table);
                } else {
                    console.warn(`Нет данных для формата: ${format}`);
                    const tbody = table.querySelector('tbody');
                    if (tbody) {
                        tbody.innerHTML = `<tr><td colspan="3">Нет данных для отображения</td></tr>`;
                    }
                }
            });
        });
    }

    /**
     * Инициализация приложения
     */
    async function init() {
        await loadData(); // Загружаем данные из JSON
        setupButtons(); // Настраиваем кнопки
        // Активируем первый раздел (Push) по умолчанию
        buttons.push.click();
    }

    init();
});
