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
            <span className="schedule-hours">10:00 - 14:00</span>
          </div>
          <div className="schedule-item">
            <span className="schedule-day">Domingos y Festivos</span>
            <span className="schedule-hours">Cerrado</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;
