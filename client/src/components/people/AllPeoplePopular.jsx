import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Container from '../ui/Container';
import Card from '../ui/Card';
import ButtonSeeMore from '../ui/ButtonSeeMore';
import SpinnerCustom from '../ui/SpinnerCustom';
import { fetchPopularPeople } from '../../service/api';

const AllPeoplePopular = () => {
  // State management
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Keys for session storage
  const storageKeyPrefix = 'popularPeople';
  const peopleKey = `${storageKeyPrefix}Items`;
  const pageKey = `${storageKeyPrefix}Page`;

  // Initial data fetch or retrieve from sessionStorage
  useEffect(() => {
    const savedPeople = sessionStorage.getItem(peopleKey);
    const savedPage = sessionStorage.getItem(pageKey);

    if (savedPeople) {
      // Load data from sessionStorage
      setPeople(JSON.parse(savedPeople));
      setPage(Number(savedPage));
      setLoading(false);
    } else {
      // Fetch initial data from API
      const fetchInitial = async () => {
        try {
          const data = await fetchPopularPeople(1);
          const unique = Array.from(new Map(data.map((p) => [p.id, p])).values());
          setPeople(unique);
          setHasMore(data.length > 0);
          setLoading(false);
          sessionStorage.setItem(peopleKey, JSON.stringify(unique));
          sessionStorage.setItem(pageKey, '1');
        } catch (err) {
          console.error('Initial fetch error:', err);
          setLoading(false);
        }
      };
      fetchInitial();
    }

    // Save scroll position on unload
    const saveScroll = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    window.addEventListener('beforeunload', saveScroll);
    window.addEventListener('pagehide', saveScroll);

    return () => {
      window.removeEventListener('beforeunload', saveScroll);
      window.removeEventListener('pagehide', saveScroll);
    };
  }, []);

  // Restore scroll position on mount
  useEffect(() => {
    const pos = sessionStorage.getItem('scrollPosition');
    if (pos) window.scrollTo(0, parseInt(pos, 10));
  }, []);

  // Fetch more people on "See More" button click
  const loadMorePeople = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextPage = page + 1;
    try {
      const data = await fetchPopularPeople(nextPage);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        const combined = [...people, ...data];
        const unique = Array.from(new Map(combined.map((p) => [p.id, p])).values());
        setPeople(unique);
        setPage(nextPage);
        sessionStorage.setItem(peopleKey, JSON.stringify(unique));
        sessionStorage.setItem(pageKey, nextPage.toString());
      }
    } catch (err) {
      console.error('Load more error:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Container>
      {loading ? (
        // Show loading spinner while initial data is being fetched
        <div className="d-flex justify-content-center">
          <SpinnerCustom />
        </div>
      ) : (
        <>
          {/* Display list of popular people */}
          <div className="row g-2">
            {people.map((person) => (
              <div key={person.id} className="col-lg-2 col-md-3 col-4">
                <Card>
                  {/* Lazy load profile image */}
                  <LazyLoad height={200} offset={100} placeholder={<img src="/profile.png" alt="loading" className="card-img-top" />}>
                    <img src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : '/profile.png'} className="card-img-top" alt={person.name} />
                  </LazyLoad>
                  <div className="card-body px-2 pb-3">
                    {/* Display person's name with link to their detail page */}
                    <div className="title-wrapper">
                      <Link to={`/people/${person.id}`} className="card-title text">
                        {person.name}
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* See more button if more people exist */}
          {hasMore && (
            <div className="text-center mt-4">
              <ButtonSeeMore onClick={loadMorePeople} disabled={loadingMore} />
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default AllPeoplePopular;
