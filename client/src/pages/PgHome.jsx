import React from 'react';
import TitlePages from '../utils/TitlePages';
import TrendingMovies from '../components/movies/TrendingMovies';
import TvTrending from '../components/tv/TvTrending';

const PgHome = () => {
  TitlePages('Welcome');
  return (
    <section>
      <TrendingMovies />
      <TvTrending />
    </section>
  );
};

export default PgHome;
