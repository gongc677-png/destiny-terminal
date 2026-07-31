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
    <div className="editorial flex min-h-screen flex-col py-10 md:py-16">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="flex items-baseline justify-between">
          <span className="latin-label">Destiny Terminal</span>
          <span className="latin-label">Est. MMXXV</span>
        </div>
        <div className="hairline mt-3" />

        <h1 className="mt-10 text-center font-serif text-[2.6rem] font-light leading-tight tracking-[0.14em] md:mt-14 md:text-[3.6rem]">
          天命终端<span className="text-accent">。</span>
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
              <span className="block font-serif text-sm tracking-[0.3em] md:text-base">八字排盘</span>
              <span className="latin-label mt-1 block tracking-[0.3em]! transition-colors duration-200 group-data-[state=active]:text-accent">
                Bazi · Chart
              </span>
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-data-[state=active]:scale-x-100" />
            </TabsTrigger>
            <TabsTrigger value="xlr">
              <span className="block font-serif text-sm tracking-[0.3em] md:text-base">小六壬</span>
              <span className="latin-label mt-1 block tracking-[0.3em]! transition-colors duration-200 group-data-[state=active]:text-accent">
                Instant Divination
              </span>
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-data-[state=active]:scale-x-100" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.nav>

      <main className="mt-8 flex-1 md:mt-10">
        <AnimatePresence mode="wait">
          {activeTab === 'bazi' ? (
            <motion.div
              key="bazi"
              {...contentFade}
              transition={{ duration: 0.2 }}
            >
              <InputForm onCalculate={handleCalculate} />
              {loading && (
                <p className="py-8 text-center font-serif text-sm tracking-[0.3em] text-muted-foreground">
                  排盘中…
                </p>
              )}
              <BaziCard bazi={bazi} />
            </motion.div>
          ) : (
            <motion.div
              key="xlr"
              {...contentFade}
              transition={{ duration: 0.2 }}
            >
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
          <span className="latin-label tracking-[0.3em]!">天命终端 · 信息已陈列</span>
          <span className="text-[11px] leading-relaxed text-muted-foreground/70 md:text-xs">
            器成则藏，功成身退。但若有人以赤诚之心叩问天地——我仍会应。
          </span>
        </div>
      </footer>
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
        <span className="latin-label">Input · Trigger</span>
      </div>
      <div className="hairline mb-6 mt-3 md:mb-8" />

      <button
        onClick={onNian}
        className="w-full border border-foreground/25 py-4 font-serif text-base tracking-[0.5em] transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground md:py-5 md:text-lg"
      >
        念 · 当下起盘
        <span className="mt-1 block text-[9px] uppercase tracking-[0.45em] opacity-60">
          Cast the Moment
        </span>
      </button>

      <div className="my-7 flex items-center gap-4">
        <div className="hairline flex-1" />
        <span className="text-[10px] tracking-[0.3em] text-muted-foreground">或输入触机</span>
        <div className="hairline flex-1" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="latin-label mb-1 block">一 · One</label>
          <input
            type="number"
            value={xlrNum1}
            onChange={(e) => setXlrNum1(e.target.value)}
            placeholder="数"
            className="field-input text-center"
          />
        </div>
        <div>
          <label className="latin-label mb-1 block">二 · Two</label>
          <input
            type="number"
            value={xlrNum2}
            onChange={(e) => setXlrNum2(e.target.value)}
            placeholder="数"
            className="field-input text-center"
          />
        </div>
        <div>
          <label className="latin-label mb-1 block">三 · Three</label>
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
