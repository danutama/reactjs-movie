import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { fetchTrendingMovies } from '../../service/api';
import Container from '../ui/Container';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';
import { FaStar } from 'react-icons/fa';
import { getYear, formatVoteAverage } from '../../utils/Helper';

function TrendingMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const movieData = await fetchTrendingMovies();
      setMovies(movieData);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-baseline mb-3">
        <p className="h5 text m-0">Trending Movies</p>
        <Link to="/movies/trending" className="btn-link">
          <small>Explore</small>
        </Link>
      </div>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="overflow-auto scrollbar-custom">
          <div className="d-flex gap-2 justify-content-start">
            {movies.map((movie) => (
              <div key={movie.id} className="col-sm-custom col-lg-2 col-md-4 col-6 mb-2">
                <Card>
                  <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.webp" alt="loading" className="card-img-top" />}>
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className="card-img-top" alt={movie.title} />
                  </LazyLoad>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
                      <small className="text-secondary">{getYear(movie.release_date)}</small>
                      <small className="text-secondary d-flex align-items-center">
                        <FaStar className="star-icon text-yellow me-1" />
                        {formatVoteAverage(movie.vote_average)}
                      </small>
                    </div>
                    <div className="title-wrapper">
                      <Link to={`/movies/${movie.id}`} className="card-title text">
                        {movie.title}
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}

export default TrendingMovies;
