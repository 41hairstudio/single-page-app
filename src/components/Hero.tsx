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
          <h3 className="location-title">Encuéntranos</h3>
          <p className="location-address">
            Parque de los Alcornocales, 1, Norte<br />
            41015 Sevilla
          </p>
          <a 
            href="https://google.com/maps/place//data=!4m2!3m1!1s0xd1269e7737572d9:0x955c282366bfb48?sa=X&ved=1t:8290&ictx=111"
            target="_blank"
            rel="noopener noreferrer"
            className="location-button"
          >
            Ver en Google Maps
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;

/*
I'd like to automate a barber shop system where you can book an hour to have a hair cut. You can schedule it from 10:00AM to 2:00PM and 5:00PM to 8:30PM from monday to friday and from 10:00AM to 2:00PM on saturdays. Sundays and holidays are closed. I want to implement a chat on my app in a model with a simple form. You can also cancel your reservation through the chat. At the moment after doing a book you receive a confirmation email with the details of your reservation. The same happens when you cancel it. Also, the barber must recive a notification with a button to add the book to his calender android or ios calendar. If the book is canceled the appointment must be removed from the calendar. Of course, if an hour is booked that hour must not be available for other users.
*/