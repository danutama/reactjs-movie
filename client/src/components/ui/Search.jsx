import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { searchTMDB } from '../../service/api';
import { IoCloseOutline } from 'react-icons/io5';
import { FaRegUser, FaHashtag } from 'react-icons/fa';
import { BiMoviePlay } from 'react-icons/bi';
import { MdLiveTv } from 'react-icons/md';

const DEBOUNCE_MS = 400;

const iconList = {
  movie: BiMoviePlay,
  person: FaRegUser,
  keyword: FaHashtag,
  tv: MdLiveTv,
};

const getLinkTo = (result) => {
  const map = {
    movie: `/movies/${result.id}`,
    tv: `/tv-shows/${result.id}`,
    person: `/people/${result.id}`,
    keyword: `/keyword/${result.id}`,
  };
  return map[result.media_type] || '';
};

const Search = ({ show, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  // Debounce search — tunggu user berhenti ketik 400ms baru fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const data = await searchTMDB(query);
      setResults(data.results || []);
      setLoading(false);
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Bootstrap modal handling
  useEffect(() => {
    const modalElement = document.getElementById('searchModal');
    if (!modalElement) return;

    if (show) {
      const bootstrapModal = new window.bootstrap.Modal(modalElement);
      bootstrapModal.show();

      const handleModalHidden = () => {
        setQuery('');
        setResults([]);
        cleanupModal(modalElement);
        onClose();
      };

      modalElement.addEventListener('hidden.bs.modal', handleModalHidden);

      return () => {
        modalElement.removeEventListener('hidden.bs.modal', handleModalHidden);
        cleanupModal(modalElement);
      };
    } else {
      modalElement.style.display = 'none';
      document.querySelector('.modal-backdrop')?.remove();
    }
  }, [show, onClose]);

  const cleanupModal = (modalElement) => {
    const instance = window.bootstrap.Modal.getInstance(modalElement);
    if (instance) instance.dispose();

    document.querySelector('.modal-backdrop')?.remove();

    if (document.body?.style) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.body.removeAttribute('data-bs-overflow');
      document.body.removeAttribute('data-bs-padding-right');
    }

    if (modalElement) modalElement.style.display = 'none';
  };

  const handleClick = () => {
    const modalElement = document.getElementById('searchModal');
    if (modalElement) {
      const instance = window.bootstrap.Modal.getInstance(modalElement);
      if (instance) {
        instance.hide();
        instance.dispose();
      }
      modalElement.style.display = 'none';
      document.querySelector('.modal-backdrop')?.remove();
    }
    setQuery('');
    setResults([]);
    onClose();
  };

  return (
    <div className="modal fade" id="searchModal" tabIndex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-fullscreen-md-down modal-dialog-scrollable">
        <div className="modal-content modal-search" style={{ height: '100vh' }}>
          <div className="modal-header d-grid border-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <p className="fs-5 modal-title text" id="searchModalLabel">
                Explore
              </p>
              <button type="button" className="text-secondary bg-transparent border-0" data-bs-dismiss="modal" aria-label="Close">
                <IoCloseOutline className="icon fs-1" />
              </button>
            </div>
            <input type="text" className="form-control form-input-custom py-3 rounded-3" placeholder="Type to search..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <div className="modal-body scrollbar-custom" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
            <div className="search-suggest-body">
              {loading && <p className="text-center text-secondary">Loading...</p>}

              {!loading && query && results.length > 0 && (
                <div>
                  {results.map((result, index) => {
                    const IconComponent = iconList[result.media_type] || FaRegUser;
                    return (
                      <React.Fragment key={result.id}>
                        <Link to={getLinkTo(result)} className="text d-flex align-items-center" onClick={handleClick}>
                          <IconComponent className="me-2" style={{ fontSize: '1rem', flexShrink: 0 }} />
                          {result.name || result.title || result.keyword}
                        </Link>
                        {index < results.length - 1 && <div className="hr" />}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {!loading && query && results.length === 0 && <p className="text-center">No results found.</p>}

              {!query && (
                <div className="text-center">
                  <img src="/movie.svg" alt="Search" className="w-75 mt-5 mb-4" />
                  <p className="text-secondary">Search movies, people, or TV shows</p>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer border-0"></div>
        </div>
      </div>
    </div>
  );
};

export default Search;
