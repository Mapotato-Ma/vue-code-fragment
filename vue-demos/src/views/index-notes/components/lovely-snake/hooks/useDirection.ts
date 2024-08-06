export const useDirection = () => {
  const DIRECTION_KEY_CODE = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
  const GAME_CONTROL_KEY_CODE = ['Space', 'KeyR'];
  const ALL_KEY_CODE = [...DIRECTION_KEY_CODE, ...GAME_CONTROL_KEY_CODE];
  const directionMap = new Map([
    ['ArrowRight', [0, -1]],
    ['ArrowLeft', [0, 1]],
    ['ArrowUp', [1, 0]],
    ['ArrowDown', [-1, 0]]
  ]);
  /**
   * 判断两个方向是否相反。
   * @param direction 当前方向
   * @param nextDirection 下一个方向
   * @returns 如果两个方向相反则返回true，否则返回false。如果任一方向无效，则抛出错误。
   */
  const isReverseDirection = (direction: string, nextDirection: string): boolean => {
    if (!DIRECTION_KEY_CODE.includes(direction) || !DIRECTION_KEY_CODE.includes(nextDirection)) {
      throw new Error('Invalid direction');
    }

    const reverseMap: Record<string, string> = {
      ArrowRight: 'ArrowLeft',
      ArrowLeft: 'ArrowRight',
      ArrowUp: 'ArrowDown',
      ArrowDown: 'ArrowUp'
    };

    return reverseMap[direction] === nextDirection;
  };
  return {
    DIRECTION_KEY_CODE,
    GAME_CONTROL_KEY_CODE,
    ALL_KEY_CODE,
    directionMap,
    isReverseDirection
  };
};
