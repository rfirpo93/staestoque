import React, { useState } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// Importando xlsx diretamente do CDN
import * as XLSX from 'xlsx';

const UploadPMPF = () => {
    const [file, setFile] = useState(null);
    const [rows, setRows] = useState([]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            setRows(json);
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Upload de lista PMPF
            </Typography>
            <Box display="flex" justifyContent="center" mb={2}>
                <Button
                    variant="contained"
                    component="label"
                >
                    Selecione o arquivo
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>
            </Box>
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
