import axios from 'axios';

const api = axios.create({
  timeout: 10000,
});

// ─── Movies ───────────────────────────────────────────────────────────────────

export const fetchPopularMovies = async (page) => {
  try {
    const response = await api.get('/api/popular-movies', { params: { page } });
    return response.data;
  } catch {
    return [];
  }
};

export const fetchTrendingMovies = async (page) => {
  try {
    const response = await api.get('/api/trending-movies', { params: { page } });
    return response.data;
  } catch {
    return [];
  }
};

export const fetchLatestMovies = async (page) => {
  try {
    const response = await api.get('/api/upcoming-movies', { params: { page } });
    return response.data;
  } catch {
    return [];
  }
};

export const fetchMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await api.get(`/api/movies/genre/${genreId}`, { params: { page } });
    return response.data;
  } catch {
    return [];
  }
};

// Detail movie sudah include credits (movie.credits)
export const fetchMovieById = async (id) => {
  try {
    const response = await api.get(`/api/movie/${id}`);
    return response.data;
  } catch {
    return null;
  }
};

// Tetap ada untuk backward compatibility kalau masih dipakai di tempat lain
export const fetchMovieCredits = async (id) => {
  try {
    const response = await api.get(`/api/movie/${id}/credits`);
    return response.data;
  } catch {
    return null;
  }
};

export const fetchMovieTrailer = async (id) => {
  try {
    const response = await api.get(`/api/movie-trailer/${id}`);
    return response.data;
  } catch {
    return [];
  }
};

// ─── Genres ───────────────────────────────────────────────────────────────────

export const fetchGenres = async () => {
  try {
    const response = await api.get('/api/movie-genres');
    return response.data;
  } catch {
    return [];
  }
};

export const fetchTVGenres = async () => {
  try {
    const response = await api.get('/api/tv-genres');
    return response.data;
  } catch {
    return [];
  }
};

// ─── TV Shows ─────────────────────────────────────────────────────────────────

export const fetchTrendingTVShows = async (page) => {
  try {
    const response = await api.get('/api/trending-tv', { params: { page } });
    return response.data;
  } catch {
    return [];
  }
};

export const fetchPopularTVShows = async (page = 1) => {
  try {
    const response = await api.get('/api/tvshows/popular', { params: { page } });
    return response.data;
  } catch {
    return [];
  }
};

export const fetchTopRatedTVShows = async (page = 1) => {
  try {
    const response = await api.get('/api/tvshows/top-rated', { params: { page } });
    return response.data;
  } catch {
    return [];
  }
};

export const fetchTVAiringToday = async (page = 1) => {
  try {
    const response = await api.get('/api/tvshows/airing-today', { params: { page } });
    return response.data;
  } catch {
    return [];
  }
};

export const fetchTVOnTheAir = async (page = 1) => {
  try {
    const response = await api.get('/api/tvshows/on-the-air', { params: { page } });
    return response.data;
  } catch {
    return [];
  }
};

export const fetchTVShowsByGenre = async (genreId, page = 1) => {
  try {
    const response = await api.get(`/api/tvshows/genre/${genreId}`, { params: { page } });
    return response.data;
  } catch {
    return [];
  }
};

// Detail TV sudah include credits (tv.credits) dan external_ids (tv.external_ids)
export const fetchTvShowById = async (id) => {
  try {
    const response = await api.get(`/api/tv/${id}`);
    return response.data;
  } catch {
    return null;
  }
};

// Tetap ada untuk backward compatibility
export const fetchTvShowCredits = async (id) => {
  try {
    const response = await api.get(`/api/tv/${id}/aggregate_credits`);
    return response.data;
  } catch {
    return null;
  }
};

export const fetchExternalIdsTv = async (id) => {
  try {
    const response = await api.get(`/api/tv/${id}/external_ids`);
    return response.data;
  } catch {
    return null;
  }
};

export const fetchTVTrailer = async (id) => {
  try {
    const response = await api.get(`/api/tv-trailer/${id}`);
    return response.data;
  } catch {
    return [];
  }
};

// ─── People ───────────────────────────────────────────────────────────────────

export const fetchPopularPeople = async (page = 1) => {
  try {
    const response = await api.get('/api/popular-people', { params: { page } });
    return response.data;
  } catch {
    return [];
  }
};

// Detail person sudah include movie_credits & tv_credits
export const fetchPersonById = async (id) => {
  try {
    const response = await api.get(`/api/person/${id}`);
    return response.data;
  } catch {
    return null;
  }
};

// Tetap ada untuk backward compatibility
export const fetchPersonMovieCredits = async (id) => {
  try {
    const response = await api.get(`/api/person/${id}/movie-credits`);
    return response.data;
  } catch {
    return null;
  }
};

export const fetchPersonTVCredits = async (id) => {
  try {
    const response = await api.get(`/api/person/${id}/tv-credits`);
    return response.data;
  } catch {
    return null;
  }
};

// ─── Search ───────────────────────────────────────────────────────────────────

export const searchTMDB = async (query) => {
  try {
    const response = await api.get('/api/search', { params: { query } });
    return response.data;
  } catch {
    return { results: [] };
  }
};
