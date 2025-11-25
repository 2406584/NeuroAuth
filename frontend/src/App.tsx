import { BrowserRouter, Routes, Route } from 'react-router';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { useEffect, useState } from 'react';

// Import the components needed for routing
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoutes from './components/ProtectedRoutes';

const App = () => {
  const theme = createTheme({});

  const [authenticated, setAuthenticated] = useState<boolean>(false);

  // 1. Initial Authentication Check on Load
  useEffect(() => {
    // A simple check for token presence
    const token = localStorage.getItem('token');
    
    // 💡 NOTE: In a real app, you would also want to verify the token 
    // expiry here (e.g., with a utility function)
    if (token) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, []);

  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* 1. PUBLIC ROUTES (Always accessible) */}
          <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
          <Route path="/register" element={<Register />} />

          {/* 2. PROTECTED ROUTES (Requires authentication) */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRoutes element={Dashboard} authenticated={authenticated} />} 
          />

          {/* 4. 404 CATCH-ALL */}
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default App;