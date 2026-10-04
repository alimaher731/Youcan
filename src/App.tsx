/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  INITIAL_GOAL, 
  INITIAL_TASKS, 
  INITIAL_STREAK, 
  INITIAL_REFLECTIONS 
} from './utils/initialData';
import { Goal90, Task, StreakInfo, MonthReflections, Category, Priority } from './types';
import { Header } from './components/Header';
import { FlameStreakCard } from './components/FlameStreakCard';
import { CompanionWidget } from './components/CompanionWidget';
import { DaySelector } from './components/DaySelector';
import { DailyTaskList } from './components/DailyTaskList';
import { MonthlyStatistics } from './components/MonthlyStatistics';
import { Roadmap90 } from './components/Roadmap90';
import { GoalSettings } from './components/GoalSettings';
import { MotivationalQuoteBanner } from './components/MotivationalQuoteBanner';
import { AddTaskModal } from './components/AddTaskModal';
import { EditTaskModal } from './components/EditTaskModal';
import { StreakModal } from './components/StreakModal';
import { ReminderModal } from './components/ReminderModal';
import { InstallModal } from './components/InstallModal';
import { MiniWidgetView } from './components/MiniWidgetView';
import { PublishGuideModal } from './components/PublishGuideModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { Rocket } from 'lucide-react';
import { sounds } from './utils/audio';
import { sendLocalNotification } from './utils/notification';

