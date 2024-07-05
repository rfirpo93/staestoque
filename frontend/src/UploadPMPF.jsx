import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as XLSX from 'xlsx';
import styled from '@emotion/styled';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Definindo o tema inspirado nas cores do logo
const theme = createTheme({
    palette: {
        primary: {
            main: '#0d6efd', // Azul principal
        },
        secondary: {
            main: '#6c757d', // Cinza secundário
        },
    },
});

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

const MainContainer = styled(Box)`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(145deg, #e0e0e0, #ffffff);
  width: 100vw;
  padding: 0;
  margin: 0;
`;

const TableContainerStyled = styled(TableContainer)`
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

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

                // Extrair os nomes das colunas da primeira linha
                const columnNames = json[0];
                // Mapear os dados
                const formattedRows = json.slice(1).map(row => ({
                    ean: row[columnNames.indexOf('Codigo EAN')] || row[columnNames.indexOf('EAN')] || row[columnNames.indexOf('CodigoEAN')] || row[columnNames.indexOf('EAN Codigo')] || '',
                    descricao: row[columnNames.indexOf('Descrição')] || '',
                    pmpf: row[columnNames.indexOf('PMPF')] || ''
                }));

                setRows(formattedRows);
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
        row.ean.toString().toLowerCase().includes(filters.ean.toLowerCase()) &&
        row.descricao.toString().toLowerCase().includes(filters.descricao.toLowerCase()) &&
        row.pmpf.toString().toLowerCase().includes(filters.pmpf.toLowerCase())
    );

    return (
        <ThemeProvider theme={theme}>
            <MainContainer>
                <Box sx={{ width: '90%' }}>
                    <Typography variant="h4" gutterBottom align="center">
                        Lista PMPF
                    </Typography>
                    {rows.length > 0 && (
                        <TableContainerStyled component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>
                                            <TextField
                                                placeholder="EAN"
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
                                        <StyledTableCell>EAN</StyledTableCell>
                                        <StyledTableCell>Descrição</StyledTableCell>
                                        <StyledTableCell>PMPF</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredRows.map((row, index) => (
                                        <StyledTableRow key={index}>
                                            <TableCell align="center">{row.ean}</TableCell>
                                            <TableCell align="center">{row.descricao}</TableCell>
                                            <TableCell align="center">{row.pmpf}</TableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainerStyled>
                    )}
                </Box>
            </MainContainer>
        </ThemeProvider>
    );
};

export default UploadPMPF;
