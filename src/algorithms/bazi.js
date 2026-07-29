import {
  STEMS, BRANCHES, ELEMENTS, YIN_YANG, NAYIN, ZODIAC,
  TIGER_DUN, MOUSE_DUN, SOLAR_TERMS, getShiShen,
} from './constants.js';

/**
 * 计算两个日期之间的天数（不含起始日）
 */
function daysBetween(y1, m1, d1, y2, m2, d2) {
  const date1 = new Date(y1, m1 - 1, d1);
  const date2 = new Date(y2, m2 - 1, d2);
  return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
}

/**
 * 获取出生日期对应的月支索引（基于节气）
 * @returns {{ branchIdx: number, branchName: string }} 月支
 */
function getMonthBranch(year, month, day) {
  const dateNum = month * 100 + day;
  for (let i = 0; i < SOLAR_TERMS.length; i++) {
    const st = SOLAR_TERMS[i];
    const stNum = st.m * 100 + st.d;
    const next = SOLAR_TERMS[(i + 1) % 12];
    let nextNum = next.m * 100 + next.d;
    // 处理跨年（丑月→寅月跨年）
    if (next.m < st.m) nextNum += 1200;
    let adjustedDate = dateNum;
    if (st.m > month) adjustedDate += 1200; // 日期在年初，节气在年尾
    if (adjustedDate >= stNum && adjustedDate < nextNum) {
      // SOLAR_TERMS 从寅开始(index 0)，需映射到实际地支索引(寅=2)
      const realBranchIdx = (i + 2) % 12;
      return { branchIdx: realBranchIdx, branchName: BRANCHES[realBranchIdx] };
    }
  }
  // 兜底：按公历月推算（寅=2月对应地支索引2）
  const approxIdx = (month + 1) % 12;
  return { branchIdx: approxIdx, branchName: BRANCHES[approxIdx] };
}

/**
 * 根据小时获取时辰索引 (0=子时)
 */
function getHourBranchIdx(hour) {
  return Math.floor(((hour + 1) % 24) / 2);
}

/**
 * 排八字
 * @param {{ year: number, month: number, day: number, hour: number, isMale: boolean }} birth
 * @returns 八字排盘结果
 */
export function calculateBazi({ year, month, day, hour, isMale = true }) {
  // -- 1. 年柱 --
  const yearStemIdx = (year - 4) % 10;
  const yearBranchIdx = (year - 4) % 12;
  // 立春前归上一年
  let actualYearStemIdx = yearStemIdx;
  let actualYearBranchIdx = yearBranchIdx;
  if (month < 2 || (month === 2 && day < 4)) {
    actualYearStemIdx = (year - 5) % 10;
    actualYearBranchIdx = (year - 5) % 12;
  }
  const actualYearStemIdxPos = ((actualYearStemIdx % 10) + 10) % 10;
  const actualYearBranchIdxPos = ((actualYearBranchIdx % 12) + 12) % 12;

  // -- 2. 月柱 --
  const { branchIdx: monthBranchIdx } = getMonthBranch(year, month, day);
  const monthStemStart = TIGER_DUN[actualYearStemIdxPos];
  const monthStemIdx = (monthStemStart + monthBranchIdx) % 10;

  // -- 3. 日柱 --
  // 基准：1900-01-01 = 甲戌日（60甲子序号 10）
  const days = daysBetween(1900, 1, 1, year, month, day);
  const daySexagenary = ((10 + days) % 60 + 60) % 60;
  const dayStemIdx = daySexagenary % 10;
  const dayBranchIdx = daySexagenary % 12;

  // -- 4. 时柱 --
  const hourBranchIdx = getHourBranchIdx(hour);
  const hourStemStart = MOUSE_DUN[dayStemIdx];
  const hourStemIdx = (hourStemStart + hourBranchIdx) % 10;

  // -- 组装四柱 --
  const pillars = [
    {
      name: '年柱',
      stem: STEMS[actualYearStemIdxPos],
      branch: BRANCHES[actualYearBranchIdxPos],
      stemIdx: actualYearStemIdxPos,
      branchIdx: actualYearBranchIdxPos,
      nayin: NAYIN[actualYearStemIdxPos * 6 + (actualYearBranchIdxPos % 6 === 0 ? 0 : actualYearBranchIdxPos % 6)],
    },
    {
      name: '月柱',
      stem: STEMS[monthStemIdx],
      branch: BRANCHES[monthBranchIdx],
      stemIdx: monthStemIdx,
      branchIdx: monthBranchIdx,
    },
    {
      name: '日柱',
      stem: STEMS[dayStemIdx],
      branch: BRANCHES[dayBranchIdx],
      stemIdx: dayStemIdx,
      branchIdx: dayBranchIdx,
    },
    {
      name: '时柱',
      stem: STEMS[hourStemIdx],
      branch: BRANCHES[hourBranchIdx],
      stemIdx: hourStemIdx,
      branchIdx: hourBranchIdx,
    },
  ];

  // -- 五行统计 --
  const wuxingCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  pillars.forEach((p) => {
    wuxingCount[ELEMENTS[p.stem]]++;
    wuxingCount[ELEMENTS[p.branch]]++;
  });

  // -- 地支藏干（简化：只取本气） --
  const hiddenStemsMap = {
    子: '癸', 丑: '己', 寅: '甲', 卯: '乙', 辰: '戊',
    巳: '丙', 午: '丁', 未: '己', 申: '庚', 酉: '辛', 戌: '戊', 亥: '壬',
  };

  // -- 十神 --
  const dayStem = STEMS[dayStemIdx];
  pillars.forEach((p) => {
    p.shiShen = getShiShen(dayStem, p.stem);
    const hidden = hiddenStemsMap[p.branch];
    p.hiddenStem = hidden;
    p.hiddenShiShen = hidden ? getShiShen(dayStem, hidden) : '';
    p.element = ELEMENTS[p.stem];
    p.yinYang = YIN_YANG[p.stem];
  });

  // -- 大运排盘 --
  const daYun = calculateDaYun({
    yearStemIdx: actualYearStemIdxPos,
    yearBranchIdx: actualYearBranchIdxPos,
    monthBranchIdx,
    monthStemIdx,
    dayStemIdx,
    dayBranchIdx,
    year,
    month,
    day,
    isMale,
  });

  return {
    pillars,
    wuxingCount,
    dayStem,
    dayStemIdx,
    dayMaster: `${dayStem}(${ELEMENTS[dayStem]}·${YIN_YANG[dayStem]})`,
    zodiac: ZODIAC[actualYearBranchIdxPos],
    daYun,
  };
}

