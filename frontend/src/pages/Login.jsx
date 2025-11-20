import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { login, isAuthenticated, loadingAuth } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Se já estiver logado → redireciona
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password); // login vindo do seu hook useAuth()
    } catch (err) {
      setError('Email ou senha incorretos.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f5f5f5',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '300px',
          padding: '20px',
          borderRadius: '8px',
          background: '#fff',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Login</h2>

        {error && (
          <p style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>
            {error}
          </p>
        )}

        <div style={{ marginTop: '15px' }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              marginTop: '5px',
              padding: '8px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
        </div>

        <div style={{ marginTop: '15px' }}>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              marginTop: '5px',
              padding: '8px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loadingAuth}
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#4CAF50',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          {loadingAuth ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
