app.post('/save-log', (req, res) => {
    const logEntry = req.body;
    console.log('Лог записан:', logEntry);
    res.send('Лог успешно обработан');
});
