import { ref, push, get, query, orderByChild, equalTo, remove, update } from 'firebase/database';
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
  
  // Sábados: no disponible para reserva online (depende de la demanda del mes)
  if (day === 6) {
    return [];
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

// Buscar reservas por número de teléfono
export const getReservationsByPhone = async (phone: string): Promise<Reservation[]> => {
  try {
    const reservationsRef = ref(database, RESERVATIONS_PATH);
    const phoneQuery = query(reservationsRef, orderByChild('phone'), equalTo(phone));
    const snapshot = await get(phoneQuery);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const reservations = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      
      // Filtrar solo reservas futuras
      const now = new Date();
      const today = formatDate(now);
      
      return reservations.filter((res: Reservation) => {
        const resDate = new Date(res.date);
        const todayDate = new Date(today);
        return resDate >= todayDate;
      }).sort((a: Reservation, b: Reservation) => {
        // Ordenar por fecha y hora
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }
        return a.time.localeCompare(b.time);
      });
    }
    return [];
  } catch (error) {
    console.error('Error obteniendo reservas por teléfono:', error);
    return [];
  }
};

// Cancelar una reserva
export const cancelReservation = async (reservationId: string): Promise<boolean> => {
  try {
    const reservationRef = ref(database, `${RESERVATIONS_PATH}/${reservationId}`);
    await remove(reservationRef);
    return true;
  } catch (error) {
    console.error('Error cancelando reserva:', error);
    return false;
  }
};

// Modificar una reserva
export const updateReservation = async (
  reservationId: string, 
  updates: Partial<Omit<Reservation, 'id' | 'createdAt'>>
): Promise<boolean> => {
  try {
    const reservationRef = ref(database, `${RESERVATIONS_PATH}/${reservationId}`);
    await update(reservationRef, updates);
    return true;
  } catch (error) {
    console.error('Error actualizando reserva:', error);
    return false;
  }
};

// Verificar si el nuevo horario está disponible (excluyendo la reserva actual)
export const isTimeAvailableForUpdate = async (
  date: string, 
  time: string, 
  excludeReservationId: string
): Promise<boolean> => {
  try {
    const reservationsRef = ref(database, RESERVATIONS_PATH);
    const dateQuery = query(reservationsRef, orderByChild('date'), equalTo(date));
    const snapshot = await get(dateQuery);
    
    if (snapshot.exists()) {
      const data = snapshot.val() as Record<string, Omit<Reservation, 'id'>>;
      const bookedTimes = Object.entries(data)
        .filter(([id]) => id !== excludeReservationId)
        .map(([, reservation]) => reservation.time);
      return !bookedTimes.includes(time);
    }
    return true;
  } catch (error) {
    console.error('Error verificando disponibilidad:', error);
    return false;
  }
};
