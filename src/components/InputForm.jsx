import { useState } from 'react';

export default function InputForm({ onCalculate }) {
  const now = new Date();
  const [year, setYear] = useState(2000);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(12);
  const [isMale, setIsMale] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({ year, month, day, hour, isMale });
  };

  const fillCurrent = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
    setDay(now.getDate());
    setHour(now.getHours());
  };

  const daysInMonth = new Date(year, month, 0).getDate();

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <div className="form-grid">
        <div className="field">
          <label>出生年份</label>
          <input type="number" value={year} onChange={e => setYear(+e.target.value)}
            min={1900} max={2100} />
        </div>
        <div className="field">
          <label>月份</label>
          <input type="number" value={month} onChange={e => setMonth(Math.min(12, Math.max(1, +e.target.value)))}
            min={1} max={12} />
        </div>
        <div className="field">
          <label>日期</label>
          <input type="number" value={day} onChange={e => setDay(Math.min(daysInMonth, Math.max(1, +e.target.value)))}
            min={1} max={31} />
        </div>
        <div className="field">
          <label>时辰 (0-23点)</label>
          <input type="number" value={hour} onChange={e => setHour(Math.min(23, Math.max(0, +e.target.value)))}
            min={0} max={23} />
        </div>
      </div>
      <div className="form-row">
        <div className="gender-toggle">
          <button type="button" className={isMale ? 'active' : ''} onClick={() => setIsMale(true)}>男</button>
          <button type="button" className={!isMale ? 'active' : ''} onClick={() => setIsMale(false)}>女</button>
        </div>
        <button type="button" className="btn-ghost" onClick={fillCurrent}>填入当前时间</button>
      </div>
      <button type="submit" className="btn-primary">排盘</button>
    </form>
  );
}
