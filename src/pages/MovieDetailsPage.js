import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import MovieDetails from '../components/movie/MovieDetails';
import { getMovieDetails } from '../services/api';

function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) return <CircularProgress sx={{ mx: 'auto', mt: 4, display: 'block' }} />;
  if (error) return <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>{error}</Typography>;
  if (!movie) return <Typography sx={{ mt: 4, textAlign: 'center' }}>Movie not found</Typography>;

  return (
    <Container sx={{ py: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {movie.title}
      </Typography>
      <MovieDetails movie={movie} />
    </Container>
  );
}

export default MovieDetailsPage;