import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { fetchTrendingMovies, fetchGenres } from '../../service/api';
import Container from '../ui/Container';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';
import { FaStar } from 'react-icons/fa';
import { getYear, formatVoteAverage } from '../../utils/Helper';

function TrendingMovies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [genreData, movieData] = await Promise.all([fetchGenres(), fetchTrendingMovies()]);
      setGenres(genreData);
      setMovies(movieData);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-baseline mb-3">
        <p className="h5 text m-0">Trending Movies</p>
        <Link to="/trending-movies" className="btn-link">
          <small>Explore</small>
        </Link>
      </div>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="overflow-auto scrollbar-custom">
          <div className="d-flex gap-2 justify-content-start">
            {movies.slice(0).map((movie) => (
              <div key={movie.id} className="col-lg-2 col-md-4 col-6 mb-2">
                <Card>
                  <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.png" alt="loading" className="card-img-top" />}>
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className="card-img-top" alt={movie.title} />
                  </LazyLoad>
                  <div className="card-body pb-4">
                    <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
                      <small className="text-secondary">{getYear(movie.release_date)}</small>
                      <small className="text-secondary d-flex align-items-center">
                        <FaStar className="star-icon text-yellow me-1" />
                        {formatVoteAverage(movie.vote_average)}
                      </small>
                    </div>
                    <div className="title-wrapper">
                      <Link to={`/movie/${movie.id}`} className="card-title text">
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
