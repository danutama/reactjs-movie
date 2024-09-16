import axios from 'axios';

export const fetchGenres = async () => {
  try {
    const response = await axios.get('/api/movie-genres');
    return response.data;
  } catch (error) {
    // Handle error silently
    return [];
  }
};

export const fetchTVGenres = async () => {
  try {
    const response = await axios.get('/api/tv-genres');
    return response.data;
  } catch (error) {
    // Handle error silently
    return [];
  }
};

export const fetchMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await axios.get(`/api/movies/genre/${genreId}`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    // Handle error silently
    return [];
  }
};

export const fetchTVShowsByGenre = async (genreId, page = 1) => {
  try {
    const response = await axios.get(`/api/tvshows/genre/${genreId}`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    // Handle error silently
    return [];
  }
};

export const fetchPopularMovies = async (page) => {
  try {
    const response = await axios.get('/api/popular-movies', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    // Handle error silently
    return [];
  }
};

export const fetchTrendingMovies = async (page) => {
  try {
    const response = await axios.get('/api/trending-movies', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    // Handle error silently
    return [];
  }
};

export const fetchLatestMovies = async (page) => {
  try {
    const response = await axios.get('/api/upcoming-movies', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    // Handle error silently
    return [];
  }
};

export const fetchMovieById = async (id) => {
  try {
    const response = await axios.get(`/api/movie/${id}`);
    return response.data;
  } catch (error) {
    // Handle error silently
    return null;
  }
};

export const fetchMovieCredits = async (id) => {
  try {
    const response = await axios.get(`/api/movie/${id}/credits`);
    return response.data;
  } catch (error) {
    // Handle error silently
    return null;
  }
};

export const fetchPopularPeople = async (page = 1) => {
  try {
    const response = await axios.get('/api/popular-people', {
      params: {
        page,
      },
    });
    return response.data;
  } catch (error) {
    // Handle error silently
    return [];
  }
};

export const fetchPersonById = async (id) => {
  try {
    const response = await axios.get(`/api/person/${id}`);
    return response.data;
  } catch (error) {
    // Handle error silently
    return null;
  }
};

export const fetchPersonMovieCredits = async (id) => {
  try {
    const response = await axios.get(`/api/person/${id}/movie-credits`);
    return response.data;
  } catch (error) {
    // Handle error silently
    return null;
  }
};

export const fetchPersonTVCredits = async (id) => {
  try {
    const response = await axios.get(`/api/person/${id}/tv-credits`);
    return response.data;
  } catch (error) {
    // Handle error silently
    return null;
  }
};

export const searchTMDB = async (query) => {
  try {
    const response = await axios.get(`/api/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    // Handle error silently
    return { results: [] };
  }
};

export const fetchTrendingTVShows = async (page) => {
  try {
    const response = await axios.get('/api/trending-tv', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    // Handle error silently
    return [];
  }
};

export const fetchTVAiringToday = async (page = 1) => {
  try {
    const response = await axios.get('/api/tvshows/airing-today', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    // Handle error silently
    return [];
  }
};

export const fetchTVOnTheAir = async (page = 1) => {
  try {
    const response = await axios.get('/api/tvshows/on-the-air', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    // Handle error silently
    return [];
  }
};

export const fetchPopularTVShows = async (page = 1) => {
  try {
    const response = await axios.get('/api/tvshows/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    // Handle error silently
    return [];
  }
};

export const fetchTopRatedTVShows = async (page = 1) => {
  try {
    const response = await axios.get('/api/tvshows/top-rated', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    // Handle error silently
    return [];
  }
};

export const fetchTvShowById = async (id) => {
  try {
    const response = await axios.get(`/api/tv/${id}`);
    return response.data;
  } catch (error) {
    // Handle error silently
    return null;
  }
};

export const fetchTvShowCredits = async (id) => {
  try {
    const response = await axios.get(`/api/tv/${id}/aggregate_credits`);
    return response.data;
  } catch (error) {
    // Handle error silently
    return null;
  }
};

export const fetchExternalIdsTv = async (id) => {
  try {
    const response = await axios.get(`/api/tv/${id}/external_ids`);
    return response.data;
  } catch (error) {
    // Handle error silently
    return null;
  }
};

export const fetchTvSeasonById = async (tvId, seasonId) => {
  try {
    const response = await axios.get(`/api/tv/${tvId}/season/${seasonId}`);
    return response.data;
  } catch (error) {
    // Handle error silently
    return null;
  }
};

export const fetchTvEpisodeById = async (tvId, seasonId, episodeId) => {
  try {
    const response = await axios.get(`/api/tv/${tvId}/season/${seasonId}/episode/${episodeId}`);
    return response.data;
  } catch (error) {
    // Handle error silently
    return null;
  }
};
