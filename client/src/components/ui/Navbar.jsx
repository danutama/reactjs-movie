import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HiOutlineUserGroup, HiUserGroup } from 'react-icons/hi2';
import { BiMovie, BiSolidMovie, BiSolidTv, BiTv } from 'react-icons/bi';
import { RiHome5Line, RiHome5Fill } from 'react-icons/ri';

const Navbar = () => {
  const location = useLocation();
  const { pathname } = location;

  const isActive = (base) => {
    const isDetailPage = /^\/movies\/\d+$/.test(pathname) || /^\/tv-shows\/\d+$/.test(pathname) || /^\/people\/\d+$/.test(pathname);
    return pathname.startsWith(base) && !isDetailPage;
  };

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
    if (ripple) ripple.remove();

    button.appendChild(circle);
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="nav-link-wrapper" onClick={createRipple}>
          <Link to="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
            <div className="nav-btn">
              <RiHome5Fill className="fill" />
              <RiHome5Line className="outline" />
              <p>Home</p>
            </div>
          </Link>
        </div>
        <div className="nav-link-wrapper" onClick={createRipple}>
          <Link to="/movies" className={`nav-item ${isActive('/movies') ? 'active' : ''}`}>
            <div className="nav-btn">
              <BiSolidMovie className="fill" />
              <BiMovie className="outline" />
              <p>Movies</p>
            </div>
          </Link>
        </div>
        <div className="nav-link-wrapper" onClick={createRipple}>
          <Link to="/tv-shows" className={`nav-item ${isActive('/tv-shows') ? 'active' : ''}`}>
            <div className="nav-btn">
              <BiSolidTv className="fill" />
              <BiTv className="outline" />
              <p>TV Shows</p>
            </div>
          </Link>
        </div>
        <div className="nav-link-wrapper" onClick={createRipple}>
          <Link to="/people/popular" className={`nav-item ${isActive('/people') ? 'active' : ''}`}>
            <div className="nav-btn">
              <HiUserGroup className="fill" />
              <HiOutlineUserGroup className="outline" />
              <p>People</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
