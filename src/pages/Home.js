import React, { useState, useEffect, Suspense } from 'react';
import { Container, Typography, CircularProgress } from '@mui/material';
import Cookies from 'js-cookie';
import SearchBar from '../components/common/SearchBar';
import Carousel from '../components/movie/Carousel';
import MovieCardCarousel from '../components/movie/MovieCardCarousel';
import MovieByPreference from '../components/movie/MovieByPreference';
import { getTrendingMovies, searchMovies, getNewReleases, getTrendingMoviesNoVideos } from '../services/api';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useBreakpoint from '../utils/useBreakpoint';

// Lazy load MovieList
const MovieList = React.lazy(() => import('../components/movie/MovieList'));

function Home() {
  const [movies, setMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newReleasesLoading, setNewReleasesLoading] = useState(false);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newReleasesError, setNewReleasesError] = useState(null);
  const [trendingError, setTrendingError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [hasLastSearches, setHasLastSearches] = useState(false);
  useBreakpoint(); // Keep hook call for potential side effects

  useEffect(() => {
    // Check for last searches in localStorage
    const lastSearches = JSON.parse(localStorage.getItem('lastSearches') || '[]');
    setHasLastSearches(lastSearches.length > 0);

    const fetchTrending = async () => {
      // Check for cached trending movies in cookies
      const cachedMovies = Cookies.get('trendingMovies');
      if (cachedMovies && !isSearching) {
        try {
          const parsedMovies = JSON.parse(cachedMovies);
          setMovies(parsedMovies);
          setHasMore(false); // Prevent further pagination for cached data
          setLoading(false);
          return;
        } catch (e) {
          console.error('Failed to parse cached movies:', e);
          Cookies.remove('trendingMovies'); // Clear invalid cookie
        }
      }

      setLoading(true);
      try {
        const data = await getTrendingMovies(page);
        const newMovies = data.results;

        // Cache the first 5 movies in cookies for 1 hour
        if (page === 1 && !isSearching) {
          Cookies.set('trendingMovies', JSON.stringify(newMovies), { expires: 1 / 24 }); // 1 hour
        }

        // Ensure unique movies by ID
        setMovies((prev) => {
          const combined = [...prev, ...newMovies];
          return Array.from(
            new Map(combined.map((movie) => [movie.id, movie])).values()
          );
        });
        setHasMore(data.page < data.total_pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchNewReleases = async () => {
      const cachedNewReleases = Cookies.get('newReleases');
      if (cachedNewReleases) {
        try {
          const parsedNewReleases = JSON.parse(cachedNewReleases);
          setNewReleases(parsedNewReleases);
          setNewReleasesLoading(false);
          return;
        } catch (e) {
          console.error('Failed to parse cached new releases:', e);
          Cookies.remove('newReleases');
        }
      }

      setNewReleasesLoading(true);
      try {
        const data = await getNewReleases();
        setNewReleases(data);
        Cookies.set('newReleases', JSON.stringify(data), { expires: 1 / 24 }); // 1 hour
      } catch (err) {
        setNewReleasesError(err.message);
      } finally {
        setNewReleasesLoading(false);
      }
    };

    const fetchTrendingNoVideos = async () => {
      const cachedTrending = Cookies.get('trendingMoviesNoVideos');
      if (cachedTrending) {
        try {
          const parsedTrending = JSON.parse(cachedTrending);
          setTrendingMovies(parsedTrending);
          setTrendingLoading(false);
          return;
        } catch (e) {
          console.error('Failed to parse cached trending movies:', e);
          Cookies.remove('trendingMoviesNoVideos');
        }
      }

      setTrendingLoading(true);
      try {
        const data = await getTrendingMoviesNoVideos();
        setTrendingMovies(data.results);
        Cookies.set('trendingMoviesNoVideos', JSON.stringify(data.results), { expires: 1 / 24 }); // 1 hour
      } catch (err) {
        setTrendingError(err.message);
      } finally {
        setTrendingLoading(false);
      }
    };

    if (!isSearching) {
      fetchTrending();
    }
    fetchNewReleases();
    fetchTrendingNoVideos();

    // Set up beforeunload event listener to clear cookies on page reload
    const handleBeforeUnload = () => {
      Cookies.remove('trendingMovies');
      Cookies.remove('newReleases');
      Cookies.remove('trendingMoviesNoVideos');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [page, isSearching]);

  const handleSearch = async (query) => {
    setIsSearching(true);
    setMovies([]);
    setPage(1);
    setLoading(true);
    try {
      const data = await searchMovies(query, 1);
      setMovies(data.results);
      setHasMore(data.page < data.total_pages);
      // Update lastSearches in localStorage
      const lastSearches = JSON.parse(localStorage.getItem('lastSearches') || '[]');
      const updatedSearches = [query, ...lastSearches.filter((q) => q !== query)].slice(0, 5); // Keep latest 5
      localStorage.setItem('lastSearches', JSON.stringify(updatedSearches));
      setHasLastSearches(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <Container sx={{ py: 4, mt: 4 }}>
      <Carousel movies={movies.slice(0, 5)} />
      {hasLastSearches && <MovieByPreference />}
      {newReleasesLoading ? (
        <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />
      ) : newReleasesError ? (
        <Typography color="error" sx={{ mt: 4 }}>
          {newReleasesError}
        </Typography>
      ) : (
        <MovieCardCarousel title="New Arrivals" movies={newReleases} />
      )}
      {trendingLoading ? (
        <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />
      ) : trendingError ? (
        <Typography color="error" sx={{ mt: 4 }}>
          {trendingError}
        </Typography>
      ) : (
        <MovieCardCarousel title="Trending Movies" movies={trendingMovies} />
      )}
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: (theme) => theme.palette.text.primary, mt: 4, mx: 2, textAlign: { xs: 'center', sm: 'left' } }}
      >
        Discover Movies
      </Typography>
      <SearchBar onSearch={handleSearch} />
      {error && <Typography color="error">{error}</Typography>}
      <Suspense
        fallback={<CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />}
      >
        <MovieList
          movies={movies}
          loadMore={loadMore}
          loading={loading}
          hasMore={hasMore}
        />
      </Suspense>
    </Container>
  );
}

export default Home;