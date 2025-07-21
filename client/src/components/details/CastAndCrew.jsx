import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Card from '../ui/Card';
import SpinnerCustom from '../ui/SpinnerCustom';

// Displays cast & crew list with infinite scroll and role highlights
const CastAndCrew = ({ credits, creators }) => {
  const [visibleCount, setVisibleCount] = useState(10); // Controls how many people are shown
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state for spinner
  const location = useLocation(); // Detect current route
  const loaderRef = useRef(null); // Ref for the spinner that triggers more loading
  const debounceTimerRef = useRef(null); // Ref to store debounce timeout
  const observerRef = useRef(null); // Ref for the IntersectionObserver instance

  // Determine if current page is a TV show (to show creator instead of director)
  const isTVShow = location.pathname.startsWith('/tv/');

  // Load more visible people (adds 10 each time)
  const loadMore = useCallback(() => {
    if (!isLoading && visibleCount < credits.length) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleCount((prev) => prev + 10);
        setIsLoading(false);
      }, 800); // Simulated delay
    }
  }, [isLoading, visibleCount, credits.length]);

  // Debounce loadMore calls to avoid flooding
  const debouncedLoadMore = useCallback(() => {
    if (debounceTimerRef.current) return;
    debounceTimerRef.current = setTimeout(() => {
      loadMore();
      debounceTimerRef.current = null;
    }, 300);
  }, [loadMore]);

  // Setup IntersectionObserver to trigger loadMore when loader is visible
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect(); // Disconnect old observer

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          debouncedLoadMore(); // Trigger load if spinner in view
        }
      },
      { root: null, rootMargin: '0px', threshold: 1.0 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observerRef.current.observe(currentLoader);

    return () => {
      // Clean up on component unmount
      if (currentLoader) observerRef.current.unobserve(currentLoader);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [debouncedLoadMore]);

  // Pre-filter important crew roles
  const directors = credits.filter((p) => p.job === 'Director');
  const writers = credits.filter((p) => p.job === 'Writer' || p.job === 'Novel' || p.department === 'Writing');
  const screenplays = credits.filter((p) => p.job === 'Screenplay');

  return (
    <div className="peoples">
      {/* Header section for main credits (director, creator, writers) */}
      <div className="mb-5">
        {!isTVShow && (
          <>
            <small className="text-secondary m-0 lh-lg">
              Director: <span className="text-tertiary">{directors.length > 0 ? directors.map((d) => d.name).join(', ') : '-'}</span>
            </small>
            <div className="hr"></div>
          </>
        )}

        {isTVShow && creators?.length > 0 && (
          <>
            <small className="text-secondary m-0 lh-lg">
              Creator: <span className="text-tertiary">{creators.map((c) => c.name).join(', ')}</span>
            </small>
            <div className="hr"></div>
          </>
        )}

        <small className="text-secondary m-0 lh-lg">
          Writers: <span className="text-tertiary">{writers.length > 0 ? writers.map((w) => w.name).join(', ') : '-'}</span>
        </small>
        <div className="hr"></div>

        <small className="text-secondary m-0 lh-lg">
          Screenplay: <span className="text-tertiary">{screenplays.length > 0 ? screenplays.map((s) => s.name).join(', ') : '-'}</span>
        </small>
        <div className="hr"></div>
      </div>

      {/* Cast & crew section title */}
      <p className="h5 text fw-bold mb-3">Cast & Crew</p>

      {/* Grid of cast/crew members */}
      <div className="row g-2">
        {credits.slice(0, visibleCount).map((person, index) => (
          <div key={`${person.id}-${index}`} className="col-lg-2 col-md-3 col-sm-4 col-6">
            <Card>
              <Link to={`/people/${person.id}`}>
                <LazyLoad height={200} offset={100} placeholder={<img src="/profile.png" alt="loading" className="card-img-top" />}>
                  <img src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : '/profile.png'} className="card-img-top" alt={person.name || 'Default profile'} />
                </LazyLoad>
              </Link>

              <div className="card-body">
                {/* Name with ellipsis support */}
                <div className="title-wrapper">
                  <p className="card-title text m-0">{person.name || '-'}</p>
                </div>
                <div className="hr"></div>

                {/* Character or job name */}
                <small className="text text-secondary m-0">{person.character || person.job || person.roles?.[0]?.character || person.jobs?.[0]?.job || '-'}</small>
                <div className="hr"></div>

                {/* Department name */}
                <small className="text text-secondary m-0">{person.department || person.known_for_department || '-'}</small>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Spinner and loader ref to trigger infinite scroll */}
      <div ref={loaderRef} className="d-flex justify-content-center pt-4">
        {isLoading && <SpinnerCustom />}
      </div>
    </div>
  );
};

export default CastAndCrew;
