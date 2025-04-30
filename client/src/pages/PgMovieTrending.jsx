import React from 'react';
import TitlePages from '../utils/TitlePages';
import AllTrendingMovies from '../components/movies/AllTrendingMovies';

const PgMovieTrending = () => {
  TitlePages('Trending');
  return (
    <section>
      <AllTrendingMovies />
    </section>
  );
};

export default PgMovieTrending;
