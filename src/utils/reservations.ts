import { ref, push, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../config/firebase';

export interface Reservation {
  id: string;
  date: string; // formato YYYY-MM-DD
  time: string; // formato HH:mm
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

const RESERVATIONS_PATH = 'reservations';

export const getReservations = async (): Promise<Reservation[]> => {
  try {
    const reservationsRef = ref(database, RESERVATIONS_PATH);
    const snapshot = await get(reservationsRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error obteniendo reservas de Firebase:', error);
    return [];
  }
};

export const saveReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt'>): Promise<Reservation | null> => {
  try {
    const reservationsRef = ref(database, RESERVATIONS_PATH);
    const newReservation = {
      ...reservation,
      createdAt: new Date().toISOString(),
    };
    
    const newRef = await push(reservationsRef, newReservation);
    
    return {
      id: newRef.key!,
      ...newReservation
    };
  } catch (error) {
    console.error('Error guardando reserva en Firebase:', error);
    return null;
  }
};

export const getReservationsForDate = async (date: string): Promise<string[]> => {
  try {
    const reservationsRef = ref(database, RESERVATIONS_PATH);
    const dateQuery = query(reservationsRef, orderByChild('date'), equalTo(date));
    const snapshot = await get(dateQuery);
    
    if (snapshot.exists()) {
      const data = snapshot.val() as Record<string, Omit<Reservation, 'id'>>;
      return Object.values(data).map(r => r.time);
    }
    return [];
  } catch (error) {
    console.error('Error obteniendo reservas para la fecha:', error);
    return [];
  }
};

export const isTimeAvailable = async (date: string, time: string): Promise<boolean> => {
  const bookedTimes = await getReservationsForDate(date);
  return !bookedTimes.includes(time);
};

// Horarios disponibles según el día de la semana
export const getAvailableTimeSlotsForDate = (date: Date): string[] => {
  const day = date.getDay(); // 0 = Domingo, 6 = Sábado
  
  // Domingos - cerrado
  if (day === 0) {
    return [];
  }
  
  // Sábados: 10:00 - 13:30 (última reserva a las 13:30)
  if (day === 6) {
    return generateTimeSlots('10:00', '13:30');
  }
  
  // Lunes a Viernes: 10:00 - 13:30 y 17:00 - 20:30
  return [
    ...generateTimeSlots('10:00', '13:30'),
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
