﻿import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as XLSX from 'xlsx';
import styled from '@emotion/styled';

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

const normalizeHeader = (header) => {
    return header
        .normalize('NFD') // Normalize to decompose accented characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .toLowerCase() // Convert to lowercase
        .trim(); // Trim any extra whitespace
};

const UploadPMPF = () => {
    const [rows, setRows] = useState([]);
    const [filters, setFilters] = useState({ ean: '', descricao: '', pmpf: '' });

    useEffect(() => {
        const url = 'https://raw.githubusercontent.com/rfirpo93/staestoque/main/backend/listapmpf.xlsx';

        fetch(url)
            .then(response => response.arrayBuffer())
            .then(data => {
                const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                const headers = json[0].map(normalizeHeader);
                const dataRows = json.slice(1).map(row => {
                    let rowData = {};
                    row.forEach((cell, index) => {
                        rowData[headers[index]] = cell ? cell.toString() : '';
                    });
                    return rowData;
                });

                setRows(dataRows);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const filteredRows = rows.filter(row =>
        row.codigoean.toLowerCase().includes(filters.ean.toLowerCase()) &&
        row.descricao.toLowerCase().includes(filters.descricao.toLowerCase()) &&
        row.pmpf.toLowerCase().includes(filters.pmpf.toLowerCase())
    );

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
                                <StyledTableCell>
                                    <TextField
                                        placeholder="Código EAN"
                                        name="ean"
                                        value={filters.ean}
                                        onChange={handleFilterChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                            style: { backgroundColor: 'white', borderRadius: 4 }
                                        }}
                                        variant="outlined"
                                        size="small"
                                    />
                                </StyledTableCell>
                                <StyledTableCell>
                                    <TextField
                                        placeholder="Descrição"
                                        name="descricao"
                                        value={filters.descricao}
                                        onChange={handleFilterChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                            style: { backgroundColor: 'white', borderRadius: 4 }
                                        }}
                                        variant="outlined"
                                        size="small"
                                    />
                                </StyledTableCell>
                                <StyledTableCell>
                                    <TextField
                                        placeholder="PMPF"
                                        name="pmpf"
                                        value={filters.pmpf}
                                        onChange={handleFilterChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                            style: { backgroundColor: 'white', borderRadius: 4 }
                                        }}
                                        variant="outlined"
                                        size="small"
                                    />
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Código EAN</StyledTableCell>
                                <StyledTableCell>Descrição</StyledTableCell>
                                <StyledTableCell>PMPF</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <TableCell align="center">{row.codigoean}</TableCell>
                                    <TableCell align="center">{row.descricao}</TableCell>
                                    <TableCell align="center">{row.pmpf}</TableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default UploadPMPF;
