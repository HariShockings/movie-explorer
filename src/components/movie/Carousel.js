import React, { useState } from 'react'; // Removed useEffect
import { Box, Typography, IconButton } from '@mui/material';
import Slider from 'react-slick';
import YouTube from 'react-youtube';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function Carousel({ movies }) {
  const [videoLoaded, setVideoLoaded] = useState({});
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = React.useRef(null);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    beforeChange: (current, next) => setActiveSlide(next),
    appendDots: (dots) => (
      <div
        style={{
          position: 'absolute',
          bottom: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <ul style={{ margin: 0, padding: 0 }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: activeSlide === i ? '20px' : '8px',
          height: '8px',
          borderRadius: '4px',
          backgroundColor: activeSlide === i ? '#e50914' : 'rgba(255,255,255,0.5)',
          margin: '0 4px',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
      />
    ),
  };

  const placeholderImage = 'https://placehold.co/1280x720?text=No+Media+Available';

  const CustomArrow = ({ direction, onClick }) => (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.5)',
        '&:hover': {
          backgroundColor: 'rgba(0,0,0,0.8)',
        },
        left: direction === 'prev' ? '20px' : 'auto',
        right: direction === 'next' ? '20px' : 'auto',
        display: { xs: 'none', md: 'flex' },
      }}
    >
      {direction === 'prev' ? <NavigateBeforeIcon /> : <NavigateNextIcon />}
    </IconButton>
  );

  return (
    <Box
      sx={{
        mb: 4,
        position: 'relative',
        '&:hover .carousel-arrows': {
          opacity: 1,
        },
      }}
    >
      {movies.length > 0 ? (
        <Box sx={{ position: 'relative' }}>
          <CustomArrow direction="prev" onClick={() => sliderRef.current.slickPrev()} />
          <CustomArrow direction="next" onClick={() => sliderRef.current.slickNext()} />

          <Slider ref={sliderRef} {...carouselSettings}>
            {movies.map((movie) => {
              // Add a defensive check for the movie object
              if (!movie || !movie.videos || !movie.videos.results) {
                return null; // Skip rendering if movie or videos are undefined
              }

              const trailer = movie.videos.results.find(
                (video) => video.type === 'Trailer' && video.site === 'YouTube'
              );

              return (
                <Box
                  key={movie.id}
                  sx={{
                    position: 'relative',
                    height: { xs: '50vh', md: '70vh' },
                    overflow: 'hidden',
                  }}
                >
                  {/* Poster Image and Video Background */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: 0,
                    }}
                  >
                    <img
                      src={
                        movie.backdrop_path
                          ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                          : placeholderImage
                      }
                      alt={movie.title || 'Movie Poster'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(0.7)',
                        opacity: videoLoaded[movie.id] ? 0 : 1,
                        transition: 'opacity 1s ease',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    />
                    {trailer?.key && (
                      <YouTube
                        videoId={trailer.key}
                        opts={{
                          height: '100%',
                          width: '100%',
                          playerVars: {
                            autoplay: 1,
                            mute: 1,
                            controls: 0,
                            modestbranding: 1,
                            loop: 1,
                            playlist: trailer.key, // Required for loop
                          },
                        }}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onReady={(event) => {
                          setTimeout(() => {
                            setVideoLoaded((prev) => ({ ...prev, [movie.id]: true }));
                          }, 20000); // Wait for 20 seconds before fading in the video
                        }}
                        onError={() => {
                          setVideoLoaded((prev) => ({ ...prev, [movie.id]: false }));
                        }}
                      />
                    )}
                  </Box>

                  {/* Gradient Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '40%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                      zIndex: 1,
                    }}
                  />

                  {/* Content Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: { xs: 2, md: 4 },
                      zIndex: 2,
                      color: '#fff',
                      paddingBottom: { xs: 4, md: 6, lg: 10 },
                      paddingLeft: { md: 6, lg: 10 },
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: '2rem', md: '3rem' },
                        mb: 2,
                      }}
                    >
                      {movie.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          px: 2,
                          py: 1,
                          borderRadius: '4px',
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {movie.vote_average?.toFixed(1) || 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          / 10
                        </Typography>
                      </Box>

                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {movie.release_date?.split('-')[0] || 'Unknown'}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{
                        mt: 2,
                        maxWidth: '600px',
                        lineHeight: 1.5,
                        display: { xs: 'none', md: 'block' },
                      }}
                    >
                      {movie.overview || 'No description available.'}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Slider>
        </Box>
      ) : (
        <Box
          sx={{
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6">No trending content available</Typography>
        </Box>
      )}
    </Box>
  );
}

export default Carousel;