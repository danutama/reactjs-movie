const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// ─── Cache Setup ─────────────────────────────────────────────────────────────
// TTL per jenis data (dalam detik)
const CACHE_TTL = {
  STATIC: 60 * 60 * 6, // 6 jam — genres
  TRENDING: 60 * 30, // 30 menit — trending/popular
  DETAIL: 60 * 60, // 1 jam — detail film/tv/person
  SEARCH: 60 * 5, // 5 menit — search results
};

const cache = new NodeCache({ checkperiod: 120 });

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());

// Rate limiter — cegah abuse ke server (bukan ke TMDB)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ─── Core Fetcher ─────────────────────────────────────────────────────────────
const fetchFromTMDB = async (endpoint, params = {}, ttl = CACHE_TTL.TRENDING) => {
  const cacheKey = `${endpoint}::${JSON.stringify(params)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
    params: { api_key: API_KEY, language: 'en-US', ...params },
    timeout: 8000,
  });

  cache.set(cacheKey, response.data, ttl);
  return response.data;
};

// ─── Error Handler ────────────────────────────────────────────────────────────
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getPage = (req) => parseInt(req.query.page) || 1;

// ─── Routes: Movies ───────────────────────────────────────────────────────────
app.get(
  '/api/popular-movies',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB('/movie/popular', { page: getPage(req) });
    res.json(data.results);
  }),
);

app.get(
  '/api/trending-movies',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB('/trending/movie/week', { page: getPage(req) });
    res.json(data.results);
  }),
);

app.get(
  '/api/upcoming-movies',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB('/movie/upcoming', { page: getPage(req) });
    res.json(data.results);
  }),
);

app.get(
  '/api/movies/genre/:genreId',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB('/discover/movie', {
      sort_by: 'popularity.desc',
      include_video: false,
      page: getPage(req),
      with_genres: req.params.genreId,
    });
    res.json(data.results);
  }),
);

// Combine detail + credits in one request untuk kurangi roundtrip dari FE
app.get(
  '/api/movie/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const [detail, credits] = await Promise.all([fetchFromTMDB(`/movie/${id}`, {}, CACHE_TTL.DETAIL), fetchFromTMDB(`/movie/${id}/credits`, {}, CACHE_TTL.DETAIL)]);
    res.json({ ...detail, credits });
  }),
);

// Tetap sediakan endpoint credits terpisah kalau FE butuh
app.get(
  '/api/movie/:id/credits',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB(`/movie/${req.params.id}/credits`, {}, CACHE_TTL.DETAIL);
    res.json(data);
  }),
);

app.get(
  '/api/movie-trailer/:id',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB(`/movie/${req.params.id}/videos`, {}, CACHE_TTL.DETAIL);
    const filtered = (data.results || []).filter((v) => v.site === 'YouTube' && ['Trailer', 'Teaser'].includes(v.type)).sort((a, b) => (b.official ? 1 : 0) - (a.official ? 1 : 0));
    res.json(filtered);
  }),
);

// ─── Routes: Genres ───────────────────────────────────────────────────────────
app.get(
  '/api/movie-genres',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB('/genre/movie/list', {}, CACHE_TTL.STATIC);
    res.json(data.genres);
  }),
);

app.get(
  '/api/tv-genres',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB('/genre/tv/list', {}, CACHE_TTL.STATIC);
    res.json(data.genres);
  }),
);

// ─── Routes: TV Shows ─────────────────────────────────────────────────────────
app.get(
  '/api/trending-tv',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB('/trending/tv/week', { page: getPage(req) });
    res.json(data.results);
  }),
);

app.get(
  '/api/tvshows/popular',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB('/tv/popular', { page: getPage(req) });
    res.json(data.results);
  }),
);

app.get(
  '/api/tvshows/top-rated',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB('/tv/top_rated', { page: getPage(req) });
    res.json(data.results);
  }),
);

app.get(
  '/api/tvshows/airing-today',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB('/tv/airing_today', { page: getPage(req) });
    res.json(data.results);
  }),
);

app.get(
  '/api/tvshows/on-the-air',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB('/tv/on_the_air', { page: getPage(req) });
    res.json(data.results);
  }),
);

app.get(
  '/api/tvshows/genre/:genreId',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB('/discover/tv', {
      sort_by: 'popularity.desc',
      include_video: false,
      page: getPage(req),
      with_genres: req.params.genreId,
    });
    res.json(data.results);
  }),
);

// Combine TV detail + credits + external IDs
app.get(
  '/api/tv/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const [detail, credits, externalIds] = await Promise.all([
      fetchFromTMDB(`/tv/${id}`, {}, CACHE_TTL.DETAIL),
      fetchFromTMDB(`/tv/${id}/aggregate_credits`, {}, CACHE_TTL.DETAIL),
      fetchFromTMDB(`/tv/${id}/external_ids`, {}, CACHE_TTL.DETAIL),
    ]);
    res.json({ ...detail, credits, external_ids: externalIds });
  }),
);

app.get(
  '/api/tv/:id/aggregate_credits',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB(`/tv/${req.params.id}/aggregate_credits`, {}, CACHE_TTL.DETAIL);
    res.json(data);
  }),
);

app.get(
  '/api/tv/:id/external_ids',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB(`/tv/${req.params.id}/external_ids`, {}, CACHE_TTL.DETAIL);
    res.json(data);
  }),
);

app.get(
  '/api/tv-trailer/:id',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB(`/tv/${req.params.id}/videos`, {}, CACHE_TTL.DETAIL);
    const filtered = (data.results || []).filter((v) => v.site === 'YouTube' && v.official && ['Trailer', 'Teaser'].includes(v.type)).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    res.json(filtered);
  }),
);

// ─── Routes: People ───────────────────────────────────────────────────────────
app.get(
  '/api/popular-people',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB('/person/popular', { page: getPage(req) });
    res.json(data.results);
  }),
);

// Combine person detail + movie credits + tv credits
app.get(
  '/api/person/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Person ID is required' });

    const [detail, movieCredits, tvCredits] = await Promise.all([
      fetchFromTMDB(`/person/${id}`, {}, CACHE_TTL.DETAIL),
      fetchFromTMDB(`/person/${id}/movie_credits`, {}, CACHE_TTL.DETAIL),
      fetchFromTMDB(`/person/${id}/tv_credits`, {}, CACHE_TTL.DETAIL),
    ]);
    res.json({ ...detail, movie_credits: movieCredits, tv_credits: tvCredits });
  }),
);

app.get(
  '/api/person/:id/movie-credits',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB(`/person/${req.params.id}/movie_credits`, {}, CACHE_TTL.DETAIL);
    res.json(data);
  }),
);

app.get(
  '/api/person/:id/tv-credits',
  asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB(`/person/${req.params.id}/tv_credits`, {}, CACHE_TTL.DETAIL);
    res.json(data);
  }),
);

// ─── Routes: Search ───────────────────────────────────────────────────────────
app.get(
  '/api/search',
  asyncHandler(async (req, res) => {
    const { query } = req.query;
    if (!query?.trim()) return res.json({ results: [] });

    const data = await fetchFromTMDB('/search/multi', { query }, CACHE_TTL.SEARCH);
    res.json(data);
  }),
);

// ─── Cache Stats (dev only) ───────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/_cache/stats', (req, res) => {
    res.json(cache.getStats());
  });
}

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}:`, err.message);

  const status = err.response?.status || 500;
  const message = err.response?.data?.status_message || err.message || 'Internal server error';

  res.status(status).json({ error: message });
});

// ─── Start ────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
