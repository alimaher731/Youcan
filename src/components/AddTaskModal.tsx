import React, { useState } from 'react';
import { X, Plus, Clock, Bell, Tag, Flame, Calendar } from 'lucide-react';
import { Category, Priority, Task } from '../types';
import { CATEGORY_LABELS, PRIORITY_LABELS } from './DailyTaskList';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (newTask: Omit<Task, 'id' | 'createdAt' | 'completions'>) => void;
  selectedDay: number;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  selectedDay,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('health');
  const [priority, setPriority] = useState<Priority>('medium');
  const [scheduledTime, setScheduledTime] = useState('08:00');
  const [hasReminder, setHasReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('07:50');
  const [notes, setNotes] = useState('');
  const [scheduleScope, setScheduleScope] = useState<'all' | 'month1' | 'month2' | 'month3' | 'today'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let isRecurringDaily = false;
    let activeDays: number[] = [];

    if (scheduleScope === 'all') {
      isRecurringDaily = true;
      activeDays = Array.from({ length: 90 }, (_, i) => i + 1);
    } else if (scheduleScope === 'month1') {
      activeDays = Array.from({ length: 30 }, (_, i) => i + 1);
    } else if (scheduleScope === 'month2') {
      activeDays = Array.from({ length: 30 }, (_, i) => i + 31);
    } else if (scheduleScope === 'month3') {
      activeDays = Array.from({ length: 30 }, (_, i) => i + 61);
    } else {
      activeDays = [selectedDay];
    }

    onAddTask({
      title: title.trim(),
      category,
      priority,
      scheduledTime,
      hasReminder,
      reminderTime: hasReminder ? (reminderTime || scheduledTime) : undefined,
      notes: notes.trim(),
      isRecurringDaily,
      activeDays,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0e1422] border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-right overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">إضافة مهمة جديدة للتحدي</h3>
              <p className="text-xs text-slate-400">حدد تفاصيل المهمة وموعد التذكير وجدولتها في الـ 90 يوماً</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              عنوان المهمة / العادة: *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: قراءة 20 صفحة، تمرين رياضي، مراجعة الكود..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-800/70 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                التصنيف:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400"
              >
                {(Object.keys(CATEGORY_LABELS) as Category[]).map((catKey) => (
                  <option key={catKey} value={catKey}>
                    {CATEGORY_LABELS[catKey].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                الأولوية:
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="high">أولوية قصوى 🔥</option>
                <option value="medium">أولوية متوسطة ⚡</option>
                <option value="low">أولوية عادية 🌱</option>
              </select>
            </div>
          </div>

          {/* Schedule Scope (How to distribute across the 90 days) */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              نطاق الجدولة في رحلة الـ 90 يوماً:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setScheduleScope('all')}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  scheduleScope === 'all'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                يومي (كامل الـ 90 يوم)
              </button>

              <button
                type="button"
                onClick={() => setScheduleScope('month1')}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  scheduleScope === 'month1'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                الشهر 1 (1 - 30)
              </button>

              <button
                type="button"
                onClick={() => setScheduleScope('month2')}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  scheduleScope === 'month2'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                الشهر 2 (31 - 60)
              </button>

              <button
                type="button"
                onClick={() => setScheduleScope('month3')}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  scheduleScope === 'month3'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                الشهر 3 (61 - 90)
              </button>

              <button
                type="button"
                onClick={() => setScheduleScope('today')}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer col-span-2 sm:col-span-2 ${
                  scheduleScope === 'today'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                خاصة باليوم #{selectedDay} فقط
              </button>
            </div>
          </div>

          {/* Time & Reminder Section */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>وقت التنفيذ والتذكير:</span>
              </span>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-amber-400 font-semibold">
                <input
                  type="checkbox"
                  checked={hasReminder}
                  onChange={(e) => setHasReminder(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span>تفعيل التذكير 🔔</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  موعد المهمة:
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 tabular-nums focus:outline-none focus:border-amber-400"
                />
              </div>

              {hasReminder && (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    وقت التنبيه:
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-slate-800 border border-slate-700 text-amber-300 tabular-nums focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">
              ملاحظات أو خطوات الإنجاز (اختياري):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: شرب كوب ماء قبل التمرين، كتابة ملخص..."
              className="w-full text-xs p-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              جدولة المهمة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
