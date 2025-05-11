import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Container from '../ui/Container';
import Card from '../ui/Card';
import SeeMoreCard from '../ui/SeeMoreCard';
import { getYear, formatVoteAverage } from '../../utils/Helper';
import Skeleton from '../ui/Skeleton';
import { FaStar } from 'react-icons/fa';

function MediaSlideSection({
  title,
  link,
  fetchFunction,
  itemType = 'movie', // 'movie' or 'tv'
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFunction();
      setItems(data);
      setLoading(false);
    };
    fetchData();
  }, [fetchFunction]);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-baseline mb-3">
        <p className="h5 text m-0">{title}</p>
        <Link to={link} className="btn-link">
          <small>Explore</small>
        </Link>
      </div>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="overflow-auto scrollbar-custom">
          <div className="d-flex gap-2 justify-content-start">
            {items.map((item) => (
              <div key={item.id} className="col-sm-custom col-lg-2 col-md-4 col-6 mb-2">
                <Card>
                  <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.webp" alt="loading" className="card-img-top" />}>
                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} className="card-img-top" alt={item.title || item.name} />
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
            <div className="col-sm-custom col-lg-2 col-md-4 col-6 mb-2">
              <SeeMoreCard to={link} />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default MediaSlideSection;
