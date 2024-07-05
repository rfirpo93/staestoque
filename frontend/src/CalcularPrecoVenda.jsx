import React from 'react';
import { Box, Typography } from '@mui/material';
import styled from '@emotion/styled';

// Definindo o tema inspirado nas cores do logo
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

const CalcularPrecoVenda = () => {
    return (
        <MainContainer>
            <Typography variant="h4">
                Página de Calcular Preço de Venda
            </Typography>
        </MainContainer>
    );
};

export default CalcularPrecoVenda;
