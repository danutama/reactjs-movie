import React from 'react';
import TitlePages from '../utils/TitlePages';
import TvAiringToday from '../components/tv/TvAiringToday';
import TvOnTheAir from '../components/tv/TvOnTheAir';
import TvPopular from '../components/tv/TvPopular';
import TvTopRated from '../components/tv/TvTopRated';
import TvTrending from '../components/tv/TvTrending';

const TvShow = () => {
  TitlePages('Tv Show');
  return (
    <section>
      <TvTrending />
      <TvPopular />
      <TvTopRated />
      <TvAiringToday />
      <TvOnTheAir />
    </section>
  );
};

export default TvShow;
