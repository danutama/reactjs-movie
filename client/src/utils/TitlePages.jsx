import React, { useEffect } from 'react';

const TitlePages = (title) => {
  useEffect(() => {
    document.title = `Dibimovie | ${title}`;
  }, [title]);

  return title;
};

export default TitlePages;
