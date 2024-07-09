import React from 'react';
import { Box, Typography } from '@mui/material';
import styled from '@emotion/styled';

const MainContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(145deg, #e0e0e0, #ffffff);
`;

const ImportarVenda = () => {
    return (
        <MainContainer>
            <Typography variant="h4" gutterBottom align="center" style={{ fontFamily: 'Segoe UI', color: '#0078d4' }}>
                Importar Venda
            </Typography>
            {/* Adicione o conteúdo para importar venda aqui */}
        </MainContainer>
    );
};

export default ImportarVenda;
