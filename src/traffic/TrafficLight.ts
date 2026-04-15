import type { GridPos } from '../core/Types';

export type LightState = 'NS_GREEN' | 'EW_GREEN';

export class TrafficLight {
  pos: GridPos;
  state: LightState = 'NS_GREEN';
  timer: number = 0;
  cycleTime: number = 4000; // 4 seconds per direction

  constructor(pos: GridPos) {
    this.pos = pos;
  }

  update(dt: number) {
    this.timer += dt;
    if (this.timer >= this.cycleTime) {
      this.state = this.state === 'NS_GREEN' ? 'EW_GREEN' : 'NS_GREEN';
      this.timer = 0;
    }
  }

  isGreen(from: GridPos, to: GridPos): boolean {
    const isVertical = from.c === to.c;
    const isHorizontal = from.r === to.r;

    if (this.state === 'NS_GREEN') {
      return isVertical;
    } else {
      return isHorizontal;
    }
  }
}
