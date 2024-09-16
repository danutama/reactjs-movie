import React from 'react';
import TitlePages from '../utils/TitlePages';
import TrendingMovies from '../components/TrendingMovies';
import TvTrending from '../components/tv/TvTrending';

const Home = () => {
  TitlePages('Welcome');
  return (
    <section>
      <TrendingMovies />
      <TvTrending />
    </section>
  );
};

export default Home;
