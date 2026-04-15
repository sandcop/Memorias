import { VehicleState } from '../core/Types';
import type { GridPos, ResourceColor, Point } from '../core/Types';
import { Grid } from '../map/Grid';
import { Pathfinder } from '../navigation/Pathfinder';
import { TILE_SIZE } from '../core/Constants';

export class Vehicle {
  id: string;
  color: ResourceColor;
  homePos: GridPos;
  destPos: GridPos;
  state: VehicleState = VehicleState.TOWARDS_DESTINATION;
  
  currentPos: Point;
  path: GridPos[] = [];
  pathIndex: number = 0;
  speed: number = 2.0; // tiles per second
  progress: number = 0; // 0 to 1 between tiles
  angle: number = 0;
  targetAngle: number = 0;

  constructor(id: string, color: ResourceColor, home: GridPos, dest: GridPos, grid: Grid) {
    this.id = id;
    this.color = color;
    this.homePos = home;
    this.destPos = dest;
    
    // Initial position
    this.currentPos = {
      x: home.c * TILE_SIZE + TILE_SIZE / 2,
      y: home.r * TILE_SIZE + TILE_SIZE / 2
    };

    this.calculatePath(grid, home, dest);
  }

  calculatePath(grid: Grid, start: GridPos, end: GridPos) {
    const p = Pathfinder.findPath(grid, start, end);
    if (p) {
      this.path = p;
      this.pathIndex = 0;
      this.progress = 0;
    } else {
      this.state = VehicleState.IDLE;
    }
  }

  update(dt: number, grid: Grid): boolean {
    if (this.state === VehicleState.IDLE) return false;

    if (this.path.length === 0) return false;

    // Traffic Light Check
    if (this.progress === 0 && this.pathIndex < this.path.length - 1) {
        const currentTile = this.path[this.pathIndex];
        const nextTile = this.path[this.pathIndex + 1];
        const light = grid.trafficLights.find(l => l.pos.r === nextTile.r && l.pos.c === nextTile.c);
        
        if (light && !light.isGreen(currentTile, nextTile)) {
            // Wait at red light
            return false;
        }
    }

    this.progress += (this.speed * dt) / 1000;
    
    if (this.progress >= 1) {
      this.progress = 0;
      this.pathIndex++;

      if (this.pathIndex >= this.path.length - 1) {
        // Reached end of current path
        if (this.state === VehicleState.TOWARDS_DESTINATION) {
          this.state = VehicleState.TOWARDS_HOUSE;
          this.calculatePath(grid, this.destPos, this.homePos);
          return true; // Reached destination
        } else if (this.state === VehicleState.TOWARDS_HOUSE) {
          this.state = VehicleState.ARRIVED;
          return false;
        }
      }
    }

    // Interpolate position
    const startTile = this.path[this.pathIndex];
    const endTile = this.path[this.pathIndex + 1];

    if (startTile && endTile) {
      const startTileData = grid.getTile(startTile.r, startTile.c);
      const endTileData = grid.getTile(endTile.r, endTile.c);

      const startX = startTile.c * TILE_SIZE + TILE_SIZE / 2;
      const startY = startTile.r * TILE_SIZE + TILE_SIZE / 2;
      const endX = endTile.c * TILE_SIZE + TILE_SIZE / 2;
      const endY = endTile.r * TILE_SIZE + TILE_SIZE / 2;

      if (startTileData?.roundaboutCenter && endTileData?.roundaboutCenter && 
          startTileData.roundaboutCenter.x === endTileData.roundaboutCenter.x &&
          startTileData.roundaboutCenter.y === endTileData.roundaboutCenter.y) {
          
          const center = startTileData.roundaboutCenter;
          const radius = TILE_SIZE * 0.85; 
          
          const startAngle = Math.atan2(startY - center.y, startX - center.x);
          let endAngle = Math.atan2(endY - center.y, endX - center.x);
          
          let diffAngle = endAngle - startAngle;
          while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
          while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
          
          const currentAngle = startAngle + diffAngle * this.progress;
          this.currentPos.x = center.x + Math.cos(currentAngle) * radius;
          this.currentPos.y = center.y + Math.sin(currentAngle) * radius;
          this.targetAngle = currentAngle + Math.PI / 2 * (diffAngle > 0 ? 1 : -1);
      } else {
          // Detect Corner Arc (90 degree turn)
          const conn = startTileData?.connections;
          if (conn && (this.pathIndex < this.path.length - 1)) {
              const nextTile = this.path[this.pathIndex + 1];
              const prevTile = this.pathIndex > 0 ? this.path[this.pathIndex - 1] : null;
              
              if (prevTile && nextTile) {
                  const dr1 = startTile.r - prevTile.r;
                  const dc1 = startTile.c - prevTile.c;
                  const dr2 = nextTile.r - startTile.r;
                  const dc2 = nextTile.c - startTile.c;
                  
                  // if dr1 != dr2 and dc1 != dc2, it's a turn at 'startTile'
                  if (dr1 !== dr2 && dc1 !== dc2) {
                      const radius = TILE_SIZE / 2;
                      const pivotX = startX + dc2 * radius;
                      const pivotY = startY + dr1 * radius;
                      
                      const startAngle = Math.atan2(startY - pivotY, startX - pivotX);
                      const endAngle = Math.atan2(endY - pivotY, endX - pivotX);
                      
                      let diffAngle = endAngle - startAngle;
                      while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
                      while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
                      
                      const curAngle = startAngle + diffAngle * this.progress;
                      this.currentPos.x = pivotX + Math.cos(curAngle) * radius;
                      this.currentPos.y = pivotY + Math.sin(curAngle) * radius;
                      this.targetAngle = curAngle + Math.PI / 2 * (diffAngle > 0 ? 1 : -1);
                      return false;
                  }
              }
          }

          // Default: Linear interpolation (normal road)
          this.currentPos.x = startX + (endX - startX) * this.progress;
          this.currentPos.y = startY + (endY - startY) * this.progress;
          this.targetAngle = Math.atan2(endY - startY, endX - startX);
      }

      // Smooth angle transition
      let diff = this.targetAngle - this.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.angle += diff * dt * 0.01;
    }

    return false;
  }
}
