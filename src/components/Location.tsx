import { useState } from 'react';
import './Location.css';

const Location = () => {
  const [showMapOptions, setShowMapOptions] = useState(false);
  
  // Coordenadas de la peluquería (reemplaza con las coordenadas reales)
  const address = "Calle Ejemplo 123, Sevilla";
  const coordinates = {
    lat: 37.3891,
    lng: -5.9845
  };

  const handleOpenMap = () => {
    setShowMapOptions(true);
  };

  const handleMapChoice = (mapType: 'google' | 'apple') => {
    if (mapType === 'google') {
      // Google Maps
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`,
        '_blank'
      );
    } else {
      // Apple Maps
      window.open(
        `http://maps.apple.com/?q=${coordinates.lat},${coordinates.lng}`,
        '_blank'
      );
    }
    setShowMapOptions(false);
  };

  return (
    <section className="location" id="ubicacion">
      <div className="location-container">
        <h2 className="location-title">Dónde Estamos</h2>
        
        <div className="location-content">
          <div className="map-container">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3170.123456789!2d${coordinates.lng}!3d${coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDIzJzIwLjgiTiA1wrA1OScwNC4yIlc!5e0!3m2!1ses!2ses!4v1234567890123!5m2!1ses!2ses`}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de 41 Hair Studio"
            ></iframe>
          </div>

          <div className="location-info">
            <div className="info-card">
              <h3 className="info-title">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Dirección
              </h3>
              <p className="info-text">{address}</p>
            </div>

            <button onClick={handleOpenMap} className="map-button">
              <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
              </svg>
              Abrir en Mapa
            </button>

            <p className="info-note">
              También puedes encontrarnos fácilmente buscando "41 Hair Studio" en tu aplicación de mapas favorita.
            </p>
          </div>
        </div>
      </div>

      {showMapOptions && (
        <div className="map-modal-overlay" onClick={() => setShowMapOptions(false)}>
          <div className="map-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="map-modal-title">¿Qué aplicación prefieres?</h3>
            <div className="map-options">
              <button
                onClick={() => handleMapChoice('google')}
                className="map-option-btn google"
              >
                <svg className="map-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span className="map-name">Google Maps</span>
              </button>
              <button
                onClick={() => handleMapChoice('apple')}
                className="map-option-btn apple"
              >
                <svg className="map-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="map-name">Apple Maps</span>
              </button>
            </div>
            <button
              onClick={() => setShowMapOptions(false)}
              className="map-cancel-btn"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Location;
