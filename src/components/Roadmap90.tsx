import React from 'react';
import { Flag, Award, CheckCircle2, Circle, Flame, Calendar, Sparkles } from 'lucide-react';
import { Task, Goal90 } from '../types';

interface Roadmap90Props {
  currentDay: number;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  tasks: Task[];
  goal: Goal90;
  onOpenTasksTab: () => void;
}

export const Roadmap90: React.FC<Roadmap90Props> = ({
  currentDay,
  selectedDay,
  setSelectedDay,
  tasks,
  goal,
  onOpenTasksTab,
}) => {
  const months = [
    {
      id: 1,
      title: 'الشهر الأول (الأيام 1 - 30)',
      subtitle: 'مرحلة التأسيس وبناء العادة',
      reward: goal.milestones.day30Reward,
      days: Array.from({ length: 30 }, (_, i) => i + 1),
      targetDay: 30,
      badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    },
    {
      id: 2,
      title: 'الشهر الثاني (الأيام 31 - 60)',
      subtitle: 'مرحلة الاستمرارية وبناء الزخم القوي',
      reward: goal.milestones.day60Reward,
      days: Array.from({ length: 30 }, (_, i) => i + 31),
      targetDay: 60,
      badgeColor: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
    },
    {
      id: 3,
      title: 'الشهر الثالث (الأيام 61 - 90)',
      subtitle: 'مرحلة الإتقان والوصول للهدف الكبير',
      reward: goal.milestones.day90Reward,
      days: Array.from({ length: 30 }, (_, i) => i + 61),
      targetDay: 90,
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    },
  ];

  // Helper to calculate completion for a specific day
  const getDayStatus = (dayNum: number) => {
    let scheduled = 0;
    let completed = 0;
    tasks.forEach((t) => {
      const active = t.isRecurringDaily || (t.activeDays && t.activeDays.includes(dayNum));
      if (active) {
        scheduled++;
        if (t.completions[dayNum]) completed++;
      }
    });

    const isDone = scheduled > 0 && completed === scheduled;
    const isPartial = completed > 0 && completed < scheduled;
    const isPast = dayNum < currentDay;
    const isCurrent = dayNum === currentDay;

    return { scheduled, completed, isDone, isPartial, isPast, isCurrent };
  };

  const handleSelectDay = (dayNum: number) => {
    setSelectedDay(dayNum);
    onOpenTasksTab();
  };

  return (
    <div className="space-y-6">
      {/* Roadmap Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-2xl p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span>خارطة طريق الـ 90 يوماً الكاملة</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              {goal.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {goal.whyStatement}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="text-[11px] text-slate-400 block">أنت الآن في</span>
              <span className="text-2xl font-black text-amber-400 tabular-nums">
                اليوم {currentDay}
              </span>
              <span className="text-[10px] text-slate-500 block">من أصل 90 يوم</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Monthly Sections */}
      <div className="space-y-6">
        {months.map((month) => {
          // Calculate month progress
          let monthScheduled = 0;
          let monthCompleted = 0;
          month.days.forEach((d) => {
            const st = getDayStatus(d);
            monthScheduled += st.scheduled;
            monthCompleted += st.completed;
          });
          const monthPercent = monthScheduled > 0 ? Math.round((monthCompleted / monthScheduled) * 100) : 0;
          const isCurrentMonth = currentDay >= month.days[0] && currentDay <= month.days[29];
          const isPassedMonth = currentDay > month.days[29];

          return (
            <div
              key={month.id}
              className={`bg-slate-900/60 border rounded-2xl p-5 transition-all ${
                isCurrentMonth
                  ? 'border-amber-500/40 shadow-lg shadow-amber-950/20'
                  : 'border-slate-800'
              }`}
            >
              {/* Month Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border font-black text-base tabular-nums ${month.badgeColor}`}>
                    M{month.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{month.title}</h3>
                      {isCurrentMonth && (
                        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          الشهر الحالي
                        </span>
                      )}
                      {isPassedMonth && (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          مكتمل ✅
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{month.subtitle}</p>
                  </div>
                </div>

                {/* Reward and Month Progress */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-left sm:text-right">
                    <span className="text-slate-400 block text-[11px]">نسبة إنجاز الشهر</span>
                    <span className="font-extrabold text-amber-400 tabular-nums text-sm">
                      {monthPercent}%
                    </span>
                  </div>
                  <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                      style={{ width: `${monthPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Reward Note */}
              {month.reward && (
                <div className="mb-4 px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center gap-2 text-xs text-slate-300">
                  <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>
                    <strong className="text-amber-300">المكافأة المخططة: </strong>
                    {month.reward}
                  </span>
                </div>
              )}

              {/* 30 Days Grid */}
              <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-1.5 sm:gap-2">
                {month.days.map((dayNum) => {
                  const status = getDayStatus(dayNum);
                  const isSelected = selectedDay === dayNum;

                  let cellBg = 'bg-slate-800/40 text-slate-400 border-slate-700/30';
                  if (status.isDone) {
                    cellBg = 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 font-bold';
                  } else if (status.isPartial) {
                    cellBg = 'bg-amber-950/60 border-amber-500/40 text-amber-300';
                  } else if (status.isCurrent) {
                    cellBg = 'bg-orange-950/60 border-orange-500/60 text-orange-300';
                  }

                  return (
                    <button
                      key={dayNum}
                      onClick={() => handleSelectDay(dayNum)}
                      title={`اليوم ${dayNum}: ${status.completed}/${status.scheduled} مهام منجزة`}
                      className={`p-2 rounded-lg border text-xs flex flex-col items-center justify-center transition-all cursor-pointer hover:scale-105 ${cellBg} ${
                        status.isCurrent ? 'ring-2 ring-amber-400' : ''
                      } ${isSelected ? 'ring-2 ring-white shadow-lg' : ''}`}
                    >
                      <span className="text-[10px] opacity-75">يوم</span>
                      <span className="font-extrabold tabular-nums">{dayNum}</span>
                      <div className="mt-0.5">
                        {status.isDone ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ) : status.isCurrent ? (
                          <Flame className="w-3 h-3 text-orange-400 fill-orange-400 animate-pulse" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
