import React, { useState } from 'react';
import { 
  Check, 
  Clock, 
  Bell, 
  Plus, 
  Trash2, 
  Sparkles, 
  Tag, 
  Flame, 
  Award,
  AlertCircle,
  HelpCircle,
  Pencil,
  RotateCcw
} from 'lucide-react';
import { Task, Category, Priority } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface DailyTaskListProps {
  tasks: Task[];
  selectedDay: number;
  currentDay: number;
  onToggleTask: (taskId: string, day: number) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onOpenAddTaskModal: () => void;
  onAddQuickHabit: (title: string, category: Category, priority: Priority, time: string) => void;
  onResetAllData?: () => void;
}

export const CATEGORY_LABELS: Record<Category, { label: string; color: string; border: string }> = {
  health: { label: 'صحة ورشاقة', color: 'text-emerald-400 bg-emerald-500/10', border: 'border-emerald-500/20' },
  learning: { label: 'تعلم وتطوير', color: 'text-cyan-400 bg-cyan-500/10', border: 'border-cyan-500/20' },
  spiritual: { label: 'عبادات وروحانيات', color: 'text-amber-400 bg-amber-500/10', border: 'border-amber-500/20' },
  career: { label: 'عمل ومشاريع', color: 'text-violet-400 bg-violet-500/10', border: 'border-violet-500/20' },
  personal: { label: 'عادات شخصية', color: 'text-pink-400 bg-pink-500/10', border: 'border-pink-500/20' },
};

export const PRIORITY_LABELS: Record<Priority, { label: string; color: string }> = {
  high: { label: 'أولوية قصوى', color: 'text-red-400' },
  medium: { label: 'أولوية متوسطة', color: 'text-amber-400' },
  low: { label: 'أولوية عادية', color: 'text-slate-400' },
};

