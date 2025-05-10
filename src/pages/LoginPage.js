import React, { useState, useEffect } from 'react';
import { Container, Box, useMediaQuery, useTheme, Card, Skeleton } from '@mui/material';
import Login from '../components/auth/Login';

// Curated list of high-quality cinema-related images from Unsplash
const CINEMA_IMAGES = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1', // Movie theater seats
  'https://images.unsplash.com/photo-1585647347384-2593bc3576b0', // Film reel
  'https://images.unsplash.com/photo-1542204165-65bf26472b9b', // Cinema screen
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c', // Classic movie scene
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba', // Movie night
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1';

function LoginPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [posterSrc, setPosterSrc] = useState('');
  const [imgLoading, setImgLoading] = useState(true);

  // Glass effect styles
  const glassBackground = {
    backgroundColor: theme.palette.mode === 'light' ? 
      'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.palette.mode === 'light' ? 
      'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
  };

  // Load random image on component mount
  useEffect(() => {
    const randomImage = CINEMA_IMAGES[Math.floor(Math.random() * CINEMA_IMAGES.length)];
    setPosterSrc(`${randomImage}?w=1920&h=1080&auto=format&fit=crop`);
  }, []);

  const handleImageError = (e) => {
    if (e.target.src !== FALLBACK_IMAGE) {
      e.target.src = FALLBACK_IMAGE;
    }
  };

  return (
    <Container sx={{
      py: 4,
      mt: 4,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.palette.background.default,
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        maxWidth: 1200,
        height: '100%',
        minHeight: '80vh',
        ...glassBackground,
        borderRadius: 3,
        boxShadow: theme.shadows[5],
        overflow: 'hidden',
        ...(isMobile && { flexDirection: 'column' }),
      }}>
        {/* Image Section */}
        {!isMobile && (
          <Box sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            position: 'relative',
          }}>
            <Card sx={{
              width: '100%',
              height: '100%',
              maxHeight: '80vh',
              borderRadius: 3,
              overflow: 'hidden',
              backgroundColor: 'transparent',
              boxShadow: 'none',
            }}>
              {imgLoading && (
                <Skeleton 
                  variant="rectangular" 
                  width="100%" 
                  height="100%" 
                  animation="wave" 
                />
              )}
              <Box
                component="img"
                src={posterSrc}
                alt="Cinema Poster"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: imgLoading ? 'none' : 'block',
                  transition: 'opacity 0.5s ease',
                  opacity: imgLoading ? 0 : 1,
                }}
                onLoad={() => setImgLoading(false)}
                onError={handleImageError}
              />
            </Card>
          </Box>
        )}

        {/* Login Form Section */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}>
          <Card sx={{
            width: { xs: '100%', sm: '70%' },
            maxWidth: 400,
            p: 3,
            ...glassBackground,
            borderRadius: 3,
            boxShadow: 'none',
          }}>
            <Login />
          </Card>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;