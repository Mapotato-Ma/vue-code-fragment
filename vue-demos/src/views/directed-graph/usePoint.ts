import { computed, ref, type ComputedRef, type Ref } from 'vue';
export interface IPoint {
  id: symbol;
  top: Ref<number>;
  left: Ref<number>;
  radius: Ref<number>;
  startPointIds: Array<IPoint>;
  endPointIds: Array<IPoint>;
  getCenterPosition: ComputedRef<{ top: number; left: number }>;
  updatePosition: (top: number, left: number) => void;
  // 添加连接
  addConnection: (point: IPoint) => void;
}

export const usePoint = (x: number, y: number): IPoint => {
  const id = Symbol();
  const top = ref(y);
  const left = ref(x);
  const startPointIds: IPoint['startPointIds'] = [];
  const endPointIds: IPoint['endPointIds'] = [];
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
    endPointIds.push(point);
    point.startPointIds.push({
      id,
      top,
      left,
      radius,
      startPointIds,
      endPointIds,
      updatePosition,
      addConnection,
      getCenterPosition
    });
  };

  return {
    id,
    top,
    left,
    radius,
    startPointIds,
    endPointIds,
    updatePosition,
    addConnection,
    getCenterPosition
  };
};
