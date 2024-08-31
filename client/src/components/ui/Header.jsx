import React from 'react';
import Title from './Title';
import ThemeDropdown from './Theme';
import { IoSearch } from 'react-icons/io5';

const Header = ({ onSearchClick }) => {
  return (
    <header className="container-fluid">
      <div className="header-container">
        <div className="header-box container-fluid d-flex justify-content-between align-items-center">
          <Title />
          <div className="d-flex gap-2 align-items-center">
            <button type="button" className="bg-transparent border-0" onClick={onSearchClick}>
              <IoSearch className="icon text fs-3" />
            </button>
            <ThemeDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
