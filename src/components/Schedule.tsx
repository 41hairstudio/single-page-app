import { useEffect, useState } from 'react';
import { fetchSpanishHolidays, isOpen, getCurrentSchedule } from '../utils/holidays';
import type { PublicHoliday } from '../utils/holidays';
import { getDayName } from '../utils/dateFormatter';
import './Schedule.css';

const Schedule = () => {
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
  const [loading, setLoading] = useState(true);
  const [today] = useState(new Date());

  useEffect(() => {
    const loadHolidays = async () => {
      const year = today.getFullYear();
      const holidayData = await fetchSpanishHolidays(year);
      setHolidays(holidayData);
      setLoading(false);
    };

    loadHolidays();
  }, [today]);

  const isCurrentlyOpen = isOpen(today, holidays);
  const currentSchedule = getCurrentSchedule(today, holidays);
  const dayName = getDayName(today);

  return (
    <section className="schedule" id="horarios">
      <div className="schedule-container">
        <h2 className="schedule-title">Horarios</h2>
        
        <div className="schedule-status">
          <div className={`status-indicator ${isCurrentlyOpen ? 'open' : 'closed'}`}>
            <span className="status-dot"></span>
            <span className="status-text">
              {loading ? 'Cargando...' : isCurrentlyOpen ? 'Abierto ahora' : 'Cerrado'}
            </span>
          </div>
          <p className="current-day">{dayName}</p>
          <p className="current-hours">{currentSchedule}</p>
        </div>

        <div className="schedule-list">
          <div className="schedule-item">
            <span className="schedule-day">Lunes a Viernes</span>
            <span className="schedule-hours">10:00 - 14:00 y 17:00 - 21:00</span>
          </div>
          <div className="schedule-item">
            <span className="schedule-day">Sábados</span>
            <span className="schedule-hours saturday-note">Consultar disponibilidad</span>
          </div>
          <div className="schedule-item">
            <span className="schedule-day">Domingos y Festivos</span>
            <span className="schedule-hours">Cerrado</span>
          </div>
        </div>
        
        <div className="saturday-info">
          <p className="info-text">
            <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Los sábados la disponibilidad varía según la demanda del mes. 
            Por favor, contacta con nosotros para confirmar el horario.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Schedule;
