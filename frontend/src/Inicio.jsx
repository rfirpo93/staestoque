import React from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

// Container principal estilizado
const MainContainer = styled(Container)`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(145deg, #e0e0e0, #ffffff);
  width: 100vw; // Preencher horizontalmente
  padding: 0; // Remover padding padrão do Container
  margin: 0; // Remover margin padrão do Container
`;

const Inicio = () => {
    return (
        <MainContainer>
            <Box textAlign="center">
                <Typography variant="h3" gutterBottom>
                    Bem-vindo à Tela Inicial
                </Typography>
                <Button component={Link} to="/calculo" variant="contained" color="primary">
                    Cálculo Manual de Vencimento x Venda x Margem
                </Button>
            </Box>
        </MainContainer>
    );
};

export default Inicio;
