import React from 'react';

const TVTrailer = ({ trailerKey }) => {
  if (!trailerKey) return null;

  return (
    <div className="mt-3 mb-4">
      <div className="rounded-3 overflow-hidden">
        <div className="ratio ratio-16x9">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default TVTrailer;
