import React from 'react';
import TitlePages from '../utils/TitlePages';
import AllPopularMovies from '../components/AllPopularMovies';

const Popular = () => {
  TitlePages('Popular');
  return (
    <section>
      <AllPopularMovies />
    </section>
  );
};

export default Popular;
