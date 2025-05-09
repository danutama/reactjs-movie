import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { fetchLatestMovies } from '../../service/api';
import Container from '../ui/Container';
import Card from '../ui/Card';
import { FaStar } from 'react-icons/fa';
import { getYear, formatVoteAverage } from '../../utils/Helper';
import ButtonSeeMore from '../ui/ButtonSeeMore';
import SpinnerCustom from '../ui/SpinnerCustom';

const AllLatestMovie = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const storageKeyPrefix = 'latest';
  const moviesKey = `${storageKeyPrefix}Movies`;
  const pageKey = `${storageKeyPrefix}Page`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieData = await fetchLatestMovies(page);

        const uniqueMovies = Array.from(new Map(movieData.map((movie) => [movie.id, movie])).values());

        setMovies(uniqueMovies);
        setLoading(false);
        setHasMore(movieData.length > 0);

        sessionStorage.setItem(moviesKey, JSON.stringify(uniqueMovies));
        sessionStorage.setItem(pageKey, page.toString());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const savedMovies = sessionStorage.getItem(moviesKey);
    const savedPage = sessionStorage.getItem(pageKey);

    if (savedMovies) {
      setMovies(JSON.parse(savedMovies));
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
  }, [page]);

  const loadMoreMovies = async () => {
    const nextPage = page + 1;
    try {
      const movieData = await fetchLatestMovies(nextPage);

      if (movieData.length === 0) {
        setHasMore(false);
        return;
      }

      // Filter out duplicate movies by ID
      const updatedMovies = Array.from(new Map([...movies, ...movieData].map((movie) => [movie.id, movie])).values());

      setMovies(updatedMovies);
      setPage(nextPage);

      sessionStorage.setItem(moviesKey, JSON.stringify(updatedMovies));
      sessionStorage.setItem(pageKey, nextPage.toString());
    } catch (error) {
      console.error('Error loading more movies:', error);
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
            {movies.map((movie) => (
              <div key={movie.id} className="col-lg-2 col-md-4 col-6">
                <Card>
                  <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.webp" alt="loading" className="card-img-top" />}>
                    <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/default-poster.webp'} className="card-img-top" alt={movie.title} />
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

          {hasMore && (
            <div className="text-center mt-4">
              <ButtonSeeMore onClick={loadMoreMovies} />
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default AllLatestMovie;
