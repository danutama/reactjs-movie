import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Container from '../ui/Container';
import Card from '../ui/Card';
import ButtonSeeMore from '../ui/ButtonSeeMore';
import SpinnerCustom from '../ui/SpinnerCustom';
import { FaStar } from 'react-icons/fa';
import { getYear, formatVoteAverage } from '../../utils/Helper';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const dedupeById = (list) => Array.from(new Map(list.map((item) => [item.id, item])).values());

const getCache = (key) => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setCache = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sessionStorage penuh atau tidak tersedia — skip
  }
};

// ─── Component ────────────────────────────────────────────────────────────────
const MediaByGenrePage = ({ fetchItemsByGenre, fetchGenres, itemType, storageKeyPrefix, detailPathPrefix }) => {
  const { genreId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [genreName, setGenreName] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);

  // 1 key per genre+type — simpan semua data dalam satu object
  const cacheKey = `genre-${storageKeyPrefix}-${genreId}`;

  useEffect(() => {
    const cache = getCache(cacheKey);

    if (cache?.items?.length > 0) {
      setItems(cache.items);
      setGenreName(cache.genreName || '');
      setPage(cache.page || 1);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [genreData, itemsData] = await Promise.all([fetchGenres(), fetchItemsByGenre(genreId, 1)]);

        const currentGenre = genreData.find((g) => g.id === parseInt(genreId, 10));
        if (!currentGenre) {
          navigate('/404');
          return;
        }

        const unique = dedupeById(itemsData);

        setGenreName(currentGenre.name);
        setItems(unique);
        setPage(1);
        setHasMore(itemsData.length > 0);
        setCache(cacheKey, { items: unique, genreName: currentGenre.name, page: 1 });
      } catch {
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genreId, cacheKey]);

  useEffect(() => {
    if (genreName) {
      document.title = `${itemType === 'movie' ? 'Movie Genre' : 'TV Show Genre'} | ${genreName}`;
    }
  }, [genreName, itemType]);

  const loadMoreItems = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setLoadingMore(true);

    const nextPage = page + 1;
    try {
      const newData = await fetchItemsByGenre(genreId, nextPage);

      if (newData.length === 0) {
        setHasMore(false);
        return;
      }

      setItems((prev) => {
        const unique = dedupeById([...prev, ...newData]);
        setCache(cacheKey, { items: unique, genreName, page: nextPage });
        return unique;
      });

      setPage(nextPage);
    } catch {
      // Gagal load more — biarkan state tetap, user bisa coba lagi
    } finally {
      isFetchingRef.current = false;
      setLoadingMore(false);
    }
  }, [genreId, page, hasMore, genreName, cacheKey, fetchItemsByGenre]);

  if (loading) {
    return (
      <Container>
        <div className="d-flex justify-content-center">
          <SpinnerCustom />
        </div>
      </Container>
    );
  }

  return (
    <Container>
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

      {hasMore && (
        <div className="text-center mt-4">
          <ButtonSeeMore onClick={loadMoreItems} disabled={loadingMore} />
        </div>
      )}
    </Container>
  );
};

export default MediaByGenrePage;
