export interface IPoint {
  pointId: symbol;
  pointName: string;
  top: number;
  left: number;
  radius: number;
  startPoints: Array<IPoint>;
  endPoints: Array<IPoint>;
  getCenterPosition: { top: number; left: number };
  // 添加连接
  addConnection: (point: IPoint) => void;
  dispose: () => Array<IPoint>;
}
export interface IConnection {
  startPoint: IPoint;
  endPoint: IPoint;
}
export class Point implements IPoint {
  pointId = Symbol();
  pointName: string;
  top: number;
  left: number;
  startPoints: IPoint['startPoints'] = [];
  endPoints: IPoint['endPoints'] = [];
  radius = 50;

  constructor(x: number, y: number, name: string) {
    this.top = y;
    this.left = x;
    this.pointName = name;
  }

  public get getCenterPosition() {
    return {
      top: this.top + this.radius,
      left: this.left + this.radius
    };
  }

  addConnection = (point: IPoint) => {
    this.endPoints.push(point);
    point.startPoints.push(this);
  };

  dispose() {
    this.startPoints.forEach(
      (point) => (point.endPoints = point.endPoints.filter((ep) => ep.pointId !== this.pointId))
    );
    this.endPoints.forEach(
      (point) => (point.startPoints = point.startPoints.filter((ep) => ep.pointId !== this.pointId))
    );
    return this.startPoints;
  }
}
