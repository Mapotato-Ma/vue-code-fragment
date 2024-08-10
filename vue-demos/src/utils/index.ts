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

// 将角度转换为弧度：
export const DTR = (degrees: number) => degrees * (Math.PI / 180);
// 将弧度转换为角度：
export const RTD = (radians: number) => radians * (180 / Math.PI);

/**
 * 一个自定义的日志打印函数，用于在控制台输出格式化的日志信息。
 * 它支持不同的日志类型和模块分类，使得日志输出更加清晰和可定制。
 *
 * @param msg 要输出的日志消息字符串。
 * @param module 日志所属的模块，默认为'main'。
 * @param type 日志的输出类型，默认为'log'。可以是Console对象上定义的所有方法名。
 * @param args 额外的参数，会被传递给console[type]函数，用于支持不同类型日志的额外信息输出。
 */
export const log = (msg: string, module = 'main', type: keyof Console = 'log', ...args: any[]) => {
  // 根据type的值决定是否直接调用console[type]()，用于处理groupEnd和clear类型
  if (type === 'groupEnd' || type === 'clear') {
    console[type]();
  } else {
    // 使用%c格式化代码为控制台日志添加样式，使得日志输出更加明显和分类清晰
    console[type](
      `%c[${module}] %c${msg}`,
      'color: #fff; background: #409EFF; padding: 2px 4px; border-radius: 2px;',
      'color: #fff; background: #409EFF; padding: 2px 4px; border-radius: 2px;',
      ...args
    );
  }
};

export const getRandomInt = (min: number, max: number) => {
  console.log('🚀 ~ min ~ 77行', min);
  console.log('🚀 ~ max ~ 78行', max);
  // 确保 min 和 max 是整数
  min = Math.ceil(min);
  max = Math.floor(max);

  // 生成从 min 到 max 之间的随机整数（包括 min 和 max）
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isSimpleData = (data: any) => {
  return (
    data === null ||
    data === undefined ||
    typeof data === 'string' ||
    typeof data === 'number' ||
    typeof data === 'boolean'
  );
};
