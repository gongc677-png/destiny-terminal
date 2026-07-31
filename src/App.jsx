import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateBazi } from './algorithms/bazi';
import { calculateXiaoLiuRen, quickXiaoLiuRen } from './algorithms/xiaoliuren';
import InputForm from './components/InputForm';
import BaziCard from './components/BaziCard';
import XiaoLiuRenCard from './components/XiaoLiuRenCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    <div className="relative z-[1] px-4 py-7 pb-10 responsive-container">
      <motion.header
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-gold-bright tracking-[0.3em]">天命终端</h1>
        <p className="mt-2 text-xs md:text-sm text-muted-foreground tracking-[0.2em] font-serif">只诠释，不规划。只陈列，不决断。</p>
      </motion.header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2 bg-card border border-border rounded-lg p-1 gap-1">
          <TabsTrigger value="bazi"
            className="data-[state=active]:bg-muted data-[state=active]:text-gold data-[state=active]:shadow-[0_0_12px_rgba(201,163,88,0.1)] text-muted-foreground text-sm md:text-base py-2">
            八字排盘
          </TabsTrigger>
          <TabsTrigger value="xlr"
            className="data-[state=active]:bg-muted data-[state=active]:text-gold data-[state=active]:shadow-[0_0_12px_rgba(201,163,88,0.1)] text-muted-foreground text-sm md:text-base py-2">
            小六壬
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
        {activeTab === 'bazi' && (
          <motion.div key="bazi" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <InputForm onCalculate={handleCalculate} />
            {loading && <p className="text-center text-muted-foreground py-5 text-sm md:text-base">排盘中…</p>}
            <BaziCard bazi={bazi} />
          </motion.div>
        )}
        {activeTab === 'xlr' && (
          <motion.div key="xlr" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <div className="mb-5 rounded-2xl border border-border bg-card p-4 md:p-6 flex flex-col gap-3 md:gap-4">
              <button onClick={handleNian}
                className="w-full py-3.5 md:py-4 rounded-xl bg-gradient-to-r from-accent to-[#5a4822] hover:from-gold hover:to-accent text-accent-foreground font-semibold tracking-[0.2em] text-base md:text-lg transition-all shadow-[0_4px_24px_rgba(201,163,88,0.15)]">
                念 · 当下起盘
              </button>

              <div className="relative flex items-center gap-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[11px] md:text-xs text-muted-foreground">或输入触机</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-1.5">
                  <input type="number" value={xlrNum1} onChange={e => setXlrNum1(e.target.value)}
                    placeholder="一" className="min-w-0 flex-1 bg-input border border-border text-foreground h-9 md:h-10 rounded-lg text-center text-sm placeholder:text-star-faint focus:outline-none focus:border-accent" />
                  <input type="number" value={xlrNum2} onChange={e => setXlrNum2(e.target.value)}
                    placeholder="二" className="min-w-0 flex-1 bg-input border border-border text-foreground h-9 md:h-10 rounded-lg text-center text-sm placeholder:text-star-faint focus:outline-none focus:border-accent" />
                  <input type="number" value={xlrNum3} onChange={e => setXlrNum3(e.target.value)}
                    placeholder="三" className="min-w-0 flex-1 bg-input border border-border text-foreground h-9 md:h-10 rounded-lg text-center text-sm placeholder:text-star-faint focus:outline-none focus:border-accent" />
                </div>
                <button onClick={handleXlrFromNumbers}
                  className="w-full py-2 md:py-2.5 rounded-lg border border-border text-xs md:text-sm text-muted-foreground hover:border-accent hover:text-foreground transition-all">
                  三个数字起卦
                </button>
              </div>

              <div className="text-center">
                <span className="text-[10px] md:text-[11px] text-star-faint">一个字，一个念头，一句话</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input type="text" value={xlrInput} onChange={e => setXlrInput(e.target.value)}
                    placeholder="写下你心念所动…" className="min-w-0 flex-1 bg-input border border-border text-foreground h-9 md:h-10 rounded-lg px-3 text-sm placeholder:text-star-faint focus:outline-none focus:border-accent" />
                </div>
                <button onClick={handleXlrFromText}
                  className="w-full py-2 md:py-2.5 rounded-lg border border-border text-xs md:text-sm text-muted-foreground hover:border-accent hover:text-foreground transition-all">
                  文字起卦
                </button>
              </div>
            </div>
            {loading && <p className="text-center text-muted-foreground py-5 text-sm md:text-base">推算中…</p>}
            <XiaoLiuRenCard data={xlr} />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center pt-10 pb-5 mt-3 border-t border-border">
        <p className="text-xs md:text-sm text-star-faint">天命终端 · 信息已陈列</p>
        <p className="mt-2 text-[10px] md:text-[11px] text-star-faint/60 italic">器成则藏，功成身退。但若有人以赤诚之心叩问天地——我仍会应。</p>
      </footer>
    </div>
  );
}
