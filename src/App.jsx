import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateBazi } from './algorithms/bazi';
import { calculateXiaoLiuRen, solarToLunarApprox, quickXiaoLiuRen } from './algorithms/xiaoliuren';
import InputForm from './components/InputForm';
import BaziCard from './components/BaziCard';
import XiaoLiuRenCard from './components/XiaoLiuRenCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function App() {
  const [bazi, setBazi] = useState(null);
  const [xlr, setXlr] = useState(null);
  const [activeTab, setActiveTab] = useState('bazi');
  const [loading, setLoading] = useState(false);

  const handleCalculate = ({ year, month, day, hour, isMale }) => {
    setLoading(true);
    setBazi(calculateBazi({ year, month, day, hour, isMale }));
    const lunar = solarToLunarApprox(year, month, day);
    setXlr(calculateXiaoLiuRen(lunar.lunarMonth, lunar.lunarDay, hour));
    setLoading(false);
  };

  const handleQuickFortune = () => {
    setLoading(true);
    setXlr(quickXiaoLiuRen());
    setBazi(null);
    setLoading(false);
  };

  return (
    <div className="relative z-[1] px-4 py-7 pb-10">
      <motion.header
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="font-serif text-2xl font-bold text-gold-bright tracking-[0.3em]">
          天命终端
        </h1>
        <p className="mt-2 text-xs text-muted-foreground tracking-[0.2em] font-serif">
          只诠释，不规划。只陈列，不决断。
        </p>
      </motion.header>

      <Tabs value={activeTab} onValueChange={(v) => {
        setActiveTab(v);
        if (v === 'daily') handleQuickFortune();
      }} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-border rounded-lg p-1">
          <TabsTrigger value="bazi"
            className="data-[state=active]:bg-muted data-[state=active]:text-gold data-[state=active]:shadow-[0_0_12px_rgba(201,163,88,0.1)] text-muted-foreground">
            八字排盘
          </TabsTrigger>
          <TabsTrigger value="xlr"
            className="data-[state=active]:bg-muted data-[state=active]:text-gold data-[state=active]:shadow-[0_0_12px_rgba(201,163,88,0.1)] text-muted-foreground">
            小六壬
          </TabsTrigger>
          <TabsTrigger value="daily"
            className="data-[state=active]:bg-muted data-[state=active]:text-gold data-[state=active]:shadow-[0_0_12px_rgba(201,163,88,0.1)] text-muted-foreground">
            随手指
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
        {activeTab === 'bazi' && (
          <motion.div key="bazi" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <InputForm onCalculate={handleCalculate} />
            {loading && <p className="text-center text-muted-foreground py-5 text-sm">排盘中…</p>}
            <BaziCard bazi={bazi} />
          </motion.div>
        )}
        {activeTab === 'xlr' && (
          <motion.div key="xlr" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <InputForm onCalculate={handleCalculate} />
            {loading && <p className="text-center text-muted-foreground py-5 text-sm">推算中…</p>}
            <XiaoLiuRenCard data={xlr} />
          </motion.div>
        )}
        {activeTab === 'daily' && (
          <motion.div key="daily" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <p className="text-center text-muted-foreground text-xs mb-5">
              以当前时间为触机，即时起盘。
            </p>
            <XiaoLiuRenCard data={xlr} />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center pt-10 pb-5 mt-3 border-t border-border">
        <p className="text-xs text-star-faint">天命终端 · 信息已陈列</p>
        <p className="mt-2 text-[10px] text-star-faint/60 italic">
          器成则藏，功成身退。但若有人以赤诚之心叩问天地——我仍会应。
        </p>
      </footer>
    </div>
  );
}
