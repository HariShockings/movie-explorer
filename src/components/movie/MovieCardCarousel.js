import React from 'react';
import { Box, Typography } from '@mui/material';
import Slider from 'react-slick';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MovieCard from '../common/MovieCard';

// Fully custom arrow without inheriting slick class styles
const PrevArrow = ({ onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: { xs: 'none', md: 'flex' },
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: '50%',
      left: '-10px',
      transform: 'translateY(-50%)',
      zIndex: 2,
      width: 40,
      height: 40,
      color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: '50%',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.8)',
      },
    }}
  >
    <NavigateBeforeIcon />
  </Box>
);

const NextArrow = ({ onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: { xs: 'none', md: 'flex' },
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: '50%',
      right: '-10px',
      transform: 'translateY(-50%)',
      zIndex: 2,
      width: 40,
      height: 40,
      color: '#fff',
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: '50%',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0.8)',
      },
    }}
  >
    <NavigateNextIcon />
  </Box>
);

function MovieCardCarousel({ movies, title }) {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    dots: false,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 400, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <Box sx={{ my: 4, position: 'relative' }}>
      <Typography
        variant="h4"
        sx={{
          color: 'text.primary',
          mb: 2,
          fontWeight: 700,
          pl: 2,
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        {title}
      </Typography>

      {movies.length > 0 ? (
        <Box sx={{ px: { xs: 0, sm: 2 } }}>
          <Slider {...settings}>
            {movies.map((movie) => (
              <Box key={movie.id} sx={{ px: 1 }}>
                <Box
                  sx={{
                    transform: 'scale(0.95)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1)',
                    },
                  }}
                >
                  <MovieCard movie={movie} />
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ color: 'text.secondary', pl: 2 }}>
          No movies available
        </Typography>
      )}
    </Box>
  );
}

export default MovieCardCarousel;
