import { differenceInMinutes } from 'date-fns';

interface DoNotDisturb {
  link?: string;
  minutes: number;
  timestamp: Date;
}

export enum TimeFormat {
  HALF_HOUR = '30 minutes',
  ONE_HOUR = '1 hour',
  TWO_HOURS = '2 hours',
  TOMORROW = 'Tomorrow',
  CUSTOM = 'Custom...',
}

export enum CustomTime {
  MINUTES = 'Minutes',
  HOURS = 'Hours',
  DAYS = 'Days',
}

const DND_STORAGE_KEY = 'DoNotDisturb';
const DEFAULT_URL = 'https://www.google.com';
const HOUR_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;

const isValidUrl = (link: string) => {
  if (link.trim() === '') return false;

  try {
    if (new URL(link)) return true;
  } catch (_) {
    return false;
  }
};

export const getTimeFormatValue = (timeFormat: TimeFormat): number => {
  if (timeFormat === TimeFormat.HALF_HOUR) return MINUTES_PER_HOUR / 2;

  if (timeFormat === TimeFormat.ONE_HOUR) return MINUTES_PER_HOUR;

  if (timeFormat === TimeFormat.TWO_HOURS) return 2 * MINUTES_PER_HOUR;

  return HOUR_PER_DAY * MINUTES_PER_HOUR;
};

export const getTotalMinutes = (
  customTime: CustomTime,
  value: number,
): number => {
  if (customTime === CustomTime.MINUTES) return value;

  if (customTime === CustomTime.HOURS) return value * MINUTES_PER_HOUR;

  return value * HOUR_PER_DAY * MINUTES_PER_HOUR;
};

const setDndMode = (dnd: DoNotDisturb): string => {
  if (dnd.minutes === 0) return 'Time value cannot be zero or empty!';

  if (dnd.link && !isValidUrl(dnd.link)) return 'Link provided is invalid!';

  if (!dnd.link) dnd.link = DEFAULT_URL;

  localStorage.setItem(DND_STORAGE_KEY, JSON.stringify(dnd));
};

const isUnderDndMode = (): string => {
  const stored = localStorage.getItem(DND_STORAGE_KEY);

  if (!stored) return;

  const dnd = JSON.parse(stored) as DoNotDisturb;
  const now = new Date();
  const difference = differenceInMinutes(now, dnd.timestamp);

  if (difference <= dnd.minutes) return dnd.link.trim();

  localStorage.removeItem(DND_STORAGE_KEY);

  return;
};

export default {
  setDndMode,
  isUnderDndMode,
};