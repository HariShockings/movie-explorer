import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  useTheme,
} from '@mui/material';
import MovieCard from '../common/MovieCard';
import { getGenres } from '../../services/api';
import useBreakpoint from '../../utils/useBreakpoint';

function MovieList({ movies, loadMore, loading, hasMore }) {
  const theme = useTheme();
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const observerRef = useRef();
  const columnsPerRow = useBreakpoint(); // Get number of columns based on breakpoint

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (!observerRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  // Remove duplicate movies by ID
  const uniqueMovies = Array.from(
    new Map(movies.map((movie) => [movie.id, movie])).values()
  );

  // Filter movies by selected genre
  const filteredMovies = selectedGenre
    ? uniqueMovies.filter((movie) =>
        movie.genre_ids.includes(Number(selectedGenre))
      )
    : uniqueMovies;

  // Group movies into rows based on columnsPerRow
  const rows = [];
  for (let i = 0; i < filteredMovies.length; i += columnsPerRow) {
    const rowMovies = filteredMovies.slice(i, i + columnsPerRow);
    // Only include complete rows (skip partial rows unless it's the last row and we have no more data)
    if (rowMovies.length === columnsPerRow || (!hasMore && !loading)) {
      rows.push(rowMovies);
    }
  }

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      {/* Genre Filter */}
{/* Genre Filter */}
<FormControl
  sx={{
    mb: 4,
    minWidth: 240,
    position: 'relative',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
        transition: 'all 0.3s ease',
      },
      '&:hover fieldset': {
        borderColor: theme.palette.mode === 'dark' ? '#E50914' : '#d81f26',
      },
    },
  }}
>
  <InputLabel
    sx={{
      color: theme.palette.text.secondary,
      transform: 'translate(14px, 16px) scale(1)',
      '&.Mui-focused': {
        color: theme.palette.mode === 'dark' ? '#E50914' : '#d81f26',
        transform: 'translate(14px, -9px) scale(0.85)'
      }
    }}
  >
    Filter by Genre
  </InputLabel>
  <Select
    value={selectedGenre}
    onChange={(e) => setSelectedGenre(e.target.value)}
    label="Filter by Genre"
    MenuProps={{
      PaperProps: {
        sx: {
          backgroundColor: theme.palette.background.paper,
          borderRadius: '8px',
          marginTop: '8px',
          maxHeight: 300,
          overflow: 'auto',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.mode === 'dark' ? '#2D2D2D' : '#F5F5F5',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#E50914',
            borderRadius: '4px',
          },
        }
      },
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left',
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'left',
      },
      disablePortal: true, // Keep in DOM flow
      transitionDuration: 150,
    }}
    sx={{
      '& .MuiSelect-select': {
        padding: '12px 32px 12px 14px',
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontWeight: 500,
      }
    }}
  >
    <MenuItem 
      value=""
      sx={{
        fontSize: '0.9rem',
        color: theme.palette.text.secondary,
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(229,9,20,0.1)' : 'rgba(216,31,38,0.1)'
        }
      }}
    >
      All Genres
    </MenuItem>
    {genres.map((genre) => (
      <MenuItem
        key={genre.id}
        value={genre.id}
        sx={{
          fontSize: '0.9rem',
          fontWeight: selectedGenre === genre.id.toString() ? 600 : 400,
          color: selectedGenre === genre.id.toString() 
            ? '#E50914' 
            : theme.palette.text.primary,
          padding: '8px 16px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(229,9,20,0.1)' : 'rgba(216,31,38,0.05)'
          },
          position: 'relative',
          '&::before': selectedGenre === genre.id.toString() && {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            height: '60%',
            width: '2px',
            backgroundColor: '#E50914'
          }
        }}
      >
        {genre.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>
      {/* Movie Grid */}
      <Box sx={{ width: '100%' }}>
        {rows.map((rowMovies, rowIndex) => (
          <Box
            key={`row-${rowIndex}`}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
                xl: 'repeat(5, 1fr)',
              },
              gap: 3,
              justifyItems: 'center',
              mb: 3, // Space between rows
            }}
          >
            {rowMovies.map((movie) => (
              <Box
                key={movie.id}
                sx={{
                  width: '100%',
                  maxWidth: { xs: '300px', sm: 'none' },
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <MovieCard movie={movie} />
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      {/* Loading and Status Indicators */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: theme.palette.mode === 'dark' ? '#e50914' : '#d81f26',
            }}
          />
        </Box>
      )}

      {hasMore && !loading && (
        <Box ref={observerRef} sx={{ height: '20px', mt: 2 }} />
      )}

      {!hasMore && !loading && filteredMovies.length > 0 && (
        <Typography
          variant="subtitle1"
          sx={{
            mt: 4,
            textAlign: 'center',
            color:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.7)'
                : 'rgba(0,0,0,0.6)',
          }}
        >
          You've reached the end
        </Typography>
      )}

      {filteredMovies.length === 0 && !loading && (
        <Typography
          variant="h6"
          sx={{
            mt: 4,
            textAlign: 'center',
            color:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.7)'
                : 'rgba(0,0,0,0.6)',
          }}
        >
          No movies found matching your criteria
        </Typography>
      )}
    </Box>
  );
}

export default MovieList;