import { ZHANG_JUE } from '../algorithms/xiaoliuren';

const ELEMENT_COLORS = { 木: '#4caf50', 火: '#f44336', 金: '#ffc107', 水: '#2196f3', 土: '#ff9800' };
const FORTUNE_COLORS = { 吉: '#4caf50', 平: '#ff9800', 凶: '#f44336' };

export default function XiaoLiuRenCard({ data }) {
  if (!data) return null;
  const { result, path, inputs } = data;
  const finalIdx = path[2];

  return (
    <div className="card xlr-card">
      <h2 className="card-title">小六壬 · 即时速断</h2>
      <p className="card-sub">
        农历{inputs.lunarMonth}月{inputs.lunarDay}日 · {inputs.shichenName}
      </p>

      {/* 掌诀轮盘 */}
      <div className="xlr-wheel">
        {ZHANG_JUE.map((zj, i) => {
          const isActive = i === finalIdx;
          const isPath = path.includes(i);
          const angle = (i * 60 - 90) * Math.PI / 180;
          const radius = 130;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <div key={i}
              className={`xlr-node ${isActive ? 'active' : ''} ${isPath ? 'path' : ''}`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                borderColor: isActive ? FORTUNE_COLORS[zj.fortune] : 'transparent',
              }}
            >
              <span className="xlr-node-name">{zj.name}</span>
              <span className="xlr-node-element" style={{ color: ELEMENT_COLORS[zj.element] }}>
                {zj.element}·{zj.fortune}
              </span>
            </div>
          );
        })}
        {/* 中心结果 */}
        <div className="xlr-center" style={{ borderColor: FORTUNE_COLORS[result.fortune] }}>
          <span className="xlr-result-name" style={{ color: FORTUNE_COLORS[result.fortune] }}>
            {result.name}
          </span>
          <span className="xlr-result-element">{result.element}·{result.fortune}</span>
        </div>
      </div>

      {/* 释义 */}
      <div className="xlr-meaning" style={{ borderLeftColor: FORTUNE_COLORS[result.fortune] }}>
        {result.desc}
      </div>
    </div>
  );
}
