import React from 'react';
import TitlePages from '../utils/TitlePages';
import PopularMovies from '../components/PopularMovies';
import TrendingMovies from '../components/TrendingMovies';
import UpcomingMovie from '../components/UpcomingMovie';

const Movie = () => {
  TitlePages('Movies');
  return (
    <section>
      <UpcomingMovie />
      <PopularMovies />
      <TrendingMovies />
    </section>
  );
};

export default Movie;
