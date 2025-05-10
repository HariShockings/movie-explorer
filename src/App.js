import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home';
import MovieDetailsPage from './pages/MovieDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { MovieProvider } from './context/MovieContext';
import theme from './styles/theme';

function App() {
  // Initialize darkMode from localStorage or default to false (light mode)
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Update localStorage whenever darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Suppress YouTube player errors globally
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      if (
        event.reason &&
        event.reason.message &&
        event.reason.message.includes("Cannot read properties of null (reading 'playVideo')")
      ) {
        // Suppress the error
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme(darkMode)}>
      <CssBaseline />
      <MovieProvider>
        <Router>
          <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
          <Footer />
        </Router>
      </MovieProvider>
    </ThemeProvider>
  );
}

export default App;