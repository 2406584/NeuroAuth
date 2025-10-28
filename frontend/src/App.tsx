import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login'
import Register from './pages/Register'
import {  createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

const App = () => {
  const theme = createTheme({
  /** Your theme override here */
});

  return (
    <MantineProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
    </MantineProvider>
  )
}

export default App