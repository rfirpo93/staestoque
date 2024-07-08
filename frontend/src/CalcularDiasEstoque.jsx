import React, { useState } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import styled from '@emotion/styled';
import * as XLSX from 'xlsx';

// Estilização para o container principal
const MainContainer = styled(Box)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(145deg, #e0e0e0, #ffffff);
  padding: 20px;
`;

const CalcularDiasEstoque = () => {
    const [vendas, setVendas] = useState('');
    const [estoque, setEstoque] = useState('');
    const [dias, setDias] = useState(null);
    const [data, setData] = useState([]);

    const calcularDias = () => {
        if (vendas && estoque) {
            setDias((parseFloat(estoque) / parseFloat(vendas)).toFixed(2));
        } else {
            setDias(null);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Process the data
            const processedData = [];
            let lastDate = null;

            jsonData.slice(12).forEach((row) => { // Start from the 13th row (index 12)
                if (row[2] !== undefined && row[2] !== '') { // Ignore rows where the 3rd column is blank
                    const date = row[0] || lastDate; // Use the last known date if the current date is blank
                    processedData.push([date, row[1], row[2]]);
                    lastDate = date;
                }
            });

            setData(processedData);
        };

        reader.readAsBinaryString(file);
    };

    return (
        <MainContainer>
            <Typography variant="h4" gutterBottom>
                Calcular Dias de Estoque
            </Typography>
            <TextField
                label="Vendas Diárias"
                value={vendas}
                onChange={(e) => setVendas(e.target.value)}
                margin="normal"
                variant="outlined"
            />
            <TextField
                label="Estoque Atual"
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
                margin="normal"
                variant="outlined"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={calcularDias}
                sx={{ mt: 2 }}
            >
                Calcular
            </Button>
            {dias !== null && (
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Dias de Estoque: {dias}
                </Typography>
            )}
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{ marginTop: '20px' }}
            />
            {data.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Dados do Arquivo:
                    </Typography>
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Coluna 2</th>
                                <th>Coluna 3</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row[0]}</td>
                                    <td>{row[1]}</td>
                                    <td>{row[2]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            )}
        </MainContainer>
    );
};

export default CalcularDiasEstoque;
