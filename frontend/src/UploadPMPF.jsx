import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import * as XLSX from 'xlsx';

const UploadPMPF = () => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        // URL do arquivo Excel hospedado no GitHub
        const url = 'https://raw.githubusercontent.com/rfirpo93/staestoque/main/backend/listapmpf.xlsx';

        fetch(url)
            .then(response => response.arrayBuffer())
            .then(data => {
                const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                setRows(json);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Lista PMPF
            </Typography>
            {rows.length > 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Código EAN</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell>PMPF</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row['Código EAN']}</TableCell>
                                    <TableCell>{row['Descrição']}</TableCell>
                                    <TableCell>{row['PMPF']}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default UploadPMPF;
