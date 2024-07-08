import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as XLSX from 'xlsx';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

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

const Estoque = () => {
    const [rows, setRows] = useState([]);
    const [filters, setFilters] = useState({ codigo: '', produto: '', quantidade: '', custo: '' });

    useEffect(() => {
        const url = 'https://raw.githubusercontent.com/rfirpo93/staestoque/main/backend/estoque.xlsx';

        fetch(url)
            .then(response => response.arrayBuffer())
            .then(data => {
                const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);

                const formattedRows = json.map(row => ({
                    codigo: row['Código'] ? row['Código'].toString() : '',
                    produto: row['Produto'] ? row['Produto'].toString() : '',
                    quantidade: row['Quantidade'] ? row['Quantidade'].toString() : '',
                    custo: row['Custo'] ? row['Custo'].toString() : ''
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
        row.codigo.toLowerCase().includes(filters.codigo.toLowerCase()) &&
        row.produto.toLowerCase().includes(filters.produto.toLowerCase()) &&
        row.quantidade.toLowerCase().includes(filters.quantidade.toLowerCase()) &&
        row.custo.toLowerCase().includes(filters.custo.toLowerCase())
    );

    return (
        <MainContainer>
            <BackButton variant="contained" component={Link} to="/inicio" startIcon={<ArrowBackIcon />}>
                Voltar para o Início
            </BackButton>
            <Typography variant="h4" gutterBottom align="center">
                Consulta de Estoque
            </Typography>
            {rows.length > 0 ? (
                <TableContainerStyled component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    <TextField
                                        placeholder="Código"
                                        name="codigo"
                                        value={filters.codigo}
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
                                        placeholder="Produto"
                                        name="produto"
                                        value={filters.produto}
                                        onChange={handleFilterChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <InventoryIcon />
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
                                        placeholder="Quantidade"
                                        name="quantidade"
                                        value={filters.quantidade}
                                        onChange={handleFilterChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocalOfferIcon />
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
                                        placeholder="Custo"
                                        name="custo"
                                        value={filters.custo}
                                        onChange={handleFilterChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AttachMoneyIcon />
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
                                <StyledTableCell>Código</StyledTableCell>
                                <StyledTableCell>Produto</StyledTableCell>
                                <StyledTableCell>Quantidade</StyledTableCell>
                                <StyledTableCell>Custo</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <TableCell align="center">{row.codigo}</TableCell>
                                    <TableCell align="center">{row.produto}</TableCell>
                                    <TableCell align="center">{row.quantidade}</TableCell>
                                    <TableCell align="center">{row.custo}</TableCell>
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

export default Estoque;
