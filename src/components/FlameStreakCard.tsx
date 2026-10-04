import React from 'react';
import { Flame, Shield, Award, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { StreakInfo } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface FlameStreakCardProps {
  streak: StreakInfo;
  onUseFreezeToken: () => void;
  selectedDay: number;
}

export const FlameStreakCard: React.FC<FlameStreakCardProps> = ({
  streak,
  onUseFreezeToken,
  selectedDay,
}) => {
  const { currentStreak, longestStreak, freezeTokens } = streak;

  // Determine Flame Level & Title
  const getFlameLevel = (days: number) => {
    if (days >= 76) {
      return {
        title: 'شعلة الأسطورة الذهبية',
        desc: 'أنت في قمة المجد والانضباط! إنجاز استثنائي يقترب من خط النهاية.',
        color: 'from-amber-400 via-orange-500 to-yellow-300',
        glow: 'rgba(251, 191, 36, 0.6)',
        sizeClass: 'scale-125',
        stage: 5,
        targetNext: 90,
      };
    }
    if (days >= 46) {
      return {
        title: 'شعلة الأبطال المحاربين',
        desc: 'قوة إرادة فولاذية! تجاوزت منتصف التحدي وتتقدم بثبات.',
        color: 'from-red-500 via-orange-500 to-amber-400',
        glow: 'rgba(239, 68, 68, 0.5)',
        sizeClass: 'scale-115',
        stage: 4,
        targetNext: 75,
      };
    }
    if (days >= 22) {
      return {
        title: 'شعلة الحماس والزخم',
        desc: 'العادة أصبحت جزءاً لا يتجزأ من هويتك الجديدة، لا تتراجع!',
        color: 'from-orange-500 via-amber-500 to-red-500',
        glow: 'rgba(249, 115, 22, 0.45)',
        sizeClass: 'scale-110',
        stage: 3,
        targetNext: 45,
      };
    }
    if (days >= 8) {
      return {
        title: 'شعلة العزيمة المتوهجة',
        desc: 'كسرت حاجز الأسبوع الأول الصعب والشعلة تزداد اشتعالاً!',
        color: 'from-amber-500 via-orange-500 to-red-400',
        glow: 'rgba(245, 158, 11, 0.4)',
        sizeClass: 'scale-105',
        stage: 2,
        targetNext: 21,
      };
    }
    return {
      title: 'شعلة البداية والأمل',
      desc: 'كل يوم تلتزم فيه يغذي هذه الشعلة. استمر حتى تصبح نيراناً لا تنطفئ!',
      color: 'from-yellow-400 to-orange-500',
      glow: 'rgba(234, 179, 8, 0.35)',
      sizeClass: 'scale-100',
      stage: 1,
      targetNext: 7,
    };
  };

  const flameLevel = getFlameLevel(currentStreak);

  const handleCelebrateStreak = () => {
    sounds.playStreakIgnite();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ef4444', '#fbbf24', '#f97316']
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-orange-500/20 p-5 md:p-6 shadow-xl shadow-orange-950/20">
      {/* Background ambient flame glow */}
      <div
        className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ background: flameLevel.glow }}
      />
      <div
        className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ background: 'rgba(245, 158, 11, 0.15)' }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left / Flame graphic & count */}
        <div className="flex items-center gap-5">
          {/* Flame Interactive Icon Container */}
          <div
            onClick={handleCelebrateStreak}
            title="انقر لتغذية الشعلة والاحتفال بالستريك!"
            className="group relative flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-950/80 via-slate-900 to-red-950/80 border border-orange-500/30 p-2 cursor-pointer transition-all hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/30"
          >
            {/* Embers animation */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <span className="absolute bottom-3 left-4 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ember" style={{ animationDelay: '0.1s' }} />
              <span className="absolute bottom-2 right-5 w-2 h-2 rounded-full bg-orange-400 animate-ember" style={{ animationDelay: '0.5s' }} />
              <span className="absolute bottom-4 left-8 w-1 h-1 rounded-full bg-yellow-300 animate-ember" style={{ animationDelay: '0.9s' }} />
            </div>

            {/* Main Animated SVG Flame */}
            <div className={`transition-transform duration-300 ${flameLevel.sizeClass} group-hover:scale-125`}>
              <Flame
                className="w-14 h-14 text-orange-400 fill-orange-500 animate-flame filter drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]"
              />
            </div>

            {/* Sparkle badge on top */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-full p-1 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Streak Numbers & Rank */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 tabular-nums">
                {currentStreak}
              </span>
              <span className="text-lg md:text-xl font-bold text-amber-200">
                {currentStreak === 1 ? 'يوم متتالي' : 'أيام متتالية'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-orange-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-orange-400" />
                {flameLevel.title}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">
                أعلى رقم: <strong className="text-slate-200 tabular-nums">{longestStreak} يوم</strong>
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1.5 max-w-md leading-relaxed">
              {flameLevel.desc}
            </p>
          </div>
        </div>

        {/* Right / Progress to next milestone & Streak Freeze */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Milestone Target box */}
          <div className="px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex flex-col justify-center min-w-[170px]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>الهدف القادم</span>
              </span>
              <span className="font-bold text-amber-300 tabular-nums">
                {flameLevel.targetNext} يوم
              </span>
            </div>
            {/* Progress bar to next flame stage */}
            <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((currentStreak / flameLevel.targetNext) * 100))}%`,
                }}
              />
            </div>
            <div className="text-[11px] text-slate-400 text-left mt-1 tabular-nums">
              بقي {Math.max(0, flameLevel.targetNext - currentStreak)} يوم
            </div>
          </div>

          {/* Streak Freeze Shield Token */}
          <div className="px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  تجميد الشعلة
                </div>
                <div className="text-[11px] text-slate-400">
                  متاح: <span className="text-blue-400 font-bold tabular-nums">{freezeTokens}</span> أيام راحة
                </div>
              </div>
            </div>

            <button
              onClick={onUseFreezeToken}
              disabled={freezeTokens <= 0 || streak.frozenDays.includes(selectedDay)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                streak.frozenDays.includes(selectedDay)
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 cursor-default'
                  : freezeTokens > 0
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              {streak.frozenDays.includes(selectedDay) ? 'اليوم مجمد ❄️' : 'تجميد اليوم'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
