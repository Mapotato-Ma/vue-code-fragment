import { RTD, DTR } from '@/utils';

export interface IPoint {
  x: number;
  y: number;
}

export interface IShape {
  id: symbol;
  pointTopLeft: IPoint;
  pointTopRight: IPoint;
  pointBottomLeft: IPoint;
  pointBottomRight: IPoint;
  radius: number;
  fill: string;
  pointOfTangences: {
    A: IPoint;
    B: IPoint;
    C: IPoint;
    D: IPoint;
    E: IPoint;
    F: IPoint;
    G: IPoint;
    H: IPoint;
  };
}

// 等腰梯形工厂函数
export const useRightTrapezoid = (
  pointTopLeft: IPoint,
  pointTopRight: IPoint,
  pointBottomLeft: IPoint,
  pointBottomRight: IPoint,
  radius: number,
  fill: string
): IShape => {
  const { x: x1, y: y1 } = pointTopLeft;
  const { x: x2, y: y2 } = pointTopRight;
  const { x: x3, y: y3 } = pointBottomRight;
  const { x: x4, y: y4 } = pointBottomLeft;
  const H: IPoint = { x: x1, y: y1 + radius };
  const A: IPoint = { x: x1 + radius, y: y1 };
  const G: IPoint = { x: x4, y: y4 - radius };
  const F: IPoint = { x: x4 + radius, y: y4 };
  const B: IPoint = { x: 0, y: y2 };
  const E: IPoint = { x: 0, y: y3 };
  const C: IPoint = { x: 0, y: 0 };
  const D: IPoint = { x: 0, y: 0 };

  // 上边长度
  const lineTop = x3 - x4 - (x2 - x1);
  // 下边长度
  const lineBottom = x3 - x4;
  // 直角边长度
  const lineLeft = y4 - y1;
  // 斜边长度
  const lineRight = Math.sqrt(Math.pow(lineLeft, 2) + Math.pow(lineBottom - lineTop, 2));
  // 锐角
  const acuteAngle = RTD(Math.asin(lineLeft / lineRight));
  // 钝角
  const obtuseAngle = 180 - acuteAngle;
  // B点横坐标
  B.x = x2 - radius / Math.tan(DTR(obtuseAngle / 2));
  // E点横坐标
  E.x = x3 - radius / Math.tan(DTR(acuteAngle / 2));
  const m = radius * Math.sin(DTR(obtuseAngle / 2)) * 2;
  D.x = E.x + Math.cos(DTR(obtuseAngle / 2)) * m;
  D.y = E.y - Math.sin(DTR(obtuseAngle / 2)) * m;
  const n = radius * Math.cos(DTR(obtuseAngle / 2)) * 2;
  C.x = B.x + n * Math.sin(DTR(obtuseAngle / 2));
  C.y = B.y + n * Math.cos(DTR(obtuseAngle / 2));
  return {
    id: Symbol(),
    pointTopLeft,
    pointTopRight,
    pointBottomLeft,
    pointBottomRight,
    radius,
    pointOfTangences: {
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H
    },
    fill
  };
};

// 随机生成直角梯形
export const generateRightTrapezoid = (
  x: number,
  y: number,
  hBase: number = 50,
  wBase: number = 30
) => {
  const y1 = Math.ceil(Math.abs(Math.random() * 100)) + y;
  const y2 = Math.ceil(Math.abs(Math.random() * 10)) + y1 + hBase;
  const x1 = Math.ceil(Math.abs(Math.random() * 100)) + x;
  const x2 = Math.ceil(Math.abs(Math.random() * 10)) + x1 + wBase;
  const x3 = Math.ceil(Math.abs(Math.random() * 10)) + x2 + wBase;
  return useRightTrapezoid(
    { x: x1, y: y1 },
    { x: x2, y: y1 },
    { x: x1, y: y2 },
    { x: x3, y: y2 },
    Math.floor(Math.abs(Math.random() * 10)),
    `rgb(${Math.random() * 255},${Math.random() * 255}, ${Math.random() * 255})`
  );
};
