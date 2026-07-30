import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export default function InputForm({ onCalculate }) {
  const now = new Date();
  const [year, setYear] = useState(2000);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(12);
  const [isMale, setIsMale] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({ year, month, day, hour, isMale });
  };

  const fillCurrent = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
    setDay(now.getDate());
    setHour(now.getHours());
  };

  const fields = [
    { label: '出生年份', value: year, set: setYear, min: 1900, max: 2100 },
    { label: '月份', value: month, set: (v) => setMonth(Math.min(12, Math.max(1, v))), min: 1, max: 12 },
    { label: '日期', value: day, set: (v) => setDay(Math.min(31, Math.max(1, v))), min: 1, max: 31 },
    { label: '时辰(0-23�?', value: hour, set: (v) => setHour(Math.min(23, Math.max(0, v))), min: 0, max: 23 },
  ];

  return (
    <motion.form onSubmit={handleSubmit}
      className="mb-5 rounded-2xl border border-border bg-card p-4 md:p-6 responsive-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        {fields.map((f, i) => (
          <div key={i} className="flex flex-col gap-1.5 md:gap-2">
            <label className="text-[11px] md:text-[12px] text-muted-foreground tracking-widest font-medium">{f.label}</label>
            <Input type="number" value={f.value} onChange={(e) => f.set(+e.target.value)} min={f.min} max={f.max}
              className="bg-input border-border text-foreground h-11 md:h-12 rounded-lg focus-visible:ring-accent/20 transition-all duration-200 placeholder:text-star-faint/50" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex gap-1 md:gap-2">
          <button type="button" onClick={() => setIsMale(true)}
            className={cn('px-4 md:px-6 py-2 rounded-lg text-sm md:text-base border transition-all duration-200',
              isMale ? 'bg-accent text-accent-foreground border-gold shadow-[0_2px_8px_rgba(201,163,88,0.2)]' : 'bg-input text-muted-foreground border-border hover:border-accent')}>
            �?
          </button>
          <button type="button" onClick={() => setIsMale(false)}
            className={cn('px-4 md:px-6 py-2 rounded-lg text-sm md:text-base border transition-all duration-200',
              !isMale ? 'bg-accent text-accent-foreground border-gold shadow-[0_2px_8px_rgba(201,163,88,0.2)]' : 'bg-input text-muted-foreground border-border hover:border-accent')}>
            �?
          </button>
        </div>
        <button type="button" onClick={fillCurrent}
          className="text-xs md:text-sm text-muted-foreground border border-border rounded-lg px-3 md:px-4 py-2 hover:border-accent hover:text-foreground transition-all duration-200 flex items-center gap-1 md:gap-2">
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          填入当前
        </button>
      </div>

      <Button type="submit"
        className="w-full h-12 md:h-14 bg-gradient-to-r from-accent to-[#5a4822] hover:from-gold hover:to-accent text-accent-foreground font-semibold tracking-[0.2em] text-base md:text-lg rounded-xl shadow-[0_4px_24px_rgba(201,163,88,0.15)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
        <Sparkles data-icon="inline-start" className="w-4 h-4 md:w-5 md:h-5" /> 排盘
      </Button>
    </motion.form>
  );
}
