import React, { useState } from 'react';
import { X, Globe, Smartphone, Shield, Copy, Check, ExternalLink, Sparkles, Terminal, BookOpen, Layers } from 'lucide-react';

interface PublishGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishGuideModal: React.FC<PublishGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'free' | 'android' | 'ios' | 'privacy' | 'listing'>('free');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const privacyPolicyText = `سياسة الخصوصية لتطبيق "أنت تستطيع - تحدي الـ 90 يوم"

تاريخ السريان: 2026
نحن في تطبيق "أنت تستطيع" نقدر خصوصيتك بشكل كامل ونلتزم بحماية بياناتك الشخصية.

1. جمع البيانات واستخدامها:
- لا نقوم بجمع أو مشاركة أي بيانات شخصية أو معلومات سرية عنك على أي خوادم خارجية.
- جميع مهامك اليومية، عاداتك، سجلات الستريك، وتقييماتك الشهرية يتم تخزينها محلياً وبشكل مشفر داخل جهازك (Local Storage).

2. الأذونات المطلوبة:
- إشعارات الهاتف: نطلب إذن التنبيهات فقط لتذكيرك بمواعيد مهامك اليومية التي قمت بتحديدها بنفسك، ولا نرسل أي إعلانات أو رسائل ترويجية.

3. مشاركة البيانات مع أطراف ثالثة:
- لا نبيع أو نشارك أو نؤجر أي بيانات للمستخدمين لأي طرف ثالث نهائياً.

4. التحكم في بياناتك:
- يمكنك في أي وقت حذف أو تعديل أو تصدير كافة بياناتك بنقرة زر واحدة من داخل إعدادات التطبيق.

لأي استفسار بخصوص سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني.`;

  const storeListingText = `عنوان التطبيق:
أنت تستطيع - تحدي الـ 90 يوم والويدجت

الوصف القصير (80 حرف):
تطبيق بناء العادات اليومية مع شخصية ويدجت تفاعلية وشعلة الستريك الحماسية!

الوصف الكامل:
هل أنت مستعد لتغيير حياتك وتحقيق أهدافك خلال 90 يوماً؟
تطبيق "أنت تستطيع" هو رفيقك اليومي الأقوى لبناء العادات الإيجابية والالتزام المستمر!

الميزات الرئيسية:
🔥 نظام شعلة الستريك (Streak): حافظ على حماسك ولا تقطع السلسلة يوماً واحداً.
🧸 شخصية الويدجت التفاعلية: شخصية كرتونية مرحة ترافقك وتتغير تلقائياً مع كل مهمة تنجزها (رياضة، قراءة، تركيز، عبادات).
📅 خارطة الـ 90 يوم: مقسمة لـ 3 مراحل مع نظام المكافآت الذاتية عند اليوم 30 و 60 و 90.
🔔 تنبيهات ذكية للمهام: لا تفوت أي موعد عمل أو عبادة أو دراسة.
📊 إحصائيات شهرية: رسوم بيانية دقيقة تقيس تطور التزامك ونموك الشخصي.
❄️ أوسمة تجميد الستريك: لحماية أيام إنجازك في الظروف الطارئة.
🔒 خصوصية تامة 100%: جميع بياناتك محفوظة بأمان على جهازك.

ابدأ اليوم، فالأبطال يُصنعون بالالتزام اليومي. أنت تستطيع!`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border border-slate-700/80 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-auto text-right text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-slate-900 to-transparent">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 justify-end">
                <span>دليل نشر التطبيق للعامة والمتاجر</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                كل الخطوات والأدوات لتصل بتطبيقك إلى آلاف المستخدمين
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-lg">
              🚀
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('free')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'free'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>1. نشر عام مجاني (فوري)</span>
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'android'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>2. متجر Google Play</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'ios'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. متجر App Store (iOS)</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>سياسة الخصوصية</span>
          </button>

          <button
            onClick={() => setActiveTab('listing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === 'listing'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>وصف المتجر الجاهز</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
          {/* TAB 1: FREE INSTANT PUBLIC LAUNCH */}
          {activeTab === 'free' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-emerald-200">الخيار الأسرع والمجاني 100% لنشره اليوم للعامة:</h4>
                  <p className="text-xs text-emerald-300/90 mt-1">
                    بدون دفع 25$ لقوقل أو 99$ لآبل، يمكنك رفع التطبيق على استضافة Vercel أو Netlify المجانية، ويكون عندك رابط دائم مثل (you-can.vercel.app) يفتحه أي شخص ويثبته على هاتفه فوراً!
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-black text-white text-sm">الخطوات العملية:</h5>
                <ol className="list-decimal list-inside space-y-2.5 text-xs text-slate-300 pr-2">
                  <li>
                    <strong className="text-amber-300">ارفع ملفات التطبيق على حساب GitHub:</strong> يمكنك رفع مجلد الكود هذا على مستودع (Repository) خاص بك في موقع github.com مجاناً.
                  </li>
                  <li>
                    <strong className="text-amber-300">سجل في موقع Vercel (مجاني):</strong> اذهب إلى <span className="text-sky-400 font-mono">vercel.com</span> وسجل الدخول بحساب GitHub الخاص بك.
                  </li>
                  <li>
                    <strong className="text-amber-300">اختر مشروعك واضغط Deploy:</strong> سيكتشف Vercel تلقائياً أنه تطبيق Vite React ويبنيه في أقل من دقيقة!
                  </li>
                  <li>
                    <strong className="text-amber-300">مبارك! الرابط جاهز:</strong> ستحصل على رابط عالمي مشفر بـ HTTPS يمكنك مشاركته مع كل الناس أو ربطه بدومين خاص بك.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE PLAY STORE */}
          {activeTab === 'android' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                <h4 className="font-bold text-base text-amber-200 flex items-center gap-2 justify-end">
                  <span>طريقة تحويل المشروع لـ Google Play عبر Capacitor</span>
                  <Smartphone className="w-5 h-5" />
                </h4>
                <p className="text-xs text-amber-300/80 mt-1">
                  لقد قمنا بتجهيز ملف الإعداد <span className="font-mono text-white">capacitor.config.json</span> في مشروعك مسبقاً.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-black text-white text-xs">الأوامر الأربعة لتحويل التطبيق لمشروع Android Studio:</h5>
                
                <div className="relative p-3.5 rounded-2xl bg-slate-950 font-mono text-xs text-slate-200 border border-slate-800 text-left ltr space-y-1">
                  <div className="text-slate-500"># 1. تثبيت Capacitor في المشروع</div>
                  <div className="text-emerald-400">npm install @capacitor/core @capacitor/cli @capacitor/android</div>
                  <div className="text-slate-500 pt-1"># 2. بناء ملفات الموقع المحدثة</div>
                  <div className="text-emerald-400">npm run build</div>
                  <div className="text-slate-500 pt-1"># 3. إنشاء مجلد الأندرويد</div>
                  <div className="text-emerald-400">npx cap add android</div>
                  <div className="text-slate-500 pt-1"># 4. فتح المشروع في Android Studio</div>
                  <div className="text-emerald-400">npx cap open android</div>

                  <button
                    onClick={() => handleCopy("npm install @capacitor/core @capacitor/cli @capacitor/android && npm run build && npx cap add android && npx cap open android", "cap_cmd")}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="نسخ الأوامر"
                  >
                    {copiedKey === 'cap_cmd' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs space-y-2">
                <strong className="text-amber-300 block">خطوات Google Play Console:</strong>
                <p className="text-slate-300">
                  1. افتح مشروعك في برنامج <strong>Android Studio</strong> المجاني.<br />
                  2. من القائمة العلوية اضغط: <strong>Build ➔ Generate Signed Bundle / APK ➔ Android App Bundle (AAB)</strong>.<br />
                  3. ادخل لحسابك في <strong>Google Play Console</strong>، أنشئ تطبيقا جديداً، وارفع ملف الـ <code>.aab</code>.<br />
                  4. الصق رابط سياسة الخصوصية ووصف التطبيق المرفقين في هذا الدليل!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: APPLE APP STORE */}
          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-300">
                <h4 className="font-bold text-base text-sky-200 flex items-center gap-2 justify-end">
                  <span>النشر على App Store لهواتف آيفون (iOS)</span>
                  <Layers className="w-5 h-5" />
                </h4>
                <p className="text-xs text-sky-300/80 mt-1">
                  نفس الكود يعمل مباشرة على نظام iOS عبر أداة Capacitor.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-black text-white text-xs">الأوامر لنظام iOS:</h5>
                <div className="relative p-3.5 rounded-2xl bg-slate-950 font-mono text-xs text-slate-200 border border-slate-800 text-left ltr space-y-1">
                  <div className="text-slate-500"># تثبيت حزمة iOS وبناء المشروع</div>
                  <div className="text-sky-400">npm install @capacitor/ios</div>
                  <div className="text-sky-400">npm run build</div>
                  <div className="text-sky-400">npx cap add ios</div>
                  <div className="text-sky-400">npx cap open ios</div>
                </div>
                <p className="text-xs text-slate-400">
                  * ملاحظة: بناء ورفع تطبيقات iOS يتطلب جهاز ماك (Mac) وبرنامج Xcode لرفع الملف إلى App Store Connect.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleCopy(privacyPolicyText, 'privacy')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                >
                  {copiedKey === 'privacy' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'privacy' ? 'تم نسخ النص!' : 'نسخ سياسة الخصوصية'}</span>
                </button>
                <span className="text-xs text-slate-400">مطلوبة رسمياً لمتجر قوقل بلاي وآبل</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto">
                {privacyPolicyText}
              </div>
            </div>
          )}

          {/* TAB 5: STORE LISTING */}
          {activeTab === 'listing' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleCopy(storeListingText, 'listing')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                >
                  {copiedKey === 'listing' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'listing' ? 'تم نسخ النص!' : 'نسخ وصف المتجر'}</span>
                </button>
                <span className="text-xs text-slate-400">العنوان والوصف التسويقي الجذاب</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto">
                {storeListingText}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
          <span className="text-xs text-slate-400">
            تطبيقك جاهز بالكامل ليكون فخر إنجازك في متجر التطبيقات 🌟
          </span>
        </div>
      </div>
    </div>
  );
};
