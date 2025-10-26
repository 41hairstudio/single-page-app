export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

export async function fetchSpanishHolidays(year: number): Promise<PublicHoliday[]> {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/ES`);
    if (!response.ok) {
      throw new Error('Failed to fetch holidays');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
}

export function isHoliday(date: Date, holidays: PublicHoliday[]): boolean {
  const dateString = date.toISOString().split('T')[0];
  return holidays.some(holiday => holiday.date === dateString);
}

export function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

export function isOpen(date: Date, holidays: PublicHoliday[]): boolean {
  // Closed on Sundays and holidays
  if (isSunday(date) || isHoliday(date, holidays)) {
    return false;
  }
  return true;
}

export function getCurrentSchedule(date: Date, holidays: PublicHoliday[]): string {
  if (!isOpen(date, holidays)) {
    return 'Cerrado';
  }
  
  const dayOfWeek = date.getDay();
  
  // Saturday (6)
  if (dayOfWeek === 6) {
    return '10:00 - 14:00';
  }
  
  // Monday to Friday (1-5)
  return '10:00 - 14:00 y 17:00 - 20:30';
}
