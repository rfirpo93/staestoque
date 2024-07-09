import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Avatar, Alert, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
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
import ImportarVenda from './ImportarVenda'; // Importando o componente de Importar Venda

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
                    <Avatar sx={{ m: 1, bgcolor: '#0d6efd' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" style={{ fontFamily: 'Segoe UI', color: '#0078d4' }}>
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
                            style={{ backgroundColor: '#0d6efd', color: '#fff' }}
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
                <Route path="/importar-venda" element={<ImportarVenda />} /> {/* Adicionando a rota de Importar Venda */}
            </Routes>
        </Router>
    );
};

// Componente ErrorBoundary para capturar e logar erros
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        console.log("Error caught in ErrorBoundary:", error);
        this.setState({
            hasError: true,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
    }
}

export default App;
