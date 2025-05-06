import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { fetchMovieById, fetchGenres, fetchMovieCredits, fetchMovieTrailer } from '../../service/api';
import MovieTrailer from '../trailers/MovieTrailer';
import CastAndCrew from './CastAndCrew';
import Container from '../ui/Container';
import { FaStar } from 'react-icons/fa';
import { getYear, formatVoteAverage } from '../../utils/Helper';
import SpinnerCustom from '../ui/SpinnerCustom';
import ButtonToTop from '../ui/ButtonToTop';
import ToggleTextButton from '../ui/ToggleTextButton';

function SingleMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [credits, setCredits] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showFullOverview, setShowFullOverview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setMovie(null);
        setTrailerKey(null);
        setGenres([]);
        setCredits([]);

        const movieData = await fetchMovieById(id);
        if (!movieData || !movieData.title) {
          navigate('/404');
          return;
        }

        // Fetch genres and credits
        const genreData = await fetchGenres();
        const creditsData = await fetchMovieCredits(id);

        // Set state with fetched data
        setMovie(movieData);
        setGenres(genreData);
        setCredits(creditsData.cast.concat(creditsData.crew));

        // Fetch trailer for the movie
        const trailers = await fetchMovieTrailer(id);
        if (trailers.length > 0) {
          setTrailerKey(trailers[0].key);
        }

        document.title = `React Movie | ${movieData.title}`;
      } catch (error) {
        navigate('/404');
      }
    };

    fetchData();
  }, [id, navigate]);

  if (!movie) {
    return (
      <div className="d-flex justify-content-center pt-4 position-absolute top-50 start-50 translate-middle ">
        <SpinnerCustom />
      </div>
    );
  }

  const hasBackdropImage = Boolean(movie.backdrop_path);
  const hasImdbId = Boolean(movie.imdb_id);
  const hasStatus = Boolean(movie.status);
  const hasGenres = movie.genres && movie.genres.length > 0;
  const hasLanguage = movie.spoken_languages && movie.spoken_languages.length > 0;

  // Handle text truncation and toggle
  const overviewText = movie.overview;
  const isLongText = overviewText && overviewText.length > 200;
  const displayedText = showFullOverview || !isLongText ? overviewText : `${overviewText.slice(0, 200)}...`;

  const handleToggleOverview = () => {
    setShowFullOverview(!showFullOverview);
  };

  return (
    <Container>
      <div className="row g-3 mb-3">
        <div className={`${hasBackdropImage ? 'col-lg-5' : ''}`}>
          {hasBackdropImage && (
            <LazyLoad height={200} offset={0} placeholder={<img src="/default-backdrop.webp" alt="loading" className="single-image rounded-4 w-100" />}>
              <img src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} className="single-image rounded-4 w-100" alt={movie.title} />
            </LazyLoad>
          )}
        </div>
        <div className={`${hasBackdropImage ? 'col-lg-7' : 'col-12'}`}>
          <div className="d-flex justify-content-md-start justify-content-between align-items-center mb-3">
            <div className="d-flex me-md-3">
              <span className="text-secondary d-flex align-items-center">
                <FaStar className="text-yellow me-1" />
                {formatVoteAverage(movie.vote_average)}
              </span>
              <span className="text-secondary mx-2">|</span>
              <span className="text-secondary">{movie.release_date ? getYear(movie.release_date) : '-'}</span>
              <span className="text-secondary mx-2">|</span>
              <span className="text-secondary">{movie.production_countries[0]?.iso_3166_1}</span>
            </div>

            {hasImdbId && (
              <a href={`https://www.imdb.com/title/${movie.imdb_id}`} className="btn btn-sm btn-primary border-0 rounded-5 py-1 px-3" target="_blank" rel="noopener noreferrer">
                View on IMDb
              </a>
            )}
          </div>
          <div className="mb-3">
            {hasLanguage && (
              <div className="row">
                <small className="text-secondary col-sm-2 col-3">Language</small>
                <small className="text col-8 pe-0">{movie.spoken_languages.map((lang) => lang.english_name).join(', ')}</small>
              </div>
            )}
            {hasStatus && (
              <div className="row">
                <small className="text-secondary col-sm-2 col-3">Status</small>
                <small className="text col-7">{movie.status}</small>
              </div>
            )}
            {hasGenres && (
              <div className="d-sm-flex gap-1 mt-3">
                {movie.genres.map((genre) => (
                  <Link key={genre.id} to={`/movies/genre/${genre.id}`} className="btn btn-sm btn-genre fw-normal text rounded-5 py-1 px-3 mb-sm-0 mb-1 me-sm-0 me-1">
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <h4 className="card-title text lh-base mb-3">{movie.title}</h4>
          <p className="card-text text-tertiary lh-lg mb-0">
            {displayedText}
            <ToggleTextButton isLongText={isLongText} showFullOverview={showFullOverview} handleToggleOverview={handleToggleOverview} />
          </p>
        </div>
      </div>
      <div className="mb-2">
        <div className="overflow-auto scrollbar-custom">
          <div className="d-flex gap-2 mb-3">
            {movie.production_companies.map((company) => (
              <small key={company.id} className="text company-name rounded-3">
                {company.name}
              </small>
            ))}
          </div>
        </div>
      </div>
      {trailerKey && <MovieTrailer trailerKey={trailerKey} />}
      <div>
        <CastAndCrew credits={credits} />
      </div>
      <ButtonToTop />
    </Container>
  );
}

export default SingleMovie;
