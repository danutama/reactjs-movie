import React from 'react';

const Card = ({ children }) => {
  return <div className="card box-wrapper overflow-hidden h-100 rounded-4">{children}</div>;
};

export default Card;
