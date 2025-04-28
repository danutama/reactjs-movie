import React from 'react';
import TitlePages from '../utils/TitlePages';
import AllUpcomingMovie from '../components/movies/AllUpcomingMovie';

const Latest = () => {
  TitlePages('Upcoming');
  return (
    <section>
      <AllUpcomingMovie />
    </section>
  );
};

export default Latest;
