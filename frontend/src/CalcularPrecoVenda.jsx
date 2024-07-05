import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as XLSX from 'xlsx';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const MainContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(145deg, #e0e0e0, #ffffff);
`;

const FormContainer = styled(Box)`
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  max-width: 600px;
  width: 100%;
  text-align: center;
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

const TableContainerStyled = styled(TableContainer)`
  margin-top: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const CalcularPrecoVenda = () => {
    const [produto, setProduto] = useState('');
    const [pmpf, setPmpf] = useState('');
    const [valorST, setValorST] = useState('');
    const [custoFrete, setCustoFrete] = useState('');
    const [margem, setMargem] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [filters, setFilters] = useState({ descricao: '', pmpf: '' });

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

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleRowDoubleClick = (row) => {
        setProduto(row.descricao);
        setPmpf(row.pmpf);
        setValorST((parseFloat(row.pmpf) * 0.17).toFixed(2));
        setDialogOpen(false);
    };

    const filteredRows = rows.filter(row =>
        row.descricao.toLowerCase().includes(filters.descricao.toLowerCase()) &&
        row.pmpf.toLowerCase().includes(filters.pmpf.toLowerCase())
    );

    return (
        <MainContainer>
            <FormContainer component={motion.div} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <Typography variant="h4" gutterBottom>
                    Calcular Preço de Venda
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="produto"
                        label="Referência PMPF"
                        name="produto"
                        value={produto}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={handleDialogOpen} variant="contained" color="primary" size="small">
                                    Selecionar Referência
                                </Button>
                            ),
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="pmpf"
                        label="PMPF"
                        name="pmpf"
                        value={pmpf}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    R$
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="valorST"
                        label="Valor ST"
                        name="valorST"
                        value={valorST}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    R$
                                </InputAdornment>
                            ),
                        }}
                        disabled
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="custoFrete"
                        label="Custo de Frete por Unidade"
                        name="custoFrete"
                        value={custoFrete}
                        onChange={(e) => setCustoFrete(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    R$
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="margem"
                        label="Margem Desejada"
                        name="margem"
                        value={margem}
                        onChange={(e) => setMargem(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    %
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </FormContainer>

            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="lg" fullWidth>
                <DialogTitle>Selecionar Referência PMPF</DialogTitle>
                <DialogContent>
                    <TableContainerStyled component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
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
                                    <StyledTableCell>Descrição</StyledTableCell>
                                    <StyledTableCell>PMPF</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRows.map((row, index) => (
                                    <StyledTableRow key={index} onDoubleClick={() => handleRowDoubleClick(row)}>
                                        <TableCell align="center">{row.descricao}</TableCell>
                                        <TableCell align="center">{row.pmpf}</TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainerStyled>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </MainContainer>
    );
};

export default CalcularPrecoVenda;
