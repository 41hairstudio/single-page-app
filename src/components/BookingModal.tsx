import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  formatDate,
  getAvailableTimeSlotsForDate,
  isTimeAvailable,
  saveReservation,
} from '../utils/reservations';
import { sendConfirmationEmails } from '../utils/emailService';
import { fetchSpanishHolidays } from '../utils/holidays';
import './BookingModal.css';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'date' | 'time' | 'form' | 'review' | 'confirmation';

interface BookingData {
  date: Date | null;
  time: string;
  name: string;
  email: string;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [step, setStep] = useState<Step>('date');
  const [bookingData, setBookingData] = useState<BookingData>({
    date: null,
    time: '',
    name: '',
    email: '',
  });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [holidays, setHolidays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar festivos al abrir el modal
  useState(() => {
    const loadHolidays = async () => {
      const year = new Date().getFullYear();
      const holidayData = await fetchSpanishHolidays(year);
      const holidayDates = holidayData.map(h => h.date);
      setHolidays(holidayDates);
    };
    if (isOpen) {
      loadHolidays();
    }
  });

  const handleDateSelect = (date: Date) => {
    setBookingData({ ...bookingData, date });
    const slots = getAvailableTimeSlotsForDate(date);
    setAvailableSlots(slots);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time });
    setStep('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.name || !bookingData.email) {
      setError('Por favor, completa todos los campos');
      return;
    }
    setError('');
    setStep('review');
  };

  const handleConfirmBooking = async () => {
    if (!bookingData.date) return;

    setLoading(true);
    setError('');

    try {
      const dateStr = formatDate(bookingData.date);
      
      // Verificar disponibilidad nuevamente
      if (!isTimeAvailable(dateStr, bookingData.time)) {
        setError('Lo sentimos, esta hora ya no está disponible. Por favor, selecciona otra.');
        setStep('time');
        setLoading(false);
        return;
      }

      // Guardar la reserva
      saveReservation({
        date: dateStr,
        time: bookingData.time,
        name: bookingData.name,
        email: bookingData.email,
      });

      // Enviar emails
      const emailSent = await sendConfirmationEmails({
        name: bookingData.name,
        email: bookingData.email,
        date: dateStr,
        time: bookingData.time,
      });

      if (!emailSent) {
        console.warn('No se pudieron enviar los emails de confirmación');
      }

      setStep('confirmation');
    } catch (err) {
      setError('Hubo un error al procesar tu reserva. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('date');
    setBookingData({
      date: null,
      time: '',
      name: '',
      email: '',
    });
    setError('');
    onClose();
  };

  const handleBack = () => {
    setError('');
    if (step === 'time') setStep('date');
    else if (step === 'form') setStep('time');
    else if (step === 'review') setStep('form');
  };

  const isDateDisabled = ({ date }: { date: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Deshabilitar fechas pasadas
    if (date < today) return true;
    
    // Deshabilitar domingos
    if (date.getDay() === 0) return true;
    
    // Deshabilitar festivos
    const dateStr = formatDate(date);
    if (holidays.includes(dateStr)) return true;
    
    return false;
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay" onClick={handleClose}>
      <div className="booking-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="booking-modal-close" onClick={handleClose}>
          ✕
        </button>

        <div className="booking-stepper">
          <div className={`stepper-step ${step === 'date' ? 'active' : step === 'time' || step === 'form' || step === 'review' || step === 'confirmation' ? 'completed' : ''}`}>
            <span className="stepper-number">1</span>
            <span className="stepper-label">Fecha</span>
          </div>
          <div className="stepper-line"></div>
          <div className={`stepper-step ${step === 'time' ? 'active' : step === 'form' || step === 'review' || step === 'confirmation' ? 'completed' : ''}`}>
            <span className="stepper-number">2</span>
            <span className="stepper-label">Hora</span>
          </div>
          <div className="stepper-line"></div>
          <div className={`stepper-step ${step === 'form' ? 'active' : step === 'review' || step === 'confirmation' ? 'completed' : ''}`}>
            <span className="stepper-number">3</span>
            <span className="stepper-label">Datos</span>
          </div>
          <div className="stepper-line"></div>
          <div className={`stepper-step ${step === 'review' ? 'active' : step === 'confirmation' ? 'completed' : ''}`}>
            <span className="stepper-number">4</span>
            <span className="stepper-label">Confirmar</span>
          </div>
        </div>

        {error && <div className="booking-error">{error}</div>}

        <div className="booking-content">
          {step === 'date' && (
            <div className="booking-step">
              <h2 className="booking-title">Selecciona una fecha</h2>
              <Calendar
                onChange={(value) => handleDateSelect(value as Date)}
                value={bookingData.date}
                tileDisabled={isDateDisabled}
                locale="es-ES"
                minDate={new Date()}
              />
            </div>
          )}

          {step === 'time' && (
            <div className="booking-step">
              <h2 className="booking-title">Selecciona una hora</h2>
              <p className="booking-subtitle">
                {bookingData.date && formatDateForDisplay(bookingData.date)}
              </p>
              <div className="time-slots">
                {availableSlots.length === 0 ? (
                  <p className="no-slots">No hay horarios disponibles para este día</p>
                ) : (
                  availableSlots.map((slot) => {
                    const dateStr = bookingData.date ? formatDate(bookingData.date) : '';
                    const available = isTimeAvailable(dateStr, slot);
                    return (
                      <button
                        key={slot}
                        className={`time-slot ${!available ? 'disabled' : ''}`}
                        onClick={() => available && handleTimeSelect(slot)}
                        disabled={!available}
                      >
                        {slot}
                      </button>
                    );
                  })
                )}
              </div>
              <button className="booking-back-btn" onClick={handleBack}>
                Volver
              </button>
            </div>
          )}

          {step === 'form' && (
            <div className="booking-step">
              <h2 className="booking-title">Tus datos</h2>
              <form onSubmit={handleFormSubmit} className="booking-form">
                <div className="form-group">
                  <label htmlFor="name">Nombre completo</label>
                  <input
                    type="text"
                    id="name"
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    required
                    placeholder="Escribe tu nombre"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    required
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="booking-back-btn" onClick={handleBack}>
                    Volver
                  </button>
                  <button type="submit" className="booking-next-btn">
                    Continuar
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'review' && (
            <div className="booking-step">
              <h2 className="booking-title">Revisa tu reserva</h2>
              <div className="booking-review">
                <div className="review-item">
                  <span className="review-label">Fecha:</span>
                  <span className="review-value">
                    {bookingData.date && formatDateForDisplay(bookingData.date)}
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-label">Hora:</span>
                  <span className="review-value">{bookingData.time}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Nombre:</span>
                  <span className="review-value">{bookingData.name}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Email:</span>
                  <span className="review-value">{bookingData.email}</span>
                </div>
              </div>
              <div className="form-actions">
                <button className="booking-back-btn" onClick={handleBack}>
                  Volver
                </button>
                <button
                  className="booking-confirm-btn"
                  onClick={handleConfirmBooking}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Confirmar reserva'}
                </button>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="booking-step">
              <div className="booking-success">
                <div className="success-icon">✓</div>
                <h2 className="booking-title">¡Reserva confirmada!</h2>
                <p className="success-message">
                  Tu reserva ha sido confirmada para el{' '}
                  {bookingData.date && formatDateForDisplay(bookingData.date)} a las{' '}
                  {bookingData.time}.
                </p>
                <p className="success-submessage">
                  Hemos enviado un correo de confirmación a {bookingData.email}
                </p>
                <button className="booking-done-btn" onClick={handleClose}>
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
