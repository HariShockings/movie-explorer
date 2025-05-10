import React, { useContext } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import MovieList from '../components/movie/MovieList';
import { MovieContext } from '../context/MovieContext';

function FavoritesPage() {
  const { user, favorites } = useContext(MovieContext);

  return (
    <Container sx={{ py: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Favorite Movies
      </Typography>
      {!user ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '90vh',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Please log in to view your favorites.
          </Typography>
          <Button component={Link} to="/login" variant="contained">
            Login
          </Button>
        </Box>
      ) : favorites.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '90vh',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6">
            No favorites added yet.
          </Typography>
        </Box>
      ) : (
        <MovieList movies={favorites} />
      )}
    </Container>
  );
}

export default FavoritesPage;