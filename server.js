const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Создаем экземпляр приложения
const app = express();

// Используем CORS, чтобы разрешить запросы из других доменов
app.use(cors());

// Парсинг JSON-запросов
app.use(bodyParser.json());

// Обработка POST-запроса на маршрут /save-log
app.post("/save-log", (req, res) => {
    try {
        // Извлекаем данные из тела запроса
        const { message, level } = req.body;

        // Проверяем наличие обязательных полей
        if (!message || !level) {
            return res.status(400).json({ error: "Поля 'message' и 'level' обязательны" });
        }

        // Логируем данные (здесь можно добавить сохранение в файл или базу данных)
        console.log(`Уровень: ${level}, Сообщение: ${message}`);

        // Отправляем ответ клиенту
        res.status(200).json({ success: true, message: "Лог успешно сохранен!" });
    } catch (error) {
        console.error("Ошибка на сервере:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Обработка остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: "Маршрут не найден" });
});

// Запуск сервера
const PORT = 3000; // Выберите нужный порт
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
