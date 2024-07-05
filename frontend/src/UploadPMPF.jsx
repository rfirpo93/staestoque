import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as XLSX from 'xlsx';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import logo from './assets/logo.png'; // Verifique se o caminho está correto

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

const BackButton = styled(Button)`
  align-self: flex-start;
  margin-bottom: 1rem;
  background-color: #0d6efd;
  color: white;
  &:hover {
    background-color: #0a58ca;
  }
`;

const LogoContainer = styled(Box)`
  text-align: center;
  margin-bottom: 2rem;
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
                const json = XLSX.utils.sheet_to_json(worksheet);

                const formattedRows = json.map(row => ({
                    ean: row['EAN'] ? row['EAN'].toString() : '',
                    descricao: row['Descrição'] ? row['Descrição'].toString() : '',
                    pmpf: row['PMPF'] ? row['PMPF'].toString() : ''
                }));

                setRows(formattedRows);
                console.log('Dados carregados:', formattedRows);
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
        row.ean.toLowerCase().includes(filters.ean.toLowerCase()) &&
        row.descricao.toLowerCase().includes(filters.descricao.toLowerCase()) &&
        row.pmpf.toLowerCase().includes(filters.pmpf.toLowerCase())
    );

    return (
        <MainContainer>
            <LogoContainer>
                <img src={logo} alt="Logo Santa Clara" style={{ maxWidth: '100%', height: 'auto' }} />
            </LogoContainer>
            <BackButton variant="contained" component={Link} to="/inicio" startIcon={<ArrowBackIcon />}>
                Voltar para o Início
            </BackButton>
            <Typography variant="h4" gutterBottom align="center">
                Lista PMPF
            </Typography>
            {rows.length > 0 ? (
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
            ) : (
                <Typography variant="h6" align="center">
                    Carregando dados...
                </Typography>
            )}
        </MainContainer>
    );
};

export default UploadPMPF;
