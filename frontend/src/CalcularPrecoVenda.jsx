import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalculateIcon from '@mui/icons-material/Calculate';
import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';

const MainContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(145deg, #e0e0e0, #ffffff);
`;

const FormContainer = styled(Box)`
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  max-width: 800px;
  width: 100%;
  text-align: center;
`;

const RowContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const TableContainerStyled = styled(TableContainer)`
  margin-top: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const ResultContainer = styled(DialogContent)`
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  text-align: center;
  width: 100%;
`;

const ResultBox = styled(Box)`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 350px;
  margin-top: 1rem;
  text-align: left;
`;

const ResultField = styled(Typography)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const CalcularPrecoVenda = () => {
    const [produto, setProduto] = useState('');
    const [pmpf, setPmpf] = useState('');
    const [valorST, setValorST] = useState('');
    const [custoFrete, setCustoFrete] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [margem, setMargem] = useState('');
    const [comissao, setComissao] = useState('');
    const [custo, setCusto] = useState('');
    const [produtoDialogOpen, setProdutoDialogOpen] = useState(false);
    const [pmpfDialogOpen, setPmpfDialogOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [filters, setFilters] = useState({ descricao: '', pmpf: '' });
    const [produtoFilters, setProdutoFilters] = useState({ produto: '', quantidade: '', custo: '' });
    const [result, setResult] = useState({});
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const url = 'https://raw.githubusercontent.com/rfirpo93/staestoque/main/backend/estoque.xlsx';

        fetch(url)
            .then(response => response.arrayBuffer())
            .then(data => {
                const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);

                const formattedRows = json.map(row => ({
                    produto: row['Produto'] ? row['Produto'].toString() : '',
                    quantidade: row['Quantidade'] ? row['Quantidade'].toString() : '',
                    custo: row['Custo'] ? row['Custo'].toString() : ''
                }));

                setRows(formattedRows);
                console.log('Dados carregados:', formattedRows);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleProdutoFilterChange = (e) => {
        const { name, value } = e.target;
        setProdutoFilters({
            ...produtoFilters,
            [name]: value,
        });
    };

    const handlePmpfFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleProdutoDialogOpen = () => {
        setProdutoDialogOpen(true);
    };

    const handleProdutoDialogClose = () => {
        setProdutoDialogOpen(false);
    };

    const handlePmpfDialogOpen = () => {
        setPmpfDialogOpen(true);
    };

    const handlePmpfDialogClose = () => {
        setPmpfDialogOpen(false);
    };

    const handleProdutoRowDoubleClick = (row) => {
        setProduto(row.produto);
        setCusto(row.custo);
        setProdutoDialogOpen(false);
    };

    const handlePmpfRowDoubleClick = (row) => {
        setPmpf(row.pmpf);
        setValorST((parseFloat(row.pmpf) * 0.17).toFixed(2));
        setPmpfDialogOpen(false);
    };

    const filteredProdutoRows = rows.filter(row =>
        (row.produto || '').toLowerCase().includes(produtoFilters.produto.toLowerCase()) &&
        (row.quantidade || '').toLowerCase().includes(produtoFilters.quantidade.toLowerCase()) &&
        (row.custo || '').toLowerCase().includes(produtoFilters.custo.toLowerCase())
    );

    const filteredPmpfRows = rows.filter(row =>
        (row.descricao || '').toLowerCase().includes(filters.descricao.toLowerCase()) &&
        (row.pmpf || '').toLowerCase().includes(filters.pmpf.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const custoNumber = parseFloat(custo);
        const custoFreteNumber = parseFloat(custoFrete);
        const margemNumber = parseFloat(margem);
        const comissaoNumber = parseFloat(comissao);
        const quantidadeNumber = parseFloat(quantidade);
        const valorSTNumber = parseFloat(valorST);

        const precoVendaSemST = custoNumber + custoFreteNumber + (custoNumber * (margemNumber / 100));
        const comissaoReaisPorUnidade = precoVendaSemST * (comissaoNumber / 100);
        const margemLiquida = ((precoVendaSemST - custoNumber - custoFreteNumber - comissaoReaisPorUnidade) / custoNumber) * 100;
        const precoVendaComST = precoVendaSemST + valorSTNumber;
        const valorLiquidoPorUnidade = precoVendaSemST - custoNumber - custoFreteNumber - comissaoReaisPorUnidade;
        const valorTotalPedido = valorLiquidoPorUnidade * quantidadeNumber;
        const valorComissaoTotalPedido = comissaoReaisPorUnidade * quantidadeNumber;

        setResult({
            precoVendaSemST,
            comissao: comissaoNumber,
            comissaoReaisPorUnidade,
            margemLiquida,
            precoVendaComST,
            valorLiquidoPorUnidade,
            valorTotalPedido,
            valorComissaoTotalPedido
        });

        setOpen(true);
    };

    const handleClear = () => {
        setProduto('');
        setPmpf('');
        setValorST('');
        setCustoFrete('');
        setQuantidade('');
        setMargem('');
        setComissao('');
        setCusto('');
    };

    const handleClose = () => {
        setOpen(false);
    };

    const formatNumber = (number) => {
        if (number === undefined) return "N/A";
        return number.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <MainContainer>
            <FormContainer component={motion.div} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <Typography variant="h4" gutterBottom>
                    Calcular Preço de Venda
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="produto"
                        label="Produto"
                        name="produto"
                        value={produto}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={handleProdutoDialogOpen} variant="contained" color="primary" size="small">
                                    Selecionar Produto
                                </Button>
                            ),
                        }}
                    />
                    <RowContainer>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="pmpf"
                            label="PMPF"
                            name="pmpf"
                            value={pmpf}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        R$
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <Button onClick={handlePmpfDialogOpen} variant="contained" color="primary" size="small">
                                        Selecionar Referência
                                    </Button>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="valorST"
                            label="Valor ST"
                            name="valorST"
                            value={valorST}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        R$
                                    </InputAdornment>
                                ),
                            }}
                            disabled
                        />
                    </RowContainer>
                    <RowContainer>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="custoFrete"
                            label="Custo de Frete por Unidade"
                            name="custoFrete"
                            value={custoFrete}
                            onChange={(e) => setCustoFrete(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        R$
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="quantidade"
                            label="Quantidade"
                            name="quantidade"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        un
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </RowContainer>
                    <RowContainer>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="margem"
                            label="Margem Desejada"
                            name="margem"
                            value={margem}
                            onChange={(e) => setMargem(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        %
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="comissao"
                            label="Comissão"
                            name="comissao"
                            value={comissao}
                            onChange={(e) => setComissao(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        %
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </RowContainer>
                    <RowContainer>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            startIcon={<CalculateIcon />}
                        >
                            Calcular Preço de Venda
                        </Button>
                        <Button
                            type="button"
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleClear}
                            startIcon={<ClearIcon />}
                        >
                            Limpar Formulário
                        </Button>
                    </RowContainer>
                </Box>
            </FormContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <InfoIcon sx={{ mr: 1 }} />
                        Resultados do Cálculo
                    </Box>
                </DialogTitle>
                <ResultContainer>
                    <ResultBox component={motion.div} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} sx={{ borderColor: 'blue', color: 'blue' }}>
                        <Typography variant="h6" gutterBottom>
                            Preço de Venda sem ST
                        </Typography>
                        <ResultField>
                            <Typography>Preço de Venda sem ST: R$ {formatNumber(result.precoVendaSemST)}</Typography>
                        </ResultField>
                    </ResultBox>
                    <ResultBox component={motion.div} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} sx={{ borderColor: 'green', color: 'green' }}>
                        <Typography variant="h6" gutterBottom>
                            Comissão
                        </Typography>
                        <ResultField>
                            <Typography>Comissão: {result.comissao}%</Typography>
                        </ResultField>
                        <ResultField>
                            <Typography>Comissão em reais por unidade: R$ {formatNumber(result.comissaoReaisPorUnidade)}</Typography>
                        </ResultField>
                    </ResultBox>
                    <ResultBox component={motion.div} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} sx={{ borderColor: 'purple', color: 'purple' }}>
                        <Typography variant="h6" gutterBottom>
                            Margem Líquida
                        </Typography>
                        <ResultField>
                            <Typography>Margem Líquida: {formatNumber(result.margemLiquida)}%</Typography>
                        </ResultField>
                    </ResultBox>
                    <ResultBox component={motion.div} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} sx={{ borderColor: 'red', color: 'red' }}>
                        <Typography variant="h6" gutterBottom>
                            Preço de Venda com ST
                        </Typography>
                        <ResultField>
                            <Typography>Preço de Venda com ST: R$ {formatNumber(result.precoVendaComST)}</Typography>
                        </ResultField>
                    </ResultBox>
                    <ResultBox component={motion.div} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} sx={{ borderColor: 'orange', color: 'orange' }}>
                        <Typography variant="h6" gutterBottom>
                            Valor Líquido por Unidade
                        </Typography>
                        <ResultField>
                            <Typography>Valor Líquido por Unidade: R$ {formatNumber(result.valorLiquidoPorUnidade)}</Typography>
                        </ResultField>
                    </ResultBox>
                    <ResultBox component={motion.div} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0 }} sx={{ borderColor: 'yellow', color: 'yellow' }}>
                        <Typography variant="h6" gutterBottom>
                            Valor Total do Pedido
                        </Typography>
                        <ResultField>
                            <Typography>Valor Total do Pedido: R$ {formatNumber(result.valorTotalPedido)}</Typography>
                        </ResultField>
                    </ResultBox>
                    <ResultBox component={motion.div} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1 }} sx={{ borderColor: 'brown', color: 'brown' }}>
                        <Typography variant="h6" gutterBottom>
                            Valor da Comissão Total do Pedido
                        </Typography>
                        <ResultField>
                            <Typography>Valor da Comissão Total do Pedido: R$ {formatNumber(result.valorComissaoTotalPedido)}</Typography>
                        </ResultField>
                    </ResultBox>
                </ResultContainer>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={produtoDialogOpen} onClose={handleProdutoDialogClose} maxWidth="lg" fullWidth>
                <DialogTitle>Selecionar Produto</DialogTitle>
                <DialogContent>
                    <TableContainerStyled component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            placeholder="Produto"
                                            name="produto"
                                            value={produtoFilters.produto}
                                            onChange={handleProdutoFilterChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                                style: { backgroundColor: 'white', borderRadius: 4 }
                                            }}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            placeholder="Quantidade"
                                            name="quantidade"
                                            value={produtoFilters.quantidade}
                                            onChange={handleProdutoFilterChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                                style: { backgroundColor: 'white', borderRadius: 4 }
                                            }}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            placeholder="Custo"
                                            name="custo"
                                            value={produtoFilters.custo}
                                            onChange={handleProdutoFilterChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                                style: { backgroundColor: 'white', borderRadius: 4 }
                                            }}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProdutoRows.map((row, index) => (
                                    <TableRow key={index} onDoubleClick={() => handleProdutoRowDoubleClick(row)}>
                                        <TableCell align="center">{row.produto}</TableCell>
                                        <TableCell align="center">{row.quantidade}</TableCell>
                                        <TableCell align="center">{row.custo}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainerStyled>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleProdutoDialogClose} color="primary">
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={pmpfDialogOpen} onClose={handlePmpfDialogClose} maxWidth="lg" fullWidth>
                <DialogTitle>Selecionar Referência PMPF</DialogTitle>
                <DialogContent>
                    <TableContainerStyled component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            placeholder="Descrição"
                                            name="descricao"
                                            value={filters.descricao}
                                            onChange={handlePmpfFilterChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                                style: { backgroundColor: 'white', borderRadius: 4 }
                                            }}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            placeholder="PMPF"
                                            name="pmpf"
                                            value={filters.pmpf}
                                            onChange={handlePmpfFilterChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                                style: { backgroundColor: 'white', borderRadius: 4 }
                                            }}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredPmpfRows.map((row, index) => (
                                    <TableRow key={index} onDoubleClick={() => handlePmpfRowDoubleClick(row)}>
                                        <TableCell align="center">{row.descricao}</TableCell>
                                        <TableCell align="center">{row.pmpf}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainerStyled>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePmpfDialogClose} color="primary">
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </MainContainer>
    );
};

export default CalcularPrecoVenda;
