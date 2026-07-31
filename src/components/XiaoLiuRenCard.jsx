import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZHANG_JUE } from '../algorithms/xiaoliuren';

const BAGUA = ['☰', '☷', '☳', '☴', '☵', '☲', '☶', '☱'];

// 近单色扇区，仅保留极淡的明暗交替
const SECTOR_FILLS = [
  'rgba(255,255,255,0.03)',
  'rgba(255,255,255,0.07)',
  'rgba(255,255,255,0.03)',
  'rgba(255,255,255,0.07)',
  'rgba(255,255,255,0.03)',
  'rgba(255,255,255,0.07)',
];

const FORTUNE_COLORS = { 吉: 'var(--color-wood)', 平: 'var(--color-earth)', 凶: 'var(--color-fire)' };

export default function XiaoLiuRenCard({ data }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!data) return;
    setSpinning(true);
    const resultIdx = data.path[2];
    const sectorCenter = resultIdx * 60;
    const targetRotation = 90 - sectorCenter;
    setRotation(3 * 360 + targetRotation);
    const t = setTimeout(() => setSpinning(false), 2000);
    return () => clearTimeout(t);
  }, [data]);

  if (!data) return null;
  const { result, inputs } = data;

  const dateText = inputs.monthChinese
    ? `农历${inputs.monthChinese}月${inputs.dayChinese} · ${inputs.shichenName}`
    : `农历${inputs.lunarMonth}月${inputs.lunarDay}日 · ${inputs.shichenName}`;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-10 md:mt-12"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-base tracking-[0.2em] md:text-lg">小六壬 · 即时速断</h2>
        <span className="latin-label">Instant Divination</span>
      </div>
      <div className="hairline my-3 md:my-4" />

      <p className="font-serif text-sm leading-loose text-muted-foreground md:text-base">
        {dateText}
      </p>

      {/* 罗盘 */}
      <div className="relative mx-auto mt-8 flex size-[200px] items-center justify-center sm:size-[220px] md:size-[240px]">
        <div className="absolute inset-0 rounded-full border border-border" />
        {BAGUA.map((tri, i) => {
          const angle = ((i * 45 - 90) * Math.PI) / 180;
          const r = 92;
          return (
            <span
              key={i}
              className="absolute font-serif text-xs text-star-faint md:text-sm"
              style={{
                left: `calc(50% + ${Math.cos(angle) * r}px)`,
                top: `calc(50% + ${Math.sin(angle) * r}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {tri}
            </span>
          );
        })}

        <motion.div
          className="relative size-[160px] overflow-hidden rounded-full border border-border sm:size-[180px] md:size-[200px]"
          style={{ background: `conic-gradient(from -90deg, ${SECTOR_FILLS.join(', ')})` }}
          animate={{ rotate: rotation }}
          transition={spinning ? { duration: 2, ease: [0.2, 0.8, 0.2, 1] } : { duration: 0 }}
        >
          {ZHANG_JUE.map((zj, i) => {
            const angle = ((i * 60 + 30 - 90) * Math.PI) / 180;
            const r = 52;
            return (
              <div
                key={i}
                className="absolute text-center"
                style={{
                  left: `calc(50% + ${Math.cos(angle) * r}px)`,
                  top: `calc(50% + ${Math.sin(angle) * r}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="font-serif text-[12px] leading-tight text-foreground/80 md:text-sm">
                  {zj.name}
                </div>
              </div>
            );
          })}
          <div className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background md:size-9" />
        </motion.div>

        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
          <div className="h-0 w-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-accent md:border-l-[7px] md:border-r-[7px] md:border-t-[12px]" />
        </div>
      </div>

      {/* 结果 */}
      <AnimatePresence mode="wait">
        {!spinning && (
          <motion.div
            key="result"
            className="mt-9"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="flex items-baseline gap-4">
              <span className="font-serif text-3xl tracking-[0.1em] md:text-4xl">
                {result.name}
              </span>
              <span
                className="text-[11px] tracking-[0.2em] md:text-xs"
                style={{ color: FORTUNE_COLORS[result.fortune] }}
              >
                {result.element} · {result.fortune}
              </span>
            </div>
            <div className="mt-3 h-px w-full bg-border" />
            <motion.p
              className="mt-5 border-l border-border pl-4 font-serif text-sm leading-loose text-muted-foreground md:pl-5 md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {result.desc}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
