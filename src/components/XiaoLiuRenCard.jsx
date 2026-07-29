import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ZHANG_JUE } from '../algorithms/xiaoliuren';

const ELEMENT_COLORS = { 木: 'var(--color-wood)', 火: 'var(--color-fire)', 金: 'var(--color-metal)', 水: 'var(--color-water)', 土: 'var(--color-earth)' };
const FORTUNE_VARIANTS = { 吉: 'default', 平: 'secondary', 凶: 'destructive' };
const FORTUNE_COLORS = { 吉: '#5b9a6b', 平: '#c9983e', 凶: '#c95a4a' };

export default function XiaoLiuRenCard({ data }) {
  if (!data) return null;
  const { result, path, inputs } = data;
  const finalIdx = path[2];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-border bg-card rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-lg text-gold tracking-[0.15em]">小六壬 · 即时速断</CardTitle>
          <CardDescription className="text-muted-foreground">
            农历{inputs.lunarMonth}月{inputs.lunarDay}日 · {inputs.shichenName}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* 轮盘 */}
          <div className="relative size-[280px] mx-auto">
            <motion.div className="absolute -inset-5 rounded-full border border-gold/10"
              animate={{ borderColor: ['rgba(201,163,88,0.06)', 'rgba(201,163,88,0.15)', 'rgba(201,163,88,0.06)'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {ZHANG_JUE.map((zj, i) => {
              const isActive = i === finalIdx;
              const isPath = path.includes(i);
              const angle = (i * 60 - 90) * Math.PI / 180;
              const r = 130;
              const x = Math.cos(angle) * r;
              const y = Math.sin(angle) * r;
              return (
                <motion.div key={i}
                  className={`absolute size-[60px] rounded-full border flex flex-col items-center justify-center text-[10px] -translate-x-1/2 -translate-y-1/2
                    ${isPath ? 'border-star-faint bg-[#1a1e36]' : 'border-border bg-muted'}
                    ${isActive ? '!border-2' : ''}`}
                  style={{
                    left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`,
                    borderColor: isActive ? FORTUNE_COLORS[zj.fortune] : undefined,
                    boxShadow: isActive ? `0 0 16px ${FORTUNE_COLORS[zj.fortune]}33, inset 0 0 8px ${FORTUNE_COLORS[zj.fortune]}0d` : undefined,
                  }}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.05, type: 'spring', stiffness: 200 }}
                >
                  <span className="text-[13px] font-bold text-foreground">{zj.name}</span>
                  <span className="text-[9px] mt-0.5" style={{ color: ELEMENT_COLORS[zj.element] }}>{zj.element}·{zj.fortune}</span>
                </motion.div>
              );
            })}
            {/* 中心结果 */}
            <motion.div
              className="absolute left-1/2 top-1/2 size-[68px] rounded-full border-2 bg-card flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
              style={{ borderColor: FORTUNE_COLORS[result.fortune] }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
            >
              <span className="text-[15px] font-bold" style={{ color: FORTUNE_COLORS[result.fortune] }}>{result.name}</span>
              <Badge variant={FORTUNE_VARIANTS[result.fortune]} className="text-[9px] mt-0.5">{result.element}·{result.fortune}</Badge>
            </motion.div>
          </div>

          {/* 释义 */}
          <motion.div
            className="p-3.5 bg-muted rounded-r-xl text-xs text-muted-foreground leading-relaxed"
            style={{ borderLeft: `3px solid ${FORTUNE_COLORS[result.fortune]}` }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            {result.desc}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
