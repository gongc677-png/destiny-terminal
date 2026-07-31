import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateBazi } from './algorithms/bazi_core';
import { calculateXiaoLiuRen, quickXiaoLiuRen } from './algorithms/xiaoliuren';
import InputForm from './components/InputForm';
import BaziCard from './components/BaziCard';
import XiaoLiuRenCard from './components/XiaoLiuRenCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const contentFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// 暗纹浮雕纹理（feTurbulence + feDiffuseLighting 立体光照）
const TEX_URI = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480">
  <filter id="rel">
    <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" stitchTiles="stitch" result="n"/>
    <feDiffuseLighting in="n" surfaceScale="6" diffuseConstant="0.9" lighting-color="#c9a358">
      <feDistantLight azimuth="45" elevation="60"/>
    </feDiffuseLighting>
  </filter>
  <rect width="480" height="480" filter="url(#rel)"/>
</svg>`
)}`;

function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 暗纹浮雕 · 高斯模糊 */}
      <div
        className="absolute -inset-[4%] opacity-[0.8] blur-[1px] mix-blend-soft-light"
        style={{ backgroundImage: `url("${TEX_URI}")`, backgroundSize: '480px 480px' }}
      />
      {/* 鎏金雕嵌 · 自然盘绕 */}
      <svg
        className="gold-wind absolute inset-0 h-full w-full opacity-[0.28]"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6b542c" stopOpacity="0" />
            <stop offset="0.22" stopColor="#9c7f46" />
            <stop offset="0.5" stopColor="#c9a358" />
            <stop offset="0.78" stopColor="#9c7f46" />
            <stop offset="1" stopColor="#6b542c" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#goldLine)">
          <path
            d="M-60,640 C140,540 260,720 430,630 C600,540 660,450 830,520 C1000,590 1120,680 1300,600 C1400,560 1470,575 1520,605"
            strokeWidth="1.6"
            opacity="0.9"
          />
          <path
            d="M-60,700 C170,620 300,780 470,700 C640,620 710,540 870,610 C1030,680 1150,740 1330,670 C1430,635 1490,650 1520,680"
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d="M-60,580 C150,490 280,660 450,580 C620,500 690,420 860,490 C1030,560 1130,640 1310,560"
            strokeWidth="0.7"
            opacity="0.45"
          />
          <path d="M240,540 c22,-20 44,-20 66,0 c22,20 44,20 66,0" strokeWidth="1.1" opacity="0.6" />
          <path d="M700,470 c18,-16 36,-16 54,0 c18,16 36,16 54,0" strokeWidth="1" opacity="0.5" />
          <path d="M1180,640 c24,-22 48,-22 72,0 c24,22 48,22 72,0" strokeWidth="1.1" opacity="0.6" />
          <path d="M420,760 c16,-14 32,-14 48,0 c16,14 32,14 48,0" strokeWidth="0.9" opacity="0.45" />
          <path d="M60,470 c14,-12 28,-12 42,0 c14,12 28,12 42,0" strokeWidth="0.9" opacity="0.4" />
          <path d="M620,880 C820,780 940,960 1110,870 C1280,780 1350,690 1520,760" strokeWidth="1.4" opacity="0.7" />
          <path d="M700,820 c20,-18 40,-18 60,0 c20,18 40,18 60,0" strokeWidth="1" opacity="0.5" />
        </g>
      </svg>
      {/* 渐晕，让内容区沉在暗纹里 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 100% at 50% 18%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  );
}

export default function App() {
  const [bazi, setBazi] = useState(null);
  const [xlr, setXlr] = useState(null);
  const [activeTab, setActiveTab] = useState('bazi');
  const [loading, setLoading] = useState(false);
  const [xlrInput, setXlrInput] = useState('');
  const [xlrNum1, setXlrNum1] = useState('');
  const [xlrNum2, setXlrNum2] = useState('');
  const [xlrNum3, setXlrNum3] = useState('');

  const handleCalculate = ({ year, month, day, hour, isMale }) => {
    setLoading(true);
    setBazi(calculateBazi({ year, month, day, hour, isMale }));
    setLoading(false);
  };

  const handleNian = () => {
    setLoading(true);
    setXlr(quickXiaoLiuRen());
    setLoading(false);
  };

  const handleXlrFromNumbers = () => {
    const n1 = parseInt(xlrNum1) || 1;
    const n2 = parseInt(xlrNum2) || 1;
    const n3 = parseInt(xlrNum3) || 1;
    setLoading(true);
    setXlr(calculateXiaoLiuRen(n1, n2, n3));
    setLoading(false);
  };

  const handleXlrFromText = () => {
    if (!xlrInput.trim()) return;
    let sum = 0;
    for (let i = 0; i < xlrInput.length; i++) sum += xlrInput.charCodeAt(i);
    const n1 = (sum % 12) + 1;
    const n2 = ((sum * 7) % 30) + 1;
    const n3 = (sum * 13) % 12;
    setLoading(true);
    setXlr(calculateXiaoLiuRen(n1, n2, n3));
    setLoading(false);
  };

  return (
    <div className="relative">
      <AmbientBackground />
      <div className="editorial relative z-[1] flex min-h-screen flex-col py-10 md:py-16">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="flex items-baseline justify-between">
            <span className="oracle text-[13px] tracking-[0.35em] text-muted-foreground md:text-sm">
              天命
            </span>
            <span className="font-serif text-[10px] tracking-[0.35em] text-muted-foreground md:text-[11px]">
              始於貳零貳伍
            </span>
          </div>
          <div className="hairline mt-3" />

          <h1 className="mt-10 text-center font-serif text-[2.6rem] font-light leading-tight tracking-[0.14em] md:mt-14 md:text-[3.6rem]">
            天命終端<span className="text-accent">。</span>
          </h1>
          <p className="mt-4 text-center font-serif text-xs tracking-[0.32em] text-muted-foreground md:text-sm">
            只诠释，不规划。只陈列，不决断。
          </p>
        </motion.header>

        <motion.nav
          className="mt-10 md:mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="bazi">
                <span className="block font-serif text-sm tracking-[0.3em] md:text-base">
                  八字排盘
                </span>
                <span className="mini-label mt-1 block tracking-[0.3em]! transition-colors duration-200 group-data-[state=active]:text-accent">
                  <span className="oracle">八</span>
                  <span className="oracle">字</span>
                </span>
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-data-[state=active]:scale-x-100" />
              </TabsTrigger>
              <TabsTrigger value="xlr">
                <span className="block font-serif text-sm tracking-[0.3em] md:text-base">
                  小六壬
                </span>
                <span className="mini-label mt-1 block tracking-[0.3em]! transition-colors duration-200 group-data-[state=active]:text-accent">
                  <span className="oracle">六</span>
                  <span className="oracle">壬</span>
                </span>
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-data-[state=active]:scale-x-100" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.nav>

        <main className="mt-8 flex-1 md:mt-10">
          <AnimatePresence mode="wait">
            {activeTab === 'bazi' ? (
              <motion.div key="bazi" {...contentFade} transition={{ duration: 0.2 }}>
                <InputForm onCalculate={handleCalculate} />
                {loading && (
                  <p className="py-8 text-center font-serif text-sm tracking-[0.3em] text-muted-foreground">
                    排盘中…
                  </p>
                )}
                <BaziCard bazi={bazi} />
              </motion.div>
            ) : (
              <motion.div key="xlr" {...contentFade} transition={{ duration: 0.2 }}>
                <XiaoLiuRenInputs
                  xlrNum1={xlrNum1}
                  xlrNum2={xlrNum2}
                  xlrNum3={xlrNum3}
                  xlrInput={xlrInput}
                  setXlrNum1={setXlrNum1}
                  setXlrNum2={setXlrNum2}
                  setXlrNum3={setXlrNum3}
                  setXlrInput={setXlrInput}
                  onNian={handleNian}
                  onNumbers={handleXlrFromNumbers}
                  onText={handleXlrFromText}
                />
                {loading && (
                  <p className="py-8 text-center font-serif text-sm tracking-[0.3em] text-muted-foreground">
                    推算中…
                  </p>
                )}
                <XiaoLiuRenCard data={xlr} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-14 md:mt-20">
          <div className="hairline" />
          <div className="flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:justify-between">
            <span className="mini-label tracking-[0.3em]!">
              <span className="oracle">天命</span>
              <span>終端 · 信息已陈列</span>
            </span>
            <span className="text-[11px] leading-relaxed text-muted-foreground/70 md:text-xs">
              器成则藏，功成身退。但若有人以赤诚之心叩问天地——我仍会应。
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function XiaoLiuRenInputs({
  xlrNum1,
  xlrNum2,
  xlrNum3,
  xlrInput,
  setXlrNum1,
  setXlrNum2,
  setXlrNum3,
  setXlrInput,
  onNian,
  onNumbers,
  onText,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-base tracking-[0.2em] md:text-lg">输入触机</h2>
        <span className="mini-label">
          <span className="oracle">卜</span>
          <span>触机</span>
        </span>
      </div>
      <div className="hairline mb-6 mt-3 md:mb-8" />

      <button
        onClick={onNian}
        className="w-full border border-foreground/25 py-4 font-serif text-base tracking-[0.5em] transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground md:py-5 md:text-lg"
      >
        念 · 当下起盘
        <span className="mt-1 block text-[9px] tracking-[0.45em] opacity-60">
          <span className="oracle">念</span> · 当下
        </span>
      </button>

      <div className="my-7 flex items-center gap-4">
        <div className="hairline flex-1" />
        <span className="text-[10px] tracking-[0.3em] text-muted-foreground">或输入触机</span>
        <div className="hairline flex-1" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mini-label mb-1 block text-center">
            <span className="oracle">一</span>
          </label>
          <input
            type="number"
            value={xlrNum1}
            onChange={(e) => setXlrNum1(e.target.value)}
            placeholder="数"
            className="field-input text-center"
          />
        </div>
        <div>
          <label className="mini-label mb-1 block text-center">
            <span className="oracle">二</span>
          </label>
          <input
            type="number"
            value={xlrNum2}
            onChange={(e) => setXlrNum2(e.target.value)}
            placeholder="数"
            className="field-input text-center"
          />
        </div>
        <div>
          <label className="mini-label mb-1 block text-center">
            <span className="oracle">三</span>
          </label>
          <input
            type="number"
            value={xlrNum3}
            onChange={(e) => setXlrNum3(e.target.value)}
            placeholder="数"
            className="field-input text-center"
          />
        </div>
      </div>
      <button
        onClick={onNumbers}
        className="mt-5 w-full border border-border py-3 text-xs tracking-[0.35em] text-muted-foreground transition-colors duration-300 hover:border-accent hover:text-foreground md:text-sm"
      >
        三个数字起卦
      </button>

      <p className="mt-8 text-center text-[10px] tracking-[0.25em] text-star-faint">
        一个字，一个念头，一句话
      </p>
      <div className="mt-3">
        <input
          type="text"
          value={xlrInput}
          onChange={(e) => setXlrInput(e.target.value)}
          placeholder="写下你心念所动…"
          className="field-input text-center"
        />
      </div>
      <button
        onClick={onText}
        className="mt-5 w-full border border-border py-3 text-xs tracking-[0.35em] text-muted-foreground transition-colors duration-300 hover:border-accent hover:text-foreground md:text-sm"
      >
        文字起卦
      </button>
    </motion.section>
  );
}
