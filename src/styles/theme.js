import { createTheme } from '@mui/material/styles';

const netflixFontStack = [
  '"Netflix Sans"',
  '"Helvetica Neue"',
  'Helvetica',
  'Arial',
  'sans-serif'
].join(',');

const theme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: '#E50914', // Netflix red
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#000000'
    },
    background: {
      default: darkMode ? '#141414' : '#F4F4F4',
      paper: darkMode ? '#181818' : '#FFFFFF'
    },
    text: {
      primary: darkMode ? '#E5E5E5' : '#221F1F',
      secondary: darkMode ? '#808080' : '#4A4A4A'
    }
  },
  typography: {
    fontFamily: netflixFontStack,
    h1: {
      fontSize: '3.5rem',
      fontWeight: 900,
      letterSpacing: '-0.04em',
      lineHeight: 1.1,
      transition: 'color 0.3s ease'
    },
    h2: {
      fontSize: '2.8rem',
      fontWeight: 800,
      letterSpacing: '-0.03em',
      lineHeight: 1.2,
      transition: 'color 0.3s ease'
    },
    h3: {
      fontSize: '2.2rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
      transition: 'color 0.3s ease'
    },
    h4: {
      fontSize: '1.8rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
      transition: 'color 0.3s ease'
    },
    h5: {
      fontSize: '1.4rem',
      fontWeight: 500,
      lineHeight: 1.5,
      transition: 'color 0.3s ease'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
      transition: 'color 0.3s ease'
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: '0.02em'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '@font-face': {
            fontFamily: 'Netflix Sans',
            fontStyle: 'normal',
            fontDisplay: 'swap',
            fontWeight: 400,
            src: `
              url('https://assets.nflxext.com/en_us/fonts/v1/NetflixSans_W_Rg.woff2') format('woff2'),
              url('https://assets.nflxext.com/en_us/fonts/v1/NetflixSans_W_Rg.woff') format('woff')
            `
          }
        },
        body: {
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          transition: 'color 0.3s ease'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          padding: '8px 20px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)'
          }
        }
      }
    }
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    }
  }
});

export default theme;