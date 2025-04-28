import React from 'react';
import TitlePages from '../utils/TitlePages';
import AllTrendingMovies from '../components/movies/AllTrendingMovies';

const Trending = () => {
  TitlePages('Trending');
  return (
    <section>
      <AllTrendingMovies />
    </section>
  );
};

export default Trending;
