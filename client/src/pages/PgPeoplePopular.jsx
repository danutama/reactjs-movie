import React from 'react';
import TitlePages from '../utils/TitlePages';
import AllPeoplePopular from '../components/people/AllPeoplePopular';

const PgPeoplePopular = () => {
  TitlePages('Popular People');
  return (
    <section>
      <AllPeoplePopular />
    </section>
  );
};

export default PgPeoplePopular;
