import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Container from '../ui/Container';
import Card from '../ui/Card';
import ButtonSeeMore from '../ui/ButtonSeeMore';
import SpinnerCustom from '../ui/SpinnerCustom';
import { FaStar } from 'react-icons/fa';
import { getYear, formatVoteAverage } from '../../utils/Helper';

const MediaByGenrePage = ({ fetchItemsByGenre, fetchGenres, itemType, storageKeyPrefix, detailPathPrefix }) => {
  const { genreId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [genreName, setGenreName] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genreData, itemsData] = await Promise.all([fetchGenres(), fetchItemsByGenre(genreId, page)]);

        const currentGenre = genreData.find((genre) => genre.id === parseInt(genreId, 10));
        if (!currentGenre) {
          navigate('/404');
          return;
        }

        const uniqueItems = Array.from(new Map(itemsData.map((item) => [item.id, item])).values());

        setItems(uniqueItems);
        setLoading(false);
        setHasMore(itemsData.length > 0);

        setGenreName(currentGenre.name);

        document.title = `React ${itemType === 'movie' ? 'Movie' : 'TV Show'} | ${currentGenre.name}`;

        sessionStorage.setItem(`genre-${genreId}${storageKeyPrefix}`, JSON.stringify(uniqueItems));
        sessionStorage.setItem(`genre-${genreId}Page`, page.toString());
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/404');
      }
    };

    const savedItems = sessionStorage.getItem(`genre-${genreId}${storageKeyPrefix}`);
    const savedPage = sessionStorage.getItem(`genre-${genreId}Page`);

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
  }, [genreId, page, fetchGenres, fetchItemsByGenre, storageKeyPrefix, navigate, itemType]);

  useEffect(() => {
    document.title = genreName ? `React ${itemType === 'movie' ? 'Movie' : 'TV Show'} | ${genreName}` : 'React App';
  }, [genreName, itemType]);

  const loadMoreItems = async () => {
    const nextPage = page + 1;
    try {
      const newData = await fetchItemsByGenre(genreId, nextPage);
      if (newData.length === 0) {
        setHasMore(false);
        return;
      }

      const updatedItems = Array.from(new Map([...items, ...newData].map((item) => [item.id, item])).values());
      setItems(updatedItems);
      setPage(nextPage);

      sessionStorage.setItem(`genre-${genreId}${storageKeyPrefix}`, JSON.stringify(updatedItems));
      sessionStorage.setItem(`genre-${genreId}Page`, nextPage.toString());
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
                      <Link to={`${detailPathPrefix}/${item.id}`} className="card-title text">
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

export default MediaByGenrePage;
