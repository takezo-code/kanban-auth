import { useState, useEffect } from 'react';
import { authService } from './services/auth.service';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { KanbanBoard } from './components/KanbanBoard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const authenticated = authService.isAuthenticated();
      console.log('Auth status:', authenticated);
      setIsAuthenticated(authenticated);
    } catch (err: any) {
      console.error('Erro ao verificar autenticação:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  if (error) {
    return (
      <div className="loading" style={{ color: 'red' }}>
        Erro: {error}
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return showRegister ? (
      <Register
        onRegister={handleAuth}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={handleAuth}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return <KanbanBoard />;
}

export default App;
