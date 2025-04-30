import React from 'react';
import TitlePages from '../../utils/TitlePages';
import AllTVOnTheAir from '../../components/tv/AllTVOnTheAir';

const OnTheAir = () => {
  TitlePages('TV Shows On The Air');
  return (
    <section>
      <AllTVOnTheAir />
    </section>
  );
};

export default OnTheAir;
