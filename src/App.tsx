import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Schedule from './components/Schedule';
import './App.css';
import ChatbotModal from './components/ChatbotModal';

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleReserveClick = () => {
    setIsChatbotOpen(true);
  };

  const handleCloseChatbot = () => {
    setIsChatbotOpen(false);
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
      <ChatbotModal isOpen={isChatbotOpen} onClose={handleCloseChatbot} />
      <footer className="footer">
        <p>&copy; 2025 Barbería Elegante. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
