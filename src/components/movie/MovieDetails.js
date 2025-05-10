import React, { useState, useContext } from 'react';
import {
  Typography,
  Box,
  Chip,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import YouTube from 'react-youtube';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { MovieContext } from '../../context/MovieContext';

function MovieDetails({ movie }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, favorites, addFavorite, removeFavorite } = useContext(MovieContext);
  const [showTrailer, setShowTrailer] = useState(false);

  const isFavorite = favorites.some((fav) => fav.id === movie?.id);

  const handleFavorite = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  if (!movie) {
    return (
      <Box
        sx={{
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.08)',
          borderRadius: '8px',
          border: `1px dashed ${
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.2)'
              : 'rgba(0,0,0,0.2)'
          }`,
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Movie details not available
        </Typography>
      </Box>
    );
  }

  const trailer = movie?.videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4,
        color: theme.palette.text.primary,
      }}
    >
      {/* Movie Poster */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          alignSelf: 'flex-start',
        }}
      >
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://placehold.co/500x750?text=No+Poster&font=roboto'
          }
          alt={movie.title}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
          onError={(e) => {
            e.target.src = 'https://placehold.co/500x750?text=No+Poster&font=roboto';
          }}
        />

        {/* Favorite Icon */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
          }}
        >
          <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
            <IconButton
              onClick={handleFavorite}
              sx={{
                color: isFavorite ? '#e50914' : '#fff',
                backgroundColor: 'rgba(0,0,0,0.6)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.9)',
                },
              }}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Movie Info */}
      <Box sx={{ flex: 2 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          {movie.title}{' '}
          <Typography component="span" sx={{ opacity: 0.7 }}>
            ({movie.release_date?.split('-')[0]})
          </Typography>
        </Typography>

        {/* Genres */}
        <Box sx={{ mb: 3 }}>
          {movie.genres?.map((genre) => (
            <Chip
              key={genre.id}
              label={genre.name}
              sx={{
                mr: 1,
                mb: 1,
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.1)',
                color: 'inherit',
              }}
            />
          ))}
        </Box>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor:
                theme.palette.mode === 'dark' ? '#e50914' : '#d81f26',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            {movie.vote_average?.toFixed(1)}
          </Box>
          <Typography variant="h6">User Score</Typography>
        </Box>

        {/* Overview */}
        <Typography variant="body1" paragraph sx={{ mb: 3, lineHeight: 1.6 }}>
          {movie.overview}
        </Typography>

        {/* Top Cast */}
        {movie.credits?.cast?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Cast:
            </Typography>
            <Typography variant="body1">
              {movie.credits.cast.slice(0, 5).map((actor) => actor.name).join(', ')}
            </Typography>
          </Box>
        )}

        {/* Trailer Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Media
          </Typography>

          {trailer ? (
            <>
              {!showTrailer ? (
                <Box
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    '&:hover .play-button': {
                      transform: 'scale(1.1)',
                    },
                  }}
                  onClick={() => setShowTrailer(true)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
                    alt="Trailer Thumbnail"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }}
                  />
                  <Box
                    className="play-button"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      transition: 'transform 0.3s ease',
                      color: '#fff',
                      fontSize: '4rem',
                      textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    }}
                  >
                    <PlayCircleOutlineIcon fontSize="inherit" />
                  </Box>
                </Box>
              ) : (
                <YouTube
                  videoId={trailer.key}
                  opts={opts}
                />
              )}
              <Typography variant="subtitle2" sx={{ mt: 1, opacity: 0.7 }}>
                {trailer.name}
              </Typography>
            </>
          ) : (
            <Box
              sx={{
                height: '390px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.08)',
                borderRadius: '8px',
                border: `1px dashed ${
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(0,0,0,0.2)'
                }`,
              }}
            >
              <Typography variant="h6" color="textSecondary">
                No trailer available
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default MovieDetails;