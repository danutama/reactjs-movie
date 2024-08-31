import axios from 'axios';

export const fetchGenres = async () => {
  try {
    const response = await axios.get('/api/genres');
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
