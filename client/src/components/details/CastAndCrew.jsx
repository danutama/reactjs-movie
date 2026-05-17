import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Card from '../ui/Card';
import SpinnerCustom from '../ui/SpinnerCustom';

const INITIAL_COUNT = 10;
const LOAD_MORE_COUNT = 10;
const LOAD_DELAY = 800;

const getPersonRole = (person) => person.character || person.job || person.roles?.[0]?.character || person.jobs?.[0]?.job || '-';

const CastAndCrew = ({ credits = [], creators = [] }) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const loaderRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const observerRef = useRef(null);

  const isTVShow = location.pathname.startsWith('/tv/');

  // Reset saat credits berubah (navigasi ke film/tv lain)
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [credits]);

  // Deduplikasi credits berdasarkan id + role — hindari orang sama muncul dua kali
  const deduplicatedCredits = useMemo(() => {
    const seen = new Set();
    return credits.filter((person) => {
      const key = `${person.id}-${getPersonRole(person)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [credits]);

  // Pre-filter crew roles
  const directors = useMemo(() => deduplicatedCredits.filter((p) => p.job === 'Director'), [deduplicatedCredits]);
  const writers = useMemo(() => deduplicatedCredits.filter((p) => p.job === 'Writer' || p.job === 'Novel' || p.department === 'Writing'), [deduplicatedCredits]);
  const screenplays = useMemo(() => deduplicatedCredits.filter((p) => p.job === 'Screenplay'), [deduplicatedCredits]);

  const hasMore = visibleCount < deduplicatedCredits.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
      setIsLoading(false);
    }, LOAD_DELAY);
  }, [isLoading, hasMore]);

  const debouncedLoadMore = useCallback(() => {
    if (debounceTimerRef.current) return;
    debounceTimerRef.current = setTimeout(() => {
      loadMore();
      debounceTimerRef.current = null;
    }, 300);
  }, [loadMore]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) debouncedLoadMore();
      },
      { root: null, rootMargin: '0px', threshold: 1.0 },
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observerRef.current.observe(currentLoader);

    return () => {
      if (currentLoader) observerRef.current.unobserve(currentLoader);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [debouncedLoadMore]);

  const formatNames = (list) => (list.length > 0 ? list.map((p) => p.name).join(', ') : '-');

  return (
    <div className="peoples">
      <div className="mb-5">
        {!isTVShow && (
          <>
            <small className="text-secondary m-0 lh-lg">
              Director: <span className="text-tertiary">{formatNames(directors)}</span>
            </small>
            <div className="hr"></div>
          </>
        )}

        {isTVShow && creators.length > 0 && (
          <>
            <small className="text-secondary m-0 lh-lg">
              Creator: <span className="text-tertiary">{formatNames(creators)}</span>
            </small>
            <div className="hr"></div>
          </>
        )}

        <small className="text-secondary m-0 lh-lg">
          Writers: <span className="text-tertiary">{formatNames(writers)}</span>
        </small>
        <div className="hr"></div>

        <small className="text-secondary m-0 lh-lg">
          Screenplay: <span className="text-tertiary">{formatNames(screenplays)}</span>
        </small>
        <div className="hr"></div>
      </div>

      <p className="h5 text fw-bold mb-3">Cast & Crew</p>

      <div className="row g-2">
        {deduplicatedCredits.slice(0, visibleCount).map((person, index) => (
          <div key={`${person.id}-${index}`} className="col-lg-2 col-md-3 col-sm-4 col-6">
            <Card>
              <Link to={`/people/${person.id}`}>
                <LazyLoad height={200} offset={100} placeholder={<img src="/profile.png" alt="loading" className="card-img-top" />}>
                  <img src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : '/profile.png'} className="card-img-top" alt={person.name || 'Default profile'} />
                </LazyLoad>
              </Link>

              <div className="card-body">
                <div className="title-wrapper">
                  <p className="card-title text m-0">{person.name || '-'}</p>
                </div>
                <div className="hr"></div>
                <small className="text text-secondary m-0">{getPersonRole(person)}</small>
                <div className="hr"></div>
                <small className="text text-secondary m-0">{person.department || person.known_for_department || '-'}</small>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div ref={loaderRef} className="d-flex justify-content-center pt-4">
        {isLoading && <SpinnerCustom />}
      </div>
    </div>
  );
};

export default CastAndCrew;
