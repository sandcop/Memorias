import type { GridPos } from '../core/Types';
import { VehicleState } from '../core/Types';
import { TILE_SIZE } from '../core/Constants';
import { Grid } from '../map/Grid';

export class Train {
    id: string;
    currentPos: { x: number, y: number };
    path: GridPos[] = [];
    currentPathIndex: number = 0;
    speed: number = 0.15; // Faster than cars
    angle: number = 0;
    state: VehicleState = VehicleState.TOWARDS_DESTINATION;

    constructor(id: string, startPos: GridPos, path: GridPos[]) {
        this.id = id;
        this.path = path;
        this.currentPos = {
            x: startPos.c * TILE_SIZE + TILE_SIZE / 2,
            y: startPos.r * TILE_SIZE + TILE_SIZE / 2
        };
    }

    update(dt: number, _grid: Grid): boolean {
        if (this.currentPathIndex >= this.path.length) {
            this.state = VehicleState.ARRIVED;
            return true;
        }

        const targetGridPos = this.path[this.currentPathIndex];
        const targetX = targetGridPos.c * TILE_SIZE + TILE_SIZE / 2;
        const targetY = targetGridPos.r * TILE_SIZE + TILE_SIZE / 2;

        const dx = targetX - this.currentPos.x;
        const dy = targetY - this.currentPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 2) {
            this.currentPathIndex++;
            return false;
        }

        const moveDist = this.speed * dt;
        this.angle = Math.atan2(dy, dx);
        this.currentPos.x += Math.cos(this.angle) * moveDist;
        this.currentPos.y += Math.sin(this.angle) * moveDist;

        return false;
    }
}
