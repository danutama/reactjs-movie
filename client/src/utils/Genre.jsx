import React from 'react';

const GenreList = ({ genreIds = [], genres = [] }) => {
  const getGenreNames = (genreIds) => {
    if (!Array.isArray(genreIds) || !Array.isArray(genres)) {
      return 'Unknown';
    }

    return genreIds
      .map((id) => {
        const genre = genres.find((g) => g.id === id);
        return genre ? genre.name : 'Unknown';
      })
      .join(', ');
  };

  return <span className="text-secondary">{getGenreNames(genreIds)}</span>;
};

export default GenreList;
