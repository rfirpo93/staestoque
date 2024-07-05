import React from 'react';
import { Box, Button, Typography, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import CalculateIcon from '@mui/icons-material/Calculate';
import SearchIcon from '@mui/icons-material/Search';
import ListIcon from '@mui/icons-material/List';
import InventoryIcon from '@mui/icons-material/Inventory';

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

const MenuButton = styled(Button)`
  position: absolute;
  top: 10px;
  left: 10px;
  transform: scale(1.5); // Aumenta o tamanho do botão
`;

const UploadButton = styled(Button)`
  position: absolute;
  top: 10px;
  left: 200px;
  transform: scale(1.5); // Aumenta o tamanho do botão
`;

const Inicio = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [uploadAnchorEl, setUploadAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUploadClick = (event) => {
        setUploadAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setUploadAnchorEl(null);
    };

    return (
        <MainContainer>
            <MenuButton
                variant="contained"
                color="primary"
                startIcon={<CalculateIcon />}
                onClick={handleMenuClick}
            >
                Cálculos de Oferta
            </MenuButton>
            <UploadButton
                variant="contained"
                color="secondary"
                startIcon={<SearchIcon />}
                onClick={handleUploadClick}
            >
                Consulta de Dados
            </UploadButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem component={Link} to="/calculo" onClick={handleMenuClose}>
                    Cálculo Manual de Vencimento x Venda x Margem
                </MenuItem>
            </Menu>
            <Menu
                id="upload-menu"
                anchorEl={uploadAnchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={Boolean(uploadAnchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem component={Link} to="/upload-pmpf" onClick={handleMenuClose} startIcon={<ListIcon />}>
                    Consultar lista PMPF
                </MenuItem>
                <MenuItem component={Link} to="/consultar-estoque" onClick={handleMenuClose} startIcon={<InventoryIcon />}>
                    Consultar estoque de produtos
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
