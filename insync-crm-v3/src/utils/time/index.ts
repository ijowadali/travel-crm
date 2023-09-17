import type { TimeFormatter } from '@src/types/time';
import dayjs from 'dayjs';

export class TimeUtils {
  static formatTime(time: string | number | Date, format: TimeFormatter = 'YYYY-MM-DD HH:mm:ss') {
    return dayjs(time).format(format);
  }

  static getDuration(start?: string | Date, end?: string | Date): number {
    if (!start || !end) return 0;
    const startTimestamp = typeof start === 'string' ? new Date(start).getTime() : start.getTime();
    const endTimestamp = typeof start === 'string' ? new Date(end).getTime() : start.getTime();
    return endTimestamp - startTimestamp;
  }
}
