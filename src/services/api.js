import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getTrendingMovies = async (page = 1) => {
  try {
    const response = await api.get('/trending/movie/week', {
      params: { page },
    });
    const movies = response.data.results.slice(0, 5); // Limit to 5 movies

    // Fetch details with error handling for videos
    const detailedMovies = await Promise.all(
      movies.map(async (movie) => {
        try {
          const details = await getMovieDetails(movie.id);
          const videos = details.videos?.results || [];
          const youtubeTrailers = videos.filter(
            (video) => video.site === 'YouTube' && video.type === 'Trailer'
          );
          return {
            ...movie,
            videos: youtubeTrailers.length > 0 ? { results: youtubeTrailers } : null,
          };
        } catch (error) {
          console.error(`Failed to fetch details for movie ${movie.id}:`, error);
          return { ...movie, videos: null };
        }
      })
    );
    return { ...response.data, results: detailedMovies };
  } catch (error) {
    throw new Error('Failed to fetch trending movies');
  }
};

export const getTrendingMoviesNoVideos = async (page = 1) => {
  try {
    const response = await api.get('/trending/movie/week', {
      params: { page },
    });
    return { ...response.data, results: response.data.results.slice(0, 10) }; // Limit to 10 movies
  } catch (error) {
    throw new Error('Failed to fetch trending movies');
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await api.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to search movies');
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`, {
      params: { append_to_response: 'videos,credits' },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch movie details');
  }
};

export const getGenres = async () => {
  try {
    const response = await api.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    throw new Error('Failed to fetch genres');
  }
};

export const getNewReleases = async () => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const formattedDate = sixMonthsAgo.toISOString().split('T')[0];
    const response = await api.get('/discover/movie', {
      params: {
        sort_by: 'release_date.desc',
        'release_date.gte': formattedDate,
        'release_date.lte': new Date().toISOString().split('T')[0],
        page: 1,
      },
    });
    const movies = response.data.results.slice(0, 10);
    // Fetch details for each movie to get videos
    const detailedMovies = await Promise.all(
      movies.map(async (movie) => {
        const details = await getMovieDetails(movie.id);
        return { ...movie, videos: details.videos };
      })
    );
    return detailedMovies;
  } catch (error) {
    throw new Error('Failed to fetch new releases');
  }
};

export const discoverMovies = async (params = {}) => {
  try {
    const response = await api.get('/discover/movie', {
      params: { page: 1, ...params },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch movies by discovery');
  }
};