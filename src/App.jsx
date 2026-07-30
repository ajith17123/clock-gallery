import React, { useState, useEffect } from 'react';
import './App.css';
import Home  from './components/Home';
import Home2 from './components/Home2';

const PAGES = [Home, Home2];

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [animClass,   setAnimClass]   = useState('');

  const navigate = (direction) => {
    const next = currentPage + direction;
    if (next < 0 || next >= PAGES.length) return;

    // Slide out
    setAnimClass(direction > 0 ? 'slide-out-left' : 'slide-out-right');

    setTimeout(() => {
      setCurrentPage(next);
      setAnimClass(direction > 0 ? 'slide-in-right' : 'slide-in-left');

      // Remove the slide-in class after animation completes
      setTimeout(() => setAnimClass(''), 420);
    }, 380);
  };

  const PageComponent = PAGES[currentPage];

  return (
    <div className="app-shell">
      {/* Page with transition */}
      <div className={`page-wrapper ${animClass}`}>
        <PageComponent />
      </div>

      {/* Left arrow — only show when not on first page */}
      {currentPage > 0 && (
        <button
          className="nav-arrow nav-arrow--left"
          onClick={() => navigate(-1)}
          aria-label="Previous page"
        >
          ‹
        </button>
      )}

      {/* Right arrow — only show when not on last page */}
      {currentPage < PAGES.length - 1 && (
        <button
          className="nav-arrow nav-arrow--right"
          onClick={() => navigate(1)}
          aria-label="Next page"
        >
          ›
        </button>
      )}

      {/* Page dots indicator */}
      <div className="page-dots">
        {PAGES.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === currentPage ? 'dot--active' : ''}`}
            onClick={() => navigate(i - currentPage)}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
