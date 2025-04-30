import React from 'react';
import TitlePages from '../utils/TitlePages';
import AllPopularMovies from '../components/movies/AllPopularMovies';

const PgMoviePopular = () => {
  TitlePages('Popular');
  return (
    <section>
      <AllPopularMovies />
    </section>
  );
};

export default PgMoviePopular;
