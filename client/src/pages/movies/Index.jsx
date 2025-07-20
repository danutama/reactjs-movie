import React from 'react';
import TitlePages from '../../utils/TitlePages';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';
import PopularMovies from '../../components/movies/PopularMovies';
import TrendingMovies from '../../components/movies/TrendingMovies';
import UpcomingMovie from '../../components/movies/UpcomingMovie';

const Index = () => {
  TitlePages('Movies');
  useScrollRestoration();
  return (
    <section>
      <UpcomingMovie />
      <PopularMovies />
      <TrendingMovies />
    </section>
  );
};

export default Index;
