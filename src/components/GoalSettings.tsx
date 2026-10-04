import React, { useState } from 'react';
import { Target, Award, Sparkles, Save, RotateCcw, Download, Upload, Check, AlertCircle, Rocket } from 'lucide-react';
import { Goal90 } from '../types';

interface GoalSettingsProps {
  goal: Goal90;
  onUpdateGoal: (updated: Partial<Goal90>) => void;
  onResetAllData: () => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
  onOpenPublishGuide?: () => void;
}

export const GoalSettings: React.FC<GoalSettingsProps> = ({
  goal,
  onUpdateGoal,
  onResetAllData,
  onExportData,
  onImportData,
  onOpenPublishGuide,
}) => {
  const [title, setTitle] = useState(goal.title);
  const [whyStatement, setWhyStatement] = useState(goal.whyStatement);
  const [currentDay, setCurrentDay] = useState(goal.currentDay);
  const [day30Reward, setDay30Reward] = useState(goal.milestones.day30Reward);
  const [day60Reward, setDay60Reward] = useState(goal.milestones.day60Reward);
  const [day90Reward, setDay90Reward] = useState(goal.milestones.day90Reward);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoal({
      title,
      whyStatement,
      currentDay: Number(currentDay),
      milestones: {
        day30Reward,
        day60Reward,
        day90Reward,
      },
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportData(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              <span>الهدف الأساسي لرحلة الـ 90 يوماً</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              وضوح الهدف وقوة السبب هما سر الاستمرار والانتصار على التسويف.
            </p>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            {isSaved ? <Check className="w-4 h-4 stroke-[3]" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'تم الحفظ بنجاح!' : 'حفظ التعديلات'}</span>
          </button>
        </div>

        {/* Goal Title */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1.5">
            الهدف الأساسي الأكبر الذي تريد تحقيقه في 90 يوماً:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full text-sm font-semibold p-3 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            placeholder="مثال: إنقاص 10 كغ واكتساب اللياقة، أو إتقان البرمجة وقراءة 10 كتب..."
          />
        </div>

        {/* Why Statement */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1.5">
            لماذا هذا الهدف مصيري بالنسبة لك؟ (الدافع الحقيقي):
          </label>
          <textarea
            value={whyStatement}
            onChange={(e) => setWhyStatement(e.target.value)}
            rows={3}
            required
            className="w-full text-xs p-3 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
            placeholder="اكتب الأسباب العميقة التي تجعلك لن تستسلم مهما كانت الظروف..."
          />
        </div>

        {/* Current Day Adjustment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              اليوم الحالي في التحدي (من 1 إلى 90):
            </label>
            <input
              type="number"
              min={1}
              max={90}
              value={currentDay}
              onChange={(e) => setCurrentDay(Number(e.target.value))}
              className="w-full text-sm font-bold p-3 rounded-xl bg-slate-800/70 border border-slate-700 text-amber-400 focus:outline-none focus:border-amber-400 tabular-nums"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              يمكنك تعديل اليوم الحالي ليتطابق مع تقدمك الحقيقي
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              تاريخ بدء الرحلة:
            </label>
            <input
              type="date"
              value={goal.startDate}
              onChange={(e) => onUpdateGoal({ startDate: e.target.value })}
              className="w-full text-sm p-3 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400 tabular-nums"
            />
          </div>
        </div>

        {/* Milestone Rewards Section */}
        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-amber-400" />
            <span>نظام مكافآت الإنجاز عند انتهاء كل شهر</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <label className="block text-xs font-bold text-amber-400 mb-1.5">
                مكافأة اليوم الـ 30 (نهاية الشهر الأول):
              </label>
              <input
                type="text"
                value={day30Reward}
                onChange={(e) => setDay30Reward(e.target.value)}
                placeholder="مثال: شراء ملابس جديدة أو عشاء فاخر"
                className="w-full text-xs p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <label className="block text-xs font-bold text-orange-400 mb-1.5">
                مكافأة اليوم الـ 60 (نهاية الشهر الثاني):
              </label>
              <input
                type="text"
                value={day60Reward}
                onChange={(e) => setDay60Reward(e.target.value)}
                placeholder="مثال: رحلة نهاية أسبوع أو نشاط مميز"
                className="w-full text-xs p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <label className="block text-xs font-bold text-emerald-400 mb-1.5">
                مكافأة اليوم الـ 90 (تحقيق الهدف النهائي!):
              </label>
              <input
                type="text"
                value={day90Reward}
                onChange={(e) => setDay90Reward(e.target.value)}
                placeholder="مثال: الاحتفال الكبير، شراء هدية قيمة لنفسي"
                className="w-full text-xs p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      </form>

      {/* App Stores & Public Launch Section */}
      <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 md:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">نشر التطبيق على Google Play و App Store</h3>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-500/30 font-bold">
            جاهز للمتاجر 🚀
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          هل تريد نشر التطبيق للعامة أو على متجر قوقل بلاي وآبل؟ جهزنا لك الدليل الكامل مع الأوامر، سياسة الخصوصية الرسمية، ووصف المتجر التسويقي!
        </p>
        {onOpenPublishGuide && (
          <button
            type="button"
            onClick={onOpenPublishGuide}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 text-xs font-black rounded-xl shadow-md cursor-pointer hover:opacity-95 transition-opacity"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>فتح دليل النشر والأوامر وسياسة الخصوصية 🚀</span>
          </button>
        )}
      </div>

      {/* Backup and Data Management */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-blue-400" />
          <span>النسخ الاحتياطي وإدارة البيانات</span>
        </h3>
        <p className="text-xs text-slate-400">
          تطبيق "أنت تستطيع" يحفظ بياناتك تلقائياً على جهازك. يمكنك أيضاً تصدير نسخة احتياطية أو استعادتها بأي وقت.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onExportData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>تصدير نسخة احتياطية (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-blue-400" />
            <span>استيراد نسخة سابقة</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={onResetAllData}
            className="flex items-center gap-2 px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold rounded-xl border border-red-500/30 transition-colors cursor-pointer mr-auto"
          >
            <RotateCcw className="w-4 h-4 text-red-400" />
            <span>إعادة ضبط التحدي من اليوم 1</span>
          </button>
        </div>
      </div>
    </div>
  );
};
