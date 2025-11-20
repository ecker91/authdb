import * as React from 'react';
import { Grid, Typography, Button, Card, CardContent } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Home() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight={700}>Bem-vindo!</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Crie sua camiseta personalizada escolhendo modelo, tecido, cor, estampa e tamanho.
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700}>Personalizar agora</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Monte sua camiseta e envie o pedido.
            </Typography>
            <Button variant="contained" component={RouterLink} to="/personalizar">
              Ir para Personalizar
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700}>Acompanhar pedidos</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Veja o status dos seus pedidos em tempo real.
            </Typography>
            <Button variant="outlined" component={RouterLink} to="/acompanhar">
              Ver Pedidos
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}