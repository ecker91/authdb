import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableCell, TableRow, TableContainer, Paper, Card, CardContent, Typography, Grid } from '@mui/material';
import StatusPedido from '../components/StatusPedido';
import api from '../config/axios';

export default function Acompanhar() {
  const [rows, setRows] = useState([]);
  const [statusAtual, setStatusAtual] = useState('PEDIDO_RECEBIDO');

  const carregar = async () => {
    const { data } = await api.get('/pedidos');
    setRows(data);
    if (data[0]) setStatusAtual(data[0].status);
  };

  React.useEffect(() => {
    carregar();
    const it = setInterval(carregar, 3000);
    return () => clearInterval(it);
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>Pedidos Recentes</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Protocolo</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Data</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.protocolo}>
                      <TableCell>{r.protocolo}</TableCell>
                      <TableCell>{r.status}</TableCell>
                      <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <StatusPedido status={statusAtual} />
      </Grid>
    </Grid>
  );
}