const express = require('express'); // Фреймворк для создания сервера
const bodyParser = require('body-parser'); // Для обработки JSON-запросов
const fs = require('fs'); // Для работы с файловой системой
const path = require('path'); // Для работы с путями файлов

const app = express(); // Инициализация приложения
const PORT = 3000; // Порт, на котором запустится сервер

// Middleware для обработки JSON-запросов
app.use(bodyParser.json());

// Путь к файлу для сохранения логов
const LOG_FILE = path.join(__dirname, 'info.json');

// Маршрут для обработки POST-запросов на /save-log
app.post('/save-log', (req, res) => {
    const logEntry = req.body;

    // Проверяем, что данные корректны
    if (!logEntry || !logEntry.date || !logEntry.ip) {
        return res.status(400).send('Неверные данные. Требуются "date" и "ip".');
    }

    // Читаем существующий файл с логами
    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
        let logs = [];
        if (!err && data) {
            try {
                logs = JSON.parse(data); // Парсим существующие логи
            } catch (parseError) {
                console.error('Ошибка парсинга JSON:', parseError);
            }
        }

        // Добавляем новый лог
        logs.push(logEntry);

        // Записываем обновлённые логи обратно в info.json
        fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), (err) => {
            if (err) {
                console.error('Ошибка записи в файл:', err);
                return res.status(500).send('Ошибка записи в файл');
            }
            res.send('Лог успешно сохранён');
        });
    });
});

// Маршрут для favicon.ico, чтобы избежать 404 ошибки
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Раздача статических файлов (index.html, script.js, styles.css)
app.use(express.static(path.join(__dirname)));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Логи будут сохраняться в: ${LOG_FILE}`);
});
