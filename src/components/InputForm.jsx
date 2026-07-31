import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export default function InputForm({ onCalculate }) {
  const now = new Date();
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(12);
  const [isMale, setIsMale] = useState(true);

  const yearNum = parseInt(year, 10);
  const daysInMonth = yearNum >= 1900 && yearNum <= 2100
    ? new Date(yearNum, month, 0).getDate()
    : 31;
  const safeDay = Math.min(day, daysInMonth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!yearNum || yearNum < 1900 || yearNum > 2100) {
      setYear(String(now.getFullYear()));
      onCalculate({ year: now.getFullYear(), month, day: safeDay, hour, isMale });
      return;
    }
    onCalculate({ year: yearNum, month, day: safeDay, hour, isMale });
  };

  const fillCurrent = () => {
    setYear(String(now.getFullYear()));
    setMonth(now.getMonth() + 1);
    setDay(now.getDate());
    setHour(now.getHours());
  };

  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const dayOptions = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const shichenNames = ['子时','丑时','寅时','卯时','辰时','巳时','午时','未时','申时','酉时','戌时','亥时'];

  const selectClass = 'bg-input border-border text-foreground h-11 md:h-12 rounded-lg px-2 md:px-3 w-full focus:outline-none focus:border-accent transition-all duration-200 appearance-none cursor-pointer';
  const selectLabel = 'text-[11px] md:text-xs text-muted-foreground tracking-widest font-medium mb-1.5';

  return (
    <motion.form onSubmit={handleSubmit}
      className="mb-5 rounded-2xl border border-border bg-card p-4 md:p-6 responsive-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="flex flex-col">
          <label className={selectLabel}>出生年份</label>
          <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} min={1900} max={2100}
            placeholder="如 1990"
            className="bg-input border-border text-foreground h-11 md:h-12 rounded-lg focus-visible:ring-accent/20 transition-all duration-200" />
        </div>

        <div className="flex flex-col">
          <label className={selectLabel}>月份</label>
          <select value={month} onChange={(e) => setMonth(+e.target.value)} className={selectClass}>
            {monthOptions.map((m) => (
              <option key={m} value={m}>{m}月</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className={selectLabel}>日期</label>
          <select value={safeDay} onChange={(e) => setDay(+e.target.value)} className={selectClass}>
            {dayOptions.map((d) => (
              <option key={d} value={d}>{d}日</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className={selectLabel}>时辰</label>
          <select value={hour} onChange={(e) => setHour(+e.target.value)} className={selectClass}>
            {hourOptions.map((h) => (
              <option key={h} value={h}>{String(h).padStart(2, '0')}:00 · {shichenNames[Math.floor(((h + 1) % 24) / 2)]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex gap-1">
          <button type="button" onClick={() => setIsMale(true)}
            className={cn('px-4 md:px-6 py-2 rounded-lg text-sm md:text-base border transition-all duration-200',
              isMale ? 'bg-accent text-accent-foreground border-gold shadow-[0_2px_8px_rgba(201,163,88,0.2)]' : 'bg-input text-muted-foreground border-border hover:border-accent')}>
            男
          </button>
          <button type="button" onClick={() => setIsMale(false)}
            className={cn('px-4 md:px-6 py-2 rounded-lg text-sm md:text-base border transition-all duration-200',
              !isMale ? 'bg-accent text-accent-foreground border-gold shadow-[0_2px_8px_rgba(201,163,88,0.2)]' : 'bg-input text-muted-foreground border-border hover:border-accent')}>
            女
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
