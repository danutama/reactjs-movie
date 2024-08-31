import React, { useEffect } from 'react';

const TitlePages = (title) => {
  useEffect(() => {
    document.title = `React Movie | ${title}`;
  }, [title]);

  return title;
};

export default TitlePages;
