import React from 'react';
import { Container, Box, Button, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import MenuIcon from '@mui/icons-material/Menu';

// Container principal estilizado
const MainContainer = styled(Box)`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(145deg, #e0e0e0, #ffffff);
  width: 100vw; // Preencher horizontalmente
  padding: 0; // Remover padding padrão do Container
  margin: 0; // Remover margin padrão do Container
`;

const MenuButton = styled(IconButton)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Inicio = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <MainContainer>
            <MenuButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
            >
                <MenuIcon />
            </MenuButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem component={Link} to="/calculo" onClick={handleMenuClose}>
                    Cálculo Manual de Vencimento x Venda x Margem
                </MenuItem>
            </Menu>
            <Box textAlign="center">
                <Typography variant="h3" gutterBottom>
                    Bem-vindo à Tela Inicial
                </Typography>
            </Box>
        </MainContainer>
    );
};

export default Inicio;
