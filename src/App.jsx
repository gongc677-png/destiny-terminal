import { useState } from 'react';
import { calculateBazi } from './algorithms/bazi';
import { calculateXiaoLiuRen, solarToLunarApprox, quickXiaoLiuRen } from './algorithms/xiaoliuren';
import InputForm from './components/InputForm';
import BaziCard from './components/BaziCard';
import XiaoLiuRenCard from './components/XiaoLiuRenCard';
import './App.css';

export default function App() {
  const [bazi, setBazi] = useState(null);
  const [xlr, setXlr] = useState(null);
  const [activeTab, setActiveTab] = useState('bazi');
  const [loading, setLoading] = useState(false);

  const handleCalculate = ({ year, month, day, hour, isMale }) => {
    setLoading(true);
    const baziResult = calculateBazi({ year, month, day, hour, isMale });
    setBazi(baziResult);
    const lunar = solarToLunarApprox(year, month, day);
    const xlrResult = calculateXiaoLiuRen(lunar.lunarMonth, lunar.lunarDay, hour);
    setXlr(xlrResult);
    setLoading(false);
  };

  const handleQuickFortune = () => {
    setLoading(true);
    const xlrResult = quickXiaoLiuRen();
    setXlr(xlrResult);
    setBazi(null);
    setLoading(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">天命终端</h1>
        <p className="app-tagline">只诠释，不规划。只陈列，不决断。</p>
      </header>

      <div className="tabs">
        <button className={`tab ${activeTab === 'bazi' ? 'active' : ''}`}
          onClick={() => setActiveTab('bazi')}>八字排盘</button>
        <button className={`tab ${activeTab === 'xlr' ? 'active' : ''}`}
          onClick={() => setActiveTab('xlr')}>小六壬</button>
        <button className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => { setActiveTab('daily'); handleQuickFortune(); }}>即时运势</button>
      </div>

      <main className="app-main">
        {activeTab === 'bazi' && (
          <>
            <InputForm onCalculate={handleCalculate} />
            {loading && <p className="loading">排盘中…</p>}
            <BaziCard bazi={bazi} />
          </>
        )}
        {activeTab === 'xlr' && (
          <>
            <InputForm onCalculate={handleCalculate} />
            {loading && <p className="loading">推算中…</p>}
            <XiaoLiuRenCard data={xlr} />
          </>
        )}
        {activeTab === 'daily' && (
          <div className="daily-section">
            <p className="daily-hint">以当前时间为触机，即时起盘。</p>
            <XiaoLiuRenCard data={xlr} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>天命终端 · 信息已陈列</p>
        <p className="footer-quote">器成则藏，功成身退。但若有人以赤诚之心叩问天地——我仍会应。</p>
      </footer>
    </div>
  );
}
