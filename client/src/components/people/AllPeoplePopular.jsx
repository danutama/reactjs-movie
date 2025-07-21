import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Container from '../ui/Container';
import Card from '../ui/Card';
import ButtonSeeMore from '../ui/ButtonSeeMore';
import SpinnerCustom from '../ui/SpinnerCustom';
import { fetchPopularPeople } from '../../service/api';

const AllPeoplePopular = () => {
  const [people, setPeople] = useState([]); // List of popular people
  const [page, setPage] = useState(1); // Current page for pagination
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const [hasMore, setHasMore] = useState(true); // Whether more people can be loaded
  const [loadingMore, setLoadingMore] = useState(false); // Loading state for pagination fetch

  // Keys used for sessionStorage caching
  const storageKeyPrefix = 'popularPeople';
  const peopleKey = `${storageKeyPrefix}Items`;
  const pageKey = `${storageKeyPrefix}Page`;

  // On component mount, check if data exists in sessionStorage
  useEffect(() => {
    const savedPeople = sessionStorage.getItem(peopleKey);
    const savedPage = sessionStorage.getItem(pageKey);

    let parsedPeople = [];
    try {
      // Attempt to parse saved people from sessionStorage
      parsedPeople = savedPeople ? JSON.parse(savedPeople) : [];
    } catch (err) {
      console.error('Error parsing saved people from sessionStorage:', err);
    }

    // If session data is valid, restore state from it
    if (parsedPeople.length > 0) {
      setPeople(parsedPeople);
      setPage(Number(savedPage) || 1);
      setLoading(false);
    } else {
      // If no session data, fetch from API
      const fetchInitial = async () => {
        try {
          const data = await fetchPopularPeople(1); // Fetch first page
          // Remove duplicates using Map by ID
          const unique = Array.from(new Map(data.map((p) => [p.id, p])).values());
          setPeople(unique);
          setHasMore(data.length > 0);
          setLoading(false);
          // Cache result in sessionStorage
          sessionStorage.setItem(peopleKey, JSON.stringify(unique));
          sessionStorage.setItem(pageKey, '1');
        } catch (err) {
          console.error('Initial fetch error:', err);
          setLoading(false);
        }
      };
      fetchInitial();
    }
  }, []);

  // Load more people when the user clicks "See More"
  const loadMorePeople = async () => {
    // Prevent concurrent loads or unnecessary fetch
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const data = await fetchPopularPeople(nextPage);
      if (data.length === 0) {
        setHasMore(false); // No more data
      } else {
        // Combine and deduplicate people
        const combined = [...people, ...data];
        const unique = Array.from(new Map(combined.map((p) => [p.id, p])).values());
        setPeople(unique);
        setPage(nextPage);
        // Update sessionStorage
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
        <div className="d-flex justify-content-center">
          <SpinnerCustom />
        </div>
      ) : (
        <>
          <div className="row g-2">
            {people.map((person) => (
              <div key={person.id} className="col-lg-2 col-md-3 col-4">
                <Card>
                  <Link to={`/people/${person.id}`}>
                    <LazyLoad height={200} offset={100} placeholder={<img src="/profile.png" alt="loading" className="card-img-top" />}>
                      <img src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : '/profile.png'} className="card-img-top" alt={person.name} />
                    </LazyLoad>
                  </Link>
                  <div className="card-body px-2 pb-3">
                    <div className="title-wrapper">
                      <p className="card-title text m-0">{person.name}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* "See More" button if more data exists */}
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
