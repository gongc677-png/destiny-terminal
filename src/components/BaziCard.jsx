import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WX_COLORS = { '木': '#5b9a6b', '火': '#c95a4a', '土': '#c9983e', '金': '#d4b86a', '水': '#4a80b4' };

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const fadeIn = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

export default function BaziCard({ bazi }) {
  if (!bazi) return null;
  const { pillars, wuxingCount, dayMaster, zodiac, daYun } = bazi;
  const maxWx = Math.max(...Object.values(wuxingCount), 1);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-[#1e2746] bg-[#151b30] rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8a6d3b] to-transparent opacity-60" />
        <CardHeader className="pb-2">
          <CardTitle className="font-serif text-lg text-[#c9a358] tracking-[0.15em]">八字命盘</CardTitle>
          <p className="text-xs text-[#787a8a]">日主：{dayMaster}　生肖：{zodiac}</p>
        </CardHeader>
        <CardContent>
          {/* 四柱 */}
          <motion.div className="grid grid-cols-4 gap-2 mb-4" variants={stagger} initial="initial" animate="animate">
            {pillars.map((p, i) => (
              <motion.div key={i} variants={fadeIn}
                className="text-center py-3 px-0.5 border border-[#1e2746] rounded-xl bg-[#0f1424] hover:border-[#8a6d3b] transition-colors">
                <div className="text-[10px] text-[#3d4058] tracking-widest mb-2">{p.name}</div>
                <div className="text-xl font-bold" style={{ color: WX_COLORS[p.element] }}>{p.stem}
                  <span className="block text-[9px] font-normal text-[#787a8a]">({p.element}·{p.yinYang})</span>
                </div>
                <div className="text-base font-semibold text-[#e6ddca] mt-0.5">{p.branch}</div>
                <div className="text-[11px] text-[#8a6d3b] mt-1">{p.shiShen}</div>
                <div className="text-[9px] text-[#3d4058] mt-0.5">藏干 {p.hiddenStem}·{p.hiddenShiShen}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* 纳音 */}
          <div className="text-[11px] text-[#3d4058] mb-5 flex flex-wrap gap-x-3">
            <span>纳音：</span>
            {pillars.map((p, i) => (
              <span key={i} className="text-[#787a8a]">{p.name[0]}:{p.nayin || '—'}</span>
            ))}
          </div>

          {/* 五行分布 */}
          <div className="mb-2">
            <h3 className="font-serif text-sm text-[#c9a358] tracking-[0.15em] mb-4">五行分布</h3>
            <div className="flex flex-col gap-2.5">
              {Object.entries(wuxingCount).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2.5">
                  <span className="w-5 text-base" style={{ color: WX_COLORS[k] }}>{k}</span>
                  <div className="flex-1 h-1.5 bg-[#0f1424] rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full relative"
                      style={{ backgroundColor: WX_COLORS[k] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(v / maxWx) * 100}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-1.5 h-1.5 rounded-full bg-current opacity-70 shadow-[0_0_6px_currentColor]" />
                    </motion.div>
                  </div>
                  <span className="text-xs text-[#787a8a] w-4 text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 大运 */}
          {daYun && (
            <div className="mt-6">
              <h3 className="font-serif text-sm text-[#c9a358] tracking-[0.15em] mb-3">
                大运排盘 <span className="text-[11px] text-[#787a8a] font-sans">({daYun.forward ? '顺排' : '逆排'} · {daYun.startAge}岁起运)</span>
              </h3>
              <div className="grid grid-cols-4 gap-1.5">
                {daYun.steps.map((step, i) => (
                  <div key={i} className="text-center py-2.5 border border-[#1e2746] rounded-lg bg-[#0f1424] hover:border-[#8a6d3b] transition-colors">
                    <span className="block text-[10px] text-[#3d4058]">{step.age}岁</span>
                    <span className="block text-[13px] font-semibold text-[#e6ddca]">{step.ganZhi}</span>
                    <span className="block text-[9px] text-[#3d4058]">{step.nayin}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
