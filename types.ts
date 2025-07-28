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

  export interface User {
    id: string;
    name: string;
    email: string;
    image?: string
  }
  
  export interface Medication {
    id: string;
    name: string;
    userId: string;
    scheduleType: ScheduleType;
    times: number;
     // only used for weekly schedule
    daysOfWeek?: Day[];
    dayOfMonth?: string;
    isActive: boolean;
    // ISO datetime strings
    takenLog: string[];
    purpose: string;
    type: string;
  }

  export type ToastType = "success" | "error";

  