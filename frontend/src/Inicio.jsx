import React from 'react';
import { Box, Button, Typography, Menu, MenuItem, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import CalculateIcon from '@mui/icons-material/Calculate';
import SearchIcon from '@mui/icons-material/Search';
import ListIcon from '@mui/icons-material/List';
import InventoryIcon from '@mui/icons-material/Inventory';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import StorageIcon from '@mui/icons-material/Storage';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FileUploadIcon from '@mui/icons-material/FileUpload';
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

const SectionContainer = styled(Box)`
  margin-top: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  padding: 2rem;
  width: 80%;
`;

const LogoContainer = styled(Box)`
  text-align: center;
`;

const Inicio = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [uploadAnchorEl, setUploadAnchorEl] = React.useState(null);
    const [stockAnchorEl, setStockAnchorEl] = React.useState(null);
    const [gerenciadorAnchorEl, setGerenciadorAnchorEl] = React.useState(null);
    const [configurarAnchorEl, setConfigurarAnchorEl] = React.useState(null);

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

    const handleConfigurarClick = (event) => {
        setConfigurarAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setUploadAnchorEl(null);
        setStockAnchorEl(null);
        setGerenciadorAnchorEl(null);
        setConfigurarAnchorEl(null);
    };

    return (
        <MainContainer>
            <ButtonContainer>
                <Button
                    variant="contained"
                    style={{ backgroundColor: '#0d6efd', color: '#fff' }}
                    startIcon={<CalculateIcon />}
                    onClick={handleMenuClick}
                >
                    Cálculos de Oferta
                </Button>
                <Button
                    variant="contained"
                    style={{ backgroundColor: '#6c757d', color: '#fff' }}
                    startIcon={<SearchIcon />}
                    onClick={handleUploadClick}
                >
                    Consulta de Dados
                </Button>
                <Button
                    variant="contained"
                    style={{ backgroundColor: '#28a745', color: '#fff' }}
                    startIcon={<PriceCheckIcon />}
                    component={Link}
                    to="/calcular-preco-venda"
                >
                    Calcular Preço de Venda
                </Button>
                <Button
                    variant="contained"
                    style={{ backgroundColor: '#17a2b8', color: '#fff' }}
                    startIcon={<StorageIcon />}
                    onClick={handleStockClick}
                >
                    Cálculos de Estoque
                </Button>
                <Button
                    variant="contained"
                    style={{ backgroundColor: '#ffc107', color: '#fff' }}
                    startIcon={<AssessmentIcon />}
                    onClick={handleGerenciadorClick}
                >
                    Gerenciador de Estoque
                </Button>
                <Button
                    variant="contained"
                    style={{ backgroundColor: '#6c757d', color: '#fff' }}
                    startIcon={<SettingsIcon />}
                    onClick={handleConfigurarClick}
                >
                    Configurar Produtos
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
                <MenuItem component={Link} to="/estoquexcusto" onClick={handleMenuClose} startIcon={<InventoryIcon />}>
                    Análise de Valor em Estoque por Custo
                </MenuItem>
                <MenuItem component={Link} to="/valorestoquexvenda" onClick={handleMenuClose} startIcon={<InventoryIcon />}>
                    Análise de Valor em Estoque por Preço de Venda
                </MenuItem>
            </Menu>
            <Menu
                id="configurar-menu"
                anchorEl={configurarAnchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={Boolean(configurarAnchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem component={Link} to="/vincular-codigos" onClick={handleMenuClose} startIcon={<InventoryIcon />}>
                    Vincular Códigos a Produto
                </MenuItem>
            </Menu>
            <LogoContainer>
                <img src={logo} alt="Logo Santa Clara" style={{ maxWidth: '100%', height: 'auto' }} />
            </LogoContainer>
            <SectionContainer>
                <Typography variant="h4" gutterBottom align="center" style={{ fontFamily: 'Segoe UI', color: '#0078d4' }}>
                    Área de Vendas
                </Typography>
                <List>
                    <ListItem button component={Link} to="/importar-venda">
                        <ListItemIcon>
                            <FileUploadIcon />
                        </ListItemIcon>
                        <ListItemText primary="Importar Venda" />
                    </ListItem>
                </List>
            </SectionContainer>
        </MainContainer>
    );
};

export default Inicio;
