import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Menu, MenuItem } from '@mui/material';
import * as XLSX from 'xlsx';
import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InventoryIcon from '@mui/icons-material/Inventory';
import CodeIcon from '@mui/icons-material/Code';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import SortIcon from '@mui/icons-material/Sort';

const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const MainContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(145deg, #f3f4f6, #e0e0e0);
`;

const TableContainerStyled = styled(Paper)`
  margin-top: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  width: 90%;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const StyledTh = styled.th`
  background-color: #0078d4;
  color: white;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  position: relative;
  &:hover {
    background-color: #005a9e;
  }
`;

const StyledTd = styled.td`
  text-align: center;
  padding: 10px;
  &:nth-of-type(odd) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #e0f7fa;
  }
`;

const FilterInput = styled(TextField)`
  width: 100%;
  margin-bottom: 5px;
`;

const TitleContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 20px;
  width: 90%;
`;

const TitleIcon = styled(InventoryIcon)`
  font-size: 2.5rem;
  color: #0078d4;
  animation: rotate 2s infinite linear;

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const TotalValueContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0078d4;
  color: white;
  padding: 10px;
  border-radius: 10px;
  font-weight: bold;
`;

const Valorestoquexvenda = () => {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleSortClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSortClose = () => {
        setAnchorEl(null);
    };

    const handleSort = (sortBy) => {
        setRows([...rows].sort(sortBy));
        handleSortClose();
    };

    useEffect(() => {
        const fetchData = async () => {
            const url = 'https://raw.githubusercontent.com/rfirpo93/staestoque/main/backend/estoquevenda.xlsx';

            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);

            const filteredRows = json.filter(row => row['Quantidade'] > 0);
            const totalValue = filteredRows.reduce((sum, row) => sum + (row['Quantidade'] * row['Preço Venda']), 0);

            setRows(filteredRows);
            setTotal(totalValue);
        };

        fetchData().catch(console.error);
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Código',
                accessor: 'Código',
                Filter: ColumnFilter,
                filter: 'text',
                icon: <CodeIcon />
            },
            {
                Header: 'Produto',
                accessor: 'Produto',
                Filter: ColumnFilter,
                filter: 'text',
                icon: <ShoppingCartIcon />
            },
            {
                Header: 'Quantidade',
                accessor: 'Quantidade',
                Filter: ColumnFilter,
                filter: 'text',
                icon: <FormatListNumberedIcon />
            },
            {
                Header: 'Preço Venda',
                accessor: 'Preço Venda',
                Filter: ColumnFilter,
                filter: 'text',
                icon: <AttachMoneyIcon />
            },
            {
                Header: 'Valor Total',
                accessor: row => (row['Quantidade'] * row['Preço Venda']).toFixed(2),
                id: 'ValorTotal',
                Filter: ColumnFilter,
                filter: 'text',
                icon: <ReceiptIcon />
            },
        ],
        []
    );

    const data = React.useMemo(() => rows, [rows]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows: tableRows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
        },
        useFilters
    );

    const sortByOptions = [
        { label: 'Código, do menor ao maior', sortBy: (a, b) => a['Código'] - b['Código'], icon: <ArrowUpwardIcon /> },
        { label: 'Código, do maior ao menor', sortBy: (a, b) => b['Código'] - a['Código'], icon: <ArrowDownwardIcon /> },
        { label: 'Produto, de A a Z', sortBy: (a, b) => a['Produto'].localeCompare(b['Produto']), icon: <ArrowUpwardIcon /> },
        { label: 'Produto, de Z a A', sortBy: (a, b) => b['Produto'].localeCompare(a['Produto']), icon: <ArrowDownwardIcon /> },
        { label: 'Preço Venda, do menor para o maior', sortBy: (a, b) => a['Preço Venda'] - b['Preço Venda'], icon: <ArrowUpwardIcon /> },
        { label: 'Preço Venda, do maior ao menor', sortBy: (a, b) => b['Preço Venda'] - a['Preço Venda'], icon: <ArrowDownwardIcon /> },
        { label: 'Valor total, do menor para o maior', sortBy: (a, b) => (a['Quantidade'] * a['Preço Venda']) - (b['Quantidade'] * b['Preço Venda']), icon: <ArrowUpwardIcon /> },
        { label: 'Valor total, do maior ao menor', sortBy: (a, b) => (b['Quantidade'] * b['Preço Venda']) - (a['Quantidade'] * a['Preço Venda']), icon: <ArrowDownwardIcon /> },
    ];

    return (
        <MainContainer>
            <TitleContainer>
                <Box display="flex" alignItems="center">
                    <TitleIcon />
                    <Typography variant="h4" gutterBottom align="center" style={{ fontFamily: 'Segoe UI', color: '#0078d4' }}>
                        Análise de Valor em Estoque por Preço de Venda
                    </Typography>
                </Box>
                <TotalValueContainer>
                    <Typography variant="h6">Total em Estoque: {formatCurrency(total)}</Typography>
                </TotalValueContainer>
            </TitleContainer>
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={handleSortClick}
                startIcon={<SortIcon />}
            >
                Ordenar tabela
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleSortClose}
            >
                {sortByOptions.map(option => (
                    <MenuItem key={option.label} onClick={() => handleSort(option.sortBy)}>
                        {option.icon} {option.label}
                    </MenuItem>
                ))}
            </Menu>
            <TableContainerStyled>
                <StyledTable {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <StyledTh {...column.getHeaderProps()}>
                                        {column.icon} {column.render('Header')}
                                        <div>{column.canFilter ? column.render('Filter') : null}</div>
                                    </StyledTh>
                                ))}
                            </tr>
                        ))}
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <td {...column.getHeaderProps()}>
                                        {column.canFilter ? column.render('Filter') : null}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {tableRows.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <StyledTd {...cell.getCellProps()}>
                                            {['Preço Venda', 'ValorTotal'].includes(cell.column.id)
                                                ? formatCurrency(parseFloat(cell.value))
                                                : cell.render('Cell')}
                                        </StyledTd>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={4} align="right" style={{ padding: '10px', fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Total em Estoque:</td>
                            <td align="center" style={{ padding: '10px', fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>{formatCurrency(total)}</td>
                        </tr>
                    </tfoot>
                </StyledTable>
            </TableContainerStyled>
        </MainContainer>
    );
};

function ColumnFilter({
    column: { filterValue, setFilter },
}) {
    return (
        <FilterInput
            value={filterValue || ''}
            onChange={e => setFilter(e.target.value || undefined)}
            placeholder="Pesquisar..."
            InputProps={{
                startAdornment: (
                    <SearchIcon position="start" />
                ),
            }}
            variant="outlined"
            size="small"
        />
    );
}

export default Valorestoquexvenda;
