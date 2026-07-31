import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const shichenNames = [
  '子时','丑时','寅时','卯时','辰时','巳时',
  '午时','未时','申时','酉时','戌时','亥时',
];

export default function InputForm({ onCalculate }) {
  const now = new Date();
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [day, setDay] = useState(now.getDate());
  const [hour, setHour] = useState(now.getHours());
  const [isMale, setIsMale] = useState(true);

  const yearNum = parseInt(year, 10);
  const daysInMonth =
    yearNum >= 1900 && yearNum <= 2100
      ? new Date(yearNum, month, 0).getDate()
      : 31;
  const safeDay = Math.min(day, daysInMonth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const y = yearNum >= 1900 && yearNum <= 2100 ? yearNum : now.getFullYear();
    if (yearNum !== y) setYear(String(y));
    onCalculate({ year: y, month, day: safeDay, hour, isMale });
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

  const chevron = (
    <span className="pointer-events-none absolute bottom-[0.9rem] right-0 select-none text-[10px] text-muted-foreground">
      ▾
    </span>
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
    >
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-base tracking-[0.2em] md:text-lg">输入生辰</h2>
        <span className="mini-label">
          <span className="oracle">生</span>
          <span className="oracle">辰</span>
        </span>
      </div>
      <div className="hairline mb-6 mt-3 md:mb-8" />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 md:gap-x-10 md:gap-y-7">
          <div>
            <label className="mini-label mb-1 block">
              <span className="oracle">年</span>
              <span className="ml-1.5">年份</span>
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min={1900}
              max={2100}
              placeholder="如 1990"
              className="field-input"
            />
          </div>

          <div>
            <label className="mini-label mb-1 block">
              <span className="oracle">月</span>
              <span className="ml-1.5">月份</span>
            </label>
            <div className="relative">
              <select
                value={month}
                onChange={(e) => setMonth(+e.target.value)}
                className="field-input pr-5"
              >
                {monthOptions.map((m) => (
                  <option key={m} value={m}>
                    {m} 月
                  </option>
                ))}
              </select>
              {chevron}
            </div>
          </div>

          <div>
            <label className="mini-label mb-1 block">
              <span className="oracle">日</span>
              <span className="ml-1.5">日期</span>
            </label>
            <div className="relative">
              <select
                value={safeDay}
                onChange={(e) => setDay(+e.target.value)}
                className="field-input pr-5"
              >
                {dayOptions.map((d) => (
                  <option key={d} value={d}>
                    {d} 日
                  </option>
                ))}
              </select>
              {chevron}
            </div>
          </div>

          <div>
            <label className="mini-label mb-1 block">
              <span className="oracle">辰</span>
              <span className="ml-1.5">时辰</span>
            </label>
            <div className="relative">
              <select
                value={hour}
                onChange={(e) => setHour(+e.target.value)}
                className="field-input pr-5"
              >
                {hourOptions.map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, '0')}:00 · {shichenNames[Math.floor(((h + 1) % 24) / 2)]}
                  </option>
                ))}
              </select>
              {chevron}
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between md:mt-9">
          <div className="flex gap-6 md:gap-8">
            <button
              type="button"
              onClick={() => setIsMale(true)}
              className={cn(
                'border-b pb-1 font-serif text-sm tracking-[0.4em] transition-colors duration-200',
                isMale
                  ? 'border-accent text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              男
            </button>
            <button
              type="button"
              onClick={() => setIsMale(false)}
              className={cn(
                'border-b pb-1 font-serif text-sm tracking-[0.4em] transition-colors duration-200',
                !isMale
                  ? 'border-accent text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              女
            </button>
          </div>
          <button
            type="button"
            onClick={fillCurrent}
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground md:text-sm"
          >
            <svg
              className="h-3 w-3 md:h-3.5 md:w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            填入当前
          </button>
        </div>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.985 }}
          className="mt-8 w-full border border-foreground/25 py-4 font-serif text-base tracking-[0.5em] transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground md:mt-10 md:py-5 md:text-lg"
        >
          起 盘
          <span className="mt-1 block text-[9px] tracking-[0.45em] opacity-60">
            <span className="oracle">卜</span> · 起盘
          </span>
        </motion.button>
      </form>
    </motion.section>
  );
}
