import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { fetchTVOnTheAir, fetchTVGenres } from '../../service/api';
import Container from '../ui/Container';
import Card from '../ui/Card';
import ButtonSeeMore from '../ui/ButtonSeeMore';
import SpinnerCustom from '../ui/SpinnerCustom';
import { getYear, formatVoteAverage } from '../../utils/Helper';
import { FaStar } from 'react-icons/fa';

const AllTVOnTheAir = () => {
  const [tvShows, setTVShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const storageKeyPrefix = 'onTheAirTV';
  const tvShowsKey = `${storageKeyPrefix}Shows`;
  const genresKey = `${storageKeyPrefix}Genres`;
  const pageKey = `${storageKeyPrefix}Page`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genreData, tvData] = await Promise.all([fetchTVGenres(), fetchTVOnTheAir(page)]);
        const uniqueTVShows = Array.from(new Map(tvData.map((show) => [show.id, show])).values());

        setGenres(genreData);
        setTVShows(uniqueTVShows);
        setLoading(false);
        setHasMore(tvData.length > 0);

        sessionStorage.setItem(tvShowsKey, JSON.stringify(uniqueTVShows));
        sessionStorage.setItem(genresKey, JSON.stringify(genreData));
        sessionStorage.setItem(pageKey, page.toString());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const savedTVShows = sessionStorage.getItem(tvShowsKey);
    const savedGenres = sessionStorage.getItem(genresKey);
    const savedPage = sessionStorage.getItem(pageKey);

    if (savedTVShows && savedGenres) {
      setTVShows(JSON.parse(savedTVShows));
      setGenres(JSON.parse(savedGenres));
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

  const loadMoreTVShows = async () => {
    const nextPage = page + 1;
    try {
      const tvData = await fetchTVOnTheAir(nextPage);

      if (tvData.length === 0) {
        setHasMore(false);
        return;
      }

      const updatedTVShows = Array.from(new Map([...tvShows, ...tvData].map((show) => [show.id, show])).values());

      setTVShows(updatedTVShows);
      setPage(nextPage);

      sessionStorage.setItem(tvShowsKey, JSON.stringify(updatedTVShows));
      sessionStorage.setItem(pageKey, nextPage.toString());
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
                  <LazyLoad height={200} offset={100} placeholder={<img src="/default-poster.png" alt="loading" className="card-img-top" />}>
                    <img src={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '/default-poster.png'} className="card-img-top" alt={show.name} />
                  </LazyLoad>
                  <div className="card-body pb-4">
                    <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
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
              <ButtonSeeMore onClick={loadMoreTVShows} text="Load More" />
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default AllTVOnTheAir;
