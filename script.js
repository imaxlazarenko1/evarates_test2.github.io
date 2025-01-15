document.addEventListener('DOMContentLoaded', () => {
    const jsonUrl = './data.json'; // Путь к JSON-файлу
    let jsonData = {}; // Для хранения загруженных данных

    const buttons = {
        push: document.getElementById('pushBtn'),
        inPage: document.getElementById('inPageBtn'),
        pop: document.getElementById('popBtn'),
        native: document.getElementById('nativeBtn'),
    };

    const sections = {
        push: document.getElementById('pushSection'),
        inPage: document.getElementById('inPageSection'),
        pop: document.getElementById('popSection'),
        native: document.getElementById('nativeSection'),
    };

    const tableHeaders = {
        push: ['Country Code', 'Country Name', 'CPC Mainstream', 'CPM Mainstream', 'CPC Adult', 'CPM Adult'],
        inPage: ['Country Code', 'Country Name', 'CPC', 'CPM'],
        pop: ['Country Code', 'Country Name', 'CPM'],
        native: ['Country Code', 'Country Name', 'CPC', 'CPM'],
    };

    function hideAllSections() {
        Object.values(sections).forEach((section) =>
            section.classList.remove('active')
        );
    }

    function createTableRows(data, table, format) {
        const tbody = table.querySelector('tbody');
        if (!tbody) {
            console.error("Table body (tbody) не найден.");
            return;
        }

        tbody.innerHTML = ''; // Очистка таблицы

        data.forEach((row) => {
            const tr = document.createElement('tr');
            tableHeaders[format].forEach((key) => {
                const td = document.createElement('td');
                td.textContent = row[key] || '-'; // Если данных нет, вывод "-"
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }

    async function loadData() {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) {
                throw new Error(`Ошибка загрузки JSON: ${response.status}`);
            }
            jsonData = await response.json();
        } catch (error) {
            console.error('Ошибка загрузки JSON:', error);
        }
    }

    function setupButtons() {
        Object.keys(buttons).forEach((format) => {
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
                    createTableRows(jsonData[format], table, format);
                } else {
                    console.warn(`Нет данных для формата: ${format}`);
                    const tbody = table.querySelector('tbody');
                    if (tbody) {
                        tbody.innerHTML = `<tr><td colspan="${tableHeaders[format].length}">Нет данных для отображения</td></tr>`;
                    }
                }
            });
        });
    }

    async function init() {
        await loadData();
        setupButtons();
        buttons.push.click(); // По умолчанию показывается Push
    }

    init();
});
