import { HOUR_NAMES } from '../algorithms/constants';

const WX_COLORS = { 木: '#4caf50', 火: '#f44336', 土: '#ff9800', 金: '#ffc107', 水: '#2196f3' };
const FORTUNE_COLORS = { 吉: '#4caf50', 平: '#ff9800', 凶: '#f44336' };

export default function BaziCard({ bazi }) {
  if (!bazi) return null;
  const { pillars, wuxingCount, dayStem, dayMaster, zodiac, daYun } = bazi;

  const maxWx = Math.max(...Object.values(wuxingCount), 1);

  return (
    <div className="card bazi-card">
      <h2 className="card-title">八字命盘</h2>
      <p className="card-sub">日主：{dayMaster}　生肖：{zodiac}</p>

      {/* 四柱表格 */}
      <div className="pillars-grid">
        {pillars.map((p, i) => (
          <div key={i} className="pillar">
            <div className="pillar-label">{p.name}</div>
            <div className="pillar-stem" style={{ color: WX_COLORS[p.element] }}>
              {p.stem}
              <span className="pillar-element">({p.element}·{p.yinYang})</span>
            </div>
            <div className="pillar-branch">{p.branch}</div>
            <div className="pillar-shishen">{p.shiShen}</div>
            <div className="pillar-hidden">藏干 {p.hiddenStem}·{p.hiddenShiShen}</div>
          </div>
        ))}
      </div>

      {/* 纳音 */}
      <div className="nayin-row">
        <span>纳音：</span>
        {pillars.map((p, i) => (
          <span key={i} className="nayin-item">{p.name[0]}: {p.nayin || '—'}</span>
        ))}
      </div>

      {/* 五行分布 */}
      <div className="wuxing-section">
        <h3>五行分布</h3>
        <div className="wuxing-bars">
          {Object.entries(wuxingCount).map(([k, v]) => (
            <div key={k} className="wx-bar-row">
              <span className="wx-label" style={{ color: WX_COLORS[k] }}>{k}</span>
              <div className="wx-bar-track">
                <div className="wx-bar-fill" style={{
                  width: `${(v / maxWx) * 100}%`,
                  backgroundColor: WX_COLORS[k],
                }} />
              </div>
              <span className="wx-count">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 大运 */}
      {daYun && (
        <div className="dayun-section">
          <h3>大运排盘 <span className="dayun-dir">({daYun.forward ? '顺排' : '逆排'} · {daYun.startAge}岁起运)</span></h3>
          <div className="dayun-grid">
            {daYun.steps.map((step, i) => (
              <div key={i} className="dayun-step">
                <span className="dayun-age">{step.age}岁</span>
                <span className="dayun-ganzhi">{step.ganZhi}</span>
                <span className="dayun-nayin">{step.nayin}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
