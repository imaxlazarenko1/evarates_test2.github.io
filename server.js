const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware для обработки JSON-запросов
app.use(bodyParser.json());

// Путь к файлу для сохранения логов
const LOG_FILE = path.join(__dirname, 'info.json');

// Раздача статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для сохранения логов
app.post('/save-log', (req, res) => {
    const logEntry = req.body;

    if (!logEntry || !logEntry.date || !logEntry.ip) {
        return res.status(400).send('Неверные данные. Требуются "date" и "ip".');
    }

    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
        let logs = [];
        if (!err && data) {
            logs = JSON.parse(data);
        }

        logs.push(logEntry);

        fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), (err) => {
            if (err) {
                console.error('Ошибка записи:', err);
                return res.status(500).send('Ошибка записи в файл');
            }
            res.send('Лог сохранён');
        });
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
