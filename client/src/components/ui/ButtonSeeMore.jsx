import React from 'react';

const ButtonSeeMore = ({ onClick, text }) => {
  return (
    <button className="btn btn-sm btn-primary py-2 px-3 border-0 rounded-5" onClick={onClick}>
      {text}
    </button>
  );
};

export default ButtonSeeMore;
