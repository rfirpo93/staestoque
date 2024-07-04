import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Avatar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styled from '@emotion/styled';

// Definindo o tema inspirado nas cores do logo
const theme = createTheme({
    palette: {
        primary: {
            main: '#0d6efd', // Azul principal
        },
        secondary: {
            main: '#6c757d', // Cinza secundário
        },
    },
});

// Container principal estilizado
const MainContainer = styled(Container)`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(145deg, #e0e0e0, #ffffff);
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

const App = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

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
            alert('Login bem-sucedido!');
        } else {
            setError('Usuário ou senha incorretos');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <MainContainer maxWidth="sm">
                    <LoginContainer
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                        >
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
            </Router>
        </ThemeProvider>
    );
};

export default App;
