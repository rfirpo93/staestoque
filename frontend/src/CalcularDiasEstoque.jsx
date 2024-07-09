import React, { useState, useEffect, useRef } from 'react';
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
import ShowChartIcon from '@mui/icons-material/ShowChart';
import StoreIcon from '@mui/icons-material/Store';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
    const [totalDias, setTotalDias] = useState('');
    const [valorTotalVendas, setValorTotalVendas] = useState(0);
    const [precoMedioVenda, setPrecoMedioVenda] = useState(0);
    const [margemBruta, setMargemBruta] = useState(0);
    const [showHeader, setShowHeader] = useState(false);
    const [open, setOpen] = useState(false);
    const [openGraph, setOpenGraph] = useState(false);
    const [openClientAnalysis, setOpenClientAnalysis] = useState(false);
    const [graphData, setGraphData] = useState([]);
    const [clientData, setClientData] = useState([]);
    const [products, setProducts] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        if (dataInicio && dataFim) {
            const startDate = new Date(dataInicio.split('/').reverse().join('-'));
            const endDate = new Date(dataFim.split('/').reverse().join('-'));
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            setTotalDias(diffDays.toString());

            const vendaDiariaCalc = (vendaTotal / diffDays).toFixed(2);
            setVendaDiaria(vendaDiariaCalc);
            setVendaMediaMensal((vendaDiariaCalc * 30).toFixed(2));
            setVendaMediaTrimestral((vendaDiariaCalc * 90).toFixed(2));
            setVendaMediaAnual((vendaDiariaCalc * 365).toFixed(2));
            setDiasEstoque((estoqueAtual / vendaDiariaCalc).toFixed(2));
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

            const processedData = [];
            let lastDate = null;
            let lastOperation = null;

            jsonData.slice(12).forEach((row, index) => {
                if (row[3] !== undefined && row[3] !== '') {
                    const date = row[1] || lastDate;
                    const operation = row[2] || lastOperation;
                    processedData.push([date, operation, row[3], row[8], row[11]]);
                    lastDate = date;
                    lastOperation = operation;
                }
            });

            setData(processedData);

            if (processedData.length > 0) {
                const firstDate = processedData[0][0];
                const lastDate = processedData[processedData.length - 1][0];
                setDataInicio(firstDate);
                setDataFim(lastDate);

                const parseDate = (dateStr) => {
                    const [day, month, year] = dateStr.split('/').map(Number);
                    return new Date(year, month - 1, day);
                };

                const startDate = parseDate(firstDate);
                const endDate = parseDate(lastDate);

                if (!isNaN(startDate) && !isNaN(endDate)) {
                    const diffTime = Math.abs(endDate - startDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    setTotalDias(diffDays.toString());
                } else {
                    setTotalDias('Erro ao calcular');
                }
            }

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

            const valorTotalVendasCalc = processedData
                .filter(row => row[1] === 'Fatura')
                .reduce((sum, row) => sum + (row[3] * row[4]), 0);
            setValorTotalVendas(valorTotalVendasCalc);

            const precoMedioVendaCalc = (valorTotalVendasCalc / vendaTotalCalc).toFixed(2);
            setPrecoMedioVenda(precoMedioVendaCalc);

            const margemBrutaCalc = (((valorUltimaCompraCalc - precoMedioVendaCalc) / valorUltimaCompraCalc) * -100).toFixed(2);
            setMargemBruta(margemBrutaCalc);

            const monthlyData = {};
            const clientDataMap = {};

            processedData.forEach(row => {
                if (row[1] === 'Fatura') {
                    const [day, month, year] = row[0].split('/');
                    const monthYear = `${month}/${year}`;
                    if (!monthlyData[monthYear]) {
                        monthlyData[monthYear] = 0;
                    }
                    monthlyData[monthYear] += row[3];

                    const client = row[2];
                    if (!clientDataMap[client]) {
                        clientDataMap[client] = 0;
                    }
                    clientDataMap[client] += row[3];
                }
            });

            const chartData = Object.keys(monthlyData).map(monthYear => ({
                name: monthYear,
                value: monthlyData[monthYear]
            }));

            const clientDataArray = Object.keys(clientDataMap).map(client => ({
                client,
                total: clientDataMap[client]
            })).sort((a, b) => b.total - a.total);

            setGraphData(chartData);
            setClientData(clientDataArray);

            setShowHeader(true);
        };

        reader.readAsBinaryString(file);
    };

    const handleSelectProduto = () => {
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

    const formatNumber = (number) => {
        return number.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const generatePDF = async () => {
        const doc = new jsPDF();

        // Adicione o título
        doc.setFontSize(18);
        doc.text('Análise de Estoque e Vendas', 20, 20);
        doc.setFontSize(12);

        // Adicione os campos do cabeçalho
        const headerData = [
            { label: 'Produto', value: produto },
            { label: 'Estoque Atual', value: formatNumber(estoqueAtual) },
            { label: 'Data Início', value: dataInicio },
            { label: 'Data Fim', value: dataFim },
            { label: 'Total de Dias no Intervalo', value: totalDias },
            { label: 'Venda Total no Período', value: formatNumber(vendaTotal) },
            { label: 'Compra Total no Período', value: formatNumber(compraTotal) },
            { label: 'QTD Última Compra', value: formatNumber(qtdUltimaCompra) },
            { label: 'Valor Unitário Última Compra', value: formatNumber(valorUltimaCompra) },
            { label: 'Valor Total de Vendas no Período (R$)', value: formatNumber(valorTotalVendas) },
            { label: 'Preço Médio de Venda', value: formatNumber(precoMedioVenda) },
            { label: 'Margem Bruta Realizada (%)', value: formatNumber(margemBruta) },
            { label: 'Venda Diária', value: formatNumber(vendaDiaria) },
            { label: 'Venda Média Mensal', value: formatNumber(vendaMediaMensal) },
            { label: 'Venda Média Trimestral', value: formatNumber(vendaMediaTrimestral) },
            { label: 'Venda Média Anual', value: formatNumber(vendaMediaAnual) },
            { label: 'Dias de Estoque', value: formatNumber(diasEstoque) },
        ];

        headerData.forEach((item, index) => {
            doc.text(`${item.label}: ${item.value}`, 20, 40 + (index * 10));
        });

        // Adicione o gráfico
        const chartCanvas = chartRef.current;
        if (chartCanvas) {
            const chartImgData = chartCanvas.toDataURL('image/png');
            doc.addImage(chartImgData, 'PNG', 10, 200, 190, 90);
        }

        // Adicione a tabela de clientes
        doc.text('Top 10 Compradores', 20, 310);
        clientData.slice(0, 10).forEach((row, index) => {
            doc.text(`${index + 1}. ${row.client}: ${formatNumber(row.total)} unidades`, 20, 320 + (index * 10));
        });

        doc.save('analise_estoque_venda.pdf');
    };

    return (
        <MainContainer>
            <BackButton variant="contained" component={Link} to="/inicio" startIcon={<ArrowBackIosIcon />}>
                Voltar para o Início
            </BackButton>
            <Typography variant="h4" gutterBottom align="center">
                <StoreIcon fontSize="large" style={{ marginRight: '10px' }} />
                Análise de Estoque e Vendas
            </Typography>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{ marginTop: '20px', marginBottom: '20px' }}
            />
            {showHeader && (
                <HeaderContainer id="report-content">
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
                            label="Adicionar ao Estoque"
                            value=""
                            onBlur={(e) => {
                                const newValue = parseFloat(e.target.value);
                                if (!isNaN(newValue)) {
                                    setEstoqueAtual((prev) => (parseFloat(prev) + newValue).toString());
                                }
                            }}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocalShippingIcon />
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
                            value={formatNumber(vendaTotal)}
                            onChange={(e) => setVendaTotal(parseFloat(e.target.value) || 0)}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <InventoryIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Field
                            label="Compra Total no Período"
                            value={formatNumber(compraTotal)}
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
                            value={formatNumber(qtdUltimaCompra)}
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
                            value={formatNumber(valorUltimaCompra)}
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
                            label="Valor Total de Vendas no Período (R$)"
                            value={formatNumber(valorTotalVendas)}
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
                            label="Preço Médio de Venda"
                            value={formatNumber(precoMedioVenda)}
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
                            label="Margem Bruta Realizada (%)"
                            value={formatNumber(margemBruta)}
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
                            label="Venda Diária"
                            value={formatNumber(vendaDiaria)}
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
                            value={formatNumber(vendaMediaMensal)}
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
                            value={formatNumber(vendaMediaTrimestral)}
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
                            value={formatNumber(vendaMediaAnual)}
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
                            value={formatNumber(diasEstoque)}
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
                    <Box display="flex" gap="1rem">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<ShowChartIcon />}
                            onClick={() => setOpenGraph(true)}
                        >
                            Análise de Vendas
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<InfoIcon />}
                            onClick={() => setOpenClientAnalysis(true)}
                        >
                            Análise por Cliente
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<BarChartIcon />}
                            onClick={generatePDF}
                        >
                            Gerar PDF
                        </Button>
                    </Box>
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
                                    <TableCell align="center">{formatNumber(row[3])}</TableCell>
                                    <TableCell align="center">{`R$ ${formatNumber(row[4])}`}</TableCell>
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
            <Dialog open={openGraph} onClose={() => setOpenGraph(false)} maxWidth="md" fullWidth>
                <DialogTitle>Análise de Vendas</DialogTitle>
                <DialogContent>
                    <div>
                        <Line
                            ref={chartRef}
                            data={{
                                labels: graphData.map(item => item.name),
                                datasets: [
                                    {
                                        label: 'Valor de Vendas',
                                        data: graphData.map(item => item.value),
                                        borderColor: 'rgba(75, 192, 192, 1)',
                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Análise de Vendas por Mês',
                                    },
                                },
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={openClientAnalysis} onClose={() => setOpenClientAnalysis(false)} maxWidth="md" fullWidth>
                <DialogTitle>Análise por Cliente</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Cliente</StyledTableCell>
                                    <StyledTableCell>Total Comprado (Unidades)</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {clientData.slice(0, 10).map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <TableCell align="center">{row.client}</TableCell>
                                        <TableCell align="center">{formatNumber(row.total)}</TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </MainContainer>
    );
};

export default CalcularDiasEstoque;
