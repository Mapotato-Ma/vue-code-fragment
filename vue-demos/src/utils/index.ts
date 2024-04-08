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

/**
 * @title 分隔符转驼峰
 * @example user_name_age => userNameAge TransformVar("user_name_age","_",false,false)
 * @example user_name_age => UserNameAge TransformVar("user_name_age","_",false,true)
 * @example userNameAge => user_name_age TransformVar("userNameAge","_",true)
 * @param {string} str 源字符串
 * @param {string} split 分隔符
 * @param {boolean=false} reverse 是否驼峰转烤串(忽略第四个参数，首字母一定小写)
 * @param {boolean=false} firstUp 首字母是否大写
 * @return {string} 转换之后的字符串
 * */
export const TangHuLuToBigHump = (
  str: string = '',
  split: string = '_',
  firstUp: boolean = false,
  reverse: boolean = false
) => {
  // 烤串转驼峰
  if (!reverse) {
    const strArr = str.split(split);
    const newArr = strArr.map((field, index) => {
      if (firstUp) return `${field.charAt(0).toUpperCase()}${field.slice(1)}`;
      return `${index > 0 ? field.charAt(0).toUpperCase() : field.charAt(0)}${field.slice(1)}`;
    });
    return newArr.join('');
  }
  // 驼峰转烤串
  const strArr = str.match(/[a-zA-Z][a-z]+/g) || [];
  const newArr = strArr.map((str) => str.toLowerCase());
  return newArr.join(split);
};
