import './styles/global.css';
import { useEffect, useState } from 'react';
import { getStoredToken, isAuthenticated } from './utils/auth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';

type PageType = 'login' | 'register' | 'tasks';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    if (!isAuthenticated()) {
      setCurrentPage('login');
    } else {
      setCurrentPage('tasks');
    }
  }, []);

  if (loading) {
    return <div className="container"><p>Carregando...</p></div>;
  }

  return (
    <div className="app">
      {currentPage === 'login' && <LoginPage onSwitchPage={() => setCurrentPage('register')} onLogin={() => setCurrentPage('tasks')} />}
      {currentPage === 'register' && <RegisterPage onSwitchPage={() => setCurrentPage('login')} onRegister={() => setCurrentPage('tasks')} />}
      {currentPage === 'tasks' && <TasksPage onLogout={() => { setCurrentPage('login'); }} />}
    </div>
  );
}

export default App;
