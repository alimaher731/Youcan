import React from 'react';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

interface DaySelectorProps {
  currentDay: number;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  dayCompletionRates: Record<number, number>; // dayNumber -> percentage 0-100
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  currentDay,
  selectedDay,
  setSelectedDay,
  dayCompletionRates,
}) => {
  // Determine Month Phase
  const getMonthPhase = (day: number) => {
    if (day <= 30) {
      return {
        monthName: 'الشهر الأول (الأيام 1 - 30)',
        phaseName: 'مرحلة التأسيس وبناء العادة',
        color: 'text-amber-400',
        badgeBg: 'bg-amber-500/10 border-amber-500/30'
      };
    }
    if (day <= 60) {
      return {
        monthName: 'الشهر الثاني (الأيام 31 - 60)',
        phaseName: 'مرحلة الاستمرارية وبناء الزخم',
        color: 'text-orange-400',
        badgeBg: 'bg-orange-500/10 border-orange-500/30'
      };
    }
    return {
      monthName: 'الشهر الثالث (الأيام 61 - 90)',
      phaseName: 'مرحلة الإتقان والوصول للهدف الكبير',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30'
    };
  };

  const currentPhase = getMonthPhase(selectedDay);

  // Navigation handlers
  const handlePrevDay = () => {
    if (selectedDay > 1) setSelectedDay(selectedDay - 1);
  };

  const handleNextDay = () => {
    if (selectedDay < 90) setSelectedDay(selectedDay + 1);
  };

  const handleJumpToToday = () => {
    setSelectedDay(currentDay);
  };

  // Generate visible window of days around selectedDay
  const windowSize = 9;
  const halfWindow = Math.floor(windowSize / 2);
  let startDay = Math.max(1, selectedDay - halfWindow);
  let endDay = Math.min(90, startDay + windowSize - 1);
  if (endDay - startDay < windowSize - 1) {
    startDay = Math.max(1, endDay - windowSize + 1);
  }

  const daysRange = [];
  for (let d = startDay; d <= endDay; d++) {
    daysRange.push(d);
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 transition-all">
      {/* Top Header: Phase and Jump to Today */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-800 text-amber-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${currentPhase.badgeBg} ${currentPhase.color}`}>
                {currentPhase.monthName}
              </span>
              <span className="text-xs text-slate-400">
                {currentPhase.phaseName}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              مهام اليوم <span className="text-amber-400 tabular-nums">#{selectedDay}</span>
              {selectedDay === currentDay && (
                <span className="mr-2 text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  اليوم الفعلي الحالي
                </span>
              )}
            </h3>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {selectedDay !== currentDay && (
            <button
              onClick={handleJumpToToday}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors cursor-pointer"
            >
              الرجوع لليوم الحالي ({currentDay})
            </button>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevDay}
              disabled={selectedDay <= 1}
              title="اليوم السابق"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextDay}
              disabled={selectedDay >= 90}
              title="اليوم التالي"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days carousel / strip */}
      <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
        {daysRange.map((dayNum) => {
          const isSelected = dayNum === selectedDay;
          const isCurrent = dayNum === currentDay;
          const completionRate = dayCompletionRates[dayNum] || 0;
          const isFull = completionRate === 100;
          const isPast = dayNum < currentDay;

          return (
            <button
              key={dayNum}
              onClick={() => setSelectedDay(dayNum)}
              className={`group flex flex-col items-center justify-between p-2 rounded-xl transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-400'
                  : isCurrent
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/50 hover:bg-slate-750'
                  : 'bg-slate-800/40 text-slate-300 border border-slate-700/40 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {/* Day Number */}
              <div className="text-[11px] font-medium opacity-80">يوم</div>
              <div className={`text-base font-extrabold tabular-nums ${
                isSelected ? 'text-slate-950' : isCurrent ? 'text-amber-400' : 'text-white'
              }`}>
                {dayNum}
              </div>

              {/* Completion badge / dot */}
              <div className="mt-1 flex items-center justify-center">
                {isFull ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
                ) : completionRate > 0 ? (
                  <span className={`text-[10px] font-bold tabular-nums ${isSelected ? 'text-slate-900' : 'text-amber-400'}`}>
                    {completionRate}%
                  </span>
                ) : isPast ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
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
};
