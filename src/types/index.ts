export type Category = 'health' | 'learning' | 'spiritual' | 'career' | 'personal';

export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  scheduledTime?: string; // HH:mm
  hasReminder: boolean;
  reminderTime?: string; // HH:mm
  notes?: string;
  isRecurringDaily: boolean; // True = all 90 days
  activeDays: number[]; // Specific days (1-90) if not all days
  completions: Record<number, boolean>; // key: day number (1-90), value: completed
  createdAt: string;
}

export interface Goal90 {
  title: string;
  whyStatement: string;
  startDate: string; // YYYY-MM-DD
  currentDay: number; // 1 to 90
  milestones: {
    day30Reward: string;
    day60Reward: string;
    day90Reward: string;
  };
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string; // YYYY-MM-DD
  freezeTokens: number;
  frozenDays: number[]; // day numbers
}

export interface MonthlyReflection {
  notes: string;
  rating: number; // 1 to 5 stars
  proudOf: string;
  toBeImproved: string;
}

export interface MonthReflections {
  month1: MonthlyReflection;
  month2: MonthlyReflection;
  month3: MonthlyReflection;
}

export interface CategoryMeta {
  name: string;
  iconName: string;
  color: string;
  bgLight: string;
  border: string;
}
