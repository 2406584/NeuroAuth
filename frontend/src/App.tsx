import { BrowserRouter, Routes, Route } from 'react-router';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { useEffect, useState } from 'react';

// Import the components needed for routing
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoutes from './components/ProtectedRoutes';

const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch(e) {
    return null;
  }
}

const App = () => {
  const theme = createTheme({});

  const [authenticated, setAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJwt(token);
      return !!(decoded && decoded.exp * 1000 > Date.now());
    }
    return false;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setAuthenticated(true);
        
        const timeUntilExpiry = decoded.exp * 1000 - Date.now();
        const timer = setTimeout(() => {
          localStorage.removeItem('token');
          setAuthenticated(false);
          window.location.href = '/login';
        }, timeUntilExpiry);

        return () => clearTimeout(timer);
      } else {
        localStorage.removeItem('token');
        setAuthenticated(false);
      }
    } else {
      setAuthenticated(false);
    }
  }, []);

  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login setAuthenticated={setAuthenticated} />} />
          <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
          <Route path="/register" element={<Register />} />

          <Route 
            path="/dashboard" 
            element={<ProtectedRoutes element={Dashboard} authenticated={authenticated} />} 
          />
          <Route 
            path="/admin" 
            element={<ProtectedRoutes element={AdminDashboard} authenticated={authenticated} />} 
          />

          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default App;