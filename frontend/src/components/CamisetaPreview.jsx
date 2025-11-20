import * as React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function CamisetaPreview({ cor = 'Branco', modelo = 'Básico' }) {
  const formatarNome = (texto) =>
    texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');

  const modeloMap = {
    'Básico': 'basica',
    'Polo': 'polo',
    'Regata': 'regata',
  };

  const corMap = {
    'Preto': 'Preta',
    'Branco': 'Branca',
    'Azul': 'Azul',
  };

  const modeloFormatado = modeloMap[modelo] || formatarNome(modelo);
  const corFormatada = formatarNome(corMap[cor] || cor);
  const imagem = `/${modeloFormatado}_${corFormatada}.png`;

  console.log('🖼️ Imagem buscada:', imagem);

  return (
    <Card sx={{ height: '100%', textAlign: 'center' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Prévia
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
          <img
            src={imagem}
            alt={`${modelo} ${cor}`}
            style={{ width: 230, height: 230, objectFit: 'contain', borderRadius: 12 }}
            onError={(e) => (e.target.src = '/basica_branca.png')}
          />
        </Box>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Modelo: {modelo} — Cor: {cor}
        </Typography>
      </CardContent>
    </Card>
  );
}
