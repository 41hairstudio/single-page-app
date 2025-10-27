export interface Reservation {
  id: string;
  date: string; // formato YYYY-MM-DD
  time: string; // formato HH:mm
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

const STORAGE_KEY = 'barbershop_reservations';

export const getReservations = (): Reservation[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveReservation = (reservation: Omit<Reservation, 'id' | 'createdAt'>): Reservation => {
  const reservations = getReservations();
  const newReservation: Reservation = {
    ...reservation,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  reservations.push(newReservation);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  return newReservation;
};

export const getReservationsForDate = (date: string): string[] => {
  const reservations = getReservations();
  return reservations
    .filter(r => r.date === date)
    .map(r => r.time);
};

export const isTimeAvailable = (date: string, time: string): boolean => {
  const bookedTimes = getReservationsForDate(date);
  return !bookedTimes.includes(time);
};

// Horarios disponibles según el día de la semana
export const getAvailableTimeSlotsForDate = (date: Date): string[] => {
  const day = date.getDay(); // 0 = Domingo, 6 = Sábado
  
  // Domingos - cerrado
  if (day === 0) {
    return [];
  }
  
  // Sábados: 10:00 - 14:00
  if (day === 6) {
    return generateTimeSlots('10:00', '14:00');
  }
  
  // Lunes a Viernes: 10:00 - 14:00 y 17:00 - 20:30
  return [
    ...generateTimeSlots('10:00', '14:00'),
    ...generateTimeSlots('17:00', '20:30')
  ];
};

const generateTimeSlots = (start: string, end: string): string[] => {
  const slots: string[] = [];
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (
    currentHour < endHour || 
    (currentHour === endHour && currentMin <= endMin)
  ) {
    slots.push(`${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`);
    
    // Incrementar 30 minutos
    currentMin += 30;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour += 1;
    }
  }
  
  return slots;
};

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
