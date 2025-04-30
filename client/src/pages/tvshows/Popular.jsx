import React from 'react';
import TitlePages from '../../utils/TitlePages';
import AllTVPopular from '../../components/tv/AllTVPopular';

const Popular = () => {
  TitlePages('Popular TV Shows');
  return (
    <section>
      <AllTVPopular />
    </section>
  );
};

export default Popular;
