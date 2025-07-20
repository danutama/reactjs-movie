import React from 'react';
import TitlePages from '../utils/TitlePages';
import { useScrollRestoration } from '../hooks/useScrollRestoration';
import TrendingMovies from '../components/movies/TrendingMovies';
import TvTrending from '../components/tv/TvTrending';

const Home = () => {
  TitlePages('Welcome');
  useScrollRestoration();
  return (
    <section>
      <TrendingMovies />
      <TvTrending />
    </section>
  );
};

export default Home;
