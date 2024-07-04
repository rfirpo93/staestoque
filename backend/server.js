// backend/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const app = express();
const PORT = process.env.PORT || 5000;

// Endpoint para servir o arquivo Excel
app.get('/data', (req, res) => {
    const filePath = path.join(__dirname, 'listapmpf.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    res.json(json);
});

// Servir arquivos estáticos do build do React
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Rota para servir o frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
