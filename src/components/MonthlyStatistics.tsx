import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Calendar, 
  Printer, 
  Star, 
  Award,
  Sparkles,
  PieChart,
  HelpCircle,
  Clock,
  Save
} from 'lucide-react';
import { Task, MonthReflections, Category } from '../types';
import { CATEGORY_LABELS } from './DailyTaskList';

interface MonthlyStatisticsProps {
  tasks: Task[];
  currentDay: number;
  reflections: MonthReflections;
  onUpdateReflection: (monthKey: 'month1' | 'month2' | 'month3', field: string, value: any) => void;
  goalTitle: string;
}

export const MonthlyStatistics: React.FC<MonthlyStatisticsProps> = ({
  tasks,
  currentDay,
  reflections,
  onUpdateReflection,
  goalTitle,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<1 | 2 | 3 | 'all'>(
    currentDay <= 30 ? 1 : currentDay <= 60 ? 2 : 3
  );

  // Month ranges:
  // Month 1: 1 - 30
  // Month 2: 31 - 60
  // Month 3: 61 - 90
  const getDaysForMonth = (m: 1 | 2 | 3 | 'all'): number[] => {
    if (m === 1) return Array.from({ length: 30 }, (_, i) => i + 1);
    if (m === 2) return Array.from({ length: 30 }, (_, i) => i + 31);
    if (m === 3) return Array.from({ length: 30 }, (_, i) => i + 61);
    return Array.from({ length: 90 }, (_, i) => i + 1);
  };

  const activeDays = getDaysForMonth(selectedMonth);

  // Calculate detailed stats
  let totalScheduled = 0;
  let totalCompleted = 0;
  const dayStats: Record<number, { scheduled: number; completed: number; rate: number }> = {};
  const categoryStats: Record<Category, { scheduled: number; completed: number }> = {
    health: { scheduled: 0, completed: 0 },
    learning: { scheduled: 0, completed: 0 },
    spiritual: { scheduled: 0, completed: 0 },
    career: { scheduled: 0, completed: 0 },
    personal: { scheduled: 0, completed: 0 },
  };

  activeDays.forEach((dayNum) => {
    let dayScheduled = 0;
    let dayCompleted = 0;

    tasks.forEach((task) => {
      const isActive = task.isRecurringDaily || (task.activeDays && task.activeDays.includes(dayNum));
      if (isActive) {
        dayScheduled++;
        totalScheduled++;
        categoryStats[task.category].scheduled++;

        if (task.completions[dayNum]) {
          dayCompleted++;
          totalCompleted++;
          categoryStats[task.category].completed++;
        }
      }
    });

    const rate = dayScheduled > 0 ? Math.round((dayCompleted / dayScheduled) * 100) : 0;
    dayStats[dayNum] = { scheduled: dayScheduled, completed: dayCompleted, rate };
  });

  const totalUncompleted = Math.max(0, totalScheduled - totalCompleted);
  const completionRate = totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;

  // Grade calculation
  const getPerformanceGrade = (rate: number) => {
    if (rate >= 90) return { grade: 'ممتاز A+', desc: 'أداء أسطوري وانضباط استثنائي!', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (rate >= 80) return { grade: 'جيد جداً A', desc: 'مستوى رائع جداً، استمرارية قوية!', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' };
    if (rate >= 70) return { grade: 'جيد B', desc: 'تقدم ملحوظ، لكنك قادر على بذل المزيد!', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    if (rate >= 50) return { grade: 'مقبول C', desc: 'بحاجة إلى تركيز إضافي وتنظيم الأولويات.', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' };
    return { grade: 'بحاجة لانطلاقة جديدة D', desc: 'لا تستسلم، الهدف ينتظرك وإمكاناتك أكبر!', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
  };

  const performance = getPerformanceGrade(completionRate);

  const monthTitles = {
    1: 'الشهر الأول: مرحلة التأسيس وبناء العادة (الأيام 1 - 30)',
    2: 'الشهر الثاني: مرحلة الاستمرارية وصناعة الزخم (الأيام 31 - 60)',
    3: 'الشهر الثالث: مرحلة الإتقان وتحقيق الهدف (الأيام 61 - 90)',
    all: 'إحصائية الـ 90 يوماً الكاملة'
  };

  const currentReflectionKey = selectedMonth === 1 ? 'month1' : selectedMonth === 2 ? 'month2' : 'month3';
  const reflection = selectedMonth !== 'all' ? reflections[currentReflectionKey] : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Month Selector & Print Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 no-print">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>الإحصائيات الشهرية للنتائج والمهام</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            تحليل دقيق للأداء ونسب الإنجاز لكل شهر من رحلة الـ 90 يوماً.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>طباعة / تصدير التقرير</span>
          </button>
        </div>
      </div>

      {/* Month Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-slate-900/60 rounded-xl border border-slate-800 scrollbar-none no-print">
        <button
          onClick={() => setSelectedMonth(1)}
          className={`flex-1 min-w-[130px] px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
            selectedMonth === 1
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          الشهر الأول (1 - 30)
        </button>

        <button
          onClick={() => setSelectedMonth(2)}
          className={`flex-1 min-w-[130px] px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
            selectedMonth === 2
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          الشهر الثاني (31 - 60)
        </button>

        <button
          onClick={() => setSelectedMonth(3)}
          className={`flex-1 min-w-[130px] px-3.5 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
            selectedMonth === 3
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          الشهر الثالث (61 - 90)
        </button>

        <button
          onClick={() => setSelectedMonth('all')}
          className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer text-center whitespace-nowrap ${
            selectedMonth === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          كامل الـ 90 يوم
        </button>
      </div>

      {/* Header Banner for Selected Report */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-amber-400">تقرير الأداء الإحصائي</span>
            <h3 className="text-xl font-black text-white mt-1">
              {monthTitles[selectedMonth]}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              الهدف الأساسي للتحدي: <strong className="text-slate-200">{goalTitle}</strong>
            </p>
          </div>

          {/* Performance Grade Badge */}
          <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${performance.bg}`}>
            <div className="p-2 rounded-lg bg-slate-900/80">
              <Award className={`w-7 h-7 ${performance.color}`} />
            </div>
            <div>
              <div className="text-xs text-slate-400">تقييم هذا الشهر</div>
              <div className={`text-xl font-extrabold ${performance.color}`}>
                {performance.grade}
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                {performance.desc}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metric Numbers Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Total Scheduled */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>إجمالي المهام المجدولة</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
            {totalScheduled}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            خلال {activeDays.length} يوماً
          </p>
        </div>

        {/* Completed Tasks */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="text-emerald-400 font-semibold">المهام المنجزة ✅</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
            {totalCompleted}
          </div>
          <p className="text-[11px] text-emerald-400/80 mt-1 tabular-nums">
            {completionRate}% من الإجمالي
          </p>
        </div>

        {/* Uncompleted / Missed Tasks */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="text-rose-400 font-semibold">المهام غير المنجزة ❌</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 tabular-nums">
            {totalUncompleted}
          </div>
          <p className="text-[11px] text-rose-400/80 mt-1 tabular-nums">
            {totalScheduled > 0 ? 100 - completionRate : 0}% متبقية أو فائتة
          </p>
        </div>

        {/* Overall Completion Rate */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="text-amber-400 font-semibold">معدل الإنجاز العام</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums">
            {completionRate}%
          </div>
          {/* Visual Mini Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Daily Heatmap / Grid + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Daily Matrix of the Month */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>سجل إنجاز الأيام (خريطة الشهر)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                نسبة إنجاز كل يوم على حدة بالأرقام
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span>100% كامل</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                <span>جزئي</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-slate-800" />
                <span>0% أو قادم</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
            {activeDays.map((dayNum) => {
              const stat = dayStats[dayNum] || { scheduled: 0, completed: 0, rate: 0 };
              const isPastOrToday = dayNum <= currentDay;
              const isToday = dayNum === currentDay;

              let bgColor = 'bg-slate-800/40 border-slate-700/40 text-slate-400';
              if (isPastOrToday && stat.scheduled > 0) {
                if (stat.rate === 100) {
                  bgColor = 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300';
                } else if (stat.rate >= 50) {
                  bgColor = 'bg-amber-950/60 border-amber-500/40 text-amber-300';
                } else if (stat.rate > 0) {
                  bgColor = 'bg-orange-950/60 border-orange-500/30 text-orange-300';
                } else {
                  bgColor = 'bg-red-950/40 border-red-500/30 text-red-400';
                }
              }

              return (
                <div
                  key={dayNum}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${bgColor} ${
                    isToday ? 'ring-2 ring-amber-400 shadow-md' : ''
                  }`}
                  title={`اليوم ${dayNum}: ${stat.completed} من ${stat.scheduled} منجزة (${stat.rate}%)`}
                >
                  <span className="text-[10px] font-medium opacity-80">يوم {dayNum}</span>
                  <span className="text-sm font-bold my-0.5 tabular-nums">
                    {stat.scheduled > 0 ? `${stat.rate}%` : '-'}
                  </span>
                  <span className="text-[9px] opacity-75 tabular-nums">
                    {stat.completed}/{stat.scheduled}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (1 col): Category Distribution */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <PieChart className="w-4 h-4 text-cyan-400" />
              <span>إنجاز المجالات والتصنيفات</span>
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              مقارنة الالتزام بالمهام حسب تصنيف الحياة
            </p>

            <div className="space-y-3.5">
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((catKey) => {
                const cStat = categoryStats[catKey];
                const catMeta = CATEGORY_LABELS[catKey];
                const catRate = cStat.scheduled > 0 ? Math.round((cStat.completed / cStat.scheduled) * 100) : 0;

                return (
                  <div key={catKey} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">{catMeta.label}</span>
                      <span className="text-slate-400 tabular-nums">
                        {cStat.completed} / {cStat.scheduled} (<strong className="text-white">{catRate}%</strong>)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${catRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-400">
            <span className="font-semibold text-amber-400">نصيحة إحصائية: </span>
            التوازن بين العبادات والصحة والتعلم هو سر النجاح في ختام الـ 90 يوماً.
          </div>
        </div>
      </div>

      {/* Monthly Reflection & Journal (سجل المراجعة الذاتية للشهر) */}
      {selectedMonth !== 'all' && reflection && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>سجل المراجعة والتقييم الذاتي للشهر {selectedMonth}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                دوّن تأملاتك ودروسك المستفادة لتنطلق للشهر التالي بقوة أكبر.
              </p>
            </div>

            {/* Satisfaction Rating Stars */}
            <div className="flex items-center gap-1.5 bg-slate-800/70 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-300 ml-2">مدى الرضا:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onUpdateReflection(currentReflectionKey, 'rating', star)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= (reflection.rating || 0)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ما أنا فخور بإنجازه هذا الشهر:
              </label>
              <textarea
                value={reflection.proudOf}
                onChange={(e) => onUpdateReflection(currentReflectionKey, 'proudOf', e.target.value)}
                placeholder="مثال: الالتزام اليومي بالرياضة وقراءة كتابين كاملين..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                نقاط تحتاج إلى تحسين للشهر القادم:
              </label>
              <textarea
                value={reflection.toBeImproved}
                onChange={(e) => onUpdateReflection(currentReflectionKey, 'toBeImproved', e.target.value)}
                placeholder="مثال: تقليل وقت تصفح الهاتف قبل النوم، زيادة شرب الماء..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ملاحظات عامة وخطة الشهر القادم:
              </label>
              <textarea
                value={reflection.notes}
                onChange={(e) => onUpdateReflection(currentReflectionKey, 'notes', e.target.value)}
                placeholder="اكتب أي مشاعر، قرارات أو مكافآت حققتها لنفسك..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
