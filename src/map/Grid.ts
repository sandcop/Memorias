import { TileType, TerrainType } from '../core/Types';
import type { ITile, GridPos, IHighway } from '../core/Types';
import { GRID_SIZE, TILE_SIZE } from '../core/Constants';
import { TrafficLight } from '../traffic/TrafficLight';
import { Roundabout } from '../buildings/Roundabout';

export class Grid {
  tiles: ITile[][];
  highways: IHighway[] = [];
  trafficLights: TrafficLight[] = [];
  roundabouts: Roundabout[] = [];

  constructor() {
    this.tiles = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      this.tiles[r] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        this.tiles[r][c] = {
          pos: { r, c },
          type: TileType.EMPTY,
          terrain: TerrainType.PLAIN,
          connections: { N: false, S: false, E: false, W: false }
        };
      }
    }
  }

  generateTerrain(type: 'ISLAND' | 'MOUNTAIN' | 'CONTINENT') {
      // Clear
      for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
              this.tiles[r][c].terrain = TerrainType.PLAIN;
          }
      }

      if (type === 'ISLAND') {
          // Water border and rivers
          this.applyBlob(TerrainType.WATER, 0, 0, GRID_SIZE * 0.45);
          this.applyBlob(TerrainType.WATER, GRID_SIZE-1, GRID_SIZE-1, GRID_SIZE * 0.45);
          this.applyBlob(TerrainType.WATER, 0, GRID_SIZE-1, GRID_SIZE * 0.45);
          this.applyBlob(TerrainType.WATER, GRID_SIZE-1, 0, GRID_SIZE * 0.45);
      } else if (type === 'MOUNTAIN') {
          // Central range
          for (let i = 0; i < 8; i++) {
              this.applyBlob(TerrainType.MOUNTAIN, GRID_SIZE/2 + i*3 - 12, GRID_SIZE/2 + i*3 - 12, 6);
          }
      }

      // Always add a winding river
      this.applyRiver();
  }

  private applyRiver() {
      let r = 0;
      let c = Math.floor(Math.random() * (GRID_SIZE - 20)) + 10;
      
      while (r < GRID_SIZE) {
          this.tiles[r][c].terrain = TerrainType.WATER;
          // River thickness (Increased for high res)
          if (c + 1 < GRID_SIZE) this.tiles[r][c+1].terrain = TerrainType.WATER;
          if (c + 2 < GRID_SIZE) this.tiles[r][c+2].terrain = TerrainType.WATER;
          if (c + 3 < GRID_SIZE) this.tiles[r][c+3].terrain = TerrainType.WATER;
          
          r++;
          // Random walk for winding effect
          const dir = Math.random();
          if (dir < 0.25 && c > 4) c--;
          else if (dir > 0.75 && c < GRID_SIZE - 6) c++;
      }
  }

  private applyBlob(type: TerrainType, startR: number, startC: number, size: number) {
      for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
              const dist = Math.sqrt(Math.pow(r - startR, 2) + Math.pow(c - startC, 2));
              if (dist < size + Math.random() * 2) {
                  this.tiles[r][c].terrain = type;
              }
          }
      }
  }

  getTile(r: number, c: number): ITile | null {
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return null;
    return this.tiles[r][c];
  }

  placeRoad(r: number, c: number) {
    const tile = this.getTile(r, c);
    if (tile && (tile.type === TileType.EMPTY || tile.type === TileType.ROAD)) {
      tile.type = TileType.ROAD;
      this.updateConnections(r, c);
      
      // Update neighbors
      this.updateConnections(r - 1, c);
      this.updateConnections(r + 1, c);
      this.updateConnections(r, c - 1);
      this.updateConnections(r, c + 1);
    }
  }

  placeTrack(r: number, c: number) {
      const tile = this.getTile(r, c);
      if (tile && (tile.type === TileType.EMPTY || tile.type === TileType.TRACK)) {
          tile.type = TileType.TRACK;
          this.updateConnections(r, c);
          this.updateConnections(r - 1, c);
          this.updateConnections(r + 1, c);
          this.updateConnections(r, c - 1);
          this.updateConnections(r, c + 1);
      }
  }

  removeTile(r: number, c: number) {
    const tile = this.getTile(r, c);
    if (tile && (tile.type === TileType.ROAD || tile.type === TileType.TRACK)) {
      tile.type = TileType.EMPTY;
      tile.connections = { N: false, S: false, E: false, W: false };
      
      // Update neighbors
      this.updateConnections(r - 1, c);
      this.updateConnections(r + 1, c);
      this.updateConnections(r, c - 1);
      this.updateConnections(r, c + 1);
      return true;
    }
    return false;
  }

  updateConnections(r: number, c: number) {
    const tile = this.getTile(r, c);
    if (!tile || (tile.type !== TileType.ROAD && tile.type !== TileType.HOUSE && tile.type !== TileType.DESTINATION && tile.type !== TileType.TRACK)) return;

    tile.connections.N = this.isConnectable(r - 1, c);
    tile.connections.S = this.isConnectable(r + 1, c);
    tile.connections.W = this.isConnectable(r, c - 1);
    tile.connections.E = this.isConnectable(r, c + 1);
  }

  isConnectable(r: number, c: number): boolean {
    const neighbor = this.getTile(r, c);
    return neighbor !== null && neighbor.type !== TileType.EMPTY;
  }

  worldToGrid(x: number, y: number, offsetX: number, offsetY: number): GridPos {
    const c = Math.floor((x - offsetX) / TILE_SIZE);
    const r = Math.floor((y - offsetY) / TILE_SIZE);
    return { r, c };
  }

  gridToWorld(r: number, c: number, offsetX: number, offsetY: number) {
    return {
      x: offsetX + c * TILE_SIZE + TILE_SIZE / 2,
      y: offsetY + r * TILE_SIZE + TILE_SIZE / 2
    };
  }

  placeTrafficLight(r: number, c: number) {
    const tile = this.getTile(r, c);
    if (tile && (tile.type === TileType.ROAD)) {
      // Avoid duplicates
      if (!this.trafficLights.find(l => l.pos.r === r && l.pos.c === c)) {
          this.trafficLights.push(new TrafficLight({ r, c }));
      }
    }
  }

  placeRoundabout(r: number, c: number): boolean {
    // Check 2x2 area
    for (let dr = 0; dr < 2; dr++) {
        for (let dc = 0; dc < 2; dc++) {
            const tr = r + dr;
            const tc = c + dc;
            if (tr >= GRID_SIZE || tc >= GRID_SIZE) return false;
            if (this.tiles[tr][tc].type !== TileType.EMPTY) return false;
        }
    }

    // Place
    const rb = new Roundabout(Math.random().toString(), { r, c });
    this.roundabouts.push(rb);

    const center = {
        x: (c + 1) * TILE_SIZE,
        y: (r + 1) * TILE_SIZE
    };

    for (const tilePos of rb.getTiles()) {
        const tile = this.tiles[tilePos.r][tilePos.c];
        tile.type = TileType.ROAD;
        tile.roundaboutCenter = center;
        this.updateConnections(tilePos.r, tilePos.c);
    }
    return true;
  }
}
