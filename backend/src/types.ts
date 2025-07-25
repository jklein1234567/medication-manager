export enum ScheduleType {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
  }
  
  export enum Day {
    MONDAY = 'Mon',
    TUESDAY = 'Tue',
    WEDNESDAY = 'Wed',
    THURSDAY = 'Thu',
    FRIDAY = 'Fri',
    SATURDAY = 'Sat',
    SUNDAY = 'Sun',
  }
  
  export interface Medication {
    id: string;
    name: string;
    scheduleType: ScheduleType;
    times: string[]; // changed to string[] for multiple times per day
    daysOfWeek?: Day[]; // only used for weekly schedule
    isActive: boolean;
    takenLog: string[]; // ISO datetime strings
  }
  