import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Paper } from '@mui/material';
import * as XLSX from 'xlsx';
import styled from '@emotion/styled';

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

const Valorestoquexcusto = () => {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const url = 'https://raw.githubusercontent.com/rfirpo93/staestoque/main/backend/estoquecusto.xlsx';

            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);

            const filteredRows = json.filter(row => row['Quantidade'] > 0);
            const totalValue = filteredRows.reduce((sum, row) => sum + (row['Quantidade'] * row['Custo']), 0);

            setRows(filteredRows);
            setTotal(totalValue);
        };

        fetchData().catch(console.error);
    }, []);

    return (
        <MainContainer>
            <Typography variant="h4" gutterBottom align="center">
                Análise de Valor em Estoque por Custo
            </Typography>
            <TableContainerStyled component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Código</TableCell>
                            <TableCell align="center">Produto</TableCell>
                            <TableCell align="center">Quantidade</TableCell>
                            <TableCell align="center">Custo</TableCell>
                            <TableCell align="center">Valor Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">{row['Código']}</TableCell>
                                <TableCell align="center">{row['Produto']}</TableCell>
                                <TableCell align="center">{row['Quantidade']}</TableCell>
                                <TableCell align="center">{row['Custo']}</TableCell>
                                <TableCell align="center">{(row['Quantidade'] * row['Custo']).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4} align="right">Total em Estoque:</TableCell>
                            <TableCell align="center">{total.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainerStyled>
        </MainContainer>
    );
};

export default Valorestoquexcusto;
