import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import './Header.css';

interface HeaderProps {
  onReserveClick: () => void;
}

const Header = ({ onReserveClick }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'inicio') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      setMenuOpen(false);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const header = document.querySelector('.header') as HTMLElement;
      const headerHeight = header?.offsetHeight || 0;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setMenuOpen(false);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <img 
          src={logo} 
          alt="41hairstudio - Barbería Profesional en Sevilla" 
          title="41hairstudio Logo"
          className="header-logo" 
        />
        
        <button 
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="header-nav"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav 
          id="header-nav"
          className={`header-nav ${menuOpen ? 'open' : ''}`}
          role="navigation"
          aria-label="Navegación principal"
        >
          <button onClick={() => scrollToSection('inicio')} className="nav-link">
            Inicio
          </button>
          <button onClick={() => scrollToSection('servicios')} className="nav-link">
            Servicios
          </button>
          <button onClick={() => scrollToSection('galeria')} className="nav-link">
            Galería
          </button>
          <button onClick={() => scrollToSection('horarios')} className="nav-link">
            Horarios
          </button>
          <button 
            className="header-reserve-btn-mobile" 
            onClick={() => {
              onReserveClick();
              setMenuOpen(false);
            }}
          >
            Reservar
          </button>
        </nav>

        <button className="header-reserve-btn" onClick={onReserveClick} aria-label="Reservar ahora">
          Reservar
        </button>
      </div>
    </header>
  );
};

export default Header;
