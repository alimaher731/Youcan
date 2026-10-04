import React, { useState, useEffect } from 'react';
import { X, Save, Clock, Bell, Tag, Flame, Calendar, Trash2 } from 'lucide-react';
import { Category, Priority, Task } from '../types';
import { CATEGORY_LABELS, PRIORITY_LABELS } from './DailyTaskList';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSaveTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSaveTask,
  onDeleteTask,
}) => {
  if (!isOpen || !task) return null;

  const [title, setTitle] = useState(task.title);
  const [category, setCategory] = useState<Category>(task.category);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [scheduledTime, setScheduledTime] = useState(task.scheduledTime || '08:00');
  const [hasReminder, setHasReminder] = useState(task.hasReminder);
  const [reminderTime, setReminderTime] = useState(task.reminderTime || task.scheduledTime || '07:50');
  const [notes, setNotes] = useState(task.notes || '');
  const [isRecurringDaily, setIsRecurringDaily] = useState(task.isRecurringDaily);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setCategory(task.category);
      setPriority(task.priority);
      setScheduledTime(task.scheduledTime || '08:00');
      setHasReminder(task.hasReminder);
      setReminderTime(task.reminderTime || task.scheduledTime || '07:50');
      setNotes(task.notes || '');
      setIsRecurringDaily(task.isRecurringDaily);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      ...task,
      title: title.trim(),
      category,
      priority,
      scheduledTime,
      hasReminder,
      reminderTime: hasReminder ? (reminderTime || scheduledTime) : undefined,
      notes: notes.trim(),
      isRecurringDaily,
    });
    onClose();
  };

  const handleDelete = () => {
    onDeleteTask(task.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-auto text-right text-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-white">تعديل المهمة ✏️</h2>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              📝
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-200 mb-1.5">
              عنوان المهمة أو العادة:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: قراءة 20 صفحة، رياضة 30 دقيقة..."
              className="w-full text-sm p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Category selection */}
          <div>
            <label className="block font-bold text-slate-200 mb-1.5">
              التصنيف:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((catKey) => {
                const isSelected = category === catKey;
                const catMeta = CATEGORY_LABELS[catKey];
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                      isSelected
                        ? `${catMeta.color} ${catMeta.border} ring-2 ring-amber-400 font-bold`
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{catMeta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block font-bold text-slate-200 mb-1.5">
              الأولوية:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['high', 'medium', 'low'] as Priority[]).map((pKey) => {
                const isSelected = priority === pKey;
                const pMeta = PRIORITY_LABELS[pKey];
                return (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => setPriority(pKey)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-black'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{pMeta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time & Reminder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>وقت التنفيذ:</span>
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>تنبيه الهاتف:</span>
              </label>
              <input
                type="time"
                disabled={!hasReminder}
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className={`w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400 ${
                  !hasReminder ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={hasReminder}
              onChange={(e) => setHasReminder(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-600"
            />
            <span className="text-slate-300 font-semibold">تفعيل إشعار التذكير اليومي</span>
          </label>

          {/* Daily Recurring scope */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isRecurringDaily}
              onChange={(e) => setIsRecurringDaily(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-600"
            />
            <span className="text-slate-300 font-semibold">تكرار هذه المهمة يومياً طوال الـ 90 يوماً</span>
          </label>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-200 mb-1.5">
              ملاحظات أو نصائح إضافية:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: جهز كتابك بجانب السرير قبل النوم..."
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none text-xs"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-bold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف المهمة</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black shadow-md transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>حفظ التعديلات</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
