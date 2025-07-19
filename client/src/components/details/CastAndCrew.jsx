import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Card from '../ui/Card';
import SpinnerCustom from '../ui/SpinnerCustom';

// Main component for displaying cast and crew section with lazy loading and infinite scroll
const CastAndCrew = ({ credits, creators }) => {
  const [visibleCount, setVisibleCount] = useState(10); // How many cast to display initially
  const [isLoading, setIsLoading] = useState(false); // Loading state for lazy loading

  const location = useLocation();
  const loaderRef = useRef(null); // Ref for the element to be observed by IntersectionObserver
  const debounceTimerRef = useRef(null); // Ref to prevent rapid scroll triggering
  const observerRef = useRef(null); // Ref to store the IntersectionObserver instance

  // Check if the current page is for a TV show
  const isTVShow = location.pathname.startsWith('/tv/');

  // Load more cast entries when scrolled near the bottom
  const loadMore = useCallback(() => {
    if (!isLoading && visibleCount < credits.length) {
      setIsLoading(true);
      setTimeout(() => {
        setVisibleCount((prev) => prev + 10); // Load 10 more
        setIsLoading(false);
      }, 800);
    }
  }, [isLoading, visibleCount, credits.length]);

  // Debounce wrapper to limit loadMore execution frequency
  const debouncedLoadMore = useCallback(() => {
    if (debounceTimerRef.current) return;
    debounceTimerRef.current = setTimeout(() => {
      loadMore();
      debounceTimerRef.current = null;
    }, 300);
  }, [loadMore]);

  // Setup IntersectionObserver for infinite scrolling
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          debouncedLoadMore();
        }
      },
      { root: null, rootMargin: '0px', threshold: 1.0 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observerRef.current.observe(currentLoader);

    return () => {
      if (currentLoader) observerRef.current.unobserve(currentLoader);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [debouncedLoadMore]);

  // Filter specific roles from credits
  const directors = credits.filter((p) => p.job === 'Director');
  const writers = credits.filter((p) => p.job === 'Writer' || p.job === 'Novel' || p.department === 'Writing');
  const screenplays = credits.filter((p) => p.job === 'Screenplay');

  return (
    <div className="peoples">
      <div className="mb-5">
        {/* Show Director (for movies only) */}
        {!isTVShow && (
          <>
            <small className="text-secondary m-0 lh-lg">
              Director: <span className="text-tertiary">{directors.length > 0 ? directors.map((d) => d.name).join(', ') : '-'}</span>
            </small>
            <div className="hr"></div>
          </>
        )}

        {/* Show Creator (for TV shows only) */}
        {isTVShow && creators?.length > 0 && (
          <>
            <small className="text-secondary m-0 lh-lg">
              Creator: <span className="text-tertiary">{creators.map((c) => c.name).join(', ')}</span>
            </small>
            <div className="hr"></div>
          </>
        )}

        {/* Writers */}
        <small className="text-secondary m-0 lh-lg">
          Writers: <span className="text-tertiary">{writers.length > 0 ? writers.map((w) => w.name).join(', ') : '-'}</span>
        </small>
        <div className="hr"></div>

        {/* Screenplay */}
        <small className="text-secondary m-0 lh-lg">
          Screenplay: <span className="text-tertiary">{screenplays.length > 0 ? screenplays.map((s) => s.name).join(', ') : '-'}</span>
        </small>
        <div className="hr"></div>
      </div>

      {/* Cast & Crew Cards */}
      <p className="h5 text fw-bold mb-3">Cast & Crew</p>
      <div className="row g-2">
        {credits.slice(0, visibleCount).map((person, index) => (
          <div key={`${person.id}-${index}`} className="col-lg-2 col-md-3 col-sm-4 col-6">
            <Card>
              {/* Lazy load image */}
              <LazyLoad height={200} offset={100} placeholder={<img src="/profile.png" alt="loading" className="card-img-top" />}>
                <img src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : '/profile.png'} className="card-img-top" alt={person.name || 'Default profile'} />
              </LazyLoad>

              {/* Person info */}
              <div className="card-body">
                <div className="title-wrapper">
                  <Link to={`/people/${person.id}`} className="btn-link">
                    {person.name || '-'}
                  </Link>
                </div>
                <div className="hr"></div>
                <small className="text m-0">{person.character || person.job || person.roles?.[0]?.character || person.jobs?.[0]?.job || '-'}</small>
                <div className="hr"></div>
                <small className="text m-0">{person.department || person.known_for_department || '-'}</small>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Loader shown when loading more */}
      <div ref={loaderRef} className="d-flex justify-content-center pt-4">
        {isLoading && <SpinnerCustom />}
      </div>
    </div>
  );
};

export default CastAndCrew;
