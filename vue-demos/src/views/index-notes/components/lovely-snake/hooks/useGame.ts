import { Subscription, filter, fromEvent, interval, tap, throttleTime } from 'rxjs';
import { useDirection } from './useDirection';
import { RewardType, useRewards } from './useRewards';
import { useSnake, type PointList } from './useSnake';
import { getRandomInt } from '@/utils';

export const useGame = () => {
  const {
    snake,
    snakeJSON,
    snakeLength,
    gameOver,
    snakeFoot,
    direction,
    speed,
    gameEvent,
    remake,
    move,
    extendSnake,
    validatePointsInSnakeBody
  } = useSnake();
  const { DIRECTION_KEY_CODE, GAME_CONTROL_KEY_CODE, ALL_KEY_CODE, isReverseDirection } =
    useDirection();
  const { currentRewardType, currentReward, currentRewardJSON, getRewardType } = useRewards();
  // 游戏中
  let gaming: Subscription;

  const registerEvent = () => {
    // 总事件
    const allEvent = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      tap((v) => v.preventDefault()),
      filter((e) => ALL_KEY_CODE.includes(e.code))
    );

    // 方向事件
    const directionEvent = allEvent.pipe(filter((e) => DIRECTION_KEY_CODE.includes(e.code)));
    // 游戏控制事件
    const gameControlEvent = allEvent.pipe(filter((e) => GAME_CONTROL_KEY_CODE.includes(e.code)));

    gameControlEvent.subscribe((e) => {
      // 开始游戏
      if (e.code === 'Space' && !gaming) {
        gaming = interval(10).pipe(throttleTime(speed.value)).subscribe(move);
        generateReward();
      }
      // 重玩
      if (e.code === 'KeyR') {
        // 蛇重生
        remake();
        gaming?.unsubscribe();
        gaming = interval(10).pipe(throttleTime(speed.value)).subscribe(move);
        generateReward();
      }
    });

    directionEvent.subscribe((e) => {
      // 游戏未开始，禁用方向键
      if (!gaming) return;
      // 禁止掉头
      if (isReverseDirection(direction.value, e.code)) return;
      if (e.code !== direction.value) {
        // 改变方向
        direction.value = e.code;
        gameEvent.next('move');
      } else {
        // 加速
        move();
      }
    });

    // 监听游戏失败
    gameEvent.subscribe((e) => {
      if (e === 'fail') {
        gaming?.unsubscribe();
      }
      if (e === 'move') {
        // 吃到奖励
        if (
          `${currentRewardJSON.value}`.includes(`[${snakeFoot.value[0]},${snakeFoot.value[1]}]`)
        ) {
          extendSnake(getExtendPoints(currentRewardType.value));
          generateReward();
          speed.value -= 20;
          gaming.unsubscribe();
          gaming = interval(10).pipe(throttleTime(speed.value)).subscribe(move);
        }
      }
    });
  };

  // 生成奖励
  const generateReward = () => {
    currentRewardType.value = getRewardType();
    if (currentRewardType.value === RewardType.大奖励) {
      currentReward.value = generateBigReward([2, 47], [2, 87]);
    } else {
      currentReward.value = [generateSmallReward([1, 48], [1, 88])];
    }
  };

  // 生成小奖励
  const generateSmallReward = (
    xLimit: [number, number],
    yLimit: [number, number]
  ): [number, number] => {
    const point: [number, number] = [getRandomInt(...xLimit), getRandomInt(...yLimit)];
    if (validatePointsInSnakeBody([point]).isIn) {
      return generateSmallReward(xLimit, yLimit);
    } else {
      return point;
    }
  };

  // 生成大奖励
  const generateBigReward = (xLimit: [number, number], yLimit: [number, number]): PointList => {
    const point: [number, number] = generateSmallReward(xLimit, yLimit);
    const points: PointList = [
      point,
      [point[0], point[1] + 1],
      [point[0] + 1, point[1]],
      [point[0] + 1, point[1] + 1]
    ];
    if (validatePointsInSnakeBody(points).allOut) {
      return points;
    } else {
      return generateBigReward(xLimit, yLimit);
    }
  };

  // 获取奖励点
  const getExtendPoints = (type: RewardType): PointList => {
    const [x, y] = snakeFoot.value;
    const points: PointList = [];

    let dx = 0,
      dy = 0;
    switch (direction.value) {
      case 'ArrowRight':
        dy = 1;
        break;
      case 'ArrowDown':
        dx = 1;
        break;
      case 'ArrowUp':
        dx = -1;
        break;
      default:
        dy = -1;
    }

    for (let i = 1; i <= 4; i++) {
      points.push([x + dx * i, y + dy * i]);
    }

    return type === RewardType.大奖励 ? points : [points[0]];
  };

  return {
    snake,
    snakeJSON,
    snakeLength,
    gameOver,
    currentRewardJSON,
    registerEvent
  };
};
