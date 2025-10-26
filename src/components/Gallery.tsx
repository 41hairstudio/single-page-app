import { useEffect, useRef, useState } from 'react';
import 'keen-slider/keen-slider.min.css';
import KeenSlider, { type KeenSliderInstance } from 'keen-slider';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import './Gallery.css';

const Gallery = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [slider, setSlider] = useState<KeenSliderInstance | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [img1, img2, img3];

  useEffect(() => {
    if (sliderRef.current) {
      const newSlider = new KeenSlider(sliderRef.current, {
        loop: true,
        slides: {
          perView: 1,
          spacing: 15,
        },
        slideChanged(s: KeenSliderInstance) {
          setCurrentSlide(s.track.details.rel);
        },
      });

      setSlider(newSlider);

      return () => {
        newSlider.destroy();
      };
    }
  }, []);

  return (
    <section className="gallery" id="galeria">
      <div className="gallery-container">
        <h2 className="gallery-title">Galería</h2>
        <div className="gallery-slider-wrapper">
          <div ref={sliderRef} className="keen-slider">
            {images.map((src, index) => (
              <div key={index} className="keen-slider__slide">
                <img src={src} alt={`Galería ${index + 1}`} className="gallery-image" />
              </div>
            ))}
          </div>
          {slider && (
            <>
              <button
                className="gallery-arrow gallery-arrow-left"
                onClick={() => slider.prev()}
                aria-label="Imagen anterior"
              >
                ‹
              </button>
              <button
                className="gallery-arrow gallery-arrow-right"
                onClick={() => slider.next()}
                aria-label="Imagen siguiente"
              >
                ›
              </button>
            </>
          )}
        </div>
        {slider && (
          <div className="gallery-dots">
            {[...Array(images.length)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => slider.moveToIdx(idx)}
                className={`gallery-dot ${currentSlide === idx ? 'active' : ''}`}
                aria-label={`Ir a imagen ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
