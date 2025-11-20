import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import Home from './pages/Home';
import Personalizar from './pages/Personalizar';
import Acompanhar from './pages/Acompanhar';
import { PedidoProvider } from './contexts/PedidoContext';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import { PrivateRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
    <PedidoProvider>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Loja de Camisetas Personalizadas
          </Typography>
          <Button color="inherit" component={Link} to="/">Início</Button>
          <Button color="inherit" component={Link} to="/personalizar">Personalizar</Button>
          <Button color="inherit" component={Link} to="/acompanhar">Pedidos</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/personalizar" element={<Personalizar />} />
              <Route path="/acompanhar" element={<Acompanhar />} />
            </Route>
          </Routes>
        </Container>
      </Box>
    </PedidoProvider>
    </AuthProvider>
  );
}