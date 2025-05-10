import React, { useContext, useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Tooltip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { MovieContext } from '../../context/MovieContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

function Header({ toggleDarkMode, darkMode }) {
  const { user, favorites } = useContext(MovieContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <AppBar
      position="fixed"
      elevation={scrolled ? 4 : 0}
      sx={{
        background: darkMode
          ? scrolled
            ? 'rgba(20, 20, 20, 0.95)'
            : 'rgba(20, 20, 20, 0.8)'
          : scrolled
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        height: scrolled ? '60px' : '70px',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '100%',
          padding: { xs: '0 16px', md: '0 32px' },
        }}
      >
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Netflix Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 700,
              fontSize: { xs: '1.4rem', md: '1.8rem' },
              color: darkMode ? '#e50914' : '#d81f26',
              letterSpacing: '-0.5px',
              mr: 2,
            }}
          >
            MovieFlix
          </Typography>
        </Box>

        {/* Right Controls */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          {/* Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
            <Button
              component={Link}
              to="/"
              startIcon={<HomeIcon />}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: darkMode ? '#e5e5e5' : '#333',
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/favorites"
              startIcon={<FavoriteIcon />}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: darkMode ? '#e5e5e5' : '#333',
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              Wishlist {favorites.length > 0 && `(${favorites.length})`}
            </Button>
          </Box>

          {/* Theme Toggle */}
          <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            <IconButton
              onClick={toggleDarkMode}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: darkMode ? '#333' : '#f0f0f0',
                transition: '0.3s ease',
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: darkMode ? '#444' : '#e0e0e0',
                },
              }}
            >
              <Box
                sx={{
                  transform: darkMode ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {darkMode ? (
                  <LightModeIcon sx={{ color: '#fff', fontSize: '20px' }} />
                ) : (
                  <DarkModeIcon sx={{ color: '#000', fontSize: '20px' }} />
                )}
              </Box>
            </IconButton>
          </Tooltip>

          {/* Auth Buttons */}
          {user ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  color: darkMode ? '#e5e5e5' : '#333',
                  fontWeight: 500,
                }}
              >
                Hi, {user.email.split('@')[0]}
              </Typography>
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: darkMode ? '#fff' : '#333',
                  borderColor: darkMode ? '#fff' : '#333',
                  textTransform: 'none',
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              startIcon={<LoginIcon />}
              variant="contained"
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: darkMode ? '#e50914' : '#d81f26',
                color: '#fff',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: darkMode ? '#f40612' : '#c11119',
                },
              }}
            >
              Sign In
            </Button>
          )}

          {/* Mobile Menu Icon */}
          <IconButton
            onClick={toggleMenu}
            sx={{
              display: { md: 'none' },
              color: darkMode ? '#fff' : '#333',
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: darkMode ? '#141414' : '#fff',
              zIndex: 1000,
              display: { md: 'none' },
              padding: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <Button
              fullWidth
              component={Link}
              to="/"
              startIcon={<HomeIcon />}
              onClick={() => setMenuOpen(false)}
              sx={{
                justifyContent: 'flex-start',
                color: darkMode ? '#e5e5e5' : '#333',
                py: 1.5,
              }}
            >
              Home
            </Button>
            <Button
              fullWidth
              component={Link}
              to="/favorites"
              startIcon={<FavoriteIcon />}
              onClick={() => setMenuOpen(false)}
              sx={{
                justifyContent: 'flex-start',
                color: darkMode ? '#e5e5e5' : '#333',
                py: 1.5,
              }}
            >
              Wishlist {favorites.length > 0 && `(${favorites.length})`}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
