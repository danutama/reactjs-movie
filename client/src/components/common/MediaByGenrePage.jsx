import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Container from '../ui/Container';
import Card from '../ui/Card';
import ButtonSeeMore from '../ui/ButtonSeeMore';
import SpinnerCustom from '../ui/SpinnerCustom';
import { FaStar } from 'react-icons/fa';
import { getYear, formatVoteAverage } from '../../utils/Helper';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';

const MediaByGenrePage = ({ fetchItemsByGenre, fetchGenres, itemType, storageKeyPrefix, detailPathPrefix }) => {
  // Initialize scroll restoration hook
  useScrollRestoration({
    debounceMs: 50,
    restoreDelay: 100,
  });

  const { genreId } = useParams();
  const navigate = useNavigate();

  // State management
  const [items, setItems] = useState([]);
  const [genreName, setGenreName] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false); // Prevent multiple fetches simultaneously

  // Keys for sessionStorage
  const itemsKey = `genre-${genreId}${storageKeyPrefix}`;
  const pageKey = `genre-${genreId}Page`;

  // Fetch genre name and initial items
  useEffect(() => {
    const savedItems = sessionStorage.getItem(itemsKey);
    const savedPage = sessionStorage.getItem(pageKey);

    if (savedItems && savedPage) {
      // Load from session storage if available
      setItems(JSON.parse(savedItems));
      setPage(Number(savedPage));
      setLoading(false);
    } else {
      // Fetch genres and items if not cached
      const fetchData = async () => {
        try {
          const [genreData, itemsData] = await Promise.all([fetchGenres(), fetchItemsByGenre(genreId, 1)]);

          // Find the selected genre
          const currentGenre = genreData.find((g) => g.id === parseInt(genreId, 10));
          if (!currentGenre) {
            navigate('/404');
            return;
          }

          // Remove duplicates
          const unique = Array.from(new Map(itemsData.map((item) => [item.id, item])).values());

          setGenreName(currentGenre.name);
          setItems(unique);
          setPage(1);
          setHasMore(itemsData.length > 0);
          setLoading(false);

          sessionStorage.setItem(itemsKey, JSON.stringify(unique));
          sessionStorage.setItem(pageKey, '1');
        } catch (err) {
          console.error('Initial fetch error:', err);
          navigate('/404');
        }
      };

      fetchData();
    }
  }, [genreId, fetchGenres, fetchItemsByGenre, storageKeyPrefix, navigate, itemsKey, pageKey]);

  // Update page title with genre name
  useEffect(() => {
    if (genreName) {
      document.title = `${itemType === 'movie' ? 'Movie Genre' : 'TV Show Genre'} | ${genreName}`;
    }
  }, [genreName, itemType]);

  // Load more items with debounce logic using ref
  const loadMoreItems = async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setLoadingMore(true);

    const nextPage = page + 1;
    try {
      const newData = await fetchItemsByGenre(genreId, nextPage);
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        // Combine and remove duplicates
        const combined = [...items, ...newData];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        setItems(unique);
        setPage(nextPage);

        sessionStorage.setItem(itemsKey, JSON.stringify(unique));
        sessionStorage.setItem(pageKey, nextPage.toString());
      }
    } catch (err) {
      console.error('Load more error:', err);
    } finally {
      isFetchingRef.current = false;
      setLoadingMore(false);
    }
  };

  return (
    <Container>
      {loading ? (
        // Show loading spinner during initial fetch
        <div className="d-flex justify-content-center">
          <SpinnerCustom />
        </div>
      ) : (
        <>
          <div className="row g-2">
            {items.map((item) => (
              <div key={item.id} className="col-lg-2 col-md-4 col-6">
                <Card>
                  {/* Lazy load images for better performance */}
                  <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.webp" alt="loading" className="card-img-top" />}>
                    <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/default-poster.webp'} className="card-img-top" alt={item.title || item.name} />
                  </LazyLoad>
                  <div className="card-body">
                    {/* Release year and rating */}
                    <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
                      <small className="text-secondary">{getYear(item.release_date || item.first_air_date)}</small>
                      <small className="text-secondary d-flex align-items-center">
                        <FaStar className="star-icon text-yellow me-1" />
                        {formatVoteAverage(item.vote_average)}
                      </small>
                    </div>
                    {/* Item title link */}
                    <div className="title-wrapper">
                      <Link to={`${detailPathPrefix}/${item.id}`} className="card-title text">
                        {item.title || item.name}
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* See more button if there are more items */}
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

export default MediaByGenrePage;
