import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ZHANG_JUE } from '../algorithms/xiaoliuren';

const BAGUA = ['☰','☷','☳','☴','☵','☲','☶','☱'];

const SECTOR_COLORS = [
  'rgba(91,154,107,0.2)',  // 大安 木
  'rgba(74,128,180,0.2)',  // 留连 水
  'rgba(201,90,74,0.2)',   // 速喜 火
  'rgba(212,184,106,0.2)', // 赤口 金
  'rgba(74,128,180,0.2)',  // 小吉 水
  'rgba(201,152,62,0.2)',  // 空亡 土
];

const FORTUNE_VARIANTS = { 吉: 'default', 平: 'secondary', 凶: 'destructive' };
const FORTUNE_COLORS = { 吉: '#5b9a6b', 平: '#c9983e', 凶: '#c95a4a' };

export default function XiaoLiuRenCard({ data }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!data) return;
    setSpinning(true);
    const resultIdx = data.path[2];
    // Each sector is 60deg, starting from 大安 at 0deg (3 o'clock)
    // Pointer at top (-90deg). We rotate so result sector's center aligns with top.
    const sectorCenter = resultIdx * 60;
    const targetRotation = 90 - sectorCenter; // brings sector to top
    const fullSpins = 3 * 360;
    setRotation(fullSpins + targetRotation);
    const t = setTimeout(() => setSpinning(false), 2000);
    return () => clearTimeout(t);
  }, [data]);

  if (!data) return null;
  const { result, inputs } = data;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-border bg-card rounded-2xl relative overflow-hidden responsive-container">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />
        <CardHeader className="pb-1 md:pb-2">
          <CardTitle className="font-serif text-lg md:text-xl text-gold tracking-[0.15em]">小六壬 · 即时速断</CardTitle>
          <CardDescription className="text-muted-foreground text-sm md:text-base">
            农历{inputs.lunarMonth}月{inputs.lunarDay}日 · {inputs.shichenName}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6 md:gap-8">
          {/* Compass */}
          <div className="relative size-[200px] sm:size-[220px] md:size-[240px] lg:size-[280px] flex items-center justify-center">
            {/* Outer fixed ring with Bagua */}
            <div className="absolute inset-0 rounded-full border-2 border-border" />
            {BAGUA.map((tri, i) => {
              const angle = (i * 45 - 90) * Math.PI / 180;
              const r = 96;
              return (
                <span key={i} className="absolute text-gold/50 text-xs md:text-sm font-serif"
                  style={{
                    left: `calc(50% + ${Math.cos(angle) * r}px)`,
                    top: `calc(50% + ${Math.sin(angle) * r}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}>
                  {tri}
                </span>
              );
            })}

            {/* Spinning disc */}
            <motion.div
              className="relative size-[160px] sm:size-[180px] md:size-[200px] lg:size-[240px] rounded-full overflow-hidden border-2 border-accent/40"
              style={{
                background: `conic-gradient(from -90deg, ${SECTOR_COLORS.join(', ')})`,
              }}
              animate={{ rotate: rotation }}
              transition={spinning
                ? { duration: 2, ease: [0.2, 0.8, 0.2, 1] }
                : { duration: 0 }}
            >
              {/* Sector labels */}
              {ZHANG_JUE.map((zj, i) => {
                const angle = ((i * 60 + 30) - 90) * Math.PI / 180;
                const r = 50;
                return (
                  <div key={i} className="absolute text-center"
                    style={{
                      left: `calc(50% + ${Math.cos(angle) * r}px)`,
                      top: `calc(50% + ${Math.sin(angle) * r}px)`,
                      transform: 'translate(-50%, -50%)',
                    }}>
                    <div className="text-[11px] md:text-[13px] font-bold text-foreground leading-tight">{zj.name}</div>
                  </div>
                );
              })}
              {/* Center circle */}
              <div className="absolute left-1/2 top-1/2 size-8 md:size-10 rounded-full bg-card border-2 border-accent/40 -translate-x-1/2 -translate-y-1/2" />
            </motion.div>

            {/* Pointer at top */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 z-10">
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] md:border-l-[8px] md:border-r-[8px] md:border-t-[14px] border-l-transparent border-r-transparent border-t-gold"
                style={{ filter: 'drop-shadow(0 0 4px rgba(201,163,88,0.5))' }} />
            </div>
          </div>

          {/* Result below compass */}
          <AnimatePresence mode="wait">
            {!spinning && (
              <motion.div
                key="result"
                className="flex flex-col items-center gap-3 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-xl md:text-2xl font-bold" style={{ color: FORTUNE_COLORS[result.fortune] }}>
                    {result.name}
                  </span>
                  <Badge variant={FORTUNE_VARIANTS[result.fortune]} className="text-xs md:text-sm">
                    {result.element}·{result.fortune}
                  </Badge>
                </div>
                <motion.div
                  className="p-3 md:p-4 bg-muted rounded-xl text-xs md:text-sm text-muted-foreground leading-relaxed w-full"
                  style={{ borderLeft: `3px solid ${FORTUNE_COLORS[result.fortune]}` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {result.desc}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
