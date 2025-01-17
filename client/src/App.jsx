import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, Suspense, lazy } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScrollToTop from './utils/ScrollToTop';
import Header from './components/ui/Header';
import Navbar from './components/ui/Navbar';
import Search from './components/ui/Search';
import Footer from './components/ui/Footer';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Movie = lazy(() => import('./pages/Movie'));
const Latest = lazy(() => import('./pages/Upcoming'));
const Trending = lazy(() => import('./pages/Trending'));
const Popular = lazy(() => import('./pages/Popular'));
const TvShow = lazy(() => import('./pages/TvShow'));
const TvShowTopRated = lazy(() => import('./pages/TvShowTopRated'));
const TvShowAiringToday = lazy(() => import('./pages/TvShowAiringToday'));
const TvShowPopular = lazy(() => import('./pages/TvShowPopular'));
const TvShowOnTheAir = lazy(() => import('./pages/TvShowOnTheAir'));
const TvShowTrending = lazy(() => import('./pages/TvShowTrending'));
const Single = lazy(() => import('./pages/Single'));
const SingleTv = lazy(() => import('./pages/SingleTv'));
const PeoplePopular = lazy(() => import('./pages/PeoplePopular'));
const Person = lazy(() => import('./pages/Person'));
const MovieGenre = lazy(() => import('./pages/MovieGenre'));
const TvGenre = lazy(() => import('./pages/TvGenre'));
const NotFound = lazy(() => import('./pages/404'));

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
          <Route path="/" element={<Home />} />
          {/* TV SHOWS */}
          <Route path="/tvshow" element={<TvShow />} />
          <Route path="/trending-tv-shows" element={<TvShowTrending />} />
          <Route path="/popular-tv-shows" element={<TvShowPopular />} />
          <Route path="/tv-on-the-air" element={<TvShowOnTheAir />} />
          <Route path="/top-rated-tv" element={<TvShowTopRated />} />
          <Route path="/tv-airing-today" element={<TvShowAiringToday />} />
          <Route path="/tv-genre/:genreId" element={<TvGenre />} />
          <Route path="/tv/:id" element={<SingleTv />} />
          {/* MOVIES */}
          <Route path="/movies" element={<Movie />} />
          <Route path="/upcoming-movie" element={<Latest />} />
          <Route path="/trending-movies" element={<Trending />} />
          <Route path="/popular-movies" element={<Popular />} />
          <Route path="/movie/:id" element={<Single />} />
          <Route path="/person/:personId" element={<Person />} />
          <Route path="/movie-genre/:genreId" element={<MovieGenre />} />
          {/* PEOPLE */}
          <Route path="/popular-people" element={<PeoplePopular />} />
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
