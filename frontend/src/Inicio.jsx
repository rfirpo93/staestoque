import React from 'react';
import { Box, Button, Typography, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import CalculateIcon from '@mui/icons-material/Calculate';
import SearchIcon from '@mui/icons-material/Search';
import ListIcon from '@mui/icons-material/List';
import InventoryIcon from '@mui/icons-material/Inventory';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import StorageIcon from '@mui/icons-material/Storage';
import AssessmentIcon from '@mui/icons-material/Assessment';
import logo from './assets/logo.png'; // Importando a imagem do logo

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

const ButtonContainer = styled(Box)`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 20px;
`;

const LogoContainer = styled(Box)`
  text-align: center;
`;

const Inicio = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [uploadAnchorEl, setUploadAnchorEl] = React.useState(null);
    const [stockAnchorEl, setStockAnchorEl] = React.useState(null);
    const [gerenciadorAnchorEl, setGerenciadorAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUploadClick = (event) => {
        setUploadAnchorEl(event.currentTarget);
    };

    const handleStockClick = (event) => {
        setStockAnchorEl(event.currentTarget);
    };

    const handleGerenciadorClick = (event) => {
        setGerenciadorAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setUploadAnchorEl(null);
        setStockAnchorEl(null);
        setGerenciadorAnchorEl(null);
    };

    return (
        <MainContainer>
            <ButtonContainer>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CalculateIcon />}
                    onClick={handleMenuClick}
                >
                    Cálculos de Oferta
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<SearchIcon />}
                    onClick={handleUploadClick}
                >
                    Consulta de Dados
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<PriceCheckIcon />}
                    component={Link}
                    to="/calcular-preco-venda"
                >
                    Calcular Preço de Venda
                </Button>
                <Button
                    variant="contained"
                    color="info"
                    startIcon={<StorageIcon />}
                    onClick={handleStockClick}
                >
                    Cálculos de Estoque
                </Button>
                <Button
                    variant="contained"
                    color="warning"
                    startIcon={<AssessmentIcon />}
                    onClick={handleGerenciadorClick}
                >
                    Gerenciador de Estoque
                </Button>
            </ButtonContainer>
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
            <Menu
                id="stock-menu"
                anchorEl={stockAnchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={Boolean(stockAnchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem component={Link} to="/calcular-dias-estoque" onClick={handleMenuClose} startIcon={<InventoryIcon />}>
                    Calcular Dias de Estoque com Base no Cardex
                </MenuItem>
            </Menu>
            <Menu
                id="gerenciador-menu"
                anchorEl={gerenciadorAnchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={Boolean(gerenciadorAnchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem component={Link} to="/analise-dias-estoque" onClick={handleMenuClose} startIcon={<InventoryIcon />}>
                    Análise de Dias de Estoque com Base na Venda Informada
                </MenuItem>
            </Menu>
            <LogoContainer>
                <img src={logo} alt="Logo Santa Clara" style={{ maxWidth: '100%', height: 'auto' }} />
                <Typography variant="h3" gutterBottom>
                    Bem-vindo à Tela Inicial
                </Typography>
            </LogoContainer>
        </MainContainer>
    );
};

export default Inicio;
