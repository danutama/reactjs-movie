import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { fetchPopularPeople } from '../../service/api';
import Container from '../ui/Container';
import Card from '../ui/Card';
import ButtonSeeMore from '../ui/ButtonSeeMore';
import SpinnerCustom from '../ui/SpinnerCustom';

const AllPeoplePopular = () => {
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const storageKeyPrefix = 'popularPeople';
  const peopleKey = `${storageKeyPrefix}People`;
  const pageKey = `${storageKeyPrefix}Page`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const peopleData = await fetchPopularPeople(page);
        const uniquePeople = Array.from(new Map(peopleData.map((person) => [person.id, person])).values());

        setPeople(uniquePeople);
        setLoading(false);
        setHasMore(peopleData.length > 0);

        sessionStorage.setItem(peopleKey, JSON.stringify(uniquePeople));
        sessionStorage.setItem(pageKey, page.toString());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const savedPeople = sessionStorage.getItem(peopleKey);
    const savedPage = sessionStorage.getItem(pageKey);

    if (savedPeople) {
      setPeople(JSON.parse(savedPeople));
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

  const loadMorePeople = async () => {
    const nextPage = page + 1;
    try {
      const peopleData = await fetchPopularPeople(nextPage);

      if (peopleData.length === 0) {
        setHasMore(false);
        return;
      }

      const updatedPeople = Array.from(new Map([...people, ...peopleData].map((person) => [person.id, person])).values());

      setPeople(updatedPeople);
      setPage(nextPage);

      sessionStorage.setItem(peopleKey, JSON.stringify(updatedPeople));
      sessionStorage.setItem(pageKey, nextPage.toString());
    } catch (error) {
      console.error('Error loading more people:', error);
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
            {people.map((person) => (
              <div key={person.id} className="col-lg-2 col-md-3 col-4">
                <Card>
                  <LazyLoad height={200} offset={100} placeholder={<img src="/profile.png" alt="loading" className="card-img-top" />}>
                    <img src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : '/profile.png'} className="card-img-top" alt={person.name} />
                  </LazyLoad>
                  <div className="card-body px-2 pb-3">
                    <div className="title-wrapper">
                      <Link to={`/people/${person.id}`} className="card-title text">
                        {person.name}
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-4">
              <ButtonSeeMore onClick={loadMorePeople} />
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default AllPeoplePopular;
