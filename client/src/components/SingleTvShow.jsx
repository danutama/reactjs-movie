import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchTvShowById, fetchTvShowCredits, fetchTVGenres, fetchExternalIdsTv } from '../service/api';
import Peoples from './Peoples';
import Container from './ui/Container';
import { FaStar } from 'react-icons/fa';
import { getYear, formatVoteAverage } from '../utils/Helper';
import SpinnerCustom from './ui/SpinnerCustom';
import ButtonToTop from './ui/ButtonToTop';
import ToggleTextButton from './ui/ToggleTextButton';
import Credit from './ui/Credit';

function SingleTvShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tvShow, setTvShow] = useState(null);
  const [genres, setGenres] = useState([]);
  const [credits, setCredits] = useState([]);
  const [creators, setCreators] = useState([]);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [externalIds, setExternalIds] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tvShowData = await fetchTvShowById(id);
        if (!tvShowData || !tvShowData.name) {
          navigate('/404');
          return;
        }
        const creditsData = await fetchTvShowCredits(id);
        const genresData = await fetchTVGenres();
        const externalIdsData = await fetchExternalIdsTv(id);

        setTvShow(tvShowData);
        setGenres(genresData);
        setCredits(creditsData.cast.concat(creditsData.crew));
        setCreators(tvShowData.created_by || []);
        setExternalIds(externalIdsData);
        document.title = `React TV Show | ${tvShowData.name}`;
      } catch (error) {
        navigate('/404');
      }
    };

    fetchData();
  }, [id, navigate]);

  if (!tvShow) {
    return (
      <div className="d-flex justify-content-center pt-4 position-absolute top-50 start-50 translate-middle ">
        <SpinnerCustom />
      </div>
    );
  }

  const hasBackdropImage = Boolean(tvShow.backdrop_path);
  const hasImdbId = Boolean(externalIds && externalIds.imdb_id);
  const hasTvGenre = tvShow.genres && tvShow.genres.length > 0;
  const hasLanguage = tvShow.spoken_languages && tvShow.spoken_languages.length > 0;

  // Handle text truncation and toggle
  const overviewText = tvShow.overview;
  const isLongText = overviewText && overviewText.length > 200;
  const displayedText = showFullOverview || !isLongText ? overviewText : `${overviewText.slice(0, 200)}...`;

  const handleToggleOverview = () => {
    setShowFullOverview(!showFullOverview);
  };

  return (
    <Container>
      <div className="row g-3 mb-3">
        <div className={`${hasBackdropImage ? 'col-lg-5' : ''}`}>{hasBackdropImage && <img src={`https://image.tmdb.org/t/p/w500${tvShow.backdrop_path}`} className="single-image rounded-4 w-100" alt={tvShow.name} />}</div>
        <div className={`${hasBackdropImage ? 'col-lg-7' : 'col-12'}`}>
          <div className="d-flex justify-content-md-start justify-content-between align-items-center mb-3">
            <div className="d-flex me-md-3">
              <span className="text-secondary d-flex align-items-center">
                <FaStar className="text-yellow me-1" />
                {formatVoteAverage(tvShow.vote_average)}
              </span>
              <span className="text-secondary mx-2">|</span>
              <span className="text-secondary">{tvShow.first_air_date ? getYear(tvShow.first_air_date) : '-'}</span>
              <span className="text-secondary mx-2">|</span>
              <span className="text-secondary">{tvShow.production_countries[0]?.iso_3166_1}</span>
            </div>
            {hasImdbId && (
              <a href={`https://www.imdb.com/title/${externalIds.imdb_id}`} className="btn btn-sm btn-primary border-0 rounded-5 py-1 px-3" target="_blank" rel="noopener noreferrer">
                View on IMDb
              </a>
            )}
          </div>
          {hasLanguage && <p className="text-secondary">Language: {tvShow.spoken_languages.map((lang) => lang.english_name).join(', ')}</p>}
          {hasTvGenre && (
            <div className="d-sm-flex gap-1 mb-3">
              {tvShow.genres.map((genre) => (
                <Link key={genre.id} to={`/tv-genre/${genre.id}`} className="btn btn-sm btn-genre fw-normal text rounded-5 py-1 px-3 mb-sm-0 mb-1 me-sm-0 me-1">
                  {genre.name}
                </Link>
              ))}
            </div>
          )}
          <h4 className="card-title text lh-base mb-3">{tvShow.name}</h4>
          <p className="card-text text lh-lg mb-0">
            {displayedText}
            <ToggleTextButton isLongText={isLongText} showFullOverview={showFullOverview} handleToggleOverview={handleToggleOverview} />
          </p>
        </div>
      </div>
      <div className="mb-2">
        <div className="overflow-auto scrollbar-custom">
          <div className="d-flex gap-2 mb-3">
            {tvShow.production_companies.map((company) => (
              <div key={company.id} className="text company-name fs-6 rounded-3">
                {company.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Peoples credits={credits} creators={creators} />
        <Credit />
      </div>
      <ButtonToTop />
    </Container>
  );
}

export default SingleTvShow;
