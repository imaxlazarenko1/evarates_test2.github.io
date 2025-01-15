document.addEventListener("DOMContentLoaded", () => {
    const dataFilePath = "./data.json"; // Путь к JSON-файлу с данными
    const tableContainer = document.getElementById("tableContainer");
    const buttons = document.querySelectorAll(".format-btn");
    let currentData = [];
    let currentSortColumn = null;
    let currentSortDirection = 1; // 1 - по возрастанию, -1 - по убыванию

    // Загрузка данных из JSON
    async function loadData() {
        try {
            const response = await fetch(dataFilePath);
            if (!response.ok) throw new Error("Не удалось загрузить данные");
            return await response.json();
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
            return [];
        }
    }

    // Форматирование чисел: запятая вместо точки, округление до 3 знаков
    function formatNumber(value) {
        if (typeof value === "number") {
            return value.toFixed(3).replace(".", ",");
        }
        return value;
    }

    // Создание таблицы на основе данных
    function createTable(data, headers) {
        const table = document.createElement("table");
        table.className = "data-table";

        // Создание заголовка таблицы
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        headers.forEach((header, index) => {
            const th = document.createElement("th");
            th.textContent = header.label;
            th.dataset.column = header.key;
            th.style.cursor = "pointer";

            // Добавление обработчика сортировки
            th.addEventListener("click", () => sortTable(header.key));
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Создание тела таблицы
        const tbody = document.createElement("tbody");
        data.forEach(row => {
            const tr = document.createElement("tr");
            headers.forEach(header => {
                const td = document.createElement("td");
                td.textContent = formatNumber(row[header.key] ?? "-");
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        return table;
    }

    // Сортировка таблицы
    function sortTable(columnKey) {
        if (currentSortColumn === columnKey) {
            currentSortDirection *= -1; // Меняем направление сортировки
        } else {
            currentSortColumn = columnKey;
            currentSortDirection = 1; // Устанавливаем сортировку по возрастанию
        }

        currentData.sort((a, b) => {
            const valueA = typeof a[columnKey] === "number" ? a[columnKey] : parseFloat(a[columnKey]?.replace(",", "."));
            const valueB = typeof b[columnKey] === "number" ? b[columnKey] : parseFloat(b[columnKey]?.replace(",", "."));
            return (valueA - valueB) * currentSortDirection;
        });

        renderTable();
    }

    // Отображение таблицы
    function renderTable() {
        tableContainer.innerHTML = ""; // Очистка контейнера

        const formatHeaders = {
            push: [
                { key: "countryCode", label: "Country Code" },
                { key: "countryName", label: "Country Name" },
                { key: "cpcMainstream", label: "CPC Mainstream" },
                { key: "cpmMainstream", label: "CPM Mainstream" },
                { key: "cpcAdult", label: "CPC Adult" },
                { key: "cpmAdult", label: "CPM Adult" }
            ],
            inPage: [
                { key: "countryCode", label: "Country Code" },
                { key: "countryName", label: "Country Name" },
                { key: "cpc", label: "CPC" },
                { key: "cpm", label: "CPM" }
            ],
            pop: [
                { key: "countryCode", label: "Country Code" },
                { key: "countryName", label: "Country Name" },
                { key: "cpm", label: "CPM" }
            ],
            native: [
                { key: "countryCode", label: "Country Code" },
                { key: "countryName", label: "Country Name" },
                { key: "cpc", label: "CPC" },
                { key: "cpm", label: "CPM" }
            ]
        };

        const activeFormat = document.querySelector(".format-btn.active").id.replace("Btn", "").toLowerCase();
        const headers = formatHeaders[activeFormat];
        const table = createTable(currentData, headers);
        tableContainer.appendChild(table);
    }

    // Установка данных для конкретного формата
    function setFormatData(format) {
        currentData = []; // Очистка текущих данных
        switch (format) {
            case "push":
                currentData = data.push || [];
                break;
            case "inPage":
                currentData = data.inPage || [];
                break;
            case "pop":
                currentData = data.pop || [];
                break;
            case "native":
                currentData = data.native || [];
                break;
            default:
                console.error("Неизвестный формат:", format);
        }
        renderTable();
    }

    // Загрузка данных и инициализация
    let data = {};
    loadData().then(loadedData => {
        data = loadedData;

        buttons.forEach(button => {
            button.addEventListener("click", () => {
                buttons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                const format = button.id.replace("Btn", "").toLowerCase();
                setFormatData(format);
            });
        });

        // Установка формата по умолчанию
        buttons[0].click();
    });
});
