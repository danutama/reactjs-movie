const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;
app.use(express.json());

// MOVIE TRAILER
app.get('/api/movie-trailer/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${API_BASE_URL}/movie/${id}/videos`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });

    const trailers = response.data.results;
    res.json(trailers.length > 0 ? trailers : []);
  } catch (error) {
    console.error('Error fetching trailer:', error.message);
    res.json([]);
  }
});

// TV TRAILER
app.get('/api/tv-trailer/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`${API_BASE_URL}/tv/${id}/videos`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });

    const trailers = response.data.results || [];
    const filtered = trailers.filter((video) => video.site === 'YouTube' && video.official === true && (video.type === 'Trailer' || video.type === 'Teaser')).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching TV show trailer:', error.message);
    res.json([]);
  }
});

// GENRE MOVIE
app.get('/api/movie-genres', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/genre/movie/list`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });
    res.json(response.data.genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ error: 'Error fetching genres' });
  }
});

// GENRE TV
app.get('/api/tv-genres', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/genre/tv/list`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });
    res.json(response.data.genres);
  } catch (error) {
    console.error('Error fetching TV genres:', error);
    res.status(500).json({ error: 'Error fetching TV genres' });
  }
});

// FETCH MOVIES BY GENRE
app.get('/api/movies/genre/:genreId', async (req, res) => {
  try {
    const { genreId } = req.params;
    const { page = 1 } = req.query;

    const response = await axios.get(`${API_BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        sort_by: 'popularity.desc',
        include_video: false,
        page,
        with_genres: genreId,
      },
    });

    res.json(response.data.results);
  } catch (error) {
    console.error(`Error fetching movies for genre ID ${genreId}:`, error);
    res.status(500).json({ error: `Error fetching movies for genre ID ${genreId}` });
  }
});

// FETCH TV SHOWS BY GENRE
app.get('/api/tvshows/genre/:genreId', async (req, res) => {
  try {
    const { genreId } = req.params;
    const { page = 1 } = req.query;

    const response = await axios.get(`${API_BASE_URL}/discover/tv`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        sort_by: 'popularity.desc',
        include_video: false,
        page,
        with_genres: genreId,
      },
    });

    res.json(response.data.results);
  } catch (error) {
    console.error(`Error fetching TV shows for genre ID ${genreId}:`, error);
    res.status(500).json({ error: `Error fetching TV shows for genre ID ${genreId}` });
  }
});

// UPCOMING/LATEST MOVIE
app.get('/api/upcoming-movies', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(`${API_BASE_URL}/movie/upcoming`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page,
      },
    });

    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    res.status(500).json({ error: 'Error fetching upcoming movies' });
  }
});

// POPULAR MOVIES
app.get('/api/popular-movies', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(`${API_BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page,
      },
    });

    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).json({ error: 'Error fetching popular movies' });
  }
});

// TRENDING MOVIES
app.get('/api/trending-movies', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(`${API_BASE_URL}/trending/movie/week`, {
      params: {
        api_key: API_KEY,
        page,
      },
    });

    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    res.status(500).json({ error: 'Error fetching trending movies' });
  }
});

// DETAIL MOVIE
app.get('/api/movie/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_BASE_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching movie details for ID ${id}:`, error);
    res.status(500).json({ error: `Error fetching movie details for ID ${id}` });
  }
});

// CAST AND CREW
app.get('/api/movie/:id/credits', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_BASE_URL}/movie/${id}/credits`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    res.status(500).json({ error: 'Error fetching movie credits' });
  }
});

// POPULAR PEOPLE
app.get('/api/popular-people', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(`${API_BASE_URL}/person/popular`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page,
      },
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching popular people:', error);
    res.status(500).json({ error: 'Error fetching popular people' });
  }
});

// PERSON
app.get('/api/person/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Person ID is required' });
    }

    const response = await axios.get(`${API_BASE_URL}/person/${id}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching person details for ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error fetching person details' });
  }
});

// MOVIE CREDITS FOR A PERSON
app.get('/api/person/:id/movie-credits', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_BASE_URL}/person/${id}/movie_credits`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching movie credits for person ID ${id}:`, error);
    res.status(500).json({ error: `Error fetching movie credits for person ID ${id}` });
  }
});

// TV SHOW CREDITS FOR A PERSON
app.get('/api/person/:id/tv-credits', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_BASE_URL}/person/${id}/tv_credits`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching TV show credits for person ID ${id}:`, error);
    res.status(500).json({ error: `Error fetching TV show credits for person ID ${id}` });
  }
});

// SEARCHING
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(`${API_BASE_URL}/search/multi`, {
      params: {
        api_key: API_KEY,
        query,
        language: 'en-US',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error searching TMDB:', error);
    res.status(500).json({ error: 'Error searching TMDB' });
  }
});

// TRENDING TV SHOWS
app.get('/api/trending-tv', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(`${API_BASE_URL}/trending/tv/week`, {
      params: {
        api_key: API_KEY,
        page,
      },
    });

    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching trending TV shows:', error);
    res.status(500).json({ error: 'Error fetching trending TV shows' });
  }
});

// TV SHOWS AIRING TODAY
app.get('/api/tvshows/airing-today', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(`${API_BASE_URL}/tv/airing_today`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page,
      },
    });

    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching TV shows airing today:', error);
    res.status(500).json({ error: 'Error fetching TV shows airing today' });
  }
});

// TV SHOWS ON THE AIR
app.get('/api/tvshows/on-the-air', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(`${API_BASE_URL}/tv/on_the_air`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page,
      },
    });

    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching TV shows on the air:', error);
    res.status(500).json({ error: 'Error fetching TV shows on the air' });
  }
});

// POPULAR TV SHOWS
app.get('/api/tvshows/popular', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(`${API_BASE_URL}/tv/popular`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page,
      },
    });

    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    res.status(500).json({ error: 'Error fetching popular TV shows' });
  }
});

// TOP RATED TV SHOWS
app.get('/api/tvshows/top-rated', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(`${API_BASE_URL}/tv/top_rated`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page,
      },
    });

    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching top-rated TV shows:', error);
    res.status(500).json({ error: 'Error fetching top-rated TV shows' });
  }
});

// FETCH TV SHOW BY ID
app.get('/api/tv/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_BASE_URL}/tv/${id}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching TV show data from TMDB:', error);
    res.status(500).json({ error: 'Error fetching TV show data from TMDB' });
  }
});

// FETCH TV SHOW AGGREGAT CREDITS BY ID
app.get('/api/tv/:id/aggregate_credits', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_BASE_URL}/tv/${id}/aggregate_credits`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching TV show credits from TMDB:', error);
    res.status(500).json({ error: 'Error fetching TV show credits from TMDB' });
  }
});

// FETCH TV EXTERNAL ID BY TV ID
app.get('/api/tv/:id/external_ids', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${API_BASE_URL}/tv/${id}/external_ids`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching external IDs for TV show ID ${id}:`, error);
    res.status(500).json({ error: `Error fetching external IDs for TV show ID ${id}` });
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
