/**
 * Servicio de reservas usando Notion como base de datos.
 *
 * Propiedades esperadas en la base de datos de Notion:
 * - "Nombre"              (title)   → Nombre del cliente
 * - "Correo Electrónico"  (email)   → Email del cliente
 * - "Teléfono"            (phone_number) → Teléfono (9 dígitos)
 * - "Fecha"               (date)    → Fecha + hora de la reserva (ISO datetime)
 * - "Monto"               (number)  → Precio del servicio (opcional)
 * - "Tipo de pago"        (select)  → Método de pago (opcional)
 */

export interface Reservation {
  id: string;
  date: string;   // formato YYYY-MM-DD
  time: string;   // formato HH:mm
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  amount?: number;
  paymentType?: string;
}

// Tipos para las respuestas de la API de Notion
interface NotionRichTextItem {
  plain_text: string;
}

interface NotionPageProperties {
  Nombre?: { title?: NotionRichTextItem[] };
  'Correo Electrónico'?: { email?: string };
  'Teléfono'?: { phone_number?: string };
  Fecha?: { date?: { start?: string } };
  Monto?: { number?: number };
  'Tipo de pago'?: { select?: { name?: string } };
  Hora?: { rich_text?: NotionRichTextItem[] };
}

interface NotionPage {
  id: string;
  created_time: string;
  properties: NotionPageProperties;
}

interface NotionQueryResponse {
  results: NotionPage[];
}

const API_URL = '/api/notion';

// ─── Helpers internos ────────────────────────────────────────────────

async function notionApi(action: string, body?: Record<string, unknown>) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, body }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
    console.error('Notion API error:', errorData);
    throw new Error(
      typeof errorData.error === 'string'
        ? errorData.error
        : errorData.error?.message || 'Error en la API de Notion',
    );
  }

  return response.json();
}

/** Convierte una página de Notion en una Reservation */
function parseNotionPage(page: NotionPage): Reservation {
  const props = page.properties;

  // Fecha puede ser "2025-02-20" o "2025-02-20T10:00:00.000+01:00"
  const fechaStart: string = props['Fecha']?.date?.start ?? '';
  let date = '';
  let time = '';

  if (fechaStart.includes('T')) {
    date = fechaStart.split('T')[0];
    time = fechaStart.split('T')[1].substring(0, 5); // HH:mm
  } else {
    date = fechaStart;
  }

  const phone = props['Teléfono']?.phone_number ?? '';

  return {
    id: page.id,
    date,
    time,
    name: props['Nombre']?.title?.[0]?.plain_text ?? '',
    email: props['Correo Electrónico']?.email ?? '',
    phone,
    createdAt: page.created_time ?? '',
    amount: props['Monto']?.number ?? undefined,
    paymentType: props['Tipo de pago']?.select?.name ?? undefined,
  };
}

/** Construye el objeto de propiedades para crear/actualizar en Notion */
function buildNotionProperties(
  data: Partial<Omit<Reservation, 'id' | 'createdAt'>>,
) {
  const properties: Record<string, unknown> = {};

  if (data.name !== undefined) {
    properties['Nombre'] = {
      title: [{ text: { content: data.name } }],
    };
  }

  // Fecha + Hora se almacenan juntas en la propiedad "Fecha" (date)
  // Se incluye el offset de la zona horaria local para que Notion no lo interprete como UTC
  if (data.date !== undefined) {
    if (data.time) {
      const localDate = new Date(`${data.date}T${data.time}:00`);
      const offsetMinutes = -localDate.getTimezoneOffset();
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const absMin = Math.abs(offsetMinutes);
      const oh = String(Math.floor(absMin / 60)).padStart(2, '0');
      const om = String(absMin % 60).padStart(2, '0');
      const startStr = `${data.date}T${data.time}:00${sign}${oh}:${om}`;
      properties['Fecha'] = { date: { start: startStr } };
    } else {
      properties['Fecha'] = { date: { start: data.date } };
    }
  }

  if (data.email !== undefined) {
    properties['Correo Electrónico'] = { email: data.email };
  }

  if (data.phone !== undefined) {
    properties['Teléfono'] = { phone_number: data.phone };
  }

  if (data.amount !== undefined) {
    properties['Monto'] = { number: data.amount };
  }

  if (data.paymentType !== undefined) {
    properties['Tipo de pago'] = { select: { name: data.paymentType } };
  }

  return properties;
}

/** Calcula el día siguiente en formato YYYY-MM-DD */
function getNextDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  return formatDate(d);
}

// ─── Funciones públicas ──────────────────────────────────────────────

/** Obtener todas las reservas */
export const getReservations = async (): Promise<Reservation[]> => {
  try {
    const data = (await notionApi('query', {})) as NotionQueryResponse;
    return (data.results || []).map(parseNotionPage);
  } catch (error) {
    console.error('Error obteniendo reservas de Notion:', error);
    return [];
  }
};

