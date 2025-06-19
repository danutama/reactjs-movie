import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, Suspense } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScrollToTop from './utils/ScrollToTop';
import Header from './components/ui/Header';
import Navbar from './components/ui/Navbar';
import Search from './components/ui/Search';
import Footer from './components/ui/Footer';

import Pages from './pages';

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
          <Route path="/" element={<Pages.Home />} />

          {/* MOVIES */}
          <Route path="/movies" element={<Pages.Movies.Index />} />
          <Route path="/movies/upcoming" element={<Pages.Movies.Upcoming />} />
          <Route path="/movies/trending" element={<Pages.Movies.Trending />} />
          <Route path="/movies/popular" element={<Pages.Movies.Popular />} />
          <Route path="/movies/genre/:genreId" element={<Pages.Movies.ByGenre />} />
          <Route path="/movies/:id" element={<Pages.Movies.Single />} />

          {/* TV SHOWS */}
          <Route path="/tv-shows" element={<Pages.TvShows.Index />} />
          <Route path="/tv-shows/trending" element={<Pages.TvShows.Trending />} />
          <Route path="/tv-shows/popular" element={<Pages.TvShows.Popular />} />
          <Route path="/tv-shows/top-rated" element={<Pages.TvShows.TopRated />} />
          <Route path="/tv-shows/airing-today" element={<Pages.TvShows.AiringToday />} />
          <Route path="/tv-shows/on-the-air" element={<Pages.TvShows.OnTheAir />} />
          <Route path="/tv-shows/genre/:genreId" element={<Pages.TvShows.ByGenre />} />
          <Route path="/tv-shows/:id" element={<Pages.TvShows.Single />} />

          {/* PEOPLE */}
          <Route path="/people/popular" element={<Pages.People.Popular />} />
          <Route path="/people/:personId" element={<Pages.People.Person />} />

          {/* 404 */}
          <Route path="*" element={<Pages.NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
      <Navbar />
      <Search show={isSearchModalOpen} onClose={handleCloseModal} />
    </Router>
  );
}

export default App;
