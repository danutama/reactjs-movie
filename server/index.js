const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;
app.use(express.json());

const fetchFromTMDB = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    throw error;
  }
};

// Middleware to handle default page query
const withPage = (req, res, next) => {
  req.query.page = req.query.page || 1;
  next();
};

// Routes
app.get('/api/movie-trailer/:id', async (req, res) => {
  try {
    const data = await fetchFromTMDB(`/movie/${req.params.id}/videos`);
    res.json(data.results || []);
  } catch {
    res.json([]);
  }
});

app.get('/api/tv-trailer/:id', async (req, res) => {
  try {
    const data = await fetchFromTMDB(`/tv/${req.params.id}/videos`);
    const filtered = (data.results || []).filter((video) => video.site === 'YouTube' && video.official && ['Trailer', 'Teaser'].includes(video.type)).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    res.json(filtered);
  } catch {
    res.json([]);
  }
});

app.get('/api/movie-genres', async (req, res) => {
  try {
    const data = await fetchFromTMDB('/genre/movie/list');
    res.json(data.genres);
  } catch {
    res.status(500).json({ error: 'Error fetching genres' });
  }
});

app.get('/api/tv-genres', async (req, res) => {
  try {
    const data = await fetchFromTMDB('/genre/tv/list');
    res.json(data.genres);
  } catch {
    res.status(500).json({ error: 'Error fetching TV genres' });
  }
});

app.get('/api/movies/genre/:genreId', withPage, async (req, res) => {
  try {
    const data = await fetchFromTMDB('/discover/movie', {
      sort_by: 'popularity.desc',
      include_video: false,
      page: req.query.page,
      with_genres: req.params.genreId,
    });
    res.json(data.results);
  } catch {
    res.status(500).json({ error: `Error fetching movies for genre ID ${req.params.genreId}` });
  }
});

app.get('/api/tvshows/genre/:genreId', withPage, async (req, res) => {
  try {
    const data = await fetchFromTMDB('/discover/tv', {
      sort_by: 'popularity.desc',
      include_video: false,
      page: req.query.page,
      with_genres: req.params.genreId,
    });
    res.json(data.results);
  } catch {
    res.status(500).json({ error: `Error fetching TV shows for genre ID ${req.params.genreId}` });
  }
});

app.get('/api/upcoming-movies', withPage, async (req, res) => {
  try {
    const data = await fetchFromTMDB('/movie/upcoming', { page: req.query.page });
    res.json(data.results);
  } catch {
    res.status(500).json({ error: 'Error fetching upcoming movies' });
  }
});

app.get('/api/popular-movies', withPage, async (req, res) => {
  try {
    const data = await fetchFromTMDB('/movie/popular', { page: req.query.page });
    res.json(data.results);
  } catch {
    res.status(500).json({ error: 'Error fetching popular movies' });
  }
});

app.get('/api/trending-movies', withPage, async (req, res) => {
  try {
    const data = await fetchFromTMDB('/trending/movie/week', { page: req.query.page });
    res.json(data.results);
  } catch {
    res.status(500).json({ error: 'Error fetching trending movies' });
  }
});

app.get('/api/movie/:id', async (req, res) => {
  try {
    const data = await fetchFromTMDB(`/movie/${req.params.id}`);
    res.json(data);
  } catch {
    res.status(500).json({ error: `Error fetching movie details for ID ${req.params.id}` });
  }
});

app.get('/api/movie/:id/credits', async (req, res) => {
  try {
    const data = await fetchFromTMDB(`/movie/${req.params.id}/credits`);
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Error fetching movie credits' });
  }
});

app.get('/api/popular-people', withPage, async (req, res) => {
  try {
    const data = await fetchFromTMDB('/person/popular', { page: req.query.page });
    res.json(data.results);
  } catch {
    res.status(500).json({ error: 'Error fetching popular people' });
  }
});

app.get('/api/person/:id', async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ error: 'Person ID is required' });
    const data = await fetchFromTMDB(`/person/${req.params.id}`);
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Error fetching person details' });
  }
});

app.get('/api/person/:id/movie-credits', async (req, res) => {
  try {
    const data = await fetchFromTMDB(`/person/${req.params.id}/movie_credits`);
    res.json(data);
  } catch {
    res.status(500).json({ error: `Error fetching movie credits for person ID ${req.params.id}` });
  }
});

app.get('/api/person/:id/tv-credits', async (req, res) => {
  try {
    const data = await fetchFromTMDB(`/person/${req.params.id}/tv_credits`);
    res.json(data);
  } catch {
    res.status(500).json({ error: `Error fetching TV show credits for person ID ${req.params.id}` });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const data = await fetchFromTMDB('/search/multi', { query: req.query.query });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Error searching TMDB' });
  }
});

app.get('/api/trending-tv', withPage, async (req, res) => {
  try {
    const data = await fetchFromTMDB('/trending/tv/week', { page: req.query.page });
    res.json(data.results);
  } catch {
    res.status(500).json({ error: 'Error fetching trending TV shows' });
  }
});

app.get('/api/tvshows/airing-today', withPage, async (req, res) => {
  try {
    const data = await fetchFromTMDB('/tv/airing_today', { page: req.query.page });
    res.json(data.results);
  } catch {
    res.status(500).json({ error: 'Error fetching TV shows airing today' });
  }
});

app.get('/api/tvshows/on-the-air', withPage, async (req, res) => {
  try {
    const data = await fetchFromTMDB('/tv/on_the_air', { page: req.query.page });
    res.json(data.results);
  } catch {
    res.status(500).json({ error: 'Error fetching TV shows on the air' });
  }
});

app.get('/api/tvshows/popular', withPage, async (req, res) => {
  try {
    const data = await fetchFromTMDB('/tv/popular', { page: req.query.page });
    res.json(data.results);
  } catch {
    res.status(500).json({ error: 'Error fetching popular TV shows' });
  }
});

app.get('/api/tvshows/top-rated', withPage, async (req, res) => {
  try {
    const data = await fetchFromTMDB('/tv/top_rated', { page: req.query.page });
    res.json(data.results);
  } catch {
    res.status(500).json({ error: 'Error fetching top-rated TV shows' });
  }
});

app.get('/api/tv/:id', async (req, res) => {
  try {
    const data = await fetchFromTMDB(`/tv/${req.params.id}`);
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Error fetching TV show data from TMDB' });
  }
});

app.get('/api/tv/:id/aggregate_credits', async (req, res) => {
  try {
    const data = await fetchFromTMDB(`/tv/${req.params.id}/aggregate_credits`);
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Error fetching TV show credits from TMDB' });
  }
});

app.get('/api/tv/:id/external_ids', async (req, res) => {
  try {
    const data = await fetchFromTMDB(`/tv/${req.params.id}/external_ids`);
    res.json(data);
  } catch {
    res.status(500).json({ error: `Error fetching external IDs for TV show ID ${req.params.id}` });
  }
});

// LOCAL
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running locally at http://localhost:${PORT}`);
  });
}

// VERCEL
module.exports = app;
