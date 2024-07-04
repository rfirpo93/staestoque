import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
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

const Calculomanual = () => {
    const [form, setForm] = useState({
        dataInicial: '',
        dataFinal: '',
        vendaTotal: '',
        custo: '',
        margem: '',
        estoqueAtual: '',
        vencimento: '',
        freteUnidade: '',
        comissaoPercentual: ''
    });

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
            margem: '',
            estoqueAtual: '',
            vencimento: '',
            freteUnidade: '',
            comissaoPercentual: ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica de cálculo aqui
        console.log('Cálculo realizado', form);
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
                                            <AttachMoneyIcon />
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
            </MainContainer>
        </ThemeProvider>
    );
};

export default Calculomanual;
