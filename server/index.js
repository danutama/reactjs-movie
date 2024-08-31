const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// GENRE
app.get('/api/genres', async (req, res) => {
  try {
    const API_KEY = process.env.TMDB_API_KEY;
    const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
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

// UPCOMING/LATEST MOVIE
app.get('/api/upcoming-movies', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const API_KEY = process.env.TMDB_API_KEY;
    const response = await axios.get('https://api.themoviedb.org/3/movie/upcoming', {
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
    const API_KEY = process.env.TMDB_API_KEY;
    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
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
    const API_KEY = process.env.TMDB_API_KEY;
    const response = await axios.get('https://api.themoviedb.org/3/trending/movie/week', {
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
    const API_KEY = process.env.TMDB_API_KEY;

    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
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
    const API_KEY = process.env.TMDB_API_KEY;
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
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

// PERSON
app.get('/api/person/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Person ID is required' });
    }

    const API_KEY = process.env.TMDB_API_KEY;
    const response = await axios.get(`https://api.themoviedb.org/3/person/${id}`, {
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
    const API_KEY = process.env.TMDB_API_KEY;

    const response = await axios.get(`https://api.themoviedb.org/3/person/${id}/movie_credits`, {
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
    const API_KEY = process.env.TMDB_API_KEY;

    const response = await axios.get(`https://api.themoviedb.org/3/person/${id}/tv_credits`, {
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
    const API_KEY = process.env.TMDB_API_KEY;

    const response = await axios.get(`https://api.themoviedb.org/3/search/multi`, {
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

// FETCH TV SHOW BY ID
app.get('/api/tv/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const API_KEY = process.env.TMDB_API_KEY;

    const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}`, {
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
    const API_KEY = process.env.TMDB_API_KEY;

    const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}/aggregate_credits`, {
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

// FETCH TV SEASON BY ID
app.get('/api/tv/:tvId/season/:seasonId', async (req, res) => {
  try {
    const { tvId, seasonId } = req.params;
    const API_KEY = process.env.TMDB_API_KEY;

    const response = await axios.get(`https://api.themoviedb.org/3/tv/${tvId}/season/${seasonId}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching TV season data for TV ID ${tvId} and Season ID ${seasonId}:`, error);
    res.status(500).json({ error: `Error fetching TV season data for TV ID ${tvId} and Season ID ${seasonId}` });
  }
});

// FETCH TV EPISODE BY ID
app.get('/api/tv/:tvId/season/:seasonId/episode/:episodeId', async (req, res) => {
  try {
    const { tvId, seasonId, episodeId } = req.params;
    const API_KEY = process.env.TMDB_API_KEY;

    const response = await axios.get(`https://api.themoviedb.org/3/tv/${tvId}/season/${seasonId}/episode/${episodeId}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching TV episode data for TV ID ${tvId}, Season ID ${seasonId}, and Episode ID ${episodeId}:`, error);
    res.status(500).json({ error: `Error fetching TV episode data for TV ID ${tvId}, Season ID ${seasonId}, and Episode ID ${episodeId}` });
  }
});

// SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
