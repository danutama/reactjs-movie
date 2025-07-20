import React from 'react';
import TitlePages from '../../utils/TitlePages';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';
import AllPeoplePopular from '../../components/people/AllPeoplePopular';

const Popular = () => {
  TitlePages('Popular People');
  useScrollRestoration();
  return (
    <section>
      <AllPeoplePopular />
    </section>
  );
};

export default Popular;
