import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScrollToTop from './utils/ScrollToTop';
import Header from './components/ui/Header';
import Navbar from './components/ui/Navbar';
import Home from './pages/Home';
import Latest from './pages/Upcoming';
import Trending from './pages/Trending';
import Popular from './pages/Popular';
import Single from './pages/Single';
import SingleTv from './pages/SingleTv';
import Person from './pages/Person';
import NotFound from './pages/404';
import Search from './components/ui/Search';

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upcoming-movie" element={<Latest />} />
        <Route path="/trending-movies" element={<Trending />} />
        <Route path="/popular-movies" element={<Popular />} />
        <Route path="/movie/:id" element={<Single />} />
        <Route path="/tv/:id" element={<SingleTv />} />
        <Route path="/person/:personId" element={<Person />} />
        {/* fallback 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Navbar />
      <Search show={isSearchModalOpen} onClose={handleCloseModal} />
    </Router>
  );
}

export default App;
