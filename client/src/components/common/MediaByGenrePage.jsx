import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Container from '../ui/Container';
import Card from '../ui/Card';
import ButtonSeeMore from '../ui/ButtonSeeMore';
import SpinnerCustom from '../ui/SpinnerCustom';
import { FaStar } from 'react-icons/fa';
import { getYear, formatVoteAverage } from '../../utils/Helper';

const MediaByGenrePage = ({
  fetchItemsByGenre, // Function to fetch items by genre
  fetchGenres, // Function to fetch available genres
  itemType, // "movie" or "tv"
  storageKeyPrefix, // Used to namespace session storage keys
  detailPathPrefix, // Path prefix for detail page (e.g., "/movie")
}) => {
  const { genreId } = useParams(); // Get genre ID from URL
  const navigate = useNavigate(); // For redirecting (e.g., 404)

  // State variables
  const [items, setItems] = useState([]); // Fetched media items
  const [genreName, setGenreName] = useState(''); // Genre display name
  const [page, setPage] = useState(1); // Current page number
  const [loading, setLoading] = useState(true); // Loading indicator (initial)
  const [loadingMore, setLoadingMore] = useState(false); // Loading for pagination
  const [hasMore, setHasMore] = useState(true); // If more items can be loaded
  const isFetchingRef = useRef(false); // Prevent concurrent fetch

  // Session storage keys
  const itemsKey = `genre-${genreId}${storageKeyPrefix}`;
  const pageKey = `genre-${genreId}Page`;

  // Fetch data on mount or when genreId changes
  useEffect(() => {
    const savedItems = sessionStorage.getItem(itemsKey);
    const savedPage = sessionStorage.getItem(pageKey);

    // Restore from sessionStorage if exists
    if (savedItems && savedPage) {
      setItems(JSON.parse(savedItems));
      setPage(Number(savedPage));
      setLoading(false);
    } else {
      const fetchData = async () => {
        try {
          const [genreData, itemsData] = await Promise.all([fetchGenres(), fetchItemsByGenre(genreId, 1)]);

          const currentGenre = genreData.find((g) => g.id === parseInt(genreId, 10));
          if (!currentGenre) {
            navigate('/404');
            return;
          }

          const unique = Array.from(new Map(itemsData.map((item) => [item.id, item])).values());

          setGenreName(currentGenre.name);
          setItems(unique);
          setPage(1);
          setHasMore(itemsData.length > 0);
          setLoading(false);

          // Save to sessionStorage
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

  // Set page title based on genre
  useEffect(() => {
    if (genreName) {
      document.title = `${itemType === 'movie' ? 'Movie Genre' : 'TV Show Genre'} | ${genreName}`;
    }
  }, [genreName, itemType]);

  // Load next page of items
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
        const combined = [...items, ...newData];
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
      isFetchingRef.current = false;
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
                  <Link to={`${detailPathPrefix}/${item.id}`}>
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

          {/* Load more button */}
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