export const DailyTaskList: React.FC<DailyTaskListProps> = ({
  tasks,
  selectedDay,
  currentDay,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onOpenAddTaskModal,
  onAddQuickHabit,
  onResetAllData,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | Category>('all');

  // Filter tasks that are active for the selectedDay
  const activeTasks = tasks.filter((t) => {
    if (t.isRecurringDaily) return true;
    return t.activeDays && t.activeDays.includes(selectedDay);
  });

  // Filter based on completion status or category
  const filteredTasks = activeTasks.filter((t) => {
    const isCompleted = !!t.completions[selectedDay];
    if (filter === 'all') return true;
    if (filter === 'completed') return isCompleted;
    if (filter === 'pending') return !isCompleted;
    return t.category === filter;
  });

  const completedCount = activeTasks.filter((t) => t.completions[selectedDay]).length;
  const totalCount = activeTasks.length;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  const handleToggle = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    const willBeCompleted = !task?.completions[selectedDay];

    onToggleTask(taskId, selectedDay);

    if (willBeCompleted) {
      sounds.playTaskComplete();
      // Check if this was the last remaining task
      if (completedCount + 1 === totalCount) {
        setTimeout(() => {
          sounds.playAllTasksCompleted();
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.55 },
            colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899']
          });
        }, 200);
      }
    }
  };

  const quickHabits = [
    { title: 'صلاة في وقتها', category: 'spiritual' as Category, priority: 'high' as Priority, time: '05:30' },
    { title: '30 دقيقة رياضة', category: 'health' as Category, priority: 'high' as Priority, time: '07:30' },
    { title: 'قراءة 15 صفحة', category: 'learning' as Category, priority: 'medium' as Priority, time: '21:00' },
    { title: 'كتابة مذكرات اليوم', category: 'personal' as Category, priority: 'low' as Priority, time: '22:00' },
  ];

  return (
    <div className="space-y-4">
      {/* Action Header: Title + Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">جدول مهام اليوم {selectedDay}</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 tabular-nums">
              {completedCount} من {totalCount} منجزة
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            خطواتك اليومية الصغيرة هي الوقود الحقيقي لشعلة نجاحك خلال الـ 90 يوماً.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onResetAllData && (
            <button
              onClick={onResetAllData}
              title="تصفير العداد والبدء من اليوم 1"
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تصفير والبدء من اليوم 1 🔄</span>
            </button>
          )}

          <button
            onClick={onOpenAddTaskModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة مهمة جديدة</span>
          </button>
        </div>
      </div>

      {/* Congratulations Banner if all tasks are finished */}
      {isAllCompleted && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/50 to-teal-950/80 border border-emerald-500/40 p-4 shadow-lg text-emerald-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                <span>أنت تستطيع! أتممت جميع مهام اليوم {selectedDay} بالكامل</span>
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
              </h4>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                حافظت على التزامك وغذيت شعلة الستريك! استمر بهذا الزخم نحو هدفك الكبير.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs (Interactive Segmented Control adhering to anti-slop guidelines) */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-900/60 rounded-xl border border-slate-800 scrollbar-none">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            filter === 'all'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          الكل ({activeTasks.length})
        </button>

        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            filter === 'pending'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          المتبقية ({totalCount - completedCount})
        </button>

        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            filter === 'completed'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          المنجزة ({completedCount})
        </button>

        <span className="text-slate-700 px-1">|</span>

        {(Object.keys(CATEGORY_LABELS) as Category[]).map((catKey) => {
          const count = activeTasks.filter((t) => t.category === catKey).length;
          if (count === 0) return null;
          return (
            <button
              key={catKey}
              onClick={() => setFilter(catKey)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filter === catKey
                  ? `${CATEGORY_LABELS[catKey].color} border ${CATEGORY_LABELS[catKey].border}`
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {CATEGORY_LABELS[catKey].label} ({count})
            </button>
          );
        })}
      </div>

      {/* Task Items List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/30 border border-slate-800/60">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-2.5" />
            <h4 className="text-sm font-bold text-slate-300">لا توجد مهام مطابقة</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              لم تتم إضافة مهام لهذا التصنيف أو أنك أنجزت كل المهام بنجاح!
            </p>
            {activeTasks.length === 0 && (
              <div className="mt-4">
                <button
                  onClick={onOpenAddTaskModal}
                  className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-amber-400"
                >
                  جدولة مهمة جديدة لليوم {selectedDay}
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = !!task.completions[selectedDay];
            const cat = CATEGORY_LABELS[task.category] || CATEGORY_LABELS.personal;
            const prio = PRIORITY_LABELS[task.priority] || PRIORITY_LABELS.medium;

            return (
              <div
                key={task.id}
                className={`group relative rounded-xl transition-all duration-200 border p-3.5 sm:p-4 ${
                  isCompleted
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                    : 'bg-slate-900/80 border-slate-700/60 hover:border-slate-600 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Custom Checkbox Button */}
                  <button
                    onClick={() => handleToggle(task.id)}
                    aria-label={`تحديد المهمة كمنجزة: ${task.title}`}
                    className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-500/40 shadow-sm'
                        : 'border-2 border-slate-600 hover:border-amber-400 text-transparent hover:bg-slate-800'
                    }`}
                  >
                    <Check className={`w-4 h-4 stroke-[3] ${isCompleted ? 'text-slate-950' : 'opacity-0'}`} />
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${cat.color} ${cat.border}`}>
                        {cat.label}
                      </span>

                      {task.priority === 'high' && (
                        <span className="text-[11px] font-semibold text-red-400 flex items-center gap-0.5">
                          <Flame className="w-3 h-3 fill-red-400" />
                          {prio.label}
                        </span>
                      )}

                      {task.isRecurringDaily && (
                        <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                          مهمة يومية طوال الـ 90 يوم
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm md:text-base font-semibold transition-all ${
                        isCompleted
                          ? 'line-through text-slate-400 decoration-slate-500'
                          : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {task.notes}
                      </p>
                    )}

                    {/* Metadata line: Time & Reminder */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      {task.scheduledTime && (
                        <span className="flex items-center gap-1 tabular-nums">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>الوقت: {task.scheduledTime}</span>
                        </span>
                      )}

                      {task.hasReminder && (
                        <span className="flex items-center gap-1 text-amber-400/90 tabular-nums">
                          <Bell className="w-3.5 h-3.5" />
                          <span>تذكير: {task.reminderTime || task.scheduledTime}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons (Edit & Delete) */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => onEditTask(task)}
                      title="تعديل المهمة"
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 border border-slate-700/60 transition-colors cursor-pointer active:scale-95"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      title="حذف المهمة"
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/60 transition-colors cursor-pointer active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Add Habit Presets Bar */}
      <div className="pt-2">
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>إضافة سريعة لعادات الـ 90 يوم الشائعة:</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickHabits.map((habit, idx) => (
              <button
                key={idx}
                onClick={() => onAddQuickHabit(habit.title, habit.category, habit.priority, habit.time)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>{habit.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
