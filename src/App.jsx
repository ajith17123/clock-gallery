import React, { useState, useEffect } from 'react';
import './App.css';
import Home  from './components/Home';
import Home2 from './components/Home2';

const PAGES = [Home, Home2];

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [animClass,   setAnimClass]   = useState('');
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isCursorVisible) setIsCursorVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('.fruit-circle') || 
        target.closest('.fruit-circle2') || 
        target.closest('.fruit-item') || 
        target.closest('.fruit-item2') ||
        target.closest('.dot') ||
        target.tagName === 'A' ||
        target.classList.contains('clickable');
      
      setIsHovering(!!isClickable);
    };

    const handleMouseLeaveWindow = () => {
      setIsCursorVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsCursorVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, [isCursorVisible]);

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
      {/* Custom Circular Cursor */}
      {isCursorVisible && (
        <div 
          className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        />
      )}

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
