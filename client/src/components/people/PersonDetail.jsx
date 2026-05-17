import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { fetchPersonById } from '../../service/api';
import Container from '../ui/Container';
import SpinnerCustom from '../ui/SpinnerCustom';
import ButtonToTop from '../ui/ButtonToTop';
import ToggleTextButton from '../ui/ToggleTextButton';
import { formatFullDate, formatDate, formatVoteAverage } from '../../utils/Helper';
import { FaStar } from 'react-icons/fa';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sortByDate = (list, dateKey) =>
  [...list].sort((a, b) => {
    if (!a[dateKey]) return 1;
    if (!b[dateKey]) return -1;
    return new Date(b[dateKey]) - new Date(a[dateKey]);
  });

const CreditCard = ({ credit, linkTo, dateKey }) => (
  <div className="col-lg-4 col-sm-6 my-sm-2 my-0">
    <div className="d-flex gap-3 justify-content-start align-items-start">
      <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.webp" alt="loading" className="credit-poster rounded-1" />}>
        <img className="credit-poster rounded-1" src={credit.poster_path ? `https://image.tmdb.org/t/p/w200${credit.poster_path}` : '/default-poster.webp'} alt={credit.title || credit.name || 'Poster'} />
      </LazyLoad>
      <div className="w-100">
        <div className="mb-2">
          <Link to={linkTo} className="person-credit-link text fw-normal">
            {credit.title || credit.name} <span className="text-secondary">as</span> {credit.job || credit.character || '-'}
          </Link>
        </div>
        <div className="d-flex gap-3 justify-content-sm-start justify-content-between align-items-center">
          <small className="text-secondary">{credit[dateKey] ? formatDate(credit[dateKey]) : '-'}</small>
          <small className="text d-flex align-items-center">
            <FaStar className="text-yellow me-1" />
            {formatVoteAverage(credit.vote_average)}
          </small>
        </div>
      </div>
    </div>
    <div className="hr d-sm-none"></div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────
const PersonDetail = ({ personId }) => {
  const [person, setPerson] = useState(null);
  const [movieCredits, setMovieCredits] = useState([]);
  const [tvCredits, setTvCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullBiography, setShowFullBiography] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getPersonDetails = async () => {
      setLoading(true);
      try {
        // fetchPersonById sudah include movie_credits & tv_credits dari BE
        const personData = await fetchPersonById(personId);

        if (!personData?.name) {
          navigate('/404');
          return;
        }

        setPerson(personData);

        // Credits sudah ada di personData
        const movieData = personData.movie_credits || {};
        const tvData = personData.tv_credits || {};

        setMovieCredits(sortByDate([...(movieData.cast || []), ...(movieData.crew || [])], 'release_date'));
        setTvCredits(sortByDate([...(tvData.cast || []), ...(tvData.crew || [])], 'first_air_date'));
      } catch {
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    getPersonDetails();
  }, [personId, navigate]);

  useEffect(() => {
    if (person?.name) document.title = `Dibimovie | ${person.name}`;
  }, [person]);

  const biographyText = person?.biography || '-';
  const isLongBiography = biographyText.length > 200;
  const displayedBiography = showFullBiography ? biographyText : biographyText.substring(0, 200);

  if (loading) {
    return (
      <div className="d-flex justify-content-center pt-4 position-absolute top-50 start-50 translate-middle">
        <SpinnerCustom />
      </div>
    );
  }

  if (!person) {
    return (
      <Container>
        <p>Person details not found.</p>
      </Container>
    );
  }

  return (
    <Container>
      {/* Person Info */}
      <div className="d-flex gap-4 justify-content-start align-items-start flex-column flex-md-row">
        <div className="person-img-wrapper w-100 mb-0">
          <LazyLoad height={200} offset={0} placeholder={<img src="/profile.png" alt="loading" className="person-img rounded-4" />}>
            <img className="person-img rounded-4" src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : '/profile.png'} alt={person.name || 'Profile image'} />
          </LazyLoad>
        </div>

        <div className="w-100">
          <div className="d-flex justify-content-sm-start justify-content-between align-items-center gap-3 mb-4">
            <p className="h4 text fw-bold m-0">{person.name || '-'}</p>
            {person.imdb_id && (
              <a href={`https://www.imdb.com/name/${person.imdb_id}/`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary border-0 rounded-5 py-1 px-3" style={{ whiteSpace: 'nowrap' }}>
                View on IMDb
              </a>
            )}
          </div>

          <p className="text-secondary">
            Known for: <span className="text-tertiary">{person.known_for_department || '-'}</span>
          </p>
          <p className="text-secondary">
            Birthday: <span className="text-tertiary">{person.birthday ? formatFullDate(person.birthday) : '-'}</span>
          </p>
          <p className="text-secondary">
            Place of Birth: <span className="text-tertiary">{person.place_of_birth || '-'}</span>
          </p>
          {person.deathday && (
            <p className="text-secondary">
              Date of Death: <span className="text-tertiary">{formatFullDate(person.deathday)}</span>
            </p>
          )}
        </div>
      </div>

      {/* Biography */}
      {biographyText !== '-' && (
        <p className="card-text text-secondary lh-lg mt-md-3">
          Biography:
          <span className="text-tertiary ms-1">
            {displayedBiography}
            {isLongBiography && !showFullBiography && <span className="text-secondary">...</span>}
            {isLongBiography && <ToggleTextButton isLongText={isLongBiography} showFullOverview={showFullBiography} handleToggleOverview={() => setShowFullBiography((prev) => !prev)} />}
          </span>
        </p>
      )}

      {/* Credits Tabs */}
      <div className="mt-4">
        <div className="sticky-top py-2">
          <ul className="nav nav-tabs d-flex justify-content-sm-start gap-3" id="credit-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link tab py-3 bg-transparent fw-bold active" id="movie-credits-tab" data-bs-toggle="tab" data-bs-target="#movie-credits" type="button" role="tab" aria-controls="movie-credits" aria-selected="true">
                Movie Credits
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link tab py-3 fw-bold bg-transparent" id="tv-credits-tab" data-bs-toggle="tab" data-bs-target="#tv-credits" type="button" role="tab" aria-controls="tv-credits" aria-selected="false">
                TV Credits
              </button>
            </li>
          </ul>
        </div>

        <div className="tab-content" id="credit-tabs-content">
          {/* Movie Credits */}
          <div className="tab-pane fade show active" id="movie-credits" role="tabpanel" aria-labelledby="movie-credits-tab">
            <div className="row">
              {movieCredits.length > 0 ? (
                movieCredits.map((credit, index) => <CreditCard key={`${credit.id}-movie-${index}`} credit={credit} linkTo={`/movies/${credit.id}`} dateKey="release_date" />)
              ) : (
                <div className="text-sm-start text-center pt-3">
                  <small className="text-secondary fst-italic">No movie credits available.</small>
                </div>
              )}
            </div>
          </div>

          {/* TV Credits */}
          <div className="tab-pane fade" id="tv-credits" role="tabpanel" aria-labelledby="tv-credits-tab">
            <div className="row">
              {tvCredits.length > 0 ? (
                tvCredits.map((credit, index) => <CreditCard key={`${credit.id}-tv-${index}`} credit={credit} linkTo={`/tv-shows/${credit.id}`} dateKey="first_air_date" />)
              ) : (
                <div className="text-sm-start text-center pt-3">
                  <small className="text-secondary fst-italic">No TV credits available.</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ButtonToTop />
    </Container>
  );
};

export default PersonDetail;
