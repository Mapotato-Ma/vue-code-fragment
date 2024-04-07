/**
 * 将数字转化为px值（默认保留两位小数）
 * @param number 需要转化的数字
 * @returns 组装好的px值
 */
export const numberToPx = (number: number, precision?: number) =>
  `${number.toFixed(precision ?? 2)}px`;

/**
 * 数字转中文(0到9)to(一到十)
 */
export const numberToChinese = (num: number) =>
  ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][num];
