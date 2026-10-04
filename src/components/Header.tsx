import React from 'react';
import { Flame, Bell, Volume2, VolumeX, BarChart3, CheckSquare, Calendar, Target, Smartphone, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  currentDay: number;
  currentStreak: number;
  totalTasksToday: number;
  completedTasksToday: number;
  activeTab: 'tasks' | 'stats' | 'roadmap' | 'goal';
  setActiveTab: (tab: 'tasks' | 'stats' | 'roadmap' | 'goal') => void;
  onOpenStreakModal: () => void;
  onOpenReminderModal: () => void;
  onOpenInstallModal: () => void;
  onToggleMiniWidgetMode: () => void;
  hasUnreadReminders: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDay,
  currentStreak,
  totalTasksToday,
  completedTasksToday,
  activeTab,
  setActiveTab,
  onOpenStreakModal,
  onOpenReminderModal,
  onOpenInstallModal,
  onToggleMiniWidgetMode,
  hasUnreadReminders,
  soundEnabled,
  setSoundEnabled,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
    if (next) sounds.playTaskComplete();
  };

  const dayPercent = Math.min(100, Math.round((currentDay / 90) * 100));

  return (
    <header className="sticky top-0 z-40 bg-[#0e1422]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('tasks')}
              className="flex items-center gap-2.5 text-right group cursor-pointer focus:outline-none"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6 text-white animate-flame" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                    أنت تستطيع
                  </span>
                  <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    تحدي 90 يوم
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  اليوم <span className="text-amber-400 font-bold tabular-nums">{currentDay}</span> من 90 · إنجاز {dayPercent}%
                </p>
              </div>
            </button>
          </div>

          {/* Mobile Right Quick Action Icons */}
          <div className="flex items-center gap-1.5 md:hidden">
            {/* Prominent Mini Widget button for Mobile */}
            <button
              onClick={onToggleMiniWidgetMode}
              title="فتح وضع الويدجت المصغر"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 active:scale-95 transition-transform"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>الويدجت 📱</span>
            </button>

            <button
              onClick={onOpenStreakModal}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-orange-950/40 border border-orange-500/30 text-amber-400 text-xs font-bold"
            >
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span className="tabular-nums">{currentStreak}</span>
            </button>

            <button
              onClick={onOpenReminderModal}
              className="relative p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white"
              aria-label="التذكيرات"
            >
              <Bell className="w-4 h-4" />
              {hasUnreadReminders && (
                <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Single line with subtle active state) */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/25 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>المهام اليومية</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums ${
              activeTab === 'tasks' ? 'bg-amber-600/30 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
            }`}>
              {completedTasksToday}/{totalTasksToday}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/25 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>الإحصائيات الشهرية</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/25 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>خارطة الـ 90 يوم</span>
          </button>

          <button
            onClick={() => setActiveTab('goal')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'goal'
                ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/25 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>هدفي والمكافآت</span>
          </button>
        </nav>

        {/* Action Controls (Desktop Zone 3) */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Mini Widget Mode Toggle */}
          <button
            onClick={onToggleMiniWidgetMode}
            title="فتح وضع الويدجت المصغر"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>وضع الويدجت 📱</span>
          </button>

          {/* Install on phone trigger */}
          <button
            onClick={onOpenInstallModal}
            title="تثبيت التطبيق كـ PWA على الهاتف"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-bold transition-colors cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>تثبيت بالشاشة 📲</span>
          </button>

          {/* Flame streak trigger */}
          <button
            onClick={onOpenStreakModal}
            title="تفاصيل شعلة الستريك"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-950/60 to-red-950/40 border border-orange-500/40 text-amber-400 hover:border-orange-400 hover:scale-102 transition-all cursor-pointer shadow-sm shadow-orange-950/50"
          >
            <Flame className="w-4 h-4 text-orange-400 fill-orange-500 animate-pulse" />
            <span className="text-xs text-orange-300 font-medium">الستريك:</span>
            <span className="text-sm font-extrabold text-amber-300 tabular-nums">
              {currentStreak} {currentStreak === 1 ? 'يوم' : 'أيام'}
            </span>
          </button>

          {/* Reminder Bell */}
          <button
            onClick={onOpenReminderModal}
            title="التنبيهات والمواعيد"
            className="relative p-2 rounded-xl bg-slate-800/70 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/70 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {hasUnreadReminders && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0e1422]" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية'}
            className="p-2 rounded-xl bg-slate-800/70 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/70 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
