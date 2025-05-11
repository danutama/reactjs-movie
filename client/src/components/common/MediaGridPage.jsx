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
  useEffect(() => {
    if (!itemType) {
      console.warn('⚠️ Prop "itemType" is required but was not provided.');
    }
  }, []);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const itemsKey = `${storageKeyPrefix}Items`;
  const pageKey = `${storageKeyPrefix}Page`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFunction(page);
        const uniqueItems = Array.from(new Map(data.map((item) => [item.id, item])).values());
        setItems(uniqueItems);
        setLoading(false);
        setHasMore(data.length > 0);

        sessionStorage.setItem(itemsKey, JSON.stringify(uniqueItems));
        sessionStorage.setItem(pageKey, page.toString());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const savedItems = sessionStorage.getItem(itemsKey);
    const savedPage = sessionStorage.getItem(pageKey);

    if (savedItems) {
      setItems(JSON.parse(savedItems));
      setPage(Number(savedPage));
      setLoading(false);
    } else {
      fetchData();
    }

    const saveScrollPos = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };
    window.addEventListener('beforeunload', saveScrollPos);

    return () => {
      window.removeEventListener('beforeunload', saveScrollPos);
    };
  }, [fetchFunction, page]);

  const loadMoreItems = async () => {
    const nextPage = page + 1;
    try {
      const data = await fetchFunction(nextPage);
      if (data.length === 0) {
        setHasMore(false);
        return;
      }
      const updatedItems = Array.from(new Map([...items, ...data].map((item) => [item.id, item])).values());
      setItems(updatedItems);
      setPage(nextPage);

      sessionStorage.setItem(itemsKey, JSON.stringify(updatedItems));
      sessionStorage.setItem(pageKey, nextPage.toString());
    } catch (error) {
      console.error('Error loading more items:', error);
    }
  };

  useEffect(() => {
    const savedScrollPos = sessionStorage.getItem('scrollPosition');
    if (savedScrollPos) {
      window.scrollTo(0, parseInt(savedScrollPos, 10));
    }
  }, []);

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
                  <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.webp" alt="loading" className="card-img-top" />}>
                    <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/default-poster.webp'} className="card-img-top" alt={item.title || item.name} />
                  </LazyLoad>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
                      <small className="text-secondary">{getYear(item.release_date || item.first_air_date)}</small>
                      <small className="text-secondary d-flex align-items-center">
                        <FaStar className="star-icon text-yellow me-1" />
                        {formatVoteAverage(item.vote_average)}
                      </small>
                    </div>
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

          {hasMore && (
            <div className="text-center mt-4">
              <ButtonSeeMore onClick={loadMoreItems} />
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default MediaGridPage;