/**
 * 排大运
 */
function calculateDaYun({ yearStemIdx, yearBranchIdx, monthStemIdx, monthBranchIdx, year, month, day, isMale }) {
  const yearStemYin = YIN_YANG[STEMS[yearStemIdx]] === '阳';
  // 阳男阴女顺排，阴男阳女逆排
  const forward = (yearStemYin && isMale) || (!yearStemYin && !isMale);

  // 计算起运岁数（简化：按顺逆数到下一个/上一个节气）
  const daysToTerm = getDaysToNextTerm(year, month, day, forward);
  const startAge = Math.ceil(daysToTerm / 3);

  const steps = [];
  for (let i = 0; i < 8; i++) {
    const age = startAge + i * 10;
    let stemIdx, branchIdx;
    if (forward) {
      stemIdx = (monthStemIdx + 1 + i) % 10;
      branchIdx = (monthBranchIdx + 1 + i) % 12;
    } else {
      stemIdx = ((monthStemIdx - 1 - i) % 10 + 10) % 10;
      branchIdx = ((monthBranchIdx - 1 - i) % 12 + 12) % 12;
    }
    steps.push({
      age,
      stem: STEMS[stemIdx],
      branch: BRANCHES[branchIdx],
      ganZhi: STEMS[stemIdx] + BRANCHES[branchIdx],
      nayin: NAYIN[stemIdx * 6 + (branchIdx % 6)],
    });
  }

  return { startAge, steps, forward };
}

/**
 * 数到下一个/上一个节气天数
 */
function getDaysToNextTerm(year, month, day, forward) {
  // 简化：按固定节气日期估算
  const dateNum = month * 100 + day;
  let minDist = 365;
  for (const st of SOLAR_TERMS) {
    let stNum = st.m * 100 + st.d;
    if (forward) {
      if (st.m < month || (st.m === month && st.d <= day)) stNum += 1200;
      const dist = stNum - dateNum;
      if (dist > 0 && dist < minDist) minDist = dist;
    } else {
      if (st.m > month || (st.m === month && st.d >= day)) stNum -= 1200;
      const dist = dateNum - stNum;
      if (dist > 0 && dist < minDist) minDist = dist;
    }
  }
  // 修正跨月天数误差：按实际日历天数
  if (forward) {
    for (const st of SOLAR_TERMS) {
      const targetYear = st.m < month ? year + 1 : year;
      const d = daysBetween(year, month, day, targetYear, st.m, st.d);
      if (d > 0 && d < minDist) minDist = d;
    }
  } else {
    for (const st of SOLAR_TERMS) {
      const targetYear = st.m > month ? year - 1 : year;
      const d = daysBetween(targetYear, st.m, st.d, year, month, day);
      if (d > 0 && d < minDist) minDist = d;
    }
  }
  return minDist < 365 ? minDist : 30;
}
