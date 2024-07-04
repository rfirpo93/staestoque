import React from 'react';
import { Container, Box, Button, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import MenuIcon from '@mui/icons-material/Menu';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
  left: 150px;
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
                startIcon={<MenuIcon />}
                onClick={handleMenuClick}
            >
                Menu
            </MenuButton>
            <UploadButton
                variant="contained"
                color="secondary"
                startIcon={<CloudUploadIcon />}
                onClick={handleUploadClick}
            >
                Upload de Dados
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
                <MenuItem component={Link} to="/upload-pmpf" onClick={handleMenuClose}>
                    Subir lista PMPF
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
