import React, { useState } from 'react';
import { X, Bell, Volume2, CheckCircle2, Clock, Sparkles, AlertCircle, Check } from 'lucide-react';
import { Task } from '../types';
import { hasNotificationPermission, requestNotificationPermission, sendLocalNotification } from '../utils/notification';
import { sounds } from '../utils/audio';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  selectedDay: number;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  tasks,
  selectedDay,
}) => {
  if (!isOpen) return null;

  const [permissionGranted, setPermissionGranted] = useState(hasNotificationPermission());
  const [testSent, setTestSent] = useState(false);

  // Active tasks with reminders for this day
  const reminderTasks = tasks.filter((t) => {
    const isActive = t.isRecurringDaily || (t.activeDays && t.activeDays.includes(selectedDay));
    return isActive && t.hasReminder;
  }).sort((a, b) => {
    const timeA = a.reminderTime || a.scheduledTime || '00:00';
    const timeB = b.reminderTime || b.scheduledTime || '00:00';
    return timeA.localeCompare(timeB);
  });

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionGranted(granted);
    if (granted) {
      sendLocalNotification('أنت تستطيع! تم تفعيل التنبيهات بنجاح 🔔', {
        body: 'سنذكرك بمواعيد مهامك اليومية لتحافظ على شعلة الستريك متقدة دائماً.'
      });
    }
  };

  const handleTestAlert = () => {
    sendLocalNotification('تنبيه تجريبي: موعد مهمتك اليومية! 🚀', {
      body: 'حان الآن موعد إنجاز إحدى مهام رحلة الـ 90 يوماً. أنت تستطيع!'
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0e1422] border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-right overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">نظام التذكير والتنبيهات الذكية</h3>
              <p className="text-xs text-slate-400">حافظ على موعد كل مهمة ولا تدع شعلة الستريك تنطفئ</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 pt-4">
          {/* Permission Status Box */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>إشعارات المتصفح والنظام:</span>
                {permissionGranted ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>مفعلة</span>
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold">غير مفعلة</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                تتيح لك استقبال تنبيهات المهام حتى عندما تكون في علامة تبويب أخرى.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!permissionGranted ? (
                <button
                  onClick={handleRequestPermission}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  السماح بالإشعارات
                </button>
              ) : (
                <button
                  onClick={handleTestAlert}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{testSent ? 'تم الإرسال!' : 'تجربة التنبيه'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Today's Scheduled Reminders */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 mb-2 flex items-center justify-between">
              <span>تذكيرات اليوم #{selectedDay}:</span>
              <span className="text-amber-400 tabular-nums">
                {reminderTasks.length} تذكيرات مجدولة
              </span>
            </h4>

            {reminderTasks.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
                لا توجد مهام تحتوي على تذكير لليوم {selectedDay}. يمكنك تفعيل التذكير عند إضافة أو تعديل أي مهمة.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {reminderTasks.map((task) => {
                  const isDone = !!task.completions[selectedDay];
                  const time = task.reminderTime || task.scheduledTime || '--:--';

                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                        isDone
                          ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                          : 'bg-slate-900/90 border-slate-700/80 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className={`font-semibold block ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                            {task.title}
                          </span>
                          <span className="text-[10px] text-slate-400 tabular-nums">
                            وقت التنبيه: {time}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            أنجزت ✅
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              sendLocalNotification(`تذكير: ${task.title}`, {
                                body: task.notes || 'حان موعد إنجاز هذه المهمة الآن!'
                              });
                            }}
                            title="رنين الآن"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
