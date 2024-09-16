import React from 'react';
import TitlePages from '../utils/TitlePages';
import AllTVPopular from '../components/tv/AllTVPopular';

const TvShowPopular = () => {
  TitlePages('Popular TV Shows');
  return (
    <section>
      <AllTVPopular />
    </section>
  );
};

export default TvShowPopular;