/** Guardar una nueva reserva */
export const saveReservation = async (
  reservation: Omit<Reservation, 'id' | 'createdAt'>,
): Promise<Reservation | null> => {
  try {
    const properties = buildNotionProperties(reservation);
    const data = (await notionApi('create', { properties })) as NotionPage;
    return parseNotionPage(data);
  } catch (error) {
    console.error('Error guardando reserva en Notion:', error);
    return null;
  }
};

/** Obtener las horas ya reservadas para una fecha concreta */
export const getReservationsForDate = async (date: string): Promise<string[]> => {
  try {
    const nextDay = getNextDay(date);

    const data = await notionApi('query', {
      filter: {
        and: [
          { property: 'Fecha', date: { on_or_after: date } },
          { property: 'Fecha', date: { before: nextDay } },
        ],
      },
    });

    const response = data as NotionQueryResponse;
    return (response.results || [])
      .map((page: NotionPage) => {
        const start: string = page.properties['Fecha']?.date?.start ?? '';
        return start.includes('T') ? start.split('T')[1].substring(0, 5) : '';
      })
      .filter(Boolean);
  } catch (error) {
    console.error('Error obteniendo reservas para la fecha:', error);
    return [];
  }
};

/** Comprobar si una hora está disponible */
export const isTimeAvailable = async (
  date: string,
  time: string,
): Promise<boolean> => {
  const bookedTimes = await getReservationsForDate(date);
  return !bookedTimes.includes(time);
};

// ─── Horarios disponibles ────────────────────────────────────────────

export const getAvailableTimeSlotsForDate = (date: Date): string[] => {
  const day = date.getDay(); // 0 = Domingo, 6 = Sábado

  // Domingos y sábados → cerrado para reserva online
  if (day === 0 || day === 6) return [];

  // Lunes a Viernes: 10:00-13:30 y 17:00-20:30
  return [
    ...generateTimeSlots('10:00', '13:30'),
    ...generateTimeSlots('17:00', '20:30'),
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
    slots.push(
      `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`,
    );
    currentMin += 30;
    if (currentMin >= 60) {
      currentMin = 0;
      currentHour += 1;
    }
  }

  return slots;
};

// ─── Formato de fecha ────────────────────────────────────────────────

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ─── Buscar reservas por teléfono ────────────────────────────────────

export const getReservationsByPhone = async (
  phone: string,
): Promise<Reservation[]> => {
  try {
    const cleanPhone = phone.replace(/\s/g, '').trim();
    if (!cleanPhone) return [];

    const today = formatDate(new Date());

    const data = await notionApi('query', {
      filter: {
        and: [
          { property: 'Teléfono', phone_number: { equals: cleanPhone } },
          { property: 'Fecha', date: { on_or_after: today } },
        ],
      },
      sorts: [{ property: 'Fecha', direction: 'ascending' }],
    }) as NotionQueryResponse;

    return (data.results || []).map(parseNotionPage);
  } catch (error) {
    console.error('Error obteniendo reservas por teléfono:', error);
    return [];
  }
};

// ─── Cancelar reserva (archivar en Notion) ───────────────────────────

export const cancelReservation = async (
  reservationId: string,
): Promise<boolean> => {
  try {
    await notionApi('archive', { pageId: reservationId });
    return true;
  } catch (error) {
    console.error('Error cancelando reserva:', error);
    return false;
  }
};

// ─── Modificar reserva ──────────────────────────────────────────────

export const updateReservation = async (
  reservationId: string,
  updates: Partial<Omit<Reservation, 'id' | 'createdAt'>>,
): Promise<boolean> => {
  try {
    const properties = buildNotionProperties(updates);
    await notionApi('update', { pageId: reservationId, properties });
    return true;
  } catch (error) {
    console.error('Error actualizando reserva:', error);
    return false;
  }
};

// ─── Verificar disponibilidad excluyendo una reserva ─────────────────

export const isTimeAvailableForUpdate = async (
  date: string,
  time: string,
  excludeReservationId: string,
): Promise<boolean> => {
  try {
    const nextDay = getNextDay(date);

    const data = await notionApi('query', {
      filter: {
        and: [
          { property: 'Fecha', date: { on_or_after: date } },
          { property: 'Fecha', date: { before: nextDay } },
        ],
      },
    });

    const response = data as NotionQueryResponse;
    const bookedTimes = (response.results || [])
      .filter((page: NotionPage) => page.id !== excludeReservationId)
      .map((page: NotionPage) => {
        const start: string = page.properties['Fecha']?.date?.start ?? '';
        return start.includes('T') ? start.split('T')[1].substring(0, 5) : '';
      })
      .filter(Boolean);

    return !bookedTimes.includes(time);
  } catch (error) {
    console.error('Error verificando disponibilidad:', error);
    return false;
  }
};
