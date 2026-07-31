import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZHANG_JUE } from '../algorithms/xiaoliuren';

// 二十四山：十二地支 + 八天干（戊己居中不入盘）+ 四维卦，每山 15°
const SHAN_24 = [
  '子', '癸', '丑', '艮', '寅', '甲', '卯', '乙',
  '辰', '巽', '巳', '丙', '午', '丁', '未', '坤',
  '申', '庚', '酉', '辛', '戌', '乾', '亥', '壬',
];

// 后天八卦方位（坎北、艮东北、震东、巽东南、离南、坤西南、兑西、乾西北）
const POST_HEAVEN = [
  { sym: '☵', name: '坎', deg: 0 },
  { sym: '☶', name: '艮', deg: 45 },
  { sym: '☳', name: '震', deg: 90 },
  { sym: '☴', name: '巽', deg: 135 },
  { sym: '☲', name: '离', deg: 180 },
  { sym: '☷', name: '坤', deg: 225 },
  { sym: '☱', name: '兑', deg: 270 },
  { sym: '☰', name: '乾', deg: 315 },
];

const FORTUNE_COLORS = {
  吉: 'var(--color-wood)',
  平: 'var(--color-earth)',
  凶: 'var(--color-fire)',
};

const ELEMENT_COLORS = {
  木: 'var(--color-wood)',
  火: 'var(--color-fire)',
  土: 'var(--color-earth)',
  金: 'var(--color-metal)',
  水: 'var(--color-water)',
};

// 角位置：deg 0°=正北(顶部)，顺时针；r 为容器半径百分比
function polar(deg, r) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    left: `${50 + r * Math.cos(rad)}%`,
    top: `${50 + r * Math.sin(rad)}%`,
  };
}

function Taiji() {
  return (
    <svg viewBox="0 0 200 200" className="taiji-spin h-full w-full">
      <defs>
        <clipPath id="taiClip">
          <circle cx="100" cy="100" r="96" />
        </clipPath>
      </defs>
      <g clipPath="url(#taiClip)">
        <circle cx="100" cy="100" r="96" fill="#e8e0cc" />
        <path d="M100,4 A96,96 0 0 0 100,196 Z" fill="#0d0b08" />
        <circle cx="100" cy="52" r="48" fill="#e8e0cc" />
        <circle cx="100" cy="148" r="48" fill="#0d0b08" />
        <circle cx="100" cy="52" r="16" fill="#0d0b08" />
        <circle cx="100" cy="148" r="16" fill="#e8e0cc" />
      </g>
      <circle
        cx="100"
        cy="100"
        r="96"
        fill="none"
        stroke="rgba(201,163,88,0.6)"
        strokeWidth="3"
      />
    </svg>
  );
}

