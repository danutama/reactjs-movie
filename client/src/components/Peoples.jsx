import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Card from './ui/Card';
import SpinnerCustom from './ui/SpinnerCustom';

const Peoples = ({ credits, creators }) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prevCount) => prevCount + 10);
      setIsLoading(false);
    }, 1000);
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
      if (visibleCount < credits.length) {
        loadMore();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCount, credits.length]);

  const directors = credits.filter((person) => person.job === 'Director');
  const writers = credits.filter((person) => person.job === 'Writer' || person.job === 'Novel' || person.department === 'Writing');
  const screenplays = credits.filter((person) => person.job === 'Screenplay');

  const isTVShow = location.pathname.startsWith('/tv/');

  return (
    <div className="peoples">
      <div className="mb-5">
        {!isTVShow && (
          <>
            <small className="text-secondary m-0 lh-lg">
              Director: <span className="text-tertiary">{directors.length > 0 ? directors.map((director) => director.name).join(', ') : '-'}</span>
            </small>
            <div className="hr"></div>
          </>
        )}
        {isTVShow && creators && creators.length > 0 && (
          <div>
            <small className="text-secondary m-0 lh-lg">
              Creator: <span className="text-tertiary">{creators.map((creator) => creator.name).join(', ')}</span>
            </small>
            <div className="hr"></div>
          </div>
        )}
        <small className="text-secondary m-0 lh-lg">
          Writers: <span className="text-tertiary">{writers.length > 0 ? writers.map((writer) => writer.name).join(', ') : '-'}</span>
        </small>
        <div className="hr"></div>
        <small className="text-secondary m-0 lh-lg">
          Screenplay: <span className="text-tertiary">{screenplays.length > 0 ? screenplays.map((screenplay) => screenplay.name).join(', ') : '-'}</span>
        </small>
        <div className="hr"></div>
      </div>

      <p className="h5 text fw-bold mb-3">Cast & Crew</p>
      <div className="row g-2">
        {credits.slice(0, visibleCount).map((person, index) => (
          <div key={`${person.id}-${index}`} className="col-lg-2 col-md-3 col-sm-4 col-6">
            <Card>
              <img src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : '/profile.png'} className="card-img-top" alt={person.name || 'Default profile'} />
              <div className="card-body">
                <div className="title-wrapper">
                  <Link to={`/person/${person.id}`} className="btn-link">
                    {person.name || '-'}
                  </Link>
                </div>
                <div className="hr"></div>
                <small className="text m-0">
                  {person.character || (person.job ? person.job : '') || (person.roles && person.roles.length > 0 ? person.roles[0].character : '') || (person.jobs && person.jobs.length > 0 ? person.jobs[0].job : '') || '-'}
                </small>
                <div className="hr"></div>
                <small className="text m-0">{person.department || person.known_for_department || '-'}</small>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="d-flex justify-content-center pt-4">
          <SpinnerCustom />
        </div>
      )}
    </div>
  );
};

export default Peoples;
