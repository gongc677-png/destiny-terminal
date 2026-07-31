import { Solar } from 'lunar-javascript';
import { STEMS, BRANCHES, ELEMENTS, YIN_YANG, NAYIN } from './constants.js';

/**
 * 由天干地支索引求六十甲子序号（0-59）
 */
function getSexagenaryIndex(stemIdx, branchIdx) {
  for (let n = 0; n < 60; n++) {
    if (n % 10 === stemIdx && n % 12 === branchIdx) return n;
  }
  return 0;
}

/**
 * 由干支字符串求天干地支索引
 */
function ganZhiToIndices(ganZhi) {
  return {
    stemIdx: STEMS.indexOf(ganZhi[0]),
    branchIdx: BRANCHES.indexOf(ganZhi[1]),
  };
}

/**
 * 排八字（基于 lunar-javascript，节气与立春精确到时刻）
 * @param {{ year: number, month: number, day: number, hour: number, minute?: number, isMale?: boolean }} birth
 */
export function calculateBazi({ year, month, day, hour, minute = 0, isMale = true }) {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  const dayGan = ec.getDayGan();
  const dayGanIdx = STEMS.indexOf(dayGan);

  // 四柱原始数据
  const rawPillars = [
    {
      name: '年柱',
      gan: ec.getYearGan(),
      zhi: ec.getYearZhi(),
      nayin: ec.getYearNaYin(),
      shiShenGan: ec.getYearShiShenGan(),
      hideGan: ec.getYearHideGan(),
      shiShenZhi: ec.getYearShiShenZhi(),
      xunKong: ec.getYearXunKong(),
    },
    {
      name: '月柱',
      gan: ec.getMonthGan(),
      zhi: ec.getMonthZhi(),
      nayin: ec.getMonthNaYin(),
      shiShenGan: ec.getMonthShiShenGan(),
      hideGan: ec.getMonthHideGan(),
      shiShenZhi: ec.getMonthShiShenZhi(),
      xunKong: ec.getMonthXunKong(),
    },
    {
      name: '日柱',
      gan: ec.getDayGan(),
      zhi: ec.getDayZhi(),
      nayin: ec.getDayNaYin(),
      shiShenGan: ec.getDayShiShenGan(),
      hideGan: ec.getDayHideGan(),
      shiShenZhi: ec.getDayShiShenZhi(),
      xunKong: ec.getDayXunKong(),
    },
    {
      name: '时柱',
      gan: ec.getTimeGan(),
      zhi: ec.getTimeZhi(),
      nayin: ec.getTimeNaYin(),
      shiShenGan: ec.getTimeShiShenGan(),
      hideGan: ec.getTimeHideGan(),
      shiShenZhi: ec.getTimeShiShenZhi(),
      xunKong: ec.getTimeXunKong(),
    },
  ];

  const pillars = rawPillars.map((p) => {
    const stemIdx = STEMS.indexOf(p.gan);
    const branchIdx = BRANCHES.indexOf(p.zhi);
    return {
      name: p.name,
      stem: p.gan,
      branch: p.zhi,
      stemIdx,
      branchIdx,
      element: ELEMENTS[p.gan],
      yinYang: YIN_YANG[p.gan],
      nayin: p.nayin,
      shiShen: p.shiShenGan,
      hiddenStems: p.hideGan,
      hiddenShiShens: p.shiShenZhi,
      hiddenStem: p.hideGan[0] || '',
      hiddenShiShen: p.shiShenZhi[0] || '',
      xunKong: p.xunKong,
    };
  });

  // 五行统计（四天干 + 四地支本气）
  const wuxingCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  pillars.forEach((p) => {
    wuxingCount[ELEMENTS[p.stem]]++;
    wuxingCount[ELEMENTS[p.branch]]++;
  });

  // 大运：阳男阴女顺排，阴男阳女逆排
  const yun = ec.getYun(isMale ? 1 : 0);
  const daYunAll = yun.getDaYun();
  // 库返回的第一段为出生至起运前（无干支），跳过
  const daYunSteps = daYunAll.filter((d) => d.getGanZhi()).slice(0, 8);
  const steps = daYunSteps.map((d) => {
    const { stemIdx, branchIdx } = ganZhiToIndices(d.getGanZhi());
    return {
      startAge: d.getStartAge(),
      endAge: d.getEndAge(),
      startYear: d.getStartYear(),
      ganZhi: d.getGanZhi(),
      stem: STEMS[stemIdx],
      branch: BRANCHES[branchIdx],
      nayin: NAYIN[getSexagenaryIndex(stemIdx, branchIdx)],
    };
  });

  const startSolar = yun.getStartSolar();
  const firstStep = steps[0];

  return {
    pillars,
    wuxingCount,
    dayStem: dayGan,
    dayStemIdx: dayGanIdx,
    dayMaster: `${dayGan}(${ELEMENTS[dayGan]}·${YIN_YANG[dayGan]})`,
    zodiac: lunar.getYearShengXiaoExact(),
    lunarInfo: {
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay(),
      monthChinese: lunar.getMonthInChinese(),
      dayChinese: lunar.getDayInChinese(),
      yearChinese: lunar.getYearInChinese(),
    },
    daYun: {
      forward: yun.isForward(),
      startAge: firstStep ? firstStep.startAge : null,
      startYear: startSolar.getYear(),
      startMonth: startSolar.getMonth(),
      startDay: startSolar.getDay(),
      steps,
    },
  };
}
