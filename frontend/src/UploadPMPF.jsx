import React, { useState } from 'react';
import { Box, Button, Typography, Container, TextField, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import styled from '@emotion/styled';

// Container principal estilizado
const MainContainer = styled(Container)`
  margin-top: 2rem;
  text-align: center;
`;

const UploadBox = styled(Box)`
  border: 2px dashed #0d6efd;
  padding: 2rem;
  margin: 1rem 0;
  cursor: pointer;
`;

const UploadPMPF = () => {
    const [data, setData] = useState([]);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            setData(jsonData);
        };
        reader.readAsBinaryString(file);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: '.xls, .xlsx' });

    return (
        <MainContainer>
            <Typography variant="h4" gutterBottom>
                Subir lista PMPF
            </Typography>
            <UploadBox {...getRootProps()}>
                <input {...getInputProps()} />
                <CloudUploadIcon fontSize="large" />
                <Typography variant="body1">
                    Arraste e solte o arquivo aqui, ou clique para selecionar o arquivo
                </Typography>
            </UploadBox>
            {data.length > 0 && (
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Código EAN</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell>PMPF</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row['Código EAN']}</TableCell>
                                    <TableCell>{row['Descrição']}</TableCell>
                                    <TableCell>{row['PMPF']}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </MainContainer>
    );
};

export default UploadPMPF;
