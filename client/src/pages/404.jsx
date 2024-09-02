import React from 'react';
import img404 from '../../public/404.svg';
import TitlePages from '../utils/TitlePages';

const NotFound = () => {
  TitlePages('404 Not Found');
  return (
    <section className="container-md d-flex justify-content-center align-items-center flex-column h-100">
      <p className="text text-center fw-bold display-2 my-2">404</p>
      <p className="text text-center mb-0">Not Found</p>
      <p className="text text-center">Sorry, we can't find that page</p>
      <img src={img404} alt="404 not found" className="not-found-img my-4" />
    </section>
  );
};

export default NotFound;
