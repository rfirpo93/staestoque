import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Avatar, Alert, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styled from '@emotion/styled';
import Inicio from './Inicio';
import Calculomanual from './Calculomanual';
import UploadPMPF from './UploadPMPF';
import Estoque from './Estoque';
import CalcularPrecoVenda from './CalcularPrecoVenda';
import CalcularDiasEstoque from './CalcularDiasEstoque';
import AnaliseDiasEstoque from './AnaliseDiasEstoque';
import Valorestoquexcusto from './Valorestoquexcusto';
import Valorestoquexvenda from './Valorestoquexvenda';

// Definindo o tema inspirado nas cores do logo
const theme = createTheme({
    palette: {
        mode: 'light', // Adicionando modo claro explicitamente
        primary: {
            main: '#0d6efd', // Azul principal
        },
        secondary: {
            main: '#6c757d', // Cinza secundário
        },
        background: {
            default: '#e0e0e0',
            paper: '#ffffff',
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
  width: 100vw; // Preencher horizontalmente
  padding: 0; // Remover padding padrão do Container
  margin: 0; // Remover margin padrão do Container
`;

// Container de login estilizado
const LoginContainer = styled(Box)`
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const users = {
            'Raul': '221193',
            'Monica': 'monica123',
            'Adriana': 'adriana123',
            'Anderson': 'anderson123',
            'Santa Clara': 'santaclara'
        };
        if (users[username] && users[username] === password) {
            navigate('/inicio');
        } else {
            setError('Usuário ou senha incorretos');
        }
    };

    return (
        <MainContainer>
            <LoginContainer
                component={motion.div}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Nome de Usuário"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Senha"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Entrar
                        </Button>
                    </Box>
                </Box>
            </LoginContainer>
        </MainContainer>
    );
};

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/inicio" element={<Inicio />} />
                    <Route path="/calculo" element={<Calculomanual />} />
                    <Route path="/upload-pmpf" element={<UploadPMPF />} />
                    <Route path="/consultar-estoque" element={<Estoque />} />
                    <Route path="/calcular-preco-venda" element={<CalcularPrecoVenda />} />
                    <Route path="/calcular-dias-estoque" element={<CalcularDiasEstoque />} />
                    <Route path="/analise-dias-estoque" element={<AnaliseDiasEstoque />} />
                    <Route path="/estoquexcusto" element={<Valorestoquexcusto />} />
                    <Route path="/valorestoquexvenda" element={<Valorestoquexvenda />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
