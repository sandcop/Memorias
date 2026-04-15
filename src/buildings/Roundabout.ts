import type { GridPos } from '../core/Types';

export class Roundabout {
  id: string;
  pos: GridPos; // Top-left corner

  constructor(id: string, pos: GridPos) {
    this.id = id;
    this.pos = pos;
  }

  getTiles(): GridPos[] {
    return [
      { r: this.pos.r, c: this.pos.c },
      { r: this.pos.r + 1, c: this.pos.c },
      { r: this.pos.r, c: this.pos.c + 1 },
      { r: this.pos.r + 1, c: this.pos.c + 1 }
    ];
  }
}
