import React from 'react';
import TitlePages from '../utils/TitlePages';
import PopularMovies from '../components/movies/PopularMovies';
import TrendingMovies from '../components/movies/TrendingMovies';
import UpcomingMovie from '../components/movies/UpcomingMovie';

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
