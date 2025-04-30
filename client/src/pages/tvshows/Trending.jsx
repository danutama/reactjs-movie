import React from 'react';
import TitlePages from '../../utils/TitlePages';
import AllTVTrending from '../../components/tv/AllTVTrending';

const Trending = () => {
  TitlePages('Trending TV Shows');
  return (
    <section>
      <AllTVTrending />
    </section>
  );
};

export default Trending;
