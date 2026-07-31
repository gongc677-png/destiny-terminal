import { motion } from 'framer-motion';

const colorMap = {
  木: 'var(--color-wood)',
  火: 'var(--color-fire)',
  土: 'var(--color-earth)',
  金: 'var(--color-metal)',
  水: 'var(--color-water)',
};

const elementNature = {
  木: '曲直',
  火: '炎上',
  土: '稼穑',
  金: '从革',
  水: '润下',
};

const pillarContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const pillarItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function BaziCard({ bazi }) {
  if (!bazi) return null;
  const { pillars, wuxingCount, dayMaster, zodiac, daYun, lunarInfo } = bazi;
  const maxWx = Math.max(...Object.values(wuxingCount), 1);
  const lunarText = lunarInfo
    ? `农历${lunarInfo.yearChinese}年 ${lunarInfo.monthChinese}月${lunarInfo.dayChinese}`
    : '';

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-10 md:mt-12"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-base tracking-[0.2em] md:text-lg">命盘</h2>
        <span className="mini-label">
          <span className="oracle">命</span>
          <span className="oracle">盤</span>
        </span>
      </div>
      <div className="hairline my-3 md:my-4" />

      <p className="font-serif text-sm leading-loose text-muted-foreground md:text-base">
        日主 <span className="text-foreground">{dayMaster}</span>
        <span className="mx-2 text-star-faint">·</span>
        生肖 {zodiac}
        {lunarText && (
          <>
            <span className="mx-2 text-star-faint">·</span>
            {lunarText}
          </>
        )}
      </p>

      {/* 四柱 */}
      <motion.div
        variants={pillarContainer}
        initial="hidden"
        animate="show"
        className="mt-7 grid grid-cols-4 border-b border-border md:mt-9"
      >
        {pillars.map((p, i) => (
          <motion.div
            key={i}
            variants={pillarItem}
            className="border-l border-border px-1 pb-6 pt-5 text-center first:border-l-0 md:px-2"
          >
            <div className="mini-label tracking-[0.25em]!">{p.name}</div>
            <div className="mt-4 font-serif text-[1.8rem] leading-none md:text-[2.3rem]">
              {p.stem}
            </div>
            <div className="mt-2 font-serif text-[1.8rem] leading-none md:text-[2.3rem]">
              {p.branch}
            </div>
            <div className="mt-4 text-[11px] text-muted-foreground md:text-xs">{p.shiShen}</div>
            <div
              className="mx-auto mt-2 inline-flex items-center gap-1.5 text-[9px] tracking-[0.15em] md:text-[10px]"
              style={{ color: colorMap[p.element] }}
            >
              <span
                className="inline-block size-1 rounded-full"
                style={{ backgroundColor: colorMap[p.element] }}
              />
              {p.element} · {p.yinYang}
            </div>
            <div className="mx-auto mt-3 h-px w-5 bg-border" />
            <div className="mt-2 text-[10px] leading-relaxed text-muted-foreground md:text-[11px]">
              {p.hiddenStems && p.hiddenStems.length > 0 ? (
                <>
                  <span className="text-star-faint">藏</span> {p.hiddenStems.join(' ')}
                </>
              ) : (
                '—'
              )}
            </div>
            {p.xunKong && (
              <div className="mt-1 text-[9px] text-destructive/80 md:text-[10px]">
                旬空 {p.xunKong}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      <p className="mt-3 text-center text-[10px] tracking-[0.15em] text-star-faint md:text-[11px]">
        {pillars
          .map((p, i) => `${p.name[0]}命 ${p.nayin || '—'}`)
          .join('　·　')}
      </p>

      {/* 五行分布 */}
      <div className="mt-9 md:mt-11">
        <div className="flex items-baseline justify-between">
          <h3 className="font-serif text-sm tracking-[0.2em] md:text-base">五行分布</h3>
          <span className="mini-label">
            <span className="oracle">五</span>
            <span className="oracle">行</span>
          </span>
        </div>
        <div className="mt-4 md:mt-5">
          {Object.entries(wuxingCount).map(([k, v]) => (
            <div
              key={k}
              className="flex items-baseline gap-3 border-b border-border py-3 last:border-b-0 md:gap-4 md:py-3.5"
            >
              <span className="w-6 font-serif text-lg md:text-xl" style={{ color: colorMap[k] }}>
                {k}
              </span>
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground md:text-[11px]">
                {elementNature[k]}
              </span>
              <div className="relative h-px flex-1 bg-border">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-current"
                  style={{ color: colorMap[k] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(v / maxWx) * 100}%` }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                />
              </div>
              <span className="w-6 text-right font-latin text-base tabular-nums md:text-lg">
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 大运 */}
      {daYun && (
        <div className="mt-9 md:mt-11">
          <div className="flex items-baseline justify-between">
            <h3 className="font-serif text-sm tracking-[0.2em] md:text-base">大运</h3>
            <span className="mini-label">
              <span className="oracle">大</span>
              <span>运</span>
            </span>
          </div>
          <p className="mt-3 text-[11px] tracking-[0.1em] text-muted-foreground md:text-xs">
            {daYun.forward ? '顺排' : '逆排'} · {daYun.startAge} 岁起运
            {daYun.startYear
              ? ` · ${daYun.startYear} 年 ${daYun.startMonth} 月 ${daYun.startDay} 日交运`
              : ''}
          </p>
          <div className="mt-4 grid grid-cols-2 border-l border-t border-border md:mt-5 sm:grid-cols-4">
            {daYun.steps.map((step, i) => (
              <div
                key={i}
                className="border-b border-r border-border px-3 py-3.5 md:px-4 md:py-4"
              >
                <div className="mini-label text-[9px]! tracking-[0.2em]! md:text-[10px]!">
                  {step.startAge}–{step.endAge} 岁
                </div>
                <div className="mt-1.5 font-serif text-base md:text-lg">{step.ganZhi}</div>
                <div className="mt-0.5 text-[9px] text-star-faint md:text-[10px]">
                  {step.nayin}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