export default function XiaoLiuRenCard({ data }) {
  const [spinning, setSpinning] = useState(false);
  const [innerSpin, setInnerSpin] = useState(0); // 六壬宫盘累计转角
  const [outerSpin, setOuterSpin] = useState(0); // 八卦层累计转角

  useEffect(() => {
    if (!data) return;
    setSpinning(true);
    const resultIdx = data.path[2];
    // 结果宫中心对齐顶部指针：逆时针补 (idx*60+30)，再整圈 1080°
    setInnerSpin((prev) => prev + 1080 - (resultIdx * 60 + 30));
    setOuterSpin((prev) => prev + 720);
    const t = setTimeout(() => setSpinning(false), 2400);
    return () => clearTimeout(t);
  }, [data]);

  if (!data) return null;
  const { result, inputs } = data;

  const dateText = inputs.monthChinese
    ? `农历${inputs.monthChinese}月${inputs.dayChinese} · ${inputs.shichenName}`
    : `农历${inputs.lunarMonth}月${inputs.lunarDay}日 · ${inputs.shichenName}`;

  const resultColor = FORTUNE_COLORS[result.fortune] || 'var(--color-foreground)';
  const resultElementColor = ELEMENT_COLORS[result.element] || resultColor;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-10 md:mt-12"
    >
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-base tracking-[0.2em] md:text-lg">小六壬 · 式盘速断</h2>
        <span className="mini-label">
          <span className="oracle">卜</span>
          <span>速断</span>
        </span>
      </div>
      <div className="hairline my-3 md:my-4" />

      <p className="font-serif text-sm leading-loose text-muted-foreground md:text-base">
        {dateText}
      </p>

      {/* ── 八卦罗盘 ── */}
      <div className="relative mx-auto mt-8 size-[260px] sm:size-[300px] md:size-[340px]">
        {/* 外圈光晕 */}
        <div
          className="absolute -inset-5 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(201,163,88,0.14) 0%, rgba(0,0,0,0) 65%)',
          }}
        />

        {/* 刻度环 */}
        <div className="absolute inset-0 rounded-full border border-border/80" />
        {Array.from({ length: 72 }).map((_, i) => {
          const major = i % 3 === 0;
          const deg = i * 5;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-0 h-full w-px origin-center"
              style={{ transform: `rotate(${deg}deg)` }}
            >
              <div
                className="absolute left-1/2 top-[3%] h-[3%] w-px -translate-x-1/2 bg-border"
                style={{ opacity: major ? 0.8 : 0.35 }}
              />
            </div>
          );
        })}

        {/* 二十四山 */}
        {SHAN_24.map((s, i) => {
          const pos = polar(i * 15, 0.9);
          return (
            <span
              key={s}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-[9px] text-gold-dim md:text-[11px]"
              style={pos}
            >
              {s}
            </span>
          );
        })}

        {/* 内环分界 */}
        <div className="absolute inset-[17%] rounded-full border border-border/50" />
        <div className="absolute inset-[37%] rounded-full border border-border/70" />

        {/* 后天八卦层（起盘时随外环旋转） */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: outerSpin }}
          transition={{ duration: 2.4, ease: [0.16, 0.84, 0.18, 1] }}
        >
          {POST_HEAVEN.map((g) => {
            const pos = polar(g.deg, 0.73);
            return (
              <div
                key={g.name}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                style={pos}
              >
                <div className="text-[15px] leading-none text-gold-bright md:text-lg">{g.sym}</div>
                <div className="mt-0.5 text-[9px] tracking-[0.2em] text-gold-dim md:text-[10px]">
                  {g.name}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* 六壬六宫盘（旋转定位） */}
        <motion.div
          className="absolute inset-[37%] overflow-hidden rounded-full border border-accent/50"
          style={{
            background:
              'repeating-conic-gradient(from 0deg, rgba(201,163,88,0.09) 0deg 60deg, rgba(201,163,88,0.02) 60deg 120deg)',
            boxShadow:
              'inset 0 0 18px rgba(0,0,0,0.85), 0 0 14px rgba(201,163,88,0.12)',
          }}
          animate={{ rotate: innerSpin }}
          transition={{ duration: 2.4, ease: [0.12, 0.82, 0.16, 1] }}
        >
          {/* 宫界细线 */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'repeating-conic-gradient(transparent 0deg 59.2deg, rgba(201,163,88,0.4) 59.2deg 60deg)',
            }}
          />
          {ZHANG_JUE.map((zj, i) => {
            const centerDeg = i * 60 + 30;
            const pos = polar(centerDeg, 0.52);
            return (
              <div
                key={zj.name}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                style={pos}
              >
                <div className="font-serif text-[11px] leading-tight text-foreground/90 md:text-[13px]">
                  {zj.name}
                </div>
                <div
                  className="mt-0.5 text-[8px] md:text-[9px]"
                  style={{ color: ELEMENT_COLORS[zj.element] || 'var(--color-star-faint)' }}
                >
                  {zj.element}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* 停盘后：结果宫高亮（对准顶部指针） */}
        <AnimatePresence>
          {!spinning && data && (
            <motion.div
              className="pointer-events-none absolute inset-[37%] overflow-hidden rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              style={{
                background:
                  'conic-gradient(from -30deg, rgba(224,200,120,0.16) 0deg 60deg, transparent 60deg 360deg)',
              }}
            />
          )}
        </AnimatePresence>

        {/* 扫光 */}
        {spinning && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg 290deg, rgba(224,200,120,0.14) 335deg 360deg, transparent 360deg)',
            }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.15, ease: 'linear' }}
          />
        )}

        {/* 太极 · 恒转 */}
        <div className="absolute left-1/2 top-1/2 size-[23%] -translate-x-1/2 -translate-y-1/2">
          <Taiji />
        </div>

        {/* 指针 */}
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
          <div className="mx-auto h-0 w-0 border-l-[7px] border-r-[7px] border-t-[13px] border-l-transparent border-r-transparent border-t-gold-bright drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] md:border-l-[8px] md:border-r-[8px] md:border-t-[15px]" />
          <div className="mx-auto mt-0.5 size-1.5 rounded-full bg-gold-bright shadow-[0_0_6px_rgba(224,200,120,0.8)]" />
        </div>

        {/* 子午线标记 */}
        <span className="absolute left-1/2 top-[4%] -translate-x-1/2 text-[8px] tracking-[0.2em] text-gold-dim md:text-[9px]">
          子
        </span>
        <span className="absolute left-1/2 top-[92%] -translate-x-1/2 text-[8px] tracking-[0.2em] text-gold-dim md:text-[9px]">
          午
        </span>
      </div>

      {/* 起盘仪轨文案 */}
      <AnimatePresence mode="wait">
        {spinning ? (
          <motion.p
            key="casting"
            className="mt-6 text-center font-serif text-xs tracking-[0.3em] text-muted-foreground md:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            天垂象，见吉凶 · 式盘运转中
          </motion.p>
        ) : (
          <motion.p
            key="ready"
            className="mt-6 text-center font-serif text-xs tracking-[0.3em] text-muted-foreground/80 md:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            卦已成 · 象昭然 · 所行在君
          </motion.p>
        )}
      </AnimatePresence>

      {/* 结果 */}
      <AnimatePresence mode="wait">
        {!spinning && (
          <motion.div
            key="result"
            className="mt-7"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            <div className="flex items-baseline justify-center gap-4">
              <span className="font-serif text-4xl tracking-[0.12em] md:text-5xl">
                {result.name}
              </span>
              <span
                className="text-[11px] tracking-[0.2em] md:text-xs"
                style={{ color: resultColor }}
              >
                {result.element} · {result.fortune}
              </span>
            </div>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2">
              <div className="hairline max-w-16 flex-1" />
              <span
                className="inline-block size-1.5 rounded-full"
                style={{ backgroundColor: resultElementColor }}
              />
              <div className="hairline max-w-16 flex-1" />
            </div>
            <motion.p
              className="mx-auto mt-5 max-w-xl border-l border-border pl-4 font-serif text-sm leading-loose text-muted-foreground md:pl-5 md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {result.desc}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
