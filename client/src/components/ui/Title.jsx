import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchGenres, fetchTVGenres } from '../../service/api';
import { FaArrowLeft } from 'react-icons/fa6';

const Title = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [genreName, setGenreName] = useState('');

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 3) return 'Good evening';
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getPageTitle = () => {
    const staticTitles = {
      '/': getGreeting(),
      '/movies': 'Movies',
      '/movies/upcoming': 'Upcoming Movies',
      '/movies/trending': 'Trending Movies',
      '/movies/popular': 'Popular Movies',
      '/tv-shows': 'TV Shows',
      '/tv-shows/trending': 'Trending TV Shows',
      '/tv-shows/popular': 'Popular TV Shows',
      '/tv-shows/top-rated': 'Top Rated TV Shows',
      '/tv-shows/on-the-air': 'TV Shows On The Air',
      '/tv-shows/airing-today': 'TV Shows Airing Today',
      '/people/popular': 'Popular People',
    };

    if (staticTitles[path]) return staticTitles[path];

    if (path.startsWith('/movies/genre/')) return `Movie ${genreName || ''}`;
    if (path.startsWith('/movies/')) return 'Movie Details';

    if (path.startsWith('/tv-shows/genre/')) return `TV ${genreName || ''}`;
    if (path.startsWith('/tv-shows/')) return 'TV Show Details';

    if (path.startsWith('/people/')) return 'Person';

    return 'Dibimovie';
  };

  useEffect(() => {
    const fetchGenreName = async () => {
      const segments = path.split('/');
      const genreId = segments[3];

      if (genreId) {
        try {
          const genres = path.includes('/movies/genre/') ? await fetchGenres() : await fetchTVGenres();
          const genre = genres.find((g) => g.id === parseInt(genreId, 10));
          setGenreName(genre ? genre.name : '');
        } catch (error) {
          console.error('Error fetching genres:', error);
          setGenreName('');
        }
      }
    };

    if (path.startsWith('/movies/genre/') || path.startsWith('/tv-shows/genre/')) {
      fetchGenreName();
    } else {
      setGenreName('');
    }
  }, [path]);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="d-flex align-items-center">
      {path !== '/' && (
        <button onClick={handleBackClick} className="icon text p-0 me-3 bg-transparent border-0">
          <FaArrowLeft className="fs-5" />
        </button>
      )}
      <p className="header-title fw-bold m-0 text">{getPageTitle()}</p>
    </div>
  );
};

export default Title;
