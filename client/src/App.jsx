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
const NotFound = lazy(() => import('./pages/404'));

// Movies
const Movies = {
  Index: lazy(() => import('./pages/movies/Index')),
  Upcoming: lazy(() => import('./pages/movies/Upcoming')),
  Trending: lazy(() => import('./pages/movies/Trending')),
  Popular: lazy(() => import('./pages/movies/Popular')),
  ByGenre: lazy(() => import('./pages/movies/ByGenre')),
  Single: lazy(() => import('./pages/movies/Single')),
};

// TV Shows
const TvShows = {
  Index: lazy(() => import('./pages/tvshows/Index')),
  Trending: lazy(() => import('./pages/tvshows/Trending')),
  Popular: lazy(() => import('./pages/tvshows/Popular')),
  TopRated: lazy(() => import('./pages/tvshows/TopRated')),
  AiringToday: lazy(() => import('./pages/tvshows/AiringToday')),
  OnTheAir: lazy(() => import('./pages/tvshows/OnTheAir')),
  ByGenre: lazy(() => import('./pages/tvshows/ByGenre')),
  Single: lazy(() => import('./pages/tvshows/Single')),
};

// People
const People = {
  Popular: lazy(() => import('./pages/people/Popular')),
  Person: lazy(() => import('./pages/people/Person')),
};

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
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* MOVIES */}
          <Route path="/movies" element={<Movies.Index />} />
          <Route path="/movies/upcoming" element={<Movies.Upcoming />} />
          <Route path="/movies/trending" element={<Movies.Trending />} />
          <Route path="/movies/popular" element={<Movies.Popular />} />
          <Route path="/movies/genre/:genreId" element={<Movies.ByGenre />} />
          <Route path="/movies/:id" element={<Movies.Single />} />

          {/* TV SHOWS */}
          <Route path="/tv-shows" element={<TvShows.Index />} />
          <Route path="/tv-shows/trending" element={<TvShows.Trending />} />
          <Route path="/tv-shows/popular" element={<TvShows.Popular />} />
          <Route path="/tv-shows/top-rated" element={<TvShows.TopRated />} />
          <Route path="/tv-shows/airing-today" element={<TvShows.AiringToday />} />
          <Route path="/tv-shows/on-the-air" element={<TvShows.OnTheAir />} />
          <Route path="/tv-shows/genre/:genreId" element={<TvShows.ByGenre />} />
          <Route path="/tv-shows/:id" element={<TvShows.Single />} />

          {/* PEOPLE */}
          <Route path="/people/popular" element={<People.Popular />} />
          <Route path="/people/:personId" element={<People.Person />} />

          {/* 404 */}
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
