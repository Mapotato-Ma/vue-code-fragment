import { computed, ref, type ComputedRef, type Ref } from 'vue';
export interface IPoint {
  pointId: symbol;
  pointName: string;
  top: Ref<number>;
  left: Ref<number>;
  radius: Ref<number>;
  startPoints: Array<IPoint>;
  endPoints: Array<IPoint>;
  getCenterPosition: ComputedRef<{ top: number; left: number }>;
  updatePosition: (top: number, left: number) => void;
  // 添加连接
  addConnection: (point: IPoint) => void;
  dispose: () => Array<IPoint>;
}

export const usePoint = (x: number, y: number, name: string): IPoint => {
  const pointId = Symbol();
  const pointName = name;
  const top = ref(y);
  const left = ref(x);
  const startPoints: IPoint['startPoints'] = [];
  const endPoints: IPoint['endPoints'] = [];
  const radius = ref(50);

  const getCenterPosition = computed(() => ({
    top: top.value + radius.value,
    left: left.value + radius.value
  }));

  const updatePosition = (x: number, y: number) => {
    top.value = y;
    left.value = x;
  };

  const addConnection = (point: IPoint) => {
    endPoints.push(point);
    point.startPoints.push(thisPoint);
  };

  const dispose = () => {
    startPoints.forEach((point) => {
      const index = point.endPoints.findIndex((p) => p.pointId === pointId);
      point.endPoints.splice(index, 1);
    });
    return startPoints;
  };

  const thisPoint = {
    pointId,
    pointName,
    top,
    left,
    radius,
    startPoints,
    endPoints,
    updatePosition,
    addConnection,
    dispose,
    getCenterPosition
  };

  return thisPoint;
};
