import { message } from '@/common/plugins/message';
import { computed, ref } from 'vue';
import { useDirection } from './useDirection';
import { Subject } from 'rxjs';
export type PointList = [number, number][];
export const useSnake = () => {
  const { directionMap, DIRECTION_KEY_CODE } = useDirection();
  const snake = ref([[1, 1]]);
  const snakeJSON = computed(() => `[${snake.value.map((v) => `[${v}]`)}]`);
  const snakeLength = computed(() => snake.value.length);
  const snakeFoot = computed(() => snake.value[snakeLength.value - 1]);

  const gameOver = ref(false);
  const speed = ref(300);
  const direction = ref(DIRECTION_KEY_CODE[0]);
  const gameEvent: Subject<'fail' | 'move'> = new Subject();

  const remake = () => {
    snake.value = [[1, 1]];
    gameOver.value = false;
    speed.value = 300;
    direction.value = 'ArrowRight';
  };

  const move = () => {
    if (!gameOver.value) {
      const [x, y] = directionMap.get(direction.value)!;
      const [footX, footY] = snakeFoot.value;
      snake.value.push([footX + x * -1, footY + y * -1]);
      snake.value.shift();
      detectSuccess();
    }
  };

  const detectSuccess = () => {
    const { isIn } = validatePointsInSnakeBody([snakeFoot.value]);
    if (isIn) {
      gameOver.value = true;
    }
    if (
      snakeFoot.value[0] < 1 ||
      snakeFoot.value[0] > 48 ||
      snakeFoot.value[1] < 1 ||
      snakeFoot.value[1] > 88
    ) {
      gameOver.value = true;
    }
    if (gameOver.value) {
      gameEvent.next('fail');
      message.message('游戏结束，按 R 重玩');
    } else {
      gameEvent.next('move');
    }
  };

  const validatePointsInSnakeBody = (points: number[][]) => {
    const validResult = points.map((point) => {
      const reg = new RegExp(`(\\[${point}\\])`, 'g');
      if ((snakeJSON.value.match(reg)?.length ?? 0) > 1) {
        return true;
      } else {
        return false;
      }
    });
    return {
      allIn: validResult.every((v) => v),
      isIn: validResult.some((v) => v),
      allOut: validResult.every((v) => !v),
      isOut: validResult.some((v) => !v)
    };
  };

  const extendSnake = (points: PointList) => {
    snake.value.push(...points);
  };
  return {
    snake,
    snakeJSON,
    snakeLength,
    snakeFoot,
    gameOver,
    speed,
    direction,
    gameEvent,
    remake,
    extendSnake,
    move,
    validatePointsInSnakeBody
  };
};
