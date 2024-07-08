import React, { useState } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import styled from '@emotion/styled';

// Estilização para o container principal
const MainContainer = styled(Box)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(145deg, #e0e0e0, #ffffff);
  padding: 20px;
`;

const CalcularDiasEstoque = () => {
    try {
        const [vendas, setVendas] = useState('');
        const [estoque, setEstoque] = useState('');
        const [dias, setDias] = useState(null);

        const calcularDias = () => {
            if (vendas && estoque) {
                setDias((parseFloat(estoque) / parseFloat(vendas)).toFixed(2));
            } else {
                setDias(null);
            }
        };

        return (
            <MainContainer>
                <Typography variant="h4" gutterBottom>
                    Calcular Dias de Estoque
                </Typography>
                <TextField
                    label="Vendas Diárias"
                    value={vendas}
                    onChange={(e) => setVendas(e.target.value)}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label="Estoque Atual"
                    value={estoque}
                    onChange={(e) => setEstoque(e.target.value)}
                    margin="normal"
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={calcularDias}
                    sx={{ mt: 2 }}
                >
                    Calcular
                </Button>
                {dias !== null && (
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Dias de Estoque: {dias}
                    </Typography>
                )}
            </MainContainer>
        );
    } catch (error) {
        console.error('Error in CalcularDiasEstoque:', error);
        return <h1>Algo deu errado.</h1>;
    }
};

export default CalcularDiasEstoque;
