import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { fetchMoviesByGenre, fetchGenres } from '../../service/api';
import Container from '../ui/Container';
import Card from '../ui/Card';
import { FaStar } from 'react-icons/fa';
import { getYear, formatVoteAverage } from '../../utils/Helper';
import ButtonSeeMore from '../ui/ButtonSeeMore';
import SpinnerCustom from '../ui/SpinnerCustom';

const MovieByGenre = () => {
  const { genreId } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genreName, setGenreName] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genreData, movieData] = await Promise.all([fetchGenres(), fetchMoviesByGenre(genreId, page)]);

        const currentGenre = genreData.find((genre) => genre.id === parseInt(genreId, 10));
        if (!currentGenre) {
          navigate('/404');
          return;
        }

        const uniqueMovies = Array.from(new Map(movieData.map((movie) => [movie.id, movie])).values());

        setGenres(genreData);
        setMovies(uniqueMovies);
        setLoading(false);
        setHasMore(movieData.length > 0);

        const name = currentGenre.name;
        setGenreName(name);

        document.title = name ? `React Movie | ${name}` : 'React Movie';

        sessionStorage.setItem(`genre-${genreId}Movies`, JSON.stringify(uniqueMovies));
        sessionStorage.setItem(`genre-${genreId}Page`, page.toString());
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/404');
      }
    };

    const savedMovies = sessionStorage.getItem(`genre-${genreId}Movies`);
    const savedPage = sessionStorage.getItem(`genre-${genreId}Page`);

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
  }, [genreId, page, navigate]);

  useEffect(() => {
    document.title = genreName ? `React Movie | ${genreName}` : 'React Movie';
  }, [genreName]);

  const loadMoreMovies = async () => {
    const nextPage = page + 1;
    try {
      const movieData = await fetchMoviesByGenre(genreId, nextPage);

      if (movieData.length === 0) {
        setHasMore(false);
        return;
      }

      const updatedMovies = Array.from(new Map([...movies, ...movieData].map((movie) => [movie.id, movie])).values());

      setMovies(updatedMovies);
      setPage(nextPage);

      sessionStorage.setItem(`genre-${genreId}Movies`, JSON.stringify(updatedMovies));
      sessionStorage.setItem(`genre-${genreId}Page`, nextPage.toString());
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
                  <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.png" alt="loading" className="card-img-top" />}>
                    <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/default-poster.png'} className="card-img-top" alt={movie.title} />
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

export default MovieByGenre;
