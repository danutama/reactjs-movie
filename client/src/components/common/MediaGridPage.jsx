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
  // State management
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Session storage keys
  const itemsKey = `${storageKeyPrefix}Items`;
  const pageKey = `${storageKeyPrefix}Page`;

  // Load initial data from sessionStorage or fetch from API
  useEffect(() => {
    const savedItems = sessionStorage.getItem(itemsKey);
    const savedPage = sessionStorage.getItem(pageKey);

    if (savedItems) {
      // Restore from session storage
      setItems(JSON.parse(savedItems));
      setPage(Number(savedPage));
      setLoading(false);
    } else {
      // Fetch initial data
      const fetchInitial = async () => {
        try {
          const data = await fetchFunction(1);
          // Remove duplicate entries based on ID
          const unique = Array.from(new Map(data.map((item) => [item.id, item])).values());
          setItems(unique);
          setHasMore(data.length > 0);
          setLoading(false);
          sessionStorage.setItem(itemsKey, JSON.stringify(unique));
          sessionStorage.setItem(pageKey, '1');
        } catch (err) {
          console.error('Initial fetch error:', err);
          setLoading(false);
        }
      };
      fetchInitial();
    }

    // Save scroll position before unload
    const saveScroll = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    window.addEventListener('beforeunload', saveScroll);
    window.addEventListener('pagehide', saveScroll);

    return () => {
      window.removeEventListener('beforeunload', saveScroll);
      window.removeEventListener('pagehide', saveScroll);
    };
  }, [fetchFunction, itemsKey, pageKey]);

  // Restore scroll position on mount
  useEffect(() => {
    const pos = sessionStorage.getItem('scrollPosition');
    if (pos) window.scrollTo(0, parseInt(pos, 10));
  }, []);

  // Load more items with pagination and avoid duplicate loading
  const loadMoreItems = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextPage = page + 1;
    try {
      const data = await fetchFunction(nextPage);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        // Combine new data with previous items and remove duplicates
        const combined = [...items, ...data];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        setItems(unique);
        setPage(nextPage);
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
        // Show loading spinner while fetching data
        <div className="d-flex justify-content-center">
          <SpinnerCustom />
        </div>
      ) : (
        <>
          <div className="row g-2">
            {items.map((item) => (
              <div key={item.id} className="col-lg-2 col-md-4 col-6">
                <Card>
                  {/* Lazy load images for performance */}
                  <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.webp" alt="loading" className="card-img-top" />}>
                    <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/default-poster.webp'} className="card-img-top" alt={item.title || item.name} />
                  </LazyLoad>
                  <div className="card-body">
                    {/* Show release year and vote average */}
                    <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
                      <small className="text-secondary">{getYear(item.release_date || item.first_air_date)}</small>
                      <small className="text-secondary d-flex align-items-center">
                        <FaStar className="star-icon text-yellow me-1" />
                        {formatVoteAverage(item.vote_average)}
                      </small>
                    </div>
                    {/* Media title with link */}
                    <div className="title-wrapper">
                      <Link to={`/${itemType === 'movie' ? 'movies' : 'tv-shows'}/${item.id}`} className="card-title text">
                        {item.title || item.name}
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Show "See More" button if there are more items to load */}
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
