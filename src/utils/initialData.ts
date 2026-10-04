import { Goal90, Task, StreakInfo, MonthReflections } from '../types';

export const INITIAL_GOAL: Goal90 = {
  title: "بناء لياقة بدنية عالية، القراءة اليومية، وتطوير مهاراتي البرمجية",
  whyStatement: "لأنني أستحق أن أكون النسخة الأفضل من نفسي ولأن الـ 90 يوماً تصنع فارقاً جذرياً في صحتي ومستقبلي المهني.",
  startDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currentDay: 14,
  milestones: {
    day30Reward: "مكافأة الشهر الأول: شراء حذاء رياضي جديد ويوم راحة مميز",
    day60Reward: "مكافأة الشهر الثاني: عطلة نهاية أسبوع ممتعة وتناول وجبتي المفضلة",
    day90Reward: "مكافأة الإنجاز النهائي: الاحتفال بالهدف الكبير وشراء حاسوب محمول جديد"
  }
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'صلاة الفجر وقراءة أذكار الصباح',
    category: 'spiritual',
    priority: 'high',
    scheduledTime: '05:30',
    hasReminder: true,
    reminderTime: '05:25',
    notes: 'بداية اليوم بالطاقة الروحية والسكينة',
    isRecurringDaily: true,
    activeDays: Array.from({ length: 90 }, (_, i) => i + 1),
    completions: {
      1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true,
      8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'تمارين اللياقة أو المشي 45 دقيقة',
    category: 'health',
    priority: 'high',
    scheduledTime: '07:00',
    hasReminder: true,
    reminderTime: '06:50',
    notes: 'تمرين كارديو أو حديد + تمارين الإطالة',
    isRecurringDaily: true,
    activeDays: Array.from({ length: 90 }, (_, i) => i + 1),
    completions: {
      1: true, 2: true, 3: true, 4: false, 5: true, 6: true, 7: true,
      8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: false
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'شرب 3 لتر ماء على مدار اليوم',
    category: 'health',
    priority: 'medium',
    scheduledTime: '12:00',
    hasReminder: true,
    reminderTime: '12:00',
    notes: 'كوب ماء كل ساعتين للحفاظ على النشاط',
    isRecurringDaily: true,
    activeDays: Array.from({ length: 90 }, (_, i) => i + 1),
    completions: {
      1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true,
      8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-4',
    title: 'جلسة عمل/تعلم مركزة لمدة ساعتين (Deep Work)',
    category: 'career',
    priority: 'high',
    scheduledTime: '10:00',
    hasReminder: true,
    reminderTime: '09:55',
    notes: 'بدون إشعارات الهاتف أو وسائل التواصل',
    isRecurringDaily: true,
    activeDays: Array.from({ length: 90 }, (_, i) => i + 1),
    completions: {
      1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 7: true,
      8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: false
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-5',
    title: 'قراءة 20 صفحة من كتاب مفيد',
    category: 'learning',
    priority: 'medium',
    scheduledTime: '21:00',
    hasReminder: true,
    reminderTime: '20:45',
    notes: 'تلخيص فكرة رئيسية واحدة في دفتر الملاحظات',
    isRecurringDaily: true,
    activeDays: Array.from({ length: 90 }, (_, i) => i + 1),
    completions: {
      1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true,
      8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: false
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-6',
    title: 'مراجعة وتقييم يومي قبل النوم',
    category: 'personal',
    priority: 'low',
    scheduledTime: '22:30',
    hasReminder: true,
    reminderTime: '22:15',
    notes: 'شكر النعم وكتابة أهم إنجاز اليوم والتحضير للغد',
    isRecurringDaily: true,
    activeDays: Array.from({ length: 90 }, (_, i) => i + 1),
    completions: {
      1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true,
      8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: false
    },
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_STREAK: StreakInfo = {
  currentStreak: 14,
  longestStreak: 14,
  lastCompletedDate: new Date().toISOString().split('T')[0],
  freezeTokens: 3,
  frozenDays: []
};

export const INITIAL_REFLECTIONS: MonthReflections = {
  month1: {
    notes: "بداية حماسية ومبشرة! التركيز على الاستيقاظ المبكر صنع فارقاً كبيراً في تنظيم اليوم.",
    rating: 5,
    proudOf: "الالتزام التام بالصلوات والماء والتمارين اليومية.",
    toBeImproved: "تقليل تشتت الهاتف أثناء ساعات العمل والتعلم."
  },
  month2: {
    notes: "",
    rating: 0,
    proudOf: "",
    toBeImproved: ""
  },
  month3: {
    notes: "",
    rating: 0,
    proudOf: "",
    toBeImproved: ""
  }
};
