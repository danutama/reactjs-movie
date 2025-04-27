import React from 'react';
import Container from './Container';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <div className="d-flex gap-1 justify-content-center align-items-center flex-column mb-5 py-sm-4">
          <span>
            <a href="https://github.com/danutama" className="text-secondary fs-3" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
          </span>
          <small className="text-secondary text-center">&copy;{currentYear} Designed and built by Danu Pratama</small>
          <small className="text-secondary text-center">
            <span>Data provided by </span>
            <a href="https://www.themoviedb.org/" className="text-secondary fw-normal" target="_blank" rel="noopener noreferrer">
              TMDb
            </a>
          </small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
