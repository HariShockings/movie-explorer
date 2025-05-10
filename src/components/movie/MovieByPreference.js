import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import MovieCardCarousel from './MovieCardCarousel';
import { searchMovies, getMovieDetails, discoverMovies } from '../../services/api';

function MovieByPreference() {
  const [preferenceMovies, setPreferenceMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreferenceMovies = async () => {
      // Get last searches from localStorage
      const lastSearches = JSON.parse(localStorage.getItem('lastSearches') || '[]');
      if (!lastSearches.length) return;

      // Use the most recent search query
      const query = lastSearches[0]; // e.g., "the boys"
      setLoading(true);
      try {
        // Search for the movie
        const searchData = await searchMovies(query, 1);
        const movie = searchData.results[0]; // Assume first result is the target movie
        if (!movie) throw new Error('No movie found for the search query');

        // Get movie details for genres and cast
        const details = await getMovieDetails(movie.id);

        // Fetch movies by genre and cast
        const fetchedMovies = [];

        // Genre-based movies
        if (details.genres?.length > 0) {
          const genreIds = details.genres.map((g) => g.id).join(',');
          const genreData = await discoverMovies({ with_genres: genreIds });
          fetchedMovies.push(...genreData.results.slice(0, 10)); // Limit to 10
        }

        // Cast-based movies
        if (details.credits?.cast?.length > 0) {
          const actorIds = details.credits.cast.slice(0, 3).map((actor) => actor.id).join(',');
          const castData = await discoverMovies({ with_cast: actorIds });
          fetchedMovies.push(...castData.results.slice(0, 10)); // Limit to 10
        }

        // Remove duplicates by movie ID
        const uniqueMovies = Array.from(
          new Map(fetchedMovies.map((movie) => [movie.id, movie])).values()
        ).slice(0, 10); // Limit to 10 unique movies

        setPreferenceMovies(uniqueMovies);
      } catch (err) {
        setError('Failed to load recommended movies');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferenceMovies();
  }, []);

  if (loading) {
    return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />;
  }

  if (error) {
    return <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>{error}</Typography>;
  }

  return (
    <>
      {preferenceMovies.length > 0 ? (
        <MovieCardCarousel
          title="Recommended for You"
          movies={preferenceMovies}
        />
      ) : (
        <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', mt: 4 }}>
          No recommended movies available
        </Typography>
      )}
    </>
  );
}

export default MovieByPreference;