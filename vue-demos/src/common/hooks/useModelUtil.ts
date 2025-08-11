import Big from 'big.js';
import { ref } from 'vue';

export const useModelUtil = () => {
  /**
   * 创建一个先递增后递减的数字列表
   *
   * @param {number} count - 单向步数（总长度将是这个值的2倍）
   * @param {number} start - 缩放的起始值
   * @param {number} end - 缩放的结束/峰值
   * @returns {number[]} 一个从起始值到结束值再回到起始值的数字数组
   *
   * @example
   * // 返回 [0, 0.5, 1, 0.5, 0]
   * createScaleList(3, 0, 1)
   *
   * @description
   * - 使用Big.js进行精确的小数计算
   * - 首先创建从起始值到结束值的正向数组
   * - 然后通过反转正向数组创建反向数组
   * - 将两个数组组合形成对称的缩放序列
   */
  const createScaleList = (count: number, start: number, end: number): number[] => {
    const interval = new Big(end).minus(start).div(count);
    const forward = Array(count)
      .fill(0)
      .map((_, i) => new Big(start).plus(new Big(interval).times(i)).toNumber());

    const backward = forward.slice().reverse();

    return [...forward, ...backward];
  };
  const loopScaleList = createScaleList(300, 0.75, 1);
  const loopScaleIndex = ref(0);

  /**
   * 创建一个等间隔的数值数组
   * @param count - 数组元素个数
   * @param start - 起始值
   * @param end - 结束值
   * @returns 包含等间隔数值的数组
   */
  const createRotateList = (count: number, start: number, end: number): number[] => {
    try {
      // 计算每个区间的间隔大小
      const interval = new Big(end).minus(start).div(count);
      // 生成等间隔的数值数组
      return Array(count)
        .fill(0)
        .map((_, i) => new Big(start).plus(new Big(interval).times(i)).toNumber());
    } catch (error) {
      console.log('🚀 ~  ~ ', error);
      return [];
    }
  };
  const rotateList = createRotateList(1000, 0, -2 * Math.PI);
  const rotateIndex = ref(0);

  return { loopScaleList, loopScaleIndex, rotateList, rotateIndex };
};
