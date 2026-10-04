import React from 'react';
import { X, Flame, Shield, Award, Sparkles, Zap, Check } from 'lucide-react';
import { StreakInfo } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: StreakInfo;
  onUseFreezeToken: () => void;
  selectedDay: number;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  streak,
  onUseFreezeToken,
  selectedDay,
}) => {
  if (!isOpen) return null;

  const stages = [
    { days: '1 - 7 أيام', name: 'شعلة البداية 🟡', desc: 'الشرارة الأولى لتغيير العادات وكسر التسويف.' },
    { days: '8 - 21 يوم', name: 'شعلة العزيمة 🟠', desc: 'بناء الانضباط اليومي وتثبيت العادة في عقلك اللاواعي.' },
    { days: '22 - 45 يوم', name: 'شعلة الحماس والزخم 🔴', desc: 'الانتقال إلى منطقة القوة، وتجاوز العقبات بسلاسة.' },
    { days: '46 - 75 يوم', name: 'شعلة الأبطال 👑', desc: 'قوة إرادة متينة وتأثير إيجابي يظهر على صحتك وإنتاجيتك.' },
    { days: '76 - 90 يوم', name: 'شعلة الأسطورة الذهبية 🏆', desc: 'تحقيق الهدف الكبير وتحويل التحدي إلى أسلوب حياة دائم!' },
  ];

  const handleCelebrate = () => {
    sounds.playStreakIgnite();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ef4444', '#f97316', '#fbbf24']
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0e1422] border border-orange-500/30 rounded-2xl shadow-2xl p-6 text-right overflow-hidden">
        {/* Flame ambient glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-32 bg-orange-500/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/15 border border-orange-500/30 text-amber-400">
              <Flame className="w-5 h-5 fill-orange-500 text-orange-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">دليل شعلة الستريك والتحفيز 🔥</h3>
              <p className="text-xs text-slate-400">حافظ على تتابع أيامك المتتالية لتصل لقمة الأسطورة</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Showcase */}
        <div className="pt-4 space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-950/60 to-red-950/40 border border-orange-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-orange-300 font-semibold block">الستريك الحالي:</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black text-amber-300 tabular-nums">
                  {streak.currentStreak}
                </span>
                <span className="text-sm font-bold text-slate-200">
                  {streak.currentStreak === 1 ? 'يوم' : 'أيام متتالية'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                أطول ستريك لك: <strong className="text-amber-400 tabular-nums">{streak.longestStreak} يوم</strong>
              </span>
            </div>

            <button
              onClick={handleCelebrate}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-md hover:scale-105 transition-transform cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>إشعال الحماس!</span>
            </button>
          </div>

          {/* Freeze Token Explainer */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-200 block">درع حماية الشعلة (Freeze Token):</span>
                <span className="text-[11px] text-slate-400">
                  لديك <strong className="text-blue-400 tabular-nums">{streak.freezeTokens}</strong> أيام راحة لحماية الستريك إذا اضطررت للغياب.
                </span>
              </div>
            </div>

            <button
              onClick={onUseFreezeToken}
              disabled={streak.freezeTokens <= 0 || streak.frozenDays.includes(selectedDay)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold rounded-lg transition-colors cursor-pointer text-xs"
            >
              {streak.frozenDays.includes(selectedDay) ? 'اليوم مجمد ❄️' : 'تجميد اليوم'}
            </button>
          </div>

          {/* Ranks list */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 mb-2">
              مراحل تطور شعلتك خلال الـ 90 يوماً:
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {stages.map((st, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-start gap-2.5"
                >
                  <div className="p-1 rounded-md bg-slate-800 text-amber-400 font-bold tabular-nums text-[10px] min-w-[65px] text-center">
                    {st.days}
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block">{st.name}</span>
                    <span className="text-[11px] text-slate-400">{st.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            حسناً، فهمت
          </button>
        </div>
      </div>
    </div>
  );
};
