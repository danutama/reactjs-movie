import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, Suspense, lazy } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScrollToTop from './utils/ScrollToTop';
import Header from './components/ui/Header';
import Navbar from './components/ui/Navbar';
import Search from './components/ui/Search';
import Footer from './components/ui/Footer';

// Lazy load pages
const PgHome = lazy(() => import('./pages/PgHome'));
const PgMovie = lazy(() => import('./pages/PgMovie'));
const PgMovieUpcoming = lazy(() => import('./pages/PgMovieUpcoming'));
const PgMovieTrending = lazy(() => import('./pages/PgMovieTrending'));
const PgMoviePopular = lazy(() => import('./pages/PgMoviePopular'));
const PgTvShow = lazy(() => import('./pages/PgTvShow'));
const PgTvShowTopRated = lazy(() => import('./pages/PgTvShowTopRated'));
const PgTvShowAiringToday = lazy(() => import('./pages/PgTvShowAiringToday'));
const PgTvShowPopular = lazy(() => import('./pages/PgTvShowPopular'));
const PgTvShowOnTheAir = lazy(() => import('./pages/PgTvShowOnTheAir'));
const PgTvShowTrending = lazy(() => import('./pages/PgTvShowTrending'));
const PgSingleMovie = lazy(() => import('./pages/PgSingleMovie'));
const PgSingleTv = lazy(() => import('./pages/PgSingleTv'));
const PgPeoplePopular = lazy(() => import('./pages/PgPeoplePopular'));
const PgPerson = lazy(() => import('./pages/PgPerson'));
const PgMovieByGenre = lazy(() => import('./pages/PgMovieByGenre'));
const PgTvByGenre = lazy(() => import('./pages/PgTvByGenre'));
const NotFound = lazy(() => import('./pages/Pg404'));

function App() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
    const modalElement = document.getElementById('searchModal');
    const bootstrapModal = new window.bootstrap.Modal(modalElement);
    bootstrapModal.show();
  };

  const handleCloseModal = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <Router>
      <Header onSearchClick={handleSearchClick} />
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<PgHome />} />
          {/* TV SHOWS */}
          <Route path="/tvshow" element={<PgTvShow />} />
          <Route path="/trending-tv-shows" element={<PgTvShowTrending />} />
          <Route path="/popular-tv-shows" element={<PgTvShowPopular />} />
          <Route path="/tv-on-the-air" element={<PgTvShowOnTheAir />} />
          <Route path="/top-rated-tv" element={<PgTvShowTopRated />} />
          <Route path="/tv-airing-today" element={<PgTvShowAiringToday />} />
          <Route path="/tv-genre/:genreId" element={<PgTvByGenre />} />
          <Route path="/tv/:id" element={<PgSingleTv />} />
          {/* MOVIES */}
          <Route path="/movies" element={<PgMovie />} />
          <Route path="/upcoming-movie" element={<PgMovieUpcoming />} />
          <Route path="/trending-movies" element={<PgMovieTrending />} />
          <Route path="/popular-movies" element={<PgMoviePopular />} />
          <Route path="/movie/:id" element={<PgSingleMovie />} />
          <Route path="/person/:personId" element={<PgPerson />} />
          <Route path="/movie-genre/:genreId" element={<PgMovieByGenre />} />
          {/* PEOPLE */}
          <Route path="/popular-people" element={<PgPeoplePopular />} />
          {/* fallback 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <Navbar />
      <Search show={isSearchModalOpen} onClose={handleCloseModal} />
    </Router>
  );
}

export default App;
