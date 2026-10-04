import React from 'react';
import { RotateCcw, X, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-amber-500/40 rounded-3xl w-full max-w-md p-6 text-right text-slate-100 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Heading */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center text-3xl shadow-lg">
            🔄
          </div>
          <div>
            <h3 className="text-xl font-black text-white">
              تصفير والبدء من اليوم 1
            </h3>
            <p className="text-xs text-amber-300/90 font-semibold mt-1">
              جاهز للبدء من جديد اليوم بكل طاقة وحماس؟
            </p>
          </div>
        </div>

        {/* What will happen list */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs text-slate-300 mb-6">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>سيصبح اليوم هو <strong>اليوم 1</strong> في تحدي الـ 90 يوماً.</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>سيتم تصفير شعلة الستريك لتبدأ من <strong>0 أيام</strong> وتبنيها بنفسك.</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>ستتصفر كل المهام المكتملة لتكون جاهزة للإنجاز من الصفر اليوم.</span>
          </div>
          <div className="flex items-center gap-2.5 text-amber-300 font-bold">
            <Flame className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>قائمة مهامك وعاداتك ستبقى محفوظة كما هي دون حذف!</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>نعم، ابدأ اليوم 1 🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};
