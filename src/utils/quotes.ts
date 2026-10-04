export interface MotivationalQuote {
  quote: string;
  author: string;
  theme: string;
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    quote: "أنت تستطيع! رحلة الألف ميل تبدأ بخطوة، والـ 90 يوماً كفيلة بصنع شخصية جديدة تماماً.",
    author: "أنت تستطيع",
    theme: "البدايات والإرادة"
  },
  {
    quote: "الالتزام هو الجسر بين أهدافك وإنجازاتك اليومية، شعلتك تزداد توهجاً كلما تمسكت بوعدك لنفسك.",
    author: "حكمة الإصرار",
    theme: "الالتزام"
  },
  {
    quote: "لا تنتظر المزاج المناسب؛ الانضباط يبدأ عندما تنفذ ما عليك فعله حتى لو شعرت بالتكاسل.",
    author: "قانون العادات",
    theme: "الانضباط"
  },
  {
    quote: "أنت لست ما تقوله، بل ما تفعله يومياً بتكرار. الـ 90 يوماً تصنع المعجزات إن صدقت العزيمة.",
    author: "تطوير الذات",
    theme: "صناعة المستقبل"
  },
  {
    quote: "تذكر دائماً لماذا بدأت؛ الهدف الأساسي ينتظرك عند خط النهاية في اليوم الـ 90.",
    author: "بوصلة النجاح",
    theme: "التركيز على الهدف"
  },
  {
    quote: "الشعلة التي توقدها اليوم بحرصك على مهامك ستنير طريق نجاحك غداً. لا تدع الشعلة تنطفئ!",
    author: "شعلة الستريك",
    theme: "الاستمرارية"
  },
  {
    quote: "النجاح الصغير المتكرر يومياً يُحدث تحولاً هائلاً في نهاية الشهر. استمر، أنت أقوى مما تظن!",
    author: "الأثر التراكمي",
    theme: "التراكم الإيجابي"
  },
  {
    quote: "كل يوم تلتزم فيه هو رسالة احترام لنفسك ولمستقبلك. أنت تستطيع بلا شك!",
    author: "ثقة بالنفس",
    theme: "الثقة"
  }
];

export function getDailyQuote(dayNumber: number): MotivationalQuote {
  const index = Math.abs(dayNumber - 1) % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[index];
}
