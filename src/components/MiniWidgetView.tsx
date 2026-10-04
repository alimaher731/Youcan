import React from 'react';
import { Flame, CheckCircle, X, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { Task } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

// Character image assets
import celebrationImg from '../assets/images/companion_celebration_1791105962052.jpg';
import fitnessImg from '../assets/images/companion_fitness_1791105975031.jpg';
import learningImg from '../assets/images/companion_learning_1791105986518.jpg';
import focusImg from '../assets/images/companion_focus_1791106004062.jpg';
import spiritualImg from '../assets/images/companion_spiritual_1791106016430.jpg';

interface MiniWidgetViewProps {
  currentStreak: number;
  selectedDay: number;
  tasks: Task[];
  onToggleTask: (taskId: string, day: number) => void;
  onExit: () => void;
  onResetAllData?: () => void;
}

export const MiniWidgetView: React.FC<MiniWidgetViewProps> = ({
  currentStreak,
  selectedDay,
  tasks,
  onToggleTask,
  onExit,
  onResetAllData,
}) => {
  const activeTasks = tasks.filter((t) => {
    return t.isRecurringDaily || (t.activeDays && t.activeDays.includes(selectedDay));
  });

  const completedCount = activeTasks.filter((t) => t.completions[selectedDay]).length;
  const totalCount = activeTasks.length;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;
  const nextPendingTask = activeTasks.find((t) => !t.completions[selectedDay]);

  // Determine character image and theme
  const getCompanionState = () => {
    if (isAllCompleted || !nextPendingTask) {
      return {
        img: celebrationImg,
        headline: 'أنت في المقدمة!',
        subtitle: 'أنجزت جميع مهام اليوم بامتياز!',
        cardBg: 'bg-gradient-to-b from-[#0ea5e9] via-[#0284c7] to-[#0369a1]',
        buttonBg: 'bg-white text-sky-950 hover:bg-sky-50',
        particles: ['💛', '💖', '✨', '⭐'],
      };
    }

    const titleLower = nextPendingTask.title.toLowerCase();
    const category = nextPendingTask.category;

    if (category === 'health' || titleLower.includes('رياضة') || titleLower.includes('تمرين') || titleLower.includes('ماء')) {
      return {
        img: fitnessImg,
        headline: 'حان وقت النشاط! 💪',
        subtitle: nextPendingTask.title,
        cardBg: 'bg-gradient-to-b from-[#ea580c] via-[#c2410c] to-[#9a3412]',
        buttonBg: 'bg-amber-400 text-slate-950 hover:bg-amber-300',
        particles: ['⚡', '🔥', '💧', '✨'],
      };
    }

    if (category === 'learning' || titleLower.includes('قراءة') || titleLower.includes('كتاب') || titleLower.includes('تعلم')) {
      return {
        img: learningImg,
        headline: 'المعرفة قوة! 📚',
        subtitle: nextPendingTask.title,
        cardBg: 'bg-gradient-to-b from-[#047857] via-[#065f46] to-[#064e3b]',
        buttonBg: 'bg-emerald-300 text-slate-950 hover:bg-emerald-200',
        particles: ['💡', '📖', '🌟', '✨'],
      };
    }

    if (category === 'career' || titleLower.includes('عمل') || titleLower.includes('برمجة') || titleLower.includes('تركيز')) {
      return {
        img: focusImg,
        headline: 'ساعة التركيز والإنجاز! 🎯',
        subtitle: nextPendingTask.title,
        cardBg: 'bg-gradient-to-b from-[#6d28d9] via-[#5b21b6] to-[#4c1d95]',
        buttonBg: 'bg-violet-300 text-slate-950 hover:bg-violet-200',
        particles: ['🎯', '⚡', '☕', '✨'],
      };
    }

    if (category === 'spiritual' || titleLower.includes('صلاة') || titleLower.includes('أذكار')) {
      return {
        img: spiritualImg,
        headline: 'سكينة وطمأنينة لقلبك ✨',
        subtitle: nextPendingTask.title,
        cardBg: 'bg-gradient-to-b from-[#1e40af] via-[#1e3a8a] to-[#172554]',
        buttonBg: 'bg-amber-300 text-slate-950 hover:bg-amber-200',
        particles: ['🌙', '🌟', '🏮', '✨'],
      };
    }

    return {
      img: celebrationImg,
      headline: 'أنت في المقدمة!',
      subtitle: nextPendingTask.title,
      cardBg: 'bg-gradient-to-b from-[#0ea5e9] via-[#0284c7] to-[#0369a1]',
      buttonBg: 'bg-white text-sky-950 hover:bg-sky-50',
      particles: ['💛', '💖', '✨', '⭐'],
    };
  };

  const companion = getCompanionState();

  const handleCompleteCurrentTask = () => {
    if (!nextPendingTask) return;
    onToggleTask(nextPendingTask.id, selectedDay);
    sounds.playTaskComplete();

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0ea5e9', '#f59e0b', '#ec4899', '#10b981'],
    });
  };

  return (
    <div className="min-h-screen bg-[#070a10] flex flex-col items-center justify-center p-4 selection:bg-amber-500/30">
      {/* Top Bar for Mini View */}
      <div className="w-full max-w-sm flex items-center justify-between mb-4 px-2">
        {onResetAllData ? (
          <button
            onClick={onResetAllData}
            title="تصفير العداد لليوم 1"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-amber-300 hover:text-amber-200 text-xs font-bold border border-amber-500/40 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تصفير لليوم 1 🔄</span>
          </button>
        ) : (
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>وضع الويدجت المصغر</span>
          </span>
        )}

        <button
          onClick={onExit}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>العودة للتطبيق الكامل</span>
        </button>
      </div>

      {/* The Widget Itself - Sized and Styled Exactly Like Phone Home Screen Widget */}
      <div className="w-full max-w-sm">
        <div className={`relative overflow-hidden rounded-3xl ${companion.cardBg} border-2 border-white/20 p-5 shadow-2xl text-white select-none`}>
          {/* Floating animated particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <span className="absolute top-12 left-6 text-xl animate-float-heart" style={{ animationDelay: '0s' }}>
              {companion.particles[0]}
            </span>
            <span className="absolute top-24 right-6 text-lg animate-float-heart" style={{ animationDelay: '0.8s' }}>
              {companion.particles[1]}
            </span>
            <span className="absolute bottom-20 left-6 text-xl animate-float-heart" style={{ animationDelay: '1.4s' }}>
              {companion.particles[2]}
            </span>
            <span className="absolute bottom-28 right-6 text-lg animate-float-heart" style={{ animationDelay: '2.1s' }}>
              {companion.particles[3]}
            </span>
          </div>

          {/* Top Flame & Streak */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-md shadow-inner">
              <Flame className="w-6 h-6 fill-amber-300 text-amber-300 animate-bounce" />
            </div>
            <span className="text-3xl font-black text-white drop-shadow-md tabular-nums">
              {currentStreak}
            </span>
          </div>

          {/* Headline */}
          <div className="text-center font-black text-white text-xl drop-shadow-sm mb-3">
            {companion.headline}
          </div>

          {/* Character Artwork Frame */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-inner border border-white/10 bg-slate-900/20 mb-3">
            <img
              src={companion.img}
              alt="شخصية التحفيز"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover animate-character-bounce"
            />
          </div>

          {/* Subtitle / Task title */}
          <div className="text-center mb-3">
            <span className="text-xs text-white/80 block mb-0.5">
              {isAllCompleted ? 'حالة التحدي:' : 'المهمة الحالية:'}
            </span>
            <h4 className="text-sm font-bold text-white drop-shadow">
              {companion.subtitle}
            </h4>
          </div>

          {/* Action button */}
          {!isAllCompleted && nextPendingTask ? (
            <button
              onClick={handleCompleteCurrentTask}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs shadow-lg transition-transform hover:scale-102 cursor-pointer ${companion.buttonBg}`}
            >
              <CheckCircle className="w-4 h-4 stroke-[2.5]" />
              <span>تم الإنجاز! (الانتقال للمهمة التالية)</span>
            </button>
          ) : (
            <div className="py-2.5 px-3 rounded-2xl bg-white/20 backdrop-blur-md text-center text-xs font-bold text-white">
              🎉 مكتملة بنسبة 100% لليوم {selectedDay}!
            </div>
          )}

          {/* Progress Indicator */}
          <div className="mt-3 text-center text-[11px] text-white/80 font-medium tabular-nums">
            أنجزت {completedCount} من {totalCount} مهام
          </div>
        </div>
      </div>
    </div>
  );
};
