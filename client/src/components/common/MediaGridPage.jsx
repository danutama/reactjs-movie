import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Container from '../ui/Container';
import Card from '../ui/Card';
import ButtonSeeMore from '../ui/ButtonSeeMore';
import SpinnerCustom from '../ui/SpinnerCustom';
import { FaStar } from 'react-icons/fa';
import { getYear, formatVoteAverage } from '../../utils/Helper';

const MediaGridPage = ({ fetchFunction, itemType, storageKeyPrefix }) => {
  // State variables
  const [items, setItems] = useState([]); // Media items list
  const [page, setPage] = useState(1); // Current page
  const [loading, setLoading] = useState(true); // Initial loading
  const [hasMore, setHasMore] = useState(true); // If more data exists
  const [loadingMore, setLoadingMore] = useState(false); // Load-more loading

  // Session storage keys
  const itemsKey = `${storageKeyPrefix}Items`;
  const pageKey = `${storageKeyPrefix}Page`;

  // Load from sessionStorage or fetch initial data
  useEffect(() => {
    const savedItems = sessionStorage.getItem(itemsKey);
    const savedPage = sessionStorage.getItem(pageKey);

    if (savedItems) {
      setItems(JSON.parse(savedItems));
      setPage(Number(savedPage));
      setLoading(false);
    } else {
      const fetchInitial = async () => {
        try {
          const data = await fetchFunction(1);
          const unique = Array.from(new Map(data.map((item) => [item.id, item])).values());
          setItems(unique);
          setHasMore(data.length > 0);
          setLoading(false);

          // Save to sessionStorage
          sessionStorage.setItem(itemsKey, JSON.stringify(unique));
          sessionStorage.setItem(pageKey, '1');
        } catch (err) {
          console.error('Initial fetch error:', err);
          setLoading(false);
        }
      };
      fetchInitial();
    }
  }, [fetchFunction, itemsKey, pageKey]);

  // Load more data on button click
  const loadMoreItems = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextPage = page + 1;
    try {
      const data = await fetchFunction(nextPage);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        const combined = [...items, ...data];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        setItems(unique);
        setPage(nextPage);

        // Update sessionStorage
        sessionStorage.setItem(itemsKey, JSON.stringify(unique));
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
            {items.map((item) => (
              <div key={item.id} className="col-lg-2 col-md-4 col-6">
                <Card>
                  <Link to={`/${itemType === 'movie' ? 'movies' : 'tv-shows'}/${item.id}`}>
                    <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.webp" alt="loading" className="card-img-top" />}>
                      <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/default-poster.webp'} className="card-img-top" alt={item.title || item.name} />
                    </LazyLoad>
                  </Link>

                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
                      <small className="text-secondary">{getYear(item.release_date || item.first_air_date)}</small>
                      <small className="text-secondary d-flex align-items-center">
                        <FaStar className="star-icon text-yellow me-1" />
                        {formatVoteAverage(item.vote_average)}
                      </small>
                    </div>

                    <div className="title-wrapper">
                      <p className="card-title text m-0">{item.title || item.name}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-4">
              <ButtonSeeMore onClick={loadMoreItems} disabled={loadingMore} />
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default MediaGridPage;
