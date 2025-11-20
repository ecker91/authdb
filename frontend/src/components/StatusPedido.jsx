import * as React from 'react';
import { Card, CardContent, Typography, Stepper, Step, StepLabel } from '@mui/material';

const steps = ['PEDIDO_RECEBIDO', 'EM_IMPRESSAO', 'EM_COSTURA', 'FINALIZADO'];

export default function StatusPedido({ status='PEDIDO_RECEBIDO' }) {
  const activeIndex = Math.max(steps.indexOf(status), 0);
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>Status do Pedido</Typography>
        <Stepper activeStep={activeIndex} alternativeLabel>
          {steps.map(s => <Step key={s}><StepLabel>{s.replace('_',' ')}</StepLabel></Step>)}
        </Stepper>
      </CardContent>
    </Card>
  )
}