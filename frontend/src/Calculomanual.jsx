import React, { useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InfoIcon from '@mui/icons-material/Info';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
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

// Container principal estilizado
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

const FormContainer = styled(Box)`
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const RowContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const ResultContainer = styled(DialogContent)`
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  text-align: center;
  width: 100%; // Aumenta a largura para preencher toda a tela horizontalmente
`;

const ResultBox = styled(Box)`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 350px; // Aumentar a largura para evitar quebra de texto
  margin-top: 1rem;
  text-align: left;
`;

const ResultField = styled(Typography)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Calculomanual = () => {
    const [form, setForm] = useState({
        dataInicial: '',
        dataFinal: '',
        vendaTotal: '',
        custo: '',
        pmpf: '',
        margem: '',
        percentualImposto: '',
        estoqueAtual: '',
        vencimento: '',
        freteUnidade: '',
        comissaoPercentual: '',
        metaData: ''
    });

    const [result, setResult] = useState({
        vendaMediaDiaria: 0,
        vendaMediaMensal: 0,
        vendaMediaTrimestral: 0,
        vendaMediaAnual: 0,
        custo: 0,
        imposto: 0,
        frete: 0,
        comissao: 0,
        custoTotal: 0,
        precoVenda: 0,
        liquidoUnidade: 0,
        margemLiquida: 0,
        diasAteMeta: 0,
        vendaDiariaNecessaria: 0
    });

    const [open, setOpen] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleClear = () => {
        setForm({
            dataInicial: '',
            dataFinal: '',
            vendaTotal: '',
            custo: '',
            pmpf: '',
            margem: '',
            percentualImposto: '',
            estoqueAtual: '',
            vencimento: '',
            freteUnidade: '',
            comissaoPercentual: '',
            metaData: ''
        });
    };

    const formatNumber = (number) => {
        return number.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { dataInicial, dataFinal, vendaTotal, custo, pmpf, percentualImposto, freteUnidade, comissaoPercentual, margem, metaData, estoqueAtual } = form;
        const startDate = new Date(dataInicial);
        const endDate = new Date(dataFinal);
        const currentDate = new Date();
        const metaDate = new Date(metaData);

        const days = ((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Corrige o cálculo dos dias
        const diasAteMeta = ((metaDate - currentDate) / (1000 * 60 * 60 * 24)) + 1; // Calcula os dias até a data da meta
        const vendaDiariaNecessaria = estoqueAtual / diasAteMeta;

        const vendaMediaDiaria = vendaTotal / days;
        const vendaMediaMensal = vendaMediaDiaria * 30;
        const vendaMediaTrimestral = vendaMediaDiaria * 90;
        const vendaMediaAnual = vendaMediaDiaria * 365;
        const imposto = (pmpf * percentualImposto) / 100;
        const frete = parseFloat(freteUnidade);
        const custoTotal = parseFloat(custo) + frete + imposto + ((parseFloat(custo) + imposto + frete) * comissaoPercentual) / 100;
        const precoVenda = parseFloat(custo) + frete + imposto + ((parseFloat(custo) + frete + imposto) * (margem / 100));
        const liquidoUnidade = precoVenda - custoTotal;
        const margemLiquida = (liquidoUnidade / precoVenda) * 100;

        setResult({
            vendaMediaDiaria,
            vendaMediaMensal,
            vendaMediaTrimestral,
            vendaMediaAnual,
            custo: parseFloat(custo),
            imposto,
            frete,
            comissao: (parseFloat(custo) + imposto + frete) * comissaoPercentual / 100,
            custoTotal,
            precoVenda,
            liquidoUnidade,
            margemLiquida,
            diasAteMeta,
            vendaDiariaNecessaria
        });

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <MainContainer>
                <FormContainer
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h4" gutterBottom>
                        Preencha com as informações do Cardex
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <RowContainer>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="dataInicial"
                                label="Data Inicial Cardex"
                                name="dataInicial"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarTodayIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                value={form.dataInicial}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="dataFinal"
                                label="Data Final Cardex"
                                name="dataFinal"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarTodayIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                value={form.dataFinal}
                                onChange={handleChange}
                            />
                        </RowContainer>
                        <RowContainer>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="estoqueAtual"
                                label="Estoque Atual"
                                name="estoqueAtual"
                                type="number"
                                value={form.estoqueAtual}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="vencimento"
                                label="Vencimento"
                                name="vencimento"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={form.vencimento}
                                onChange={handleChange}
                            />
                        </RowContainer>
                        <RowContainer>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="custo"
                                label="Custo"
                                name="custo"
                                type="number"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AttachMoneyIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                value={form.custo}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="pmpf"
                                label="PMPF"
                                name="pmpf"
                                type="number"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AttachMoneyIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                value={form.pmpf}
                                onChange={handleChange}
                            />
                        </RowContainer>
                        <RowContainer>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="margem"
                                label="Margem Desejada (%)"
                                name="margem"
                                type="number"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            %
                                        </InputAdornment>
                                    ),
                                }}
                                value={form.margem}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="percentualImposto"
                                label="Percentual de Imposto"
                                name="percentualImposto"
                                type="number"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            %
                                        </InputAdornment>
                                    ),
                                }}
                                value={form.percentualImposto}
                                onChange={handleChange}
                            />
                        </RowContainer>
                        <RowContainer>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="freteUnidade"
                                label="Custo de Frete por Unidade"
                                name="freteUnidade"
                                type="number"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocalShippingIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                value={form.freteUnidade}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="comissaoPercentual"
                                label="Percentual de Comissão"
                                name="comissaoPercentual"
                                type="number"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            %
                                        </InputAdornment>
                                    ),
                                }}
                                value={form.comissaoPercentual}
                                onChange={handleChange}
                            />
                        </RowContainer>
                        <RowContainer>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="vendaTotal"
                                label="Venda Total Cardex (Unidades)"
                                name="vendaTotal"
                                type="number"
                                value={form.vendaTotal}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="metaData"
                                label="Meta (Vender até Data)"
                                name="metaData"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarTodayIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                value={form.metaData}
                                onChange={handleChange}
                            />
                        </RowContainer>
                        <RowContainer>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Calcular
                            </Button>
                            <Button
                                type="button"
                                fullWidth
                                variant="outlined"
                                color="secondary"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleClear}
                            >
                                Limpar Formulário
                            </Button>
                        </RowContainer>
                    </Box>
                </FormContainer>

                <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
                    <DialogTitle>
                        <Box display="flex" alignItems="center">
                            <InfoIcon sx={{ mr: 1 }} />
                            Resultados do Cálculo
                        </Box>
                    </DialogTitle>
                    <ResultContainer>
                        <ResultBox component={motion.div} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ borderColor: 'blue', color: 'blue' }}>
                            <Typography variant="h6" gutterBottom>
                                Venda Média
                            </Typography>
                            <ResultField>
                                <BarChartIcon />
                                <Typography>Venda Média Diária: {formatNumber(result.vendaMediaDiaria)}</Typography>
                            </ResultField>
                            <ResultField>
                                <BarChartIcon />
                                <Typography>Venda Média Mensal: {formatNumber(result.vendaMediaMensal)}</Typography>
                            </ResultField>
                            <ResultField>
                                <BarChartIcon />
                                <Typography>Venda Média Trimestral: {formatNumber(result.vendaMediaTrimestral)}</Typography>
                            </ResultField>
                            <ResultField>
                                <BarChartIcon />
                                <Typography>Venda Média Anual: {formatNumber(result.vendaMediaAnual)}</Typography>
                            </ResultField>
                        </ResultBox>
                        <ResultBox component={motion.div} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} sx={{ borderColor: 'red', color: 'red' }}>
                            <Typography variant="h6" gutterBottom>
                                Custos
                            </Typography>
                            <ResultField>
                                <AttachMoneyIcon />
                                <Typography>Custo: R$ {formatNumber(result.custo)}</Typography>
                            </ResultField>
                            <ResultField>
                                <AccountBalanceIcon />
                                <Typography>Imposto: R$ {formatNumber(result.imposto)}</Typography>
                            </ResultField>
                            <ResultField>
                                <LocalShippingIcon />
                                <Typography>Frete: R$ {formatNumber(result.frete)}</Typography>
                            </ResultField>
                            <ResultField>
                                <AttachMoneyIcon />
                                <Typography>Comissão: R$ {formatNumber(result.comissao)}</Typography>
                            </ResultField>
                            <ResultField>
                                <AttachMoneyIcon />
                                <Typography>Custo Total: R$ {formatNumber(result.custoTotal)}</Typography>
                            </ResultField>
                        </ResultBox>
                        <ResultBox component={motion.div} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} sx={{ borderColor: 'green', color: 'green' }}>
                            <Typography variant="h6" gutterBottom>
                                Preço de Venda e Margem Líquida
                            </Typography>
                            <ResultField>
                                <AttachMoneyIcon />
                                <Typography>Margem Bruta: {formatNumber(form.margem)}%</Typography>
                            </ResultField>
                            <ResultField>
                                <AttachMoneyIcon />
                                <Typography>Preço de Venda: R$ {formatNumber(result.precoVenda)}</Typography>
                            </ResultField>
                            <ResultField>
                                <AttachMoneyIcon />
                                <Typography>R$ Líquido por Unidade: R$ {formatNumber(result.liquidoUnidade)}</Typography>
                            </ResultField>
                            <ResultField>
                                <AttachMoneyIcon />
                                <Typography>Margem Líquida: {formatNumber(result.margemLiquida)}%</Typography>
                            </ResultField>
                        </ResultBox>
                        <ResultBox component={motion.div} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} sx={{ borderColor: 'purple', color: 'purple' }}>
                            <Typography variant="h6" gutterBottom>
                                Meta
                            </Typography>
                            <ResultField>
                                <CalendarTodayIcon />
                                <Typography>Dias até a data limite: {result.diasAteMeta}</Typography>
                            </ResultField>
                            <ResultField>
                                <BarChartIcon />
                                <Typography>Venda diária necessária: {formatNumber(result.vendaDiariaNecessaria)}</Typography>
                            </ResultField>
                        </ResultBox>
                    </ResultContainer>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Fechar
                        </Button>
                    </DialogActions>
                </Dialog>
            </MainContainer>
        </ThemeProvider>
    );
};

export default Calculomanual;
