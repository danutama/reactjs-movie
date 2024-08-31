import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

const Title = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Menentukan pesan selamat berdasarkan waktu lokal
  const getGreeting = () => {
    const date = new Date();
    const hours = date.getHours();

    if (hours >= 0 && hours < 3) {
      return 'Good Evening'; // Dari 00:00 hingga 03:00
    } else if (hours >= 3 && hours < 12) {
      return 'Good Morning'; // Dari 03:00 hingga 11:59
    } else if (hours >= 12 && hours < 18) {
      return 'Good Afternoon'; // Dari 12:00 hingga 17:59
    } else {
      return 'Good Evening'; // Dari 18:00 hingga 23:59
    }
  };

  // Menentukan judul berdasarkan path
  const getPageTitle = (path) => {
    if (path === '/') {
      return getGreeting();
    }
    if (path === '/upcoming-movie') {
      return 'Upcoming Movies';
    }
    if (path === '/trending-movies') {
      return 'Trending Movies';
    }
    if (path === '/popular-movies') {
      return 'Popular Movies';
    }
    if (path.startsWith('/movie/')) {
      return 'Movie Details';
    }
    if (path.startsWith('/tv/')) {
      return 'TV Details';
    }
    if (path.startsWith('/person/')) {
      return 'Person';
    }
    return 'React Movie';
  };

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
      <p className="header-title fw-bold m-0 text">{getPageTitle(path)}</p>
    </div>
  );
};

export default Title;
