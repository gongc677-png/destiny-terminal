import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZHANG_JUE } from '../algorithms/xiaoliuren';

const ELEMENT_COLORS = { 木: '#5b9a6b', 火: '#c95a4a', 金: '#d4b86a', 水: '#4a80b4', 土: '#c9983e' };
const FORTUNE_COLORS = { 吉: '#5b9a6b', 平: '#c9983e', 凶: '#c95a4a' };

export default function XiaoLiuRenCard({ data }) {
  if (!data) return null;
  const { result, path, inputs } = data;
  const finalIdx = path[2];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-[#1e2746] bg-[#151b30] rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8a6d3b] to-transparent opacity-60" />
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-lg text-[#c9a358] tracking-[0.15em]">小六壬 · 即时速断</CardTitle>
          <p className="text-xs text-[#787a8a]">
            农历{inputs.lunarMonth}月{inputs.lunarDay}日 · {inputs.shichenName}
          </p>
        </CardHeader>
        <CardContent>
          {/* 轮盘 */}
          <div className="relative w-[280px] h-[280px] mx-auto mb-6">
            <motion.div className="absolute inset-[-20px] rounded-full border border-[#c9a358]/10"
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
                  className={`absolute w-[60px] h-[60px] rounded-full border flex flex-col items-center justify-center text-[10px]
                    ${isPath ? 'border-[#3d4058] bg-[#1a1e36]' : 'border-[#1e2746] bg-[#0f1424]'}
                    ${isActive ? '!border-2' : ''}`}
                  style={{
                    left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    borderColor: isActive ? FORTUNE_COLORS[zj.fortune] : undefined,
                    boxShadow: isActive ? `0 0 16px ${FORTUNE_COLORS[zj.fortune]}33, inset 0 0 8px ${FORTUNE_COLORS[zj.fortune]}0d` : undefined,
                  }}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.05, type: 'spring', stiffness: 200 }}
                >
                  <span className="text-[13px] font-bold text-[#e6ddca]">{zj.name}</span>
                  <span className="text-[9px] mt-0.5" style={{ color: ELEMENT_COLORS[zj.element] }}>{zj.element}·{zj.fortune}</span>
                </motion.div>
              );
            })}
            {/* 中心 */}
            <motion.div
              className="absolute left-1/2 top-1/2 w-[68px] h-[68px] rounded-full border-2 bg-[#151b30] flex flex-col items-center justify-center"
              style={{ transform: 'translate(-50%, -50%)', borderColor: FORTUNE_COLORS[result.fortune] }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
            >
              <span className="text-[15px] font-bold" style={{ color: FORTUNE_COLORS[result.fortune] }}>{result.name}</span>
              <span className="text-[9px] text-[#787a8a]">{result.element}·{result.fortune}</span>
            </motion.div>
          </div>

          {/* 释义 */}
          <motion.div
            className="p-3.5 border-l-3 bg-[#0f1424] rounded-r-xl text-xs text-[#787a8a] leading-relaxed"
            style={{ borderLeftColor: FORTUNE_COLORS[result.fortune], borderLeftWidth: 3 }}
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
