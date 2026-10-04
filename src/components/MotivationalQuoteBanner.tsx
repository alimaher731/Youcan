import React, { useState } from 'react';
import { Sparkles, RefreshCw, Quote } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../utils/quotes';

interface MotivationalQuoteBannerProps {
  dayNumber: number;
}

export const MotivationalQuoteBanner: React.FC<MotivationalQuoteBannerProps> = ({ dayNumber }) => {
  const [quoteIndex, setQuoteIndex] = useState(Math.abs(dayNumber - 1) % MOTIVATIONAL_QUOTES.length);

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-orange-950/30 border border-amber-500/20 p-4 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mt-0.5">
            <Quote className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>جرعة تحفيز لليوم {dayNumber}</span>
              </span>
              <span className="text-[10px] text-slate-500">·</span>
              <span className="text-[10px] text-slate-400">{currentQuote.theme}</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-relaxed italic">
              "{currentQuote.quote}"
            </p>
          </div>
        </div>

        <button
          onClick={handleNextQuote}
          title="حكمة أخرى"
          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 transition-colors cursor-pointer flex-shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
