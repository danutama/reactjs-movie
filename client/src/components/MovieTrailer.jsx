import React from 'react';

const MovieTrailer = ({ trailerKey }) => {
  return (
    <div className="mt-3 mb-4">
      <div className="rounded-3 overflow-hidden">
        <div className="ratio ratio-16x9">
          <iframe src={`https://www.youtube.com/embed/${trailerKey}`} title="Movie Trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      </div>
    </div>
  );
};

export default MovieTrailer;
