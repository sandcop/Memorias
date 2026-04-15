import { TileType } from '../core/Types';
import type { GridPos, ResourceColor } from '../core/Types';

export abstract class Building {
  id: string;
  pos: GridPos;
  color: ResourceColor;
  type: TileType;
  spawnProgress: number = 0; // 0 to 1 for spawn animation

  constructor(id: string, pos: GridPos, color: ResourceColor, type: TileType) {
    this.id = id;
    this.pos = pos;
    this.color = color;
    this.type = type;
  }
}

export class House extends Building {
  constructor(id: string, pos: GridPos, color: ResourceColor) {
    super(id, pos, color, TileType.HOUSE);
  }
}

export class Destination extends Building {
  demand: number = 0;
  maxDemand: number = 10;
  timer: number = 0;
  isOverloaded: boolean = false;
  collapseTimer: number = 0;
  maxCollapseTime: number = 10000; // 10 seconds to collapse

  constructor(id: string, pos: GridPos, color: ResourceColor) {
    super(id, pos, color, TileType.DESTINATION);
  }

  update(dt: number) {
    // Over time, demand increases
    this.timer += dt;
    if (this.timer >= 4000) { // Slightly faster demand
      this.demand++;
      this.timer = 0;
    }

    if (this.demand >= this.maxDemand) {
      this.collapseTimer += dt;
      if (this.collapseTimer >= this.maxCollapseTime) {
          this.isOverloaded = true;
      }
    } else {
        this.collapseTimer = Math.max(0, this.collapseTimer - dt * 0.5); // Recover slow
        this.isOverloaded = false;
    }
  }

  fulfill() {
    if (this.demand > 0) {
      this.demand--;
    }
  }
}
