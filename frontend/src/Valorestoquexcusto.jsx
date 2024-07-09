import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField } from '@mui/material';
import { useTable, useSortBy, useFilters } from 'react-table';
import * as XLSX from 'xlsx';
import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InventoryIcon from '@mui/icons-material/Inventory';

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
  margin-top: 5px;
`;

const TitleContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
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

const Valorestoquexcusto = () => {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const url = 'https://raw.githubusercontent.com/rfirpo93/staestoque/main/backend/estoquecusto.xlsx';

            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);

            const filteredRows = json.filter(row => row['Quantidade'] > 0);
            const totalValue = filteredRows.reduce((sum, row) => sum + (row['Quantidade'] * row['Custo']), 0);

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
            },
            {
                Header: 'Produto',
                accessor: 'Produto',
                Filter: ColumnFilter,
                filter: 'text',
            },
            {
                Header: 'Quantidade',
                accessor: 'Quantidade',
                Filter: ColumnFilter,
                filter: 'text',
            },
            {
                Header: 'Custo',
                accessor: 'Custo',
                Filter: ColumnFilter,
                filter: 'text',
            },
            {
                Header: 'Valor Total',
                accessor: row => (row['Quantidade'] * row['Custo']).toFixed(2),
                id: 'ValorTotal',
                Filter: ColumnFilter,
                filter: 'text',
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
        useFilters,
        useSortBy
    );

    return (
        <MainContainer>
            <TitleContainer>
                <TitleIcon />
                <Typography variant="h4" gutterBottom align="center" style={{ fontFamily: 'Segoe UI', color: '#0078d4' }}>
                    Análise de Valor em Estoque por Custo
                </Typography>
            </TitleContainer>
            <TableContainerStyled>
                <StyledTable {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <StyledTh {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? <ArrowDownwardIcon fontSize="small" />
                                                    : <ArrowUpwardIcon fontSize="small" />
                                                : ''}
                                        </span>
                                        <div>{column.canFilter ? column.render('Filter') : null}</div>
                                    </StyledTh>
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
                                        <StyledTd {...cell.getCellProps()}>{cell.render('Cell')}</StyledTd>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={4} align="right" style={{ padding: '10px', fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>Total em Estoque:</td>
                            <td align="center" style={{ padding: '10px', fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>{total.toFixed(2)}</td>
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

export default Valorestoquexcusto;
