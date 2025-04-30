import React from 'react';
import TitlePages from '../utils/TitlePages';
import AllTVPopular from '../components/tv/AllTVPopular';

const PgTvShowPopular = () => {
  TitlePages('Popular TV Shows');
  return (
    <section>
      <AllTVPopular />
    </section>
  );
};

export default PgTvShowPopular;
