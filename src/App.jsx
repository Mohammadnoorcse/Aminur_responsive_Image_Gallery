import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

const imageUrls = Array.from(
  { length: 100 },
  (_, i) => `https://picsum.photos/id/${i + 10}/400/300`
);

function App() {
  const [images, setImages] = useState(imageUrls.slice(0, 20));
  const [gridCols, setGridCols] = useState(4);
  const [modalIndex, setModalIndex] = useState(null);
  const loader = useRef();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const loadMoreImages = () => {
    setTimeout(() => {
      setImages((prev) => imageUrls.slice(0, prev.length + 20));
    }, 1000);
  };

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) loadMoreImages();
  }, []);

  useEffect(() => {
    const options = { root: null, rootMargin: "20px", threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) observer.observe(loader.current);

    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);

    const handleKey = (e) => {
      if (modalIndex === null) return;
      if (e.key === "ArrowRight") setModalIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setModalIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "Escape") setModalIndex(null);
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleObserver, modalIndex, images.length]);

  return (
    <div className="App">
      <div className="header-controls">
        <h1>Responsive Image Gallery (React)</h1>
        <select
          onChange={(e) => setGridCols(Number(e.target.value))}
          value={gridCols}
        >
          <option value={2}>2 per row</option>
          <option value={4}>4 per row</option>
          <option value={6}>6 per row</option>
        </select>
      </div>

      <div
        className="gallery"
        style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
      >
        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`img-${idx}`}
            onClick={() => setModalIndex(idx)}
            loading="lazy"
          />
        ))}
      </div>

      {modalIndex !== null && (
        <div className="modal" onClick={() => setModalIndex(null)}>
          <img src={images[modalIndex]} alt="modal" />
        </div>
      )}

      <div ref={loader} className="loading">
        More image ...
      </div>

      {showScrollTop && (
        <button
          className="scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ⬆ Top
        </button>
      )}
    </div>
  );
}

export default App;
