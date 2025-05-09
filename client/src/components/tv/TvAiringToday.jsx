import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { fetchTVAiringToday } from '../../service/api';
import Container from '../ui/Container';
import Card from '../ui/Card';
import SeeMoreCard from '../ui/SeeMoreCard';
import Skeleton from '../ui/Skeleton';
import { FaStar } from 'react-icons/fa';
import { getYear, formatVoteAverage } from '../../utils/Helper';

function TvAiringToday() {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const tvData = await fetchTVAiringToday();
      setTvShows(tvData);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-baseline mb-3">
        <p className="h5 text m-0">TV Shows Airing Today</p>
        <Link to="/tv-shows/airing-today" className="btn-link">
          <small>Explore</small>
        </Link>
      </div>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="overflow-auto scrollbar-custom">
          <div className="d-flex gap-2 justify-content-start">
            {tvShows.map((show) => (
              <div key={show.id} className="col-sm-custom col-lg-2 col-md-4 col-6 mb-2">
                <Card>
                  <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.webp" alt="loading" className="card-img-top" />}>
                    <img src={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '/default-poster.webp'} className="card-img-top" alt={show.name} />
                  </LazyLoad>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
                      <small className="text-secondary">{getYear(show.first_air_date)}</small>
                      <small className="text-secondary d-flex align-items-center">
                        <FaStar className="star-icon text-yellow me-1" />
                        {formatVoteAverage(show.vote_average)}
                      </small>
                    </div>
                    <div className="title-wrapper">
                      <Link to={`/tv-shows/${show.id}`} className="card-title text">
                        {show.name}
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
            <div className="col-sm-custom col-lg-2 col-md-4 col-6 mb-2">
              <SeeMoreCard to="/tv-shows/airing-today" />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default TvAiringToday;
