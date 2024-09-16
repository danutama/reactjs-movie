import React from 'react';
import TitlePages from '../utils/TitlePages';
import AllPeoplePopular from '../components/AllPeoplePopular';

const PeoplePopular = () => {
  TitlePages('Popular People');
  return (
    <section>
      <AllPeoplePopular />
    </section>
  );
};

export default PeoplePopular;
