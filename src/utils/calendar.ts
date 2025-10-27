export const generateICSFile = (params: {
  date: string;       // "YYYY-MM-DD"
  time: string;       // "HH:mm"
  name: string;
  email: string;
  phone: string;
  conRecordatorio: boolean;
}): string => {
  const { date, time, name, email, phone, conRecordatorio } = params;

  // Parsear fecha
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const startDate = new Date(year, month - 1, day, hour, minute);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // +30min

  // Formatear fecha a formato .ics
  const formatICS = (date: Date): string =>
    date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const dtStart = formatICS(startDate);
  const dtEnd = formatICS(endDate);
  const dtStamp = formatICS(new Date());
  const uid = `cita-${Date.now()}-${Math.random().toString(36).slice(2)}@41hairstudio.com`;

  // Descripción según el valor de conRecordatorio
  const description = conRecordatorio
    ? `Reserva confirmada para ${name}\\nPor favor\\, llega con 5 minutos de antelación.`
    : `Cliente: ${name}\\nEmail: ${email}\\nTeléfono: ${phone}`;

  // Recordatorio si conRecordatorio === true
  const alarm = conRecordatorio
    ? [
        'BEGIN:VALARM',
        'TRIGGER:-P1D',
        'ACTION:DISPLAY',
        'DESCRIPTION:Recordatorio: Mañana tienes cita en 41 Hair Studio',
        'END:VALARM',
      ]
    : [];

  // Montar contenido .ics
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//41 Hair Studio//Booking System//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    'SUMMARY:Cita en 41 Hair Studio',
    `DESCRIPTION:${description}`,
    'LOCATION:Parque de los Alcornocales\\, 1\\, Norte\\, 41015 Sevilla',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    ...alarm,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
};