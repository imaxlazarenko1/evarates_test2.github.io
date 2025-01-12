// Import required modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');

// Initialize Express app
const app = express();
const PORT = 3000;

// Read Excel file and convert to JSON
const filePath = path.join(__dirname, 'Rates_recommended_Evadav_January25.xlsx');
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// API route to get table data
app.get('/api/data', (req, res) => {
    res.json(sheetData);
});

// Route to serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
