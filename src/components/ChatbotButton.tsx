import { useState } from 'react';
import './ChatbotButton.css';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="chatbot-button" onClick={toggleChatbot} aria-label="Reservar ahora">
        💬 Reservar ahora
      </button>

      {isOpen && (
        <div className="chatbot-modal">
          <div className="chatbot-modal-content">
            <div className="chatbot-header">
              <h3>Sistema de Reservas</h3>
              <button className="chatbot-close" onClick={toggleChatbot} aria-label="Cerrar">
                ✕
              </button>
            </div>
            <div className="chatbot-body">
              <div className="chatbot-placeholder">
                <p>El chatbot de reservas se integrará aquí mediante n8n.</p>
                <p className="chatbot-placeholder-hint">
                  Este es el contenedor donde se cargará el iframe o widget del chatbot.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;