export default function App() {
  // Persistence in LocalStorage
  const [goal, setGoal] = useState<Goal90>(() => {
    try {
      const saved = localStorage.getItem('youcan_90_goal');
      return saved ? JSON.parse(saved) : INITIAL_GOAL;
    } catch {
      return INITIAL_GOAL;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('youcan_90_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [streak, setStreak] = useState<StreakInfo>(() => {
    try {
      const saved = localStorage.getItem('youcan_90_streak');
      return saved ? JSON.parse(saved) : INITIAL_STREAK;
    } catch {
      return INITIAL_STREAK;
    }
  });

  const [reflections, setReflections] = useState<MonthReflections>(() => {
    try {
      const saved = localStorage.getItem('youcan_90_reflections');
      return saved ? JSON.parse(saved) : INITIAL_REFLECTIONS;
    } catch {
      return INITIAL_REFLECTIONS;
    }
  });

  const [selectedDay, setSelectedDay] = useState<number>(goal.currentDay);
  const [activeTab, setActiveTab] = useState<'tasks' | 'stats' | 'roadmap' | 'goal'>('tasks');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isMiniWidgetMode, setIsMiniWidgetMode] = useState(false);
  const [isPublishGuideOpen, setIsPublishGuideOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [lastNotifiedMinutes, setLastNotifiedMinutes] = useState<string>('');

  // Save to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('youcan_90_goal', JSON.stringify(goal));
  }, [goal]);

  useEffect(() => {
    localStorage.setItem('youcan_90_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('youcan_90_streak', JSON.stringify(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('youcan_90_reflections', JSON.stringify(reflections));
  }, [reflections]);

  // Background Reminder Checker (checks every 30 seconds for task reminders)
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMins}`;

      if (currentTimeStr === lastNotifiedMinutes) return;

      const activeTodayTasks = tasks.filter((t) => {
        const isActive = t.isRecurringDaily || (t.activeDays && t.activeDays.includes(goal.currentDay));
        const isNotDone = !t.completions[goal.currentDay];
        return isActive && isNotDone && t.hasReminder;
      });

      activeTodayTasks.forEach((task) => {
        const reminderTime = task.reminderTime || task.scheduledTime;
        if (reminderTime === currentTimeStr) {
          sendLocalNotification(`تذكير بمهمتك: ${task.title} 🔔`, {
            body: task.notes || `حان الآن موعد إنجاز المهمة لليوم ${goal.currentDay}. أنت تستطيع!`,
          });
          setLastNotifiedMinutes(currentTimeStr);
        }
      });
    };

    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [tasks, goal.currentDay, lastNotifiedMinutes]);

  // Calculate day completion percentages for all 90 days
  const dayCompletionRates: Record<number, number> = {};
  for (let d = 1; d <= 90; d++) {
    let dayScheduled = 0;
    let dayCompleted = 0;
    tasks.forEach((t) => {
      const active = t.isRecurringDaily || (t.activeDays && t.activeDays.includes(d));
      if (active) {
        dayScheduled++;
        if (t.completions[d]) dayCompleted++;
      }
    });
    dayCompletionRates[d] = dayScheduled > 0 ? Math.round((dayCompleted / dayScheduled) * 100) : 0;
  }

  // Today's task counts
  const todayTasks = tasks.filter((t) => {
    return t.isRecurringDaily || (t.activeDays && t.activeDays.includes(goal.currentDay));
  });
  const todayCompletedCount = todayTasks.filter((t) => t.completions[goal.currentDay]).length;

  // Toggle task completion
  const handleToggleTask = (taskId: string, day: number) => {
    setTasks((prev) => {
      return prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentVal = !!t.completions[day];
        return {
          ...t,
          completions: {
            ...t.completions,
            [day]: !currentVal,
          },
        };
      });
    });

    // Check if toggling increases streak
    setTimeout(() => {
      setStreak((prevStreak) => {
        const todayRate = dayCompletionRates[goal.currentDay] || 0;
        if (todayRate >= 50 && prevStreak.currentStreak < goal.currentDay) {
          const nextStreak = Math.min(goal.currentDay, prevStreak.currentStreak + 1);
          return {
            ...prevStreak,
            currentStreak: nextStreak,
            longestStreak: Math.max(prevStreak.longestStreak, nextStreak),
          };
        }
        return prevStreak;
      });
    }, 100);
  };

  // Add Task
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'completions'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      completions: {},
    };
    setTasks((prev) => [newTask, ...prev]);
    sounds.playTaskComplete();
  };

  // Quick Add Habit
  const handleAddQuickHabit = (title: string, category: Category, priority: Priority, time: string) => {
    const newTask: Task = {
      id: `task-quick-${Date.now()}`,
      title,
      category,
      priority,
      scheduledTime: time,
      hasReminder: true,
      reminderTime: time,
      isRecurringDaily: true,
      activeDays: Array.from({ length: 90 }, (_, i) => i + 1),
      completions: {},
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    sounds.playTaskComplete();
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Save Edited Task
  const handleSaveEditedTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    sounds.playTaskComplete();
  };

  // Use Freeze Token
  const handleUseFreezeToken = () => {
    if (streak.freezeTokens <= 0 || streak.frozenDays.includes(selectedDay)) return;
    setStreak((prev) => ({
      ...prev,
      freezeTokens: prev.freezeTokens - 1,
      frozenDays: [...prev.frozenDays, selectedDay],
    }));
    sounds.playStreakIgnite();
  };

  // Update Goal
  const handleUpdateGoal = (updated: Partial<Goal90>) => {
    setGoal((prev) => {
      const next = { ...prev, ...updated };
      if (updated.currentDay && updated.currentDay !== prev.currentDay) {
        setSelectedDay(updated.currentDay);
      }
      return next;
    });
  };

  // Update Monthly Reflection
  const handleUpdateReflection = (monthKey: 'month1' | 'month2' | 'month3', field: string, value: any) => {
    setReflections((prev) => ({
      ...prev,
      [monthKey]: {
        ...prev[monthKey],
        [field]: value,
      },
    }));
  };

  // Reset data to Day 1 fresh
  const executeResetAllData = () => {
    const freshGoal: Goal90 = {
      ...goal,
      currentDay: 1,
      startDate: new Date().toISOString().split('T')[0],
    };
    const freshStreak: StreakInfo = {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: '',
      freezeTokens: 3,
      frozenDays: [],
    };
    const clearedTasks: Task[] = tasks.map((t) => ({
      ...t,
      completions: {},
    }));

    setGoal(freshGoal);
    setSelectedDay(1);
    setStreak(freshStreak);
    setTasks(clearedTasks);

    localStorage.setItem('youcan_90_goal', JSON.stringify(freshGoal));
    localStorage.setItem('youcan_90_streak', JSON.stringify(freshStreak));
    localStorage.setItem('youcan_90_tasks', JSON.stringify(clearedTasks));

    sounds.playStreakIgnite();
  };

  const handleResetAllData = () => {
    setIsResetModalOpen(true);
  };

  // Export JSON
  const handleExportData = () => {
    const backup = {
      goal,
      tasks,
      streak,
      reflections,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `you-can-90days-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportData = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.goal && data.tasks && data.streak) {
        setGoal(data.goal);
        setTasks(data.tasks);
        setStreak(data.streak);
        if (data.reflections) setReflections(data.reflections);
        setSelectedDay(data.goal.currentDay || 1);
        alert('تم استيراد بيانات التحدي بنجاح!');
      } else {
        alert('الملف غير متطابق مع صيغة التحدي.');
      }
    } catch {
      alert('حدث خطأ أثناء قراءة ملف النسخ الاحتياطي.');
    }
  };

  const hasUnreadReminders = tasks.some((t) => {
    const isActive = t.isRecurringDaily || (t.activeDays && t.activeDays.includes(goal.currentDay));
    return isActive && t.hasReminder && !t.completions[goal.currentDay];
  });

  // If user opened Mini Widget Screen Mode
  if (isMiniWidgetMode) {
    return (
      <>
        <MiniWidgetView
          currentStreak={streak.currentStreak}
          selectedDay={selectedDay}
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onExit={() => setIsMiniWidgetMode(false)}
          onResetAllData={() => setIsResetModalOpen(true)}
        />
        <ResetConfirmModal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          onConfirm={executeResetAllData}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar Navigation */}
      <Header
        currentDay={goal.currentDay}
        currentStreak={streak.currentStreak}
        totalTasksToday={todayTasks.length}
        completedTasksToday={todayCompletedCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenStreakModal={() => setIsStreakModalOpen(true)}
        onOpenReminderModal={() => setIsReminderModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onToggleMiniWidgetMode={() => setIsMiniWidgetMode(true)}
        hasUnreadReminders={hasUnreadReminders}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Prominent Widget Launcher banner */}
        <div className="no-print bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-500/50 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3 w-full sm:w-auto text-right">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md flex-shrink-0 animate-pulse">
              📱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-sm">وضع الويدجت التفاعلي (Widget Mode)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">شاشة كاملة</span>
              </div>
              <p className="text-xs text-amber-200/90 mt-0.5">
                اضغط هنا لعرض التطبيق على شكل بطاقة الويدجت وشخصية التحدي مباشرة!
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMiniWidgetMode(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 cursor-pointer active:scale-95 transition-all whitespace-nowrap"
          >
            <span>فتح شاشة الويدجت الآن 👈</span>
          </button>
        </div>

        {/* Motivational Banner */}
        <div className="no-print">
          <MotivationalQuoteBanner dayNumber={selectedDay} />
        </div>

        {/* Interactive Companion Character Widget (matching user screenshot) */}
        <div className="no-print">
          <CompanionWidget
            currentStreak={streak.currentStreak}
            selectedDay={selectedDay}
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onOpenTasksTab={() => setActiveTab('tasks')}
            onToggleMiniWidgetMode={() => setIsMiniWidgetMode(true)}
          />
        </div>

        {/* Dynamic Flame Streak Card */}
        <div className="no-print">
          <FlameStreakCard
            streak={streak}
            onUseFreezeToken={handleUseFreezeToken}
            selectedDay={selectedDay}
          />
        </div>

        {/* 90-Day Navigation & Phase Selector (Visible on Tasks and Roadmap tabs) */}
        {activeTab === 'tasks' && (
          <DaySelector
            currentDay={goal.currentDay}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            dayCompletionRates={dayCompletionRates}
          />
        )}

        {/* Active Tab View */}
        {activeTab === 'tasks' && (
          <DailyTaskList
            tasks={tasks}
            selectedDay={selectedDay}
            currentDay={goal.currentDay}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={(task) => setEditingTask(task)}
            onOpenAddTaskModal={() => setIsAddTaskModalOpen(true)}
            onAddQuickHabit={handleAddQuickHabit}
            onResetAllData={handleResetAllData}
          />
        )}

        {activeTab === 'stats' && (
          <MonthlyStatistics
            tasks={tasks}
            currentDay={goal.currentDay}
            reflections={reflections}
            onUpdateReflection={handleUpdateReflection}
            goalTitle={goal.title}
          />
        )}

        {activeTab === 'roadmap' && (
          <Roadmap90
            currentDay={goal.currentDay}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            tasks={tasks}
            goal={goal}
            onOpenTasksTab={() => setActiveTab('tasks')}
          />
        )}

        {activeTab === 'goal' && (
          <GoalSettings
            goal={goal}
            onUpdateGoal={handleUpdateGoal}
            onResetAllData={handleResetAllData}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onOpenPublishGuide={() => setIsPublishGuideOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-[#090d14] py-6 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">أنت تستطيع</span>
            <span>·</span>
            <span>تحدي تحول العادات خلال 90 يوماً</span>
          </div>

          <button
            onClick={() => setIsPublishGuideOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-sm hover:border-amber-500/40"
          >
            <Rocket className="w-3.5 h-3.5 text-amber-400" />
            <span>دليل النشر على Google Play و App Store 🚀</span>
          </button>

          <div className="text-slate-400">
            «الشعلة لا تنطفئ طالما العزيمة متقدة» 🔥
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={handleAddTask}
        selectedDay={selectedDay}
      />

      <EditTaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSaveTask={handleSaveEditedTask}
        onDeleteTask={handleDeleteTask}
      />

      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        streak={streak}
        onUseFreezeToken={handleUseFreezeToken}
        selectedDay={selectedDay}
      />

      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        tasks={tasks}
        selectedDay={selectedDay}
      />

      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onToggleMiniWidgetMode={() => setIsMiniWidgetMode(true)}
      />

      <PublishGuideModal
        isOpen={isPublishGuideOpen}
        onClose={() => setIsPublishGuideOpen(false)}
      />

      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={executeResetAllData}
      />
    </div>
  );
}
