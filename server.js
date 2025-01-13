const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Подключаем парсер для обработки JSON
app.use(bodyParser.json());

// Обработка POST-запроса для сохранения логов
app.post('/save-log', (req, res) => {
    const logEntry = req.body;

    // Путь к файлу info.json
    const filePath = path.join(__dirname, 'info.json');

    // Чтение текущего содержимого info.json
    fs.readFile(filePath, (err, data) => {
        let logs = [];
        if (!err && data.length > 0) {
            logs = JSON.parse(data); // Парсим текущие логи
        }
        logs.push(logEntry); // Добавляем новую запись

        // Запись обновлённых данных обратно в info.json
        fs.writeFile(filePath, JSON.stringify(logs, null, 2), (err) => {
            if (err) {
                console.error('Ошибка записи в файл:', err);
                return res.status(500).send('Ошибка записи в файл');
            }
            res.send('Лог успешно сохранён');
        });
    });
});

// Раздача статических файлов
app.use(express.static(path.join(__dirname)));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://evarates.online);
});
