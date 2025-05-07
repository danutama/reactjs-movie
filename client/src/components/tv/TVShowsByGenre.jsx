import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { fetchTVShowsByGenre, fetchTVGenres } from '../../service/api';
import Container from '../ui/Container';
import Card from '../ui/Card';
import { FaStar } from 'react-icons/fa';
import { getYear, formatVoteAverage } from '../../utils/Helper';
import ButtonSeeMore from '../ui/ButtonSeeMore';
import SpinnerCustom from '../ui/SpinnerCustom';

const TVShowsByGenre = () => {
  const { genreId } = useParams();
  const navigate = useNavigate();
  const [tvShows, setTVShows] = useState([]);
  const [genreName, setGenreName] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genreData, tvShowData] = await Promise.all([fetchTVGenres(), fetchTVShowsByGenre(genreId, page)]);

        const currentGenre = genreData.find((genre) => genre.id === parseInt(genreId, 10));
        if (!currentGenre) {
          navigate('/404');
          return;
        }

        const uniqueTVShows = Array.from(new Map(tvShowData.map((show) => [show.id, show])).values());

        setTVShows(uniqueTVShows);
        setLoading(false);
        setHasMore(tvShowData.length > 0);

        const name = currentGenre.name;
        setGenreName(name);

        document.title = name ? `React TV Shows | ${name}` : 'React TV Shows';

        sessionStorage.setItem(`genre-${genreId}TVShows`, JSON.stringify(uniqueTVShows));
        sessionStorage.setItem(`genre-${genreId}Page`, page.toString());
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/404');
      }
    };

    const savedTVShows = sessionStorage.getItem(`genre-${genreId}TVShows`);
    const savedPage = sessionStorage.getItem(`genre-${genreId}Page`);

    if (savedTVShows) {
      setTVShows(JSON.parse(savedTVShows));
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
    document.title = genreName ? `React TV Shows | ${genreName}` : 'React TV Shows';
  }, [genreName]);

  const loadMoreTVShows = async () => {
    const nextPage = page + 1;
    try {
      const tvShowData = await fetchTVShowsByGenre(genreId, nextPage);

      if (tvShowData.length === 0) {
        setHasMore(false);
        return;
      }

      const updatedTVShows = Array.from(new Map([...tvShows, ...tvShowData].map((show) => [show.id, show])).values());

      setTVShows(updatedTVShows);
      setPage(nextPage);

      sessionStorage.setItem(`genre-${genreId}TVShows`, JSON.stringify(updatedTVShows));
      sessionStorage.setItem(`genre-${genreId}Page`, nextPage.toString());
    } catch (error) {
      console.error('Error loading more TV shows:', error);
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
            {tvShows.map((show) => (
              <div key={show.id} className="col-lg-2 col-md-4 col-6">
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
          </div>

          {hasMore && (
            <div className="text-center mt-4">
              <ButtonSeeMore onClick={loadMoreTVShows} />
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default TVShowsByGenre;
