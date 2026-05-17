import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import Container from '../ui/Container';
import Card from '../ui/Card';
import ButtonSeeMore from '../ui/ButtonSeeMore';
import SpinnerCustom from '../ui/SpinnerCustom';
import { fetchPopularPeople } from '../../service/api';

const STORAGE_KEY = 'popularPeople';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getCache = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setCache = (people, page) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ people, page }));
  } catch {
    // sessionStorage penuh atau tidak tersedia — skip saja
  }
};

const dedupeById = (list) => Array.from(new Map(list.map((p) => [p.id, p])).values());

// ─── Component ────────────────────────────────────────────────────────────────
const AllPeoplePopular = () => {
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const cache = getCache();

    if (cache?.people?.length > 0) {
      setPeople(cache.people);
      setPage(cache.page || 1);
      setLoading(false);
      return;
    }

    const fetchInitial = async () => {
      try {
        const data = await fetchPopularPeople(1);
        const unique = dedupeById(data);
        setPeople(unique);
        setHasMore(data.length > 0);
        setCache(unique, 1);
      } catch {
        // Gagal fetch — biarkan list kosong, tidak perlu crash
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, []);

  const loadMorePeople = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const data = await fetchPopularPeople(nextPage);

      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      setPeople((prev) => {
        const unique = dedupeById([...prev, ...data]);
        setCache(unique, nextPage);
        return unique;
      });

      setPage(nextPage);
    } catch {
      // Gagal load more — biarkan state tetap, user bisa coba lagi
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page]);

  if (loading) {
    return (
      <Container>
        <div className="d-flex justify-content-center">
          <SpinnerCustom />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="row g-2">
        {people.map((person) => (
          <div key={person.id} className="col-lg-2 col-md-3 col-4">
            <Card>
              <Link to={`/people/${person.id}`}>
                <LazyLoad height={200} offset={100} placeholder={<img src="/profile.png" alt="loading" className="card-img-top" />}>
                  <img src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : '/profile.png'} className="card-img-top" alt={person.name} />
                </LazyLoad>
              </Link>
              <div className="card-body px-2 pb-3">
                <div className="title-wrapper">
                  <p className="card-title text m-0">{person.name}</p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-4">
          <ButtonSeeMore onClick={loadMorePeople} disabled={loadingMore} />
        </div>
      )}
    </Container>
  );
};

export default AllPeoplePopular;
