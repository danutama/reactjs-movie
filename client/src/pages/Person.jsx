import React from 'react';
import { useParams } from 'react-router-dom';
import PersonDetail from '../components/people/PersonDetail';

const Person = () => {
  const { personId } = useParams();

  return (
    <section>
      <PersonDetail personId={personId} />
    </section>
  );
};

export default Person;
