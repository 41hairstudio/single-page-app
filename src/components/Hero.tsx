import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="inicio">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenido a 41hairstudio</h1>
          <p className="hero-subtitle">
            Tu barbería de confianza en Sevilla. Ofrezco servicios profesionales 
            de peluquería y barbería con un estilo único y personalizado. 
            Mi compromiso es la excelencia y la satisfacción de cada cliente, 
            brindando una atención completamente personalizada.
          </p>
        </div>
        
        <div className="hero-location">
          <h2 className="location-title">Encuéntranos</h2>
          <p className="location-address">
            Parque de los Alcornocales, 1, Norte<br />
            41015 Sevilla
          </p>
          <a 
            href="https://google.com/maps/place//data=!4m2!3m1!1s0xd1269e7737572d9:0x955c282366bfb48?sa=X&ved=1t:8290&ictx=111"
            target="_blank"
            rel="noopener noreferrer"
            className="location-button"
            title="Ver ubicación en Google Maps"
          >
            Ver en Google Maps
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
