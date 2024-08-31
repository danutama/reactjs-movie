import React from 'react';
import TitlePages from '../utils/TitlePages';
import PopularMovies from '../components/PopularMovies';
import TrendingMovies from '../components/TrendingMovies';
import UpcomingMovie from '../components/UpcomingMovie';

const Home = () => {
  TitlePages('Welcome');
  return (
    <section>
      <UpcomingMovie />
      <PopularMovies />
      <TrendingMovies />
    </section>
  );
};

export default Home;
