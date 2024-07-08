import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import * as XLSX from 'xlsx';
import styled from '@emotion/styled';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

const MainContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(145deg, #e0e0e0, #ffffff);
`;

const TableContainerStyled = styled(TableContainer)`
  margin-top: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const StyledTableCell = styled(TableCell)`
  background-color: #0d6efd;
  color: white;
  font-weight: bold;
  text-align: center;
`;

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #f2f2f2;
  }
  &:hover {
    background-color: #e0f7fa;
  }
`;

const BackButton = styled(Button)`
  align-self: flex-start;
  margin-bottom: 1rem;
  background-color: #0d6efd;
  color: white;
  &:hover {
    background-color: #0a58ca;
  }
`;

const CalcularDiasEstoque = () => {
    const [data, setData] = useState([]);

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
            <BackButton variant="contained" component={Link} to="/inicio" startIcon={<ArrowBackIcon />}>
                Voltar para o Início
            </BackButton>
            <Typography variant="h4" gutterBottom align="center">
                Dados de Estoque
            </Typography>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{ marginTop: '20px', marginBottom: '20px' }}
            />
            {data.length > 0 ? (
                <TableContainerStyled component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Data</StyledTableCell>
                                <StyledTableCell>Coluna 2</StyledTableCell>
                                <StyledTableCell>Coluna 3</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <TableCell align="center">{row[0]}</TableCell>
                                    <TableCell align="center">{row[1]}</TableCell>
                                    <TableCell align="center">{row[2]}</TableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainerStyled>
            ) : (
                <Typography variant="h6" align="center">
                    Carregando dados...
                </Typography>
            )}
        </MainContainer>
    );
};

export default CalcularDiasEstoque;
