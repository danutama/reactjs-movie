import React from 'react';
import TitlePages from '../utils/TitlePages';
import AllTVTrending from '../components/tv/AllTVTrending';

const PgTvShowTrending = () => {
  TitlePages('Trending TV Shows');
  return (
    <section>
      <AllTVTrending />
    </section>
  );
};

export default PgTvShowTrending;
