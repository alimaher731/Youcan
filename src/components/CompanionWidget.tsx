import React, { useState } from 'react';
import { Flame, CheckCircle, Sparkles, Heart, Zap, BookOpen, Clock, ChevronLeft, ArrowLeft } from 'lucide-react';
import { Task, Category } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

// Character image assets
import celebrationImg from '../assets/images/companion_celebration_1791105962052.jpg';
import fitnessImg from '../assets/images/companion_fitness_1791105975031.jpg';
import learningImg from '../assets/images/companion_learning_1791105986518.jpg';
import focusImg from '../assets/images/companion_focus_1791106004062.jpg';
import spiritualImg from '../assets/images/companion_spiritual_1791106016430.jpg';

interface CompanionWidgetProps {
  currentStreak: number;
  selectedDay: number;
  tasks: Task[];
  onToggleTask: (taskId: string, day: number) => void;
  onOpenTasksTab?: () => void;
  onToggleMiniWidgetMode?: () => void;
}

export const CompanionWidget: React.FC<CompanionWidgetProps> = ({
  currentStreak,
  selectedDay,
  tasks,
  onToggleTask,
  onOpenTasksTab,
  onToggleMiniWidgetMode,
}) => {
  const [characterTapped, setCharacterTapped] = useState(false);
  const [speechBubbleText, setSpeechBubbleText] = useState<string | null>(null);

  // Active tasks for this selected day
  const activeTasks = tasks.filter((t) => {
    return t.isRecurringDaily || (t.activeDays && t.activeDays.includes(selectedDay));
  });

  const completedCount = activeTasks.filter((t) => t.completions[selectedDay]).length;
  const totalCount = activeTasks.length;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  // Find next pending task
  const nextPendingTask = activeTasks.find((t) => !t.completions[selectedDay]);

  // Determine character configuration based on current active/next task
  const getCompanionState = () => {
    if (isAllCompleted || !nextPendingTask) {
      return {
        type: 'celebration',
        img: celebrationImg,
        headline: 'أنت في المقدمة!',
        subtitle: 'أتممت جميع مهام اليوم بامتياز! استمر بهذا الزخم الرائع',
        accentBg: 'from-[#0ea5e9] via-[#38bdf8] to-[#60a5fa]',
        cardBg: 'bg-gradient-to-b from-[#0ea5e9] via-[#0284c7] to-[#0369a1]',
        tagBg: 'bg-white/20 text-white',
        buttonBg: 'bg-white text-sky-900 hover:bg-sky-50',
        particles: ['💛', '💖', '✨', '⭐'],
      };
    }

    const titleLower = nextPendingTask.title.toLowerCase();
    const category = nextPendingTask.category;

    if (category === 'health' || titleLower.includes('رياضة') || titleLower.includes('تمرين') || titleLower.includes('ماء') || titleLower.includes('مشي')) {
      return {
        type: 'fitness',
        img: fitnessImg,
        headline: 'حان وقت النشاط واللياقة! 💪',
        subtitle: nextPendingTask.title,
        accentBg: 'from-[#f97316] via-[#fb923c] to-[#f59e0b]',
        cardBg: 'bg-gradient-to-b from-[#ea580c] via-[#c2410c] to-[#9a3412]',
        tagBg: 'bg-white/20 text-white',
        buttonBg: 'bg-amber-400 text-slate-950 hover:bg-amber-300',
        particles: ['⚡', '🔥', '💧', '✨'],
      };
    }

    if (category === 'learning' || titleLower.includes('قراءة') || titleLower.includes('كتاب') || titleLower.includes('تعلم') || titleLower.includes('لغة')) {
      return {
        type: 'learning',
        img: learningImg,
        headline: 'المعرفة تصنع الفارق! 📚',
        subtitle: nextPendingTask.title,
        accentBg: 'from-[#059669] via-[#10b981] to-[#34d399]',
        cardBg: 'bg-gradient-to-b from-[#047857] via-[#065f46] to-[#064e3b]',
        tagBg: 'bg-white/20 text-white',
        buttonBg: 'bg-emerald-300 text-slate-950 hover:bg-emerald-200',
        particles: ['💡', '📖', '🌟', '✨'],
      };
    }

    if (category === 'career' || titleLower.includes('عمل') || titleLower.includes('برمجة') || titleLower.includes('مشروع') || titleLower.includes('تركيز')) {
      return {
        type: 'focus',
        img: focusImg,
        headline: 'ساعة التركيز والإنجاز! 🎯',
        subtitle: nextPendingTask.title,
        accentBg: 'from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa]',
        cardBg: 'bg-gradient-to-b from-[#6d28d9] via-[#5b21b6] to-[#4c1d95]',
        tagBg: 'bg-white/20 text-white',
        buttonBg: 'bg-violet-300 text-slate-950 hover:bg-violet-200',
        particles: ['🎯', '⚡', '☕', '✨'],
      };
    }

    if (category === 'spiritual' || titleLower.includes('صلاة') || titleLower.includes('أذكار') || titleLower.includes('قرآن') || titleLower.includes('فجر')) {
      return {
        type: 'spiritual',
        img: spiritualImg,
        headline: 'سكينة وطمأنينة لقلبك ✨',
        subtitle: nextPendingTask.title,
        accentBg: 'from-[#1e3a8a] via-[#2563eb] to-[#3b82f6]',
        cardBg: 'bg-gradient-to-b from-[#1e40af] via-[#1e3a8a] to-[#172554]',
        tagBg: 'bg-white/20 text-white',
        buttonBg: 'bg-amber-300 text-slate-950 hover:bg-amber-200',
        particles: ['🌙', '🌟', '🏮', '✨'],
      };
    }

    // Default Personal
    return {
      type: 'celebration',
      img: celebrationImg,
      headline: 'أنت في المقدمة!',
      subtitle: nextPendingTask.title,
      accentBg: 'from-[#0ea5e9] via-[#38bdf8] to-[#60a5fa]',
      cardBg: 'bg-gradient-to-b from-[#0ea5e9] via-[#0284c7] to-[#0369a1]',
      tagBg: 'bg-white/20 text-white',
      buttonBg: 'bg-white text-sky-950 hover:bg-sky-50',
      particles: ['💛', '💖', '✨', '⭐'],
    };
  };

  const companion = getCompanionState();

  const handleCharacterTap = () => {
    sounds.playStreakIgnite();
    setCharacterTapped(true);

    const cheers = [
      'أنت بطل الانضباط، مستمر حتى القمة!',
      'عاش يا بطل! الشعلة مستمرة وما تنطفي 🔥',
      'كل خطوة صغيرة تقربك للهدف الكبير!',
      'أنت تستطيع، لا شيء يقف في طريقك!',
      'شعلتك اليوم في أقوى مستوياتها!',
    ];
    const randomCheer = cheers[Math.floor(Math.random() * cheers.length)];
    setSpeechBubbleText(randomCheer);

    setTimeout(() => setCharacterTapped(false), 800);
    setTimeout(() => setSpeechBubbleText(null), 3500);
  };

  const handleCompleteCurrentTask = () => {
    if (!nextPendingTask) return;
    onToggleTask(nextPendingTask.id, selectedDay);
    sounds.playTaskComplete();

    // Trigger celebratory effect
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0ea5e9', '#f59e0b', '#ec4899', '#10b981'],
    });

    setSpeechBubbleText('كفو عليك يا بطل! تم إنجاز المهمة بنجاح 🚀');
    setTimeout(() => setSpeechBubbleText(null), 3000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl p-5 sm:p-6 transition-all duration-500 bg-slate-900/90 text-white">
      {/* Background ambient lighting */}
      <div className={`absolute inset-0 bg-gradient-to-br ${companion.accentBg} opacity-20 blur-3xl pointer-events-none transition-all duration-700`} />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Text info, current task preview, and action button */}
        <div className="flex-1 w-full text-right space-y-4">
          {/* Top Pill: Streak Flame + Status Title */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
                <span>ستريك مستمر:</span>
                <span className="text-white tabular-nums text-sm font-black">{currentStreak} يوم</span>
              </div>

              <span className="text-xs text-slate-400 hidden sm:inline">
                اليوم {selectedDay} · {completedCount} من {totalCount} منجزة
              </span>
            </div>

            {onToggleMiniWidgetMode && (
              <button
                onClick={onToggleMiniWidgetMode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>تكبير شاشة الويدجت 📱</span>
              </button>
            )}
          </div>

          {/* Motivational Headline (matching screenshot) */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{companion.headline}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
              {isAllCompleted
                ? 'أتممت جميع مهام اليوم وحافظت على الشعلة متقدة! فخورون بك وبإصرارك'
                : 'شخصيتك التشجيعية ترافقك خطوة بخطوة وتتغير مع كل مهمة تنجزها.'}
            </p>
          </div>

          {/* Current Active Task Card */}
          {nextPendingTask && !isAllCompleted ? (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 block mb-0.5">
                      المهمة الحالية المطلوبة:
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {nextPendingTask.title}
                    </h4>
                    {nextPendingTask.notes && (
                      <p className="text-xs text-slate-400 mt-1">
                        {nextPendingTask.notes}
                      </p>
                    )}
                  </div>
                </div>

                {nextPendingTask.scheduledTime && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-700/80 text-slate-300 tabular-nums whitespace-nowrap">
                    {nextPendingTask.scheduledTime}
                  </span>
                )}
              </div>

              {/* Quick Action Button right inside the widget */}
              <div className="mt-3.5 pt-3 border-t border-slate-700/60 flex items-center justify-between gap-3">
                <button
                  onClick={handleCompleteCurrentTask}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer ${companion.buttonBg} hover:scale-102`}
                >
                  <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                  <span>تم إنجاز هذه المهمة الآن! (تحديث الشخصية)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">
                  <CheckCircle className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-300">
                    جميع مهام اليوم مكتملة بالكامل!
                  </h4>
                  <p className="text-xs text-emerald-400/80 mt-0.5">
                    شعلتك في ذروة تألقها. استرح الآن واستعد ليوم الغد بكل ثقة!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Phone Widget-Style Character Card (Matching the user screenshot!) */}
        <div className="relative flex-shrink-0 w-64 sm:w-72">
          {/* Outer Widget Frame matching mobile widget */}
          <div
            onClick={handleCharacterTap}
            title="انقر على الشخصية للتحفيز وسماع التشجيع!"
            className={`group relative overflow-hidden rounded-3xl ${companion.cardBg} border-2 border-white/20 p-4 shadow-2xl cursor-pointer select-none transition-transform duration-300 ${
              characterTapped ? 'scale-95' : 'hover:scale-105'
            }`}
          >
            {/* Floating Particles Animation (Hearts, Stars, Flames) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <span className="absolute top-12 left-4 text-base animate-float-heart" style={{ animationDelay: '0s' }}>
                {companion.particles[0]}
              </span>
              <span className="absolute top-20 right-6 text-sm animate-float-heart" style={{ animationDelay: '0.8s' }}>
                {companion.particles[1]}
              </span>
              <span className="absolute bottom-16 left-6 text-base animate-float-heart" style={{ animationDelay: '1.4s' }}>
                {companion.particles[2]}
              </span>
              <span className="absolute bottom-24 right-4 text-sm animate-float-heart" style={{ animationDelay: '2.1s' }}>
                {companion.particles[3]}
              </span>
            </div>

            {/* Widget Top: Flame & Streak Number (Exact replica of widget in screenshot) */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-md shadow-inner">
                <Flame className="w-5 h-5 fill-amber-300 text-amber-300 animate-bounce" />
              </div>
              <span className="text-2xl font-black text-white drop-shadow-md tabular-nums">
                {currentStreak}
              </span>
            </div>

            {/* Headline on widget */}
            <div className="text-center font-black text-white text-base sm:text-lg drop-shadow-sm mb-2">
              {companion.headline}
            </div>

            {/* Main Character Artwork Frame */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-inner border border-white/10 bg-slate-900/20">
              <img
                src={companion.img}
                alt="شخصية التحفيز للتحدي"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all duration-500 animate-character-bounce ${
                  characterTapped ? 'rotate-3 scale-110' : ''
                }`}
              />

              {/* Light glossy overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none" />
            </div>

            {/* Bottom mini tip on widget */}
            <div className="mt-2 text-center text-[11px] font-semibold text-white/90 drop-shadow">
              {isAllCompleted ? '✨ إنجاز 100% لليوم!' : `المتبقي: ${totalCount - completedCount} مهام`}
            </div>

            {/* Speech bubble overlay when character is tapped */}
            {speechBubbleText && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[90%] bg-white text-slate-900 font-extrabold text-xs p-2.5 rounded-2xl shadow-2xl border border-amber-300 text-center animate-bounce z-20">
                {speechBubbleText}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
