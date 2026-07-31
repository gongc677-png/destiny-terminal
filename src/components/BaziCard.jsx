import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const fadeIn = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

export default function BaziCard({ bazi }) {
  if (!bazi) return null;
  const { pillars, wuxingCount, dayMaster, zodiac, daYun, lunarInfo } = bazi;
  const maxWx = Math.max(...Object.values(wuxingCount), 1);
  const lunarText = lunarInfo
    ? `农历${lunarInfo.yearChinese}年 ${lunarInfo.monthChinese}月${lunarInfo.dayChinese}`
    : '';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-border bg-card rounded-2xl relative overflow-hidden responsive-container">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="font-serif text-lg md:text-xl text-gold tracking-[0.15em]">八字命盘</CardTitle>
          <CardDescription className="text-muted-foreground text-sm md:text-base">
            日主：{dayMaster}　生肖：{zodiac}
            {lunarText && <span className="block mt-1 text-xs md:text-sm">{lunarText}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:gap-6">
          {/* 四柱 */}
          <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3" variants={stagger} initial="initial" animate="animate">
            {pillars.map((p, i) => (
              <motion.div key={i} variants={fadeIn}
                className="text-center py-3 px-0.5 border border-border rounded-xl bg-muted hover:border-accent hover:shadow-lg hover:scale-[1.03] transition-all duration-200">
                <div className="text-[9px] md:text-[10px] text-star-faint tracking-widest mb-1 md:mb-2">{p.name}</div>
                <div className="text-lg md:text-xl font-bold text-wood" style={{ color: p.element === '木' ? 'var(--color-wood)' : p.element === '火' ? 'var(--color-fire)' : p.element === '土' ? 'var(--color-earth)' : p.element === '金' ? 'var(--color-metal)' : 'var(--color-water)' }}>
                  {p.stem}
                  <span className="block text-[8px] md:text-[9px] font-normal text-muted-foreground">({p.element}·{p.yinYang})</span>
                </div>
                <div className="text-base md:text-lg font-semibold text-foreground mt-0.5">{p.branch}</div>
                <Badge variant="secondary" className="mt-1 text-[9px] md:text-[10px] bg-accent/20 text-gold border-accent/30">
                  {p.shiShen}
                </Badge>
                <div className="text-[8px] md:text-[9px] text-star-faint mt-1 leading-relaxed">
                  {p.hiddenStems && p.hiddenStems.length > 0 ? (
                    <>
                      <span className="text-muted-foreground">藏干</span>{' '}
                      {p.hiddenStems.join(' ')}
                      <span className="block text-star-faint/80">{p.hiddenShiShens && p.hiddenShiShens.join(' ')}</span>
                    </>
                  ) : (
                    '—'
                  )}
                </div>
                {p.xunKong && (
                  <div className="text-[8px] md:text-[9px] text-destructive/70 mt-0.5">旬空 {p.xunKong}</div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* 纳音 */}
          <div className="text-[10px] md:text-[11px] text-star-faint flex flex-wrap gap-x-2 md:gap-x-3">
            <span>纳音：</span>
            {pillars.map((p, i) => (
              <span key={i} className="text-muted-foreground">{p.name[0]}:{p.nayin || '—'}</span>
            ))}
          </div>

          <Separator className="bg-border" />

          {/* 五行分布 */}
          <div>
            <h3 className="font-serif text-sm md:text-base text-gold tracking-[0.15em] mb-3 md:mb-4">五行分布</h3>
            <div className="flex flex-col gap-2.5 md:gap-3">
              {Object.entries(wuxingCount).map(([k, v]) => {
                const colorMap = { '木': 'var(--color-wood)', '火': 'var(--color-fire)', '土': 'var(--color-earth)', '金': 'var(--color-metal)', '水': 'var(--color-water)' };
                return (
                  <div key={k} className="flex items-center gap-2.5 md:gap-3">
                    <span className="w-4 md:w-5 text-base md:text-lg" style={{ color: colorMap[k] }}>{k}</span>
                    <div className="flex-1 h-2 md:h-2.5 bg-input rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full relative"
                        style={{ backgroundColor: colorMap[k] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(v / maxWx) * 100}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 size-1.5 md:size-2 rounded-full bg-current opacity-70 shadow-[0_0_8px_currentColor]" />
                      </motion.div>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground w-4 md:w-6 text-right">{v}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 大运 */}
          {daYun && (
            <div>
              <h3 className="font-serif text-sm md:text-base text-gold tracking-[0.15em] mb-3 md:mb-4">
                大运排盘{' '}
                <span className="text-[10px] md:text-[11px] text-muted-foreground font-sans">
                  ({daYun.forward ? '顺排' : '逆排'} · {daYun.startAge}岁起运
                  {daYun.startYear ? ` · ${daYun.startYear}年${daYun.startMonth}月${daYun.startDay}日交运` : ''})
                </span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 md:gap-2">
                {daYun.steps.map((step, i) => (
                  <div key={i} className="text-center py-2 md:py-2.5 border border-border rounded-lg bg-muted hover:border-accent hover:shadow-lg hover:scale-[1.03] transition-all duration-200">
                    <span className="block text-[9px] md:text-[10px] text-star-faint">{step.startAge}-{step.endAge}岁</span>
                    <span className="block text-[12px] md:text-[13px] font-semibold text-foreground">{step.ganZhi}</span>
                    <span className="block text-[8px] md:text-[9px] text-star-faint">{step.nayin}</span>
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
