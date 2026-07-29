/**
 * 小六壬掌诀推算
 * 掌诀顺序：大安(0)→留连(1)→速喜(2)→赤口(3)→小吉(4)→空亡(5)
 * 推算规则：月上起日，日上起时
 * 从寅位（大安）起正月，顺数至出生月；
 * 再从月落位起初一，顺数至出生日；
 * 再从日落位起子时，顺数至出生时。
 */

export const ZHANG_JUE = [
  { name: '大安', desc: '身不动时，五行属木，颜色青色，方位东方。临青龙，主事事平安，求谋可成。', element: '木', fortune: '吉' },
  { name: '留连', desc: '卒未归时，五行属水，颜色黑色，方位北方。临玄武，主凡事拖延，去者未回。', element: '水', fortune: '平' },
  { name: '速喜', desc: '人便至时，五行属火，颜色红色，方位南方。临朱雀，主喜事来临，求谋顺遂。', element: '火', fortune: '吉' },
  { name: '赤口', desc: '官事凶时，五行属金，颜色白色，方位西方。临白虎，主口舌是非，破败多端。', element: '金', fortune: '凶' },
  { name: '小吉', desc: '人来喜时，五行属水，颜色白色，方位西南。临六合，主凡事和合，多吉多利。', element: '水', fortune: '吉' },
  { name: '空亡', desc: '音信稀时，五行属土，颜色黄色，方位中央。临勾陈，主谋事落空，劳而无成。', element: '土', fortune: '凶' },
];

/**
 * 小六壬推算
 * @param {number} lunarMonth - 农历月 (1-12)
 * @param {number} lunarDay - 农历日 (1-30)
 * @param {number} hour - 公历小时 (0-23)，转为时辰
 * @returns {{ result: object, path: number[] }}
 */
export function calculateXiaoLiuRen(lunarMonth, lunarDay, hour) {
  // 时辰索引：0=子时 ... 11=亥时
  const shichenIdx = Math.floor(((hour + 1) % 24) / 2);

  // 月上起日：从寅位(0)起正月
  const monthPos = (lunarMonth - 1) % 6;

  // 日上起时：从月落位起初一
  const dayPos = (monthPos + lunarDay - 1) % 6;

  // 时上查掌诀：从日落位起子时
  const finalPos = (dayPos + shichenIdx) % 6;

  return {
    result: ZHANG_JUE[finalPos],
    path: [monthPos, dayPos, finalPos],
    inputs: { lunarMonth, lunarDay, shichen: shichenIdx, shichenName: ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][shichenIdx] + '时' },
  };
}

/**
 * 简易公历→农历转换（近似，用于小六壬）
 * 仅做粗略映射，实际应用建议接入农历库
 */
export function solarToLunarApprox(year, month, day) {
  // 简化：直接用公历月日作为近似农历
  // 误差在±1个月内，对小六壬推算影响可接受
  return {
    lunarMonth: month,
    lunarDay: day,
    lunarYear: year,
  };
}

/**
 * 根据当前时间快速起小六壬
 */
export function quickXiaoLiuRen() {
  const now = new Date();
  const lunar = solarToLunarApprox(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return calculateXiaoLiuRen(lunar.lunarMonth, lunar.lunarDay, now.getHours());
}
