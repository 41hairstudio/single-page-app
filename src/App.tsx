import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Schedule from './components/Schedule';
import BookingModal from './components/BookingModal';
import './App.css';

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleReserveClick = () => {
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <div className="app">
      <Header onReserveClick={handleReserveClick} />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <Schedule />
      </main>
      <BookingModal isOpen={isBookingOpen} onClose={handleCloseBooking} />
      <footer className="footer">
        <p>&copy; 2025 Barbería Elegante. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
