import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, InputAdornment, Dialog, DialogTitle, DialogContent } from '@mui/material';
import * as XLSX from 'xlsx';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import Estoque from './Estoque'; // Import the Estoque component
import InfoIcon from '@mui/icons-material/Info';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

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

const HeaderContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
  background: linear-gradient(145deg, #f0f0f0, #d0d0d0);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
`;

const HeaderFields = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Field = styled(TextField)`
  .MuiInputBase-root {
    background-color: #ffffff;
    border-radius: 4px;
  }
  .MuiInputAdornment-root {
    cursor: pointer;
  }
`;

const CalcularDiasEstoque = () => {
    const [data, setData] = useState([]);
    const [produto, setProduto] = useState('');
    const [estoqueAtual, setEstoqueAtual] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [vendaTotal, setVendaTotal] = useState(0);
    const [compraTotal, setCompraTotal] = useState(0);
    const [qtdUltimaCompra, setQtdUltimaCompra] = useState(0);
    const [valorUltimaCompra, setValorUltimaCompra] = useState(0);
    const [vendaDiaria, setVendaDiaria] = useState(0);
    const [vendaMediaMensal, setVendaMediaMensal] = useState(0);
    const [vendaMediaTrimestral, setVendaMediaTrimestral] = useState(0);
    const [vendaMediaAnual, setVendaMediaAnual] = useState(0);
    const [diasEstoque, setDiasEstoque] = useState(0);
    const [totalDias, setTotalDias] = useState(0);
    const [showHeader, setShowHeader] = useState(false);
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (dataInicio && dataFim) {
            const diffTime = Math.abs(new Date(dataFim) - new Date(dataInicio));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Including both start and end dates
            setTotalDias(diffDays);

            const vendaDiariaCalc = vendaTotal / diffDays;
            setVendaDiaria(vendaDiariaCalc);
            setVendaMediaMensal(vendaDiariaCalc * 30);
            setVendaMediaTrimestral(vendaDiariaCalc * 90);
            setVendaMediaAnual(vendaDiariaCalc * 365);
            setDiasEstoque(estoqueAtual / vendaDiariaCalc);
        }
    }, [dataInicio, dataFim, vendaTotal, estoqueAtual]);

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
            let lastOperation = null;

            jsonData.slice(12).forEach((row) => { // Start from the 13th row (index 12)
                if (row[2] !== undefined && row[2] !== '') { // Ignore rows where the 3rd column is blank
                    const date = row[0] || lastDate; // Use the last known date if the current date is blank
                    const operation = row[1] || lastOperation; // Use the last known operation if the current operation is blank
                    processedData.push([date, operation, row[2], row[7], row[10]]);
                    lastDate = date;
                    lastOperation = operation;
                }
            });

            setData(processedData);

            // Set date range
            if (processedData.length > 0) {
                const firstDate = new Date(processedData[0][0]);
                const lastDate = new Date(processedData[processedData.length - 1][0]);
                setDataInicio(firstDate.toISOString().split('T')[0]);
                setDataFim(lastDate.toISOString().split('T')[0]);

                const diffTime = Math.abs(lastDate - firstDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                setTotalDias(diffDays);
            }

            // Calculate totals and averages
            const vendaTotalCalc = processedData
                .filter(row => row[1] === 'Fatura')
                .reduce((sum, row) => sum + (row[3] || 0), 0);
            const compraTotalCalc = processedData
                .filter(row => row[1] === 'Entrada')
                .reduce((sum, row) => sum + (row[3] || 0), 0);
            const ultimaCompra = processedData
                .filter(row => row[1] === 'Entrada')
                .slice(-1)[0];
            const qtdUltimaCompraCalc = ultimaCompra ? ultimaCompra[3] : 0;
            const valorUltimaCompraCalc = ultimaCompra ? ultimaCompra[4] : 0;

            setVendaTotal(vendaTotalCalc);
            setCompraTotal(compraTotalCalc);
            setQtdUltimaCompra(qtdUltimaCompraCalc);
            setValorUltimaCompra(valorUltimaCompraCalc);

            setShowHeader(true);
        };

        reader.readAsBinaryString(file);
    };

    const handleSelectProduto = () => {
        // Fetch and process the products data
        const url = 'https://raw.githubusercontent.com/rfirpo93/staestoque/main/backend/estoque.xlsx';

        fetch(url)
            .then(response => response.arrayBuffer())
            .then(data => {
                const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                setProducts(json);
                setOpen(true);
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const handleProductSelect = (product) => {
        setProduto(product.produto);
        setEstoqueAtual(product.quantidade);
        setOpen(false);
    };

    return (
        <MainContainer>
            <BackButton variant="contained" component={Link} to="/inicio" startIcon={<ArrowBackIosIcon />}>
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
            {showHeader && (
                <HeaderContainer>
                    <HeaderFields>
                        <Field
                            label="Produto"
                            value={produto}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOffIcon onClick={handleSelectProduto} />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                            size="small"
                        />
                        <Field
                            label="Estoque Atual"
                            value={estoqueAtual}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ShoppingCartIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Field
                            label="Data Início"
                            value={dataInicio}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarTodayIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Field
                            label="Data Fim"
                            value={dataFim}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarTodayIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Field
                            label="Total de Dias no Intervalo"
                            value={totalDias}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarTodayIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Field
                            label="Venda Total no Período"
                            value={vendaTotal}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <InventoryIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Field
                            label="Compra Total no Período"
                            value={compraTotal}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <InventoryIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Field
                            label="QTD Última Compra"
                            value={qtdUltimaCompra}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BarChartIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Field
                            label="Valor Unitário Última Compra"
                            value={valorUltimaCompra}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MonetizationOnIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Field
                            label="Venda Diária"
                            value={vendaDiaria}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TrendingUpIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Field
                            label="Venda Média Mensal"
                            value={vendaMediaMensal}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TrendingUpIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Field
                            label="Venda Média Trimestral"
                            value={vendaMediaTrimestral}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TrendingUpIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Field
                            label="Venda Média Anual"
                            value={vendaMediaAnual}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TrendingUpIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Field
                            label="Dias de Estoque"
                            value={diasEstoque}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TrendingUpIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </HeaderFields>
                </HeaderContainer>
            )}
            {data.length > 0 ? (
                <TableContainerStyled component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Data</StyledTableCell>
                                <StyledTableCell>Operação</StyledTableCell>
                                <StyledTableCell>Entidade</StyledTableCell>
                                <StyledTableCell>Quantidade</StyledTableCell>
                                <StyledTableCell>Valor</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <TableCell align="center">{row[0]}</TableCell>
                                    <TableCell align="center">{row[1]}</TableCell>
                                    <TableCell align="center">{row[2]}</TableCell>
                                    <TableCell align="center">{row[3]}</TableCell>
                                    <TableCell align="center">{row[4]}</TableCell>
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
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Selecione um Produto</DialogTitle>
                <DialogContent>
                    <Estoque onSelectProduct={handleProductSelect} />
                </DialogContent>
            </Dialog>
        </MainContainer>
    );
};

export default CalcularDiasEstoque;
