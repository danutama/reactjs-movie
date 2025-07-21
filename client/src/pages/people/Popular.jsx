import React from 'react';
import TitlePages from '../../utils/TitlePages';
import AllPeoplePopular from '../../components/people/AllPeoplePopular';

const Popular = () => {
  TitlePages('Popular People');
  return (
    <section>
      <AllPeoplePopular />
    </section>
  );
};

export default Popular;
