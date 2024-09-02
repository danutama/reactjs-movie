import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchMovieById, fetchGenres, fetchMovieCredits } from '../service/api';
import Peoples from './Peoples';
import GenreList from './Genre';
import Container from './ui/Container';
import { FaStar } from 'react-icons/fa';
import { getYear, formatVoteAverage } from '../utils/Helper';
import SpinnerCustom from './ui/SpinnerCustom';
import ButtonToTop from './ui/ButtonToTop';
import ToggleTextButton from './ui/ToggleTextButton';
import Credit from './ui/Credit';

function SingleMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [credits, setCredits] = useState([]);
  const [showFullOverview, setShowFullOverview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieData = await fetchMovieById(id);
        if (!movieData || !movieData.title) {
          navigate('/404');
          return;
        }
        const genreData = await fetchGenres();
        const creditsData = await fetchMovieCredits(id);
        setMovie(movieData);
        setGenres(genreData);
        setCredits(creditsData.cast.concat(creditsData.crew));
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
        <div className={`${hasBackdropImage ? 'col-lg-5' : ''}`}>{hasBackdropImage && <img src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} className="single-image rounded-4 w-100" alt={movie.title} />}</div>
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
          <p className="text-secondary">Language: {movie.spoken_languages.map((lang) => lang.english_name).join(', ')}</p>
          <div className="d-sm-flex gap-1 mb-3">
            {movie.genres && movie.genres.length > 0
              ? movie.genres.map((genre) => (
                  <Link key={genre.id} to={`/movie-genre/${genre.id}`} className="btn btn-sm btn-genre fw-normal text rounded-5 py-1 px-3 mb-sm-0 mb-1 me-sm-0 me-1">
                    {genre.name}
                  </Link>
                ))
              : '-'}
          </div>
          <h4 className="card-title text lh-base mb-3">{movie.title}</h4>
          <p className="card-text text lh-lg mb-0">
            {displayedText}
            <ToggleTextButton isLongText={isLongText} showFullOverview={showFullOverview} handleToggleOverview={handleToggleOverview} />
          </p>
        </div>
      </div>
      <div className="mb-2">
        <div className="overflow-auto scrollbar-custom">
          <div className="d-flex gap-2 mb-3">
            {movie.production_companies.map((company) => (
              <div key={company.id} className="text company-name fs-6 rounded-3">
                {company.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Peoples credits={credits} />
        <Credit />
      </div>
      <ButtonToTop />
    </Container>
  );
}

export default SingleMovie;
