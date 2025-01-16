const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs"); // Для работы с файлами

const app = express();

app.use(cors());
app.use(bodyParser.json());

const FILE_NAME = "info.json"; // Имя файла для хранения логов

// Функция для сохранения данных в файл
function saveLogToFile(log) {
    try {
        // Читаем текущие данные из файла (если файл существует)
        let logs = [];
        if (fs.existsSync(FILE_NAME)) {
            const data = fs.readFileSync(FILE_NAME, "utf-8");
            logs = JSON.parse(data); // Парсим данные из файла
        }

        // Добавляем новый лог
        logs.push(log);

        // Перезаписываем файл с обновленными данными
        fs.writeFileSync(FILE_NAME, JSON.stringify(logs, null, 2), "utf-8");
        console.log("Лог успешно сохранён в файл!");
    } catch (error) {
        console.error("Ошибка записи в файл:", error);
    }
}

// Обработка POST-запроса на маршрут /save-log
app.post("/save-log", (req, res) => {
    const { message, level } = req.body;

    // Проверяем, что обязательные поля переданы
    if (!message || !level) {
        return res.status(400).json({ error: "Поля 'message' и 'level' обязательны" });
    }

    // Получаем IP клиента
    const clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Создаём объект лога
    const log = {
        message,
        level,
        ip: clientIp, // IP-адрес клиента
        timestamp: new Date().toISOString() // Метка времени
    };

    // Сохраняем лог в файл
    saveLogToFile(log);

    // Отправляем успешный ответ клиенту
    res.status(200).json({ success: true, message: "Лог успешно сохранён!" });
});

// Обработка остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: "Маршрут не найден" });
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
