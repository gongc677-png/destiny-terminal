import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const fadeIn = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

export default function BaziCard({ bazi }) {
  if (!bazi) return null;
  const { pillars, wuxingCount, dayMaster, zodiac, daYun } = bazi;
  const maxWx = Math.max(...Object.values(wuxingCount), 1);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-border bg-card rounded-2xl relative overflow-hidden responsive-container">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="font-serif text-lg md:text-xl text-gold tracking-[0.15em]">å…«å­—å‘½ç›˜</CardTitle>
          <CardDescription className="text-muted-foreground text-sm md:text-base">
            æ—¥ä¸»£º{dayMaster}¡¢ç”Ÿè‚–£º{zodiac}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:gap-6">
          {/* å››æŸ± */}
          <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3" variants={stagger} initial="initial" animate="animate">
            {pillars.map((p, i) => (
              <motion.div key={i} variants={fadeIn}
                className="text-center py-3 px-0.5 border border-border rounded-xl bg-muted hover:border-accent transition-all duration-200 hover:shadow-lg hover:scale-105">
                <div className="text-[9px] md:text-[10px] text-star-faint tracking-widest mb-1 md:mb-2">{p.name}</div>
                <div className="text-lg md:text-xl font-bold" style={{ color: p.element === 'æœ?' ? 'var(--color-wood)' : p.element === 'ç?' ? 'var(--color-fire)' : p.element === 'åœ?' ? 'var(--color-earth)' : p.element === 'é‡?' ? 'var(--color-metal)' : 'var(--color-water)' }}>
                  {p.stem}
                  <span className="block text-[8px] md:text-[9px] font-normal text-muted-foreground">({p.element}Â·{p.yinYang})</span>
                </div>
                <div className="text-base md:text-lg font-semibold text-foreground mt-0.5">{p.branch}</div>
                <Badge variant="secondary" className="mt-1 md:mt-1.5 text-[9px] md:text-[10px] bg-accent/20 text-gold border-accent/30">
                  {p.shiShen}
                </Badge>
                <div className="text-[8px] md:text-[9px] text-star-faint mt-1">è—å¹² {p.hiddenStem}Â·{p.hiddenShiShen}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* çº³éŸ³ */}
          <div className="text-[10px] md:text-[11px] text-star-faint flex flex-wrap gap-x-2 md:gap-x-3">
            <span>çº³éŸ³£º</span>
            {pillars.map((p, i) => (
              <span key={i} className="text-muted-foreground">{p.name[0]}:{p.nayin || 'â€?'}</span>
            ))}
          </div>

          <Separator className="bg-border" />

          {/* äº”è¡Œåˆ†å¸ƒ */}
          <div>
            <h3 className="font-serif text-base md:text-sm text-gold tracking-[0.15em] mb-3 md:mb-4">äº”è¡Œåˆ†å¸ƒ</h3>
            <div className="flex flex-col gap-2.5 md:gap-3">
              {Object.entries(wuxingCount).map(([k, v]) => {
                const colorMap = { 'æœ?': 'var(--color-wood)', 'ç?': 'var(--color-fire)', 'åœ?': 'var(--color-earth)', 'é‡?': 'var(--color-metal)', 'æ°?': 'var(--color-water)' };
                return (
                  <div key={k} className="flex items-center gap-2.5 md:gap-3">
                    <span className="w-4 md:w-5 text-base md:text-lg" style={{ color: colorMap[k] }}>{k}</span>
                    <div className="flex-1 h-2 md:h-2.5 bg-input rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full relative"
                        style={{ backgroundColor: colorMap[k] }}
                        initial={{ width: 0 }}
                        animate={{ width: ${(v / maxWx) * 100}% }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/5 md:translate-x-1/4 size-1.5 md:size-2 rounded-full bg-current opacity-70 shadow-[0_0_8px_currentColor]" />
                      </motion.div>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground w-4 md:w-6 text-right">{v}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* å¤§è¿ */}
          {daYun && (
            <div>
              <h3 className="font-serif text-base md:text-sm text-gold tracking-[0.15em] mb-3 md:mb-4">
                å¤§è¿æ’ç›˜{' '}
                <span className="text-[11px] md:text-[12px] text-muted-foreground font-sans">
                  ({daYun.forward ? 'é¡ºæ’' : 'é€†æ’'} Â· {daYun.startAge}å²èµ·è¿?)
                </span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 md:gap-2">
                {daYun.steps.map((step, i) => (
                  <div key={i} className="text-center py-2 md:py-2.5 border border-border rounded-lg bg-muted hover:border-accent transition-all duration-200 hover:shadow-lg hover:scale-105">
                    <span className="block text-[9px] md:text-[10px] text-star-f">{step.age}å²?</span>
                    <span className="block text-[12px] md:text-[13px] font-semibold text-foreground">{step.ganZhi}</span>
                    <span className="block text-[8px] md:text-[9px] text-star-f">{step.nayin}</span>
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
