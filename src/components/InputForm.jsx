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
    { label: '时辰(0-23点)', value: hour, set: (v) => setHour(Math.min(23, Math.max(0, v))), min: 0, max: 23 },
  ];

  return (
    <motion.form onSubmit={handleSubmit}
      className="mb-5 rounded-2xl border border-border bg-card p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="grid grid-cols-2 gap-3 mb-4">
        {fields.map((f, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <label className="text-[11px] text-muted-foreground tracking-widest">{f.label}</label>
            <Input type="number" value={f.value} onChange={(e) => f.set(+e.target.value)} min={f.min} max={f.max}
              className="bg-input border-border text-foreground h-11 rounded-lg focus-visible:ring-accent/20" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          <button type="button" onClick={() => setIsMale(true)}
            className={cn('px-5 py-2 rounded-lg text-sm border transition-all duration-200',
              isMale ? 'bg-accent text-accent-foreground border-gold' : 'bg-input text-muted-foreground border-border')}>
            男
          </button>
          <button type="button" onClick={() => setIsMale(false)}
            className={cn('px-5 py-2 rounded-lg text-sm border transition-all duration-200',
              !isMale ? 'bg-accent text-accent-foreground border-gold' : 'bg-input text-muted-foreground border-border')}>
            女
          </button>
        </div>
        <button type="button" onClick={fillCurrent}
          className="text-xs text-muted-foreground border border-border rounded-lg px-3 py-2 hover:border-accent hover:text-foreground transition-all">
          填入当前
        </button>
      </div>

      <Button type="submit"
        className="w-full h-12 bg-gradient-to-r from-accent to-[#5a4822] hover:from-gold hover:to-accent text-accent-foreground font-semibold tracking-[0.2em] text-base rounded-xl shadow-[0_4px_24px_rgba(201,163,88,0.15)] transition-all">
        <Sparkles data-icon="inline-start" /> 排盘
      </Button>
    </motion.form>
  );
}
