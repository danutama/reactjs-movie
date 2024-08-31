import React from 'react';
import TitlePages from '../utils/TitlePages';
import AllTrendingMovies from '../components/AllTrendingMovies';

const Trending = () => {
  TitlePages('Trending');
  return (
    <section>
      <AllTrendingMovies />
    </section>
  );
};

export default Trending;
