import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HiOutlineClock, HiClock, HiOutlineUserGroup, HiUserGroup, HiOutlineStar, HiStar } from "react-icons/hi2";
import { GoHome, GoHomeFill } from 'react-icons/go';

const Navbar = () => {
  const location = useLocation();
  const { pathname } = location;

  const createRipple = (event) => {
    const button = event.currentTarget;

    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];

    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="nav-link-wrapper" onClick={createRipple}>
          <Link to="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
            <div className="nav-btn">
              <GoHomeFill className="fill" />
              <GoHome className="outline" />
              <p>Home</p>
            </div>
          </Link>
        </div>
        <div className="nav-link-wrapper" onClick={createRipple}>
          <Link to="/upcoming-movie" className={`nav-item ${pathname === '/upcoming-movie' ? 'active' : ''}`}>
            <div className="nav-btn">
              <HiClock className="fill" />
              <HiOutlineClock className="outline" />
              <p>Upcoming</p>
            </div>
          </Link>
        </div>
        <div className="nav-link-wrapper" onClick={createRipple}>
          <Link to="/trending-movies" className={`nav-item ${pathname === '/trending-movies' ? 'active' : ''}`}>
            <div className="nav-btn">
              <HiUserGroup className="fill" />
              <HiOutlineUserGroup className="outline" />
              <p>Trending</p>
            </div>
          </Link>
        </div>
        <div className="nav-link-wrapper" onClick={createRipple}>
          <Link to="/popular-movies" className={`nav-item ${pathname === '/popular-movies' ? 'active' : ''}`}>
            <div className="nav-btn">
              <HiStar className="fill" />
              <HiOutlineStar className="outline" />
              <p>Popular</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
