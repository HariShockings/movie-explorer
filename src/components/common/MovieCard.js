import React, { useContext } from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton, Box, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { MovieContext } from '../../context/MovieContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star'; 

function MovieCard({ movie }) {
  const { user, favorites, addFavorite, removeFavorite } = useContext(MovieContext);
  const navigate = useNavigate();
  const isFavorite = favorites.some((fav) => fav.id === movie.id);

  const handleFavorite = (e) => {
    e.preventDefault();
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

  const placeholderImage = 'https://placehold.co/500x750?text=No+Poster&font=roboto';

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
          '& .MuiCardMedia-root': {
            transform: 'scale(1.1)',
            opacity: 0.8,
          },
          '& .movie-actions': {
            opacity: 1,
          },
        },
      }}
    >
      {/* Movie Poster with hover effect */}
      <CardMedia
        component="img"
        height="100%"
        image={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : placeholderImage
        }
        alt={movie.title}
        onError={(e) => {
          e.target.src = placeholderImage;
        }}
        sx={{
          transition: 'transform 0.5s ease, opacity 0.3s ease',
          objectFit: 'cover',
        }}
      />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Movie info */}
      <CardContent
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          color: '#fff',
          p: 2,
          zIndex: 2,
        }}
      >
        <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
          {movie.title}
        </Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.8, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {movie.release_date?.split('-')[0]} •
          <StarIcon sx={{ fontSize: 18, color: '#fbc02d' }} />
          {movie.vote_average?.toFixed(1)}
        </Typography>
      </CardContent>

      {/* Action buttons (appear on hover) */}
      <Box
        className="movie-actions"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          zIndex: 2,
        }}
      >
        <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <IconButton
            onClick={handleFavorite}
            sx={{
              color: isFavorite ? '#e50914' : '#fff',
              backgroundColor: 'rgba(0,0,0,0.7)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.9)',
              },
            }}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="View details">
          <IconButton
            component={Link}
            to={`/movie/${movie.id}`}
            sx={{
              color: '#fff',
              backgroundColor: 'rgba(0,0,0,0.7)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.9)',
              },
            }}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
}

export default MovieCard;