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

  // Menentukan judul berdasarkan path
  const getPageTitle = () => {
    switch (true) {
      case path === '/':
        return getGreeting();
      case path === '/upcoming-movie':
        return 'Upcoming Movies';
      case path === '/trending-movies':
        return 'Trending Movies';
      case path === '/popular-movies':
        return 'Popular Movies';
      case path.startsWith('/movie/'):
        return 'Movie Details';
      case path.startsWith('/tv/'):
        return 'TV Details';
      case path.startsWith('/person/'):
        return 'Person';
      case path.startsWith('/movie-genre/'):
        return `Movie ${genreName || ''}`;
      case path.startsWith('/tv-genre/'):
        return `TV ${genreName || ''}`;
      default:
        return 'React Movie';
    }
  };

  useEffect(() => {
    const fetchGenreName = async () => {
      const genreId = path.split('/')[2];
      if (genreId) {
        try {
          const genres = path.startsWith('/movie-genre/') ? await fetchGenres() : await fetchTVGenres();

          const genre = genres.find((g) => g.id === parseInt(genreId, 10));
          setGenreName(genre ? genre.name : '');
        } catch (error) {
          console.error('Error fetching genres:', error);
          setGenreName('');
        }
      }
    };

    if (path.startsWith('/movie-genre/') || path.startsWith('/tv-genre/')) {
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
