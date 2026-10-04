import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  Share, 
  PlusSquare, 
  CheckCircle, 
  Copy, 
  Check, 
  AlertTriangle,
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleMiniWidgetMode?: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  onToggleMiniWidgetMode,
}) => {
  if (!isOpen) return null;

  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in text-right">
      <div className="relative w-full max-w-lg bg-[#0e1422] border border-amber-500/40 rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-24 bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">حل مشكلة التثبيت والإضافة للشاشة 📱</h3>
              <p className="text-xs text-slate-400">طريقة فتح وتثبيت التطبيق على هاتفك بنجاح</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="space-y-4 pt-4 text-xs">
          {/* Important Alert: Why it doesn't download inside in-app browsers */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>لماذا لا يتحمل أو لا يثبت عندك الآن؟</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-200">
              إذا كنت تفتح هذا الرابط من <strong>داخل تطبيق</strong> (مثل تليغرام، إنستغرام، واتساب، أو داخل متصفح المعاينة المدمج):
              المتصفحات الداخلية للتطبيقات <strong>تمنع</strong> ميزة تنزيل التطبيقات والويدجت!
            </p>
            <div className="pt-1">
              <span className="font-bold text-amber-300 block mb-1.5">الحل السريع بخطوتين:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow cursor-pointer text-xs"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'تم نسخ الرابط بنجاح!' : '١. اضغط هنا لنسخ رابط التطبيق'}</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-300 block mt-1.5">
                ٢. افتح تطبيق <strong>Google Chrome</strong> على هاتفك والصق الرابط هناك.
              </span>
            </div>
          </div>

          {/* Quick Direct Install Button if supported by current browser context */}
          {isInstallable && !isInstalled && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white text-xs block">متصفحك الحالي يدعم التثبيت المباشر:</span>
                <span className="text-slate-300 text-[10px]">
                  اضغط الزر لتثبيته فوراً كأيقونة تطبيق كاملة على هاتفك.
                </span>
              </div>
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow cursor-pointer whitespace-nowrap text-xs"
              >
                <Download className="w-4 h-4" />
                <span>تثبيت فوراً</span>
              </button>
            </div>
          )}

          {/* Step by step for Android & iPhone in real browsers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Android Chrome */}
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <span className="font-bold text-amber-400 block text-xs border-b border-slate-700/60 pb-1.5 flex items-center gap-1">
                <span>لهواتف أندرويد (Chrome):</span>
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                <li>افتح الرابط في تطبيق <strong>Chrome</strong>.</li>
                <li>اضغط على الثلاث نقاط <strong>(⋮)</strong> في الزاوية العلوية.</li>
                <li>اختر <strong>«إضافة إلى الشاشة الرئيسية»</strong> أو <strong>«تثبيت التطبيق»</strong>.</li>
                <li>ستظهر أيقونة التطبيق على شاشتك فوراً!</li>
              </ol>
            </div>

            {/* iPhone Safari */}
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <span className="font-bold text-cyan-400 block text-xs border-b border-slate-700/60 pb-1.5 flex items-center gap-1">
                <span>لهواتف آيفون (Safari):</span>
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                <li>افتح الرابط في متصفح <strong>Safari</strong>.</li>
                <li>اضغط على زر المشاركة بالأسفل (<Share className="w-3 h-3 inline text-cyan-400" />).</li>
                <li>مرر للأسفل واختر <strong>«إضافة إلى الشاشة الرئيسية»</strong> (<PlusSquare className="w-3 h-3 inline text-cyan-400" />).</li>
                <li>اضغط <strong>إضافة (Add)</strong> بالأعلى.</li>
              </ol>
            </div>
          </div>

          {/* Clarification about APK vs Web App */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <span className="text-amber-400 font-semibold">ملاحظة: </span>
            هذا التطبيق هو <strong>تطبيق ويب ذكي (Web App)</strong> لا يحتاج تحميل ملف APK ثقيل من المتجر؛ بمجرد إضافته للشاشة الرئيسية بالخطوات أعلاه سيعمل معك تماماً كأي تطبيق مثبت على الهاتف!
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
          {onToggleMiniWidgetMode && (
            <button
              onClick={() => {
                onToggleMiniWidgetMode();
                onClose();
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
            >
              عرض وضع الويدجت المصغر 📱
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer mr-auto"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
