import { COLORS, TILE_SIZE } from '../core/Constants';
import { Grid } from '../map/Grid';
import { Destination } from '../buildings/Building';
import type { Building } from '../buildings/Building';
import type { Vehicle } from '../traffic/Vehicle';
import { TileType, TerrainType } from '../core/Types';
import { Train } from '../traffic/Train';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number; // 0 to 1
    color: string;
}

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: Particle[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  render(grid: Grid, buildings: Building[], vehicles: Vehicle[], trains: Train[], offsetX: number, offsetY: number, hoverTile: any, highwayStartPos: any, dt: number) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Background is Water
    this.ctx.fillStyle = COLORS.WATER;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawTerrain(grid, offsetX, offsetY);
    this.drawRoads(grid, offsetX, offsetY);
    this.drawHighways(grid, offsetX, offsetY);
    this.drawTrafficLights(grid, offsetX, offsetY);
    this.drawRoundabouts(grid, offsetX, offsetY);
    this.drawTracks(grid, offsetX, offsetY);
    
    if (highwayStartPos && hoverTile) {
        this.drawHighwayPreview(highwayStartPos, hoverTile, offsetX, offsetY);
    } else if (hoverTile) {
        this.drawHover(hoverTile, offsetX, offsetY);
    }

    this.drawBuildings(buildings, offsetX, offsetY);
    this.drawVehicles(vehicles, offsetX, offsetY);
    this.drawTrains(trains, offsetX, offsetY); // Added trains here
    
    this.updateAndDrawParticles(dt, offsetX, offsetY);
  }

  createSmokePuff(x: number, y: number) {
    for (let i = 0; i < 4; i++) {
        this.particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 0.05,
            vy: (Math.random() - 0.5) * 0.05,
            life: 1.0,
            color: `rgba(255, 255, 255, ${0.4 + Math.random() * 0.3})`
        });
    }
  }

  private updateAndDrawParticles(dt: number, offsetX: number, offsetY: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt * 0.0012; // Slower fade

        if (p.life <= 0) {
            this.particles.splice(i, 1);
            continue;
        }

        const screenX = offsetX + p.x;
        const screenY = offsetY + p.y;
        
        this.ctx.globalAlpha = p.life;
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, 8 * (1 - p.life * 0.5), 0, Math.PI * 2);
        this.ctx.fill();
    }
    this.ctx.globalAlpha = 1.0;
  }

  private drawTerrain(grid: Grid, offsetX: number, offsetY: number) {
    this.ctx.save();
    
    // Create the Island Path
    const landPath = new Path2D();
    for (let r = 0; r < grid.tiles.length; r++) {
      for (let c = 0; c < grid.tiles[r].length; c++) {
        const tile = grid.tiles[r][c];
        if (tile.terrain !== TerrainType.WATER) {
          const x = offsetX + c * TILE_SIZE + TILE_SIZE / 2;
          const y = offsetY + r * TILE_SIZE + TILE_SIZE / 2;
          landPath.moveTo(x + TILE_SIZE * 0.4, y);
          landPath.arc(x, y, TILE_SIZE * 0.8, 0, Math.PI * 2);
        }
      }
    }

    // 1. Layer: Shallow Water Depth (Pulsing Animation)
    const pulse = (Math.sin(Date.now() / 2500) + 1) / 2;
    this.ctx.strokeStyle = '#60a9c1';
    this.ctx.lineWidth = TILE_SIZE * (2.6 + pulse * 0.4);
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.globalAlpha = 0.3 + pulse * 0.15;
    this.ctx.stroke(landPath);
    this.ctx.globalAlpha = 1.0;

    // 2. Layer: Shore
    this.ctx.strokeStyle = COLORS.SHORE;
    this.ctx.lineWidth = TILE_SIZE * 1.5;
    this.ctx.stroke(landPath);
    
    // 3. Layer: Land Mass
    this.ctx.fillStyle = COLORS.BACKGROUND;
    this.ctx.fill(landPath);

    // 5. Layer: Tree Clusters (Organic Textures)
    this.drawTrees(grid, offsetX, offsetY);

    // 4. Layer: Topographic Mountains
    const mountainLevels = [
      { color: '#eb4d4b', size: TILE_SIZE * 0.95, stroke: TILE_SIZE * 0.4 },
      { color: '#c0392b', size: TILE_SIZE * 0.70, stroke: TILE_SIZE * 0.3 },
      { color: '#962d22', size: TILE_SIZE * 0.45, stroke: TILE_SIZE * 0.2 }
    ];

    mountainLevels.forEach(lvl => {
      this.ctx.fillStyle = lvl.color;
      this.ctx.strokeStyle = lvl.color;
      this.ctx.lineWidth = lvl.stroke;
      this.ctx.lineJoin = 'round';
      
      for (let r = 0; r < grid.tiles.length; r++) {
        for (let c = 0; c < grid.tiles[r].length; c++) {
          if (grid.tiles[r][c].terrain === TerrainType.MOUNTAIN) {
            const x = offsetX + c * TILE_SIZE + (TILE_SIZE - lvl.size)/2;
            const y = offsetY + r * TILE_SIZE + (TILE_SIZE - lvl.size)/2;
            this.ctx.fillRect(x, y, lvl.size, lvl.size);
            this.ctx.strokeRect(x, y, lvl.size, lvl.size);
          }
        }
      }
    });

    this.ctx.restore();
  }

  private drawTrees(grid: Grid, offsetX: number, offsetY: number) {
    const treeColor = 'rgba(46, 125, 50, 0.4)'; // Clear vibrant Park Green
    this.ctx.fillStyle = treeColor;
    this.ctx.strokeStyle = treeColor;
    this.ctx.lineWidth = TILE_SIZE * 1.5; // Very thick stroke to merge blobs
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';

    this.ctx.beginPath();
    for (let r = 0; r < grid.tiles.length; r++) {
      for (let c = 0; c < grid.tiles[r].length; c++) {
        const tile = grid.tiles[r][c];
        if (tile.terrain === TerrainType.PLAIN && tile.type === TileType.EMPTY) {
           // Clustered spawning logic
           const hash = (r * 789 + c * 123) % 100;
           if (hash < 1.0) { // Small centers for large clusters
               const x = offsetX + c * TILE_SIZE + TILE_SIZE / 2;
               const y = offsetY + r * TILE_SIZE + TILE_SIZE / 2;
               this.ctx.fillRect(x - 2, y - 2, 4, 4);
               this.ctx.strokeRect(x - 2, y - 2, 4, 4);
           }
        }
      }
    }
  }

  private drawRoads(grid: Grid, offsetX: number, offsetY: number) {
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    const roadWidth = TILE_SIZE * 0.45;

    for (let r = 0; r < grid.tiles.length; r++) {
      for (let c = 0; c < grid.tiles[r].length; c++) {
        const tile = grid.tiles[r][c];
        if (tile.type === TileType.ROAD) {
          const x = offsetX + c * TILE_SIZE + TILE_SIZE / 2;
          const y = offsetY + r * TILE_SIZE + TILE_SIZE / 2;

          // Road coloring for terrain
          let mainColor = COLORS.ROAD;
          if (tile.terrain === TerrainType.WATER) {
            mainColor = '#576574'; // Lighter grey for Bridge
          } else if (tile.terrain === TerrainType.MOUNTAIN) {
            mainColor = '#222f3e'; // Darker for Tunnel
          }

          this.ctx.strokeStyle = mainColor;
          this.ctx.lineWidth = roadWidth;
          this.ctx.setLineDash([]); // Solid base

          const conn = tile.connections;
          const count = (conn.N?1:0) + (conn.S?1:0) + (conn.E?1:0) + (conn.W?1:0);

          const drawRoadPath = (isDash: boolean) => {
            if (isDash) {
              this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
              this.ctx.lineWidth = 1.5;
              this.ctx.setLineDash([5, 5]);
            } else {
              this.ctx.setLineDash([]);
            }

            this.ctx.beginPath();
            if (count > 2) {
                this.ctx.moveTo(x, y);
                if (conn.N) this.ctx.lineTo(x, y - TILE_SIZE/2);
                if (conn.S) this.ctx.moveTo(x, y), this.ctx.lineTo(x, y + TILE_SIZE/2);
                if (conn.W) this.ctx.moveTo(x, y), this.ctx.lineTo(x - TILE_SIZE/2, y);
                if (conn.E) this.ctx.moveTo(x, y), this.ctx.lineTo(x + TILE_SIZE/2, y);
            } else if (count === 2) {
                if ((conn.N && conn.S) || (conn.E && conn.W)) {
                    if (conn.N && conn.S) {
                        this.ctx.moveTo(x, y - TILE_SIZE/2);
                        this.ctx.lineTo(x, y + TILE_SIZE/2);
                    } else {
                        this.ctx.moveTo(x - TILE_SIZE/2, y);
                        this.ctx.lineTo(x + TILE_SIZE/2, y);
                    }
                } else {
                    const radius = TILE_SIZE / 2;
                    if (conn.N && conn.E) this.ctx.arc(x + radius, y - radius, radius, Math.PI, Math.PI * 0.5, true);
                    else if (conn.N && conn.W) this.ctx.arc(x - radius, y - radius, radius, 0, Math.PI * 0.5);
                    else if (conn.S && conn.E) this.ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
                    else if (conn.S && conn.W) this.ctx.arc(x - radius, y + radius, radius, 0, Math.PI * 1.5, true);
                }
            } else if (count === 1) {
                this.ctx.moveTo(x,y);
                if (conn.N) this.ctx.lineTo(x, y - TILE_SIZE/2);
                if (conn.S) this.ctx.lineTo(x, y + TILE_SIZE/2);
                if (conn.W) this.ctx.lineTo(x - TILE_SIZE/2, y);
                if (conn.E) this.ctx.lineTo(x + TILE_SIZE/2, y);
            }
            this.ctx.stroke();
          };

          drawRoadPath(false); // Base Asphalt
          drawRoadPath(true);  // Dash lines
          this.ctx.setLineDash([]); // Reset
        }
      }
    }
  }

  private drawHighways(grid: Grid, offsetX: number, offsetY: number) {
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    grid.highways.forEach(hw => {
      const start = grid.gridToWorld(hw.start.r, hw.start.c, offsetX, offsetY);
      const end = grid.gridToWorld(hw.end.r, hw.end.c, offsetX, offsetY);
      
      this.ctx.save();
      
      // Calculate arc
      const mx = (start.x + end.x) / 2;
      const my = (start.y + end.y) / 2;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      // Control point for arc (perpendicular to center)
      const ctrlX = mx - dy * 0.2; 
      const ctrlY = my + dx * 0.2;

      // 1. Thick Glow Shadow
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = 'rgba(235, 77, 75, 0.4)';
      this.ctx.strokeStyle = 'rgba(235, 77, 75, 0.4)';
      this.ctx.lineWidth = 14;
      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.quadraticCurveTo(ctrlX, ctrlY, end.x, end.y);
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      // 2. Main Vibrant Path
      this.ctx.strokeStyle = '#eb4d4b'; // Vibrant Pinkish Red
      this.ctx.lineWidth = 10;
      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.quadraticCurveTo(ctrlX, ctrlY, end.x, end.y);
      this.ctx.stroke();

      // 3. Inner Light Path
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.quadraticCurveTo(ctrlX, ctrlY, end.x, end.y);
      this.ctx.stroke();
      
      this.ctx.restore();
    });
  }

  private drawRoundabouts(grid: Grid, offsetX: number, offsetY: number) {
    grid.roundabouts.forEach(rb => {
        // Center is between the 4 tiles
        const x = offsetX + rb.pos.c * TILE_SIZE + TILE_SIZE;
        const y = offsetY + rb.pos.r * TILE_SIZE + TILE_SIZE;
        const radius = TILE_SIZE * 0.9;

        // Outer ring
        this.ctx.strokeStyle = COLORS.ROAD;
        this.ctx.lineWidth = 12;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.stroke();

        // Inner part (shading)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius - 8, 0, Math.PI * 2);
        this.ctx.fill();

        // Logo or center deco
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 10, 0, Math.PI * 2);
        this.ctx.stroke();
    });
  }

  private drawTrafficLights(grid: Grid, offsetX: number, offsetY: number) {
    grid.trafficLights.forEach(light => {
      const pos = this.gridToWorldPos(light.pos, offsetX, offsetY);
      const size = 12;

      // Base
      this.ctx.fillStyle = '#2d3436';
      this.ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size);

      // Light Indicator
      // North-South Indicator
      this.ctx.fillStyle = light.state === 'NS_GREEN' ? '#2ecc71' : '#e74c3c';
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y - size / 4, size / 5, 0, Math.PI * 2);
      this.ctx.fill();

      // East-West Indicator
      this.ctx.fillStyle = light.state === 'EW_GREEN' ? '#2ecc71' : '#e74c3c';
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y + size / 4, size / 5, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  private drawTracks(grid: Grid, offsetX: number, offsetY: number) {
      this.ctx.strokeStyle = '#2d3436';
      this.ctx.lineWidth = 10;
      this.ctx.lineCap = 'butt';

      for (let r = 0; r < grid.tiles.length; r++) {
          for (let c = 0; c < grid.tiles[r].length; c++) {
              const tile = grid.tiles[r][c];
              if (tile.type === TileType.TRACK) {
                  const x = offsetX + c * TILE_SIZE + TILE_SIZE / 2;
                  const y = offsetY + r * TILE_SIZE + TILE_SIZE / 2;
                  const conn = tile.connections;

                  // Main Rail Line
                  this.ctx.beginPath();
                  if (conn.N) this.ctx.moveTo(x, y), this.ctx.lineTo(x, y - TILE_SIZE/2);
                  if (conn.S) this.ctx.moveTo(x, y), this.ctx.lineTo(x, y + TILE_SIZE/2);
                  if (conn.W) this.ctx.moveTo(x, y), this.ctx.lineTo(x - TILE_SIZE/2, y);
                  if (conn.E) this.ctx.moveTo(x, y), this.ctx.lineTo(x + TILE_SIZE/2, y);
                  this.ctx.stroke();

                  // Rail Ties (perpendicular lines)
                  this.ctx.strokeStyle = '#636e72';
                  this.ctx.lineWidth = 2;
                  if (conn.N || conn.S) {
                      this.ctx.beginPath();
                      this.ctx.moveTo(x - 8, y); this.ctx.lineTo(x + 8, y);
                      this.ctx.stroke();
                  } else {
                      this.ctx.beginPath();
                      this.ctx.moveTo(x, y - 8); this.ctx.lineTo(x, y + 8);
                      this.ctx.stroke();
                  }
                  this.ctx.strokeStyle = '#2d3436';
                  this.ctx.lineWidth = 10;
              }
          }
      }
  }

  private drawTrains(trains: Train[], offsetX: number, offsetY: number) {
    trains.forEach(t => {
        this.ctx.save();
        this.ctx.translate(offsetX + t.currentPos.x, offsetY + t.currentPos.y);
        this.ctx.rotate(t.angle);

        // Train Car
        this.ctx.fillStyle = '#eb4d4b';
        const w = 24;
        const h = 10;
        this.ctx.beginPath();
        this.ctx.roundRect(-w/2, -h/2, w, h, 2);
        this.ctx.fill();

        // Windows
        this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
        for (let i=0; i<3; i++) {
            this.ctx.fillRect(-w/2 + 4 + i*6, -h/2 + 2, 4, h-4);
        }

        this.ctx.restore();
    });
  }

  private drawHighwayPreview(startPos: any, endPos: any, offsetX: number, offsetY: number) {
    const start = this.gridToWorldPos(startPos, offsetX, offsetY);
    const end = this.gridToWorldPos(endPos, offsetX, offsetY);

    this.ctx.strokeStyle = 'rgba(46, 204, 113, 0.5)';
    this.ctx.lineWidth = 6;
    this.ctx.setLineDash([10, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  private gridToWorldPos(pos: any, offsetX: number, offsetY: number) {
    return {
      x: offsetX + pos.c * TILE_SIZE + TILE_SIZE / 2,
      y: offsetY + pos.r * TILE_SIZE + TILE_SIZE / 2
    };
  }

  private drawHover(tile: any, offsetX: number, offsetY: number) {
      this.ctx.fillStyle = COLORS.ROAD_HOVER;
      const x = offsetX + tile.c * TILE_SIZE;
      const y = offsetY + tile.r * TILE_SIZE;
      this.ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  }

  private drawBuildings(buildings: Building[], offsetX: number, offsetY: number) {
    buildings.forEach(b => {
      const bx = offsetX + b.pos.c * TILE_SIZE + TILE_SIZE / 2;
      const by = offsetY + b.pos.r * TILE_SIZE + TILE_SIZE / 2;
      const color = COLORS.BUILDINGS[b.color];

      // 1. Draw Long Shadow
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      const shadowLength = TILE_SIZE * 4;
      this.ctx.beginPath();
      const shadowW = b.type === TileType.HOUSE ? TILE_SIZE * 0.5 : TILE_SIZE * 1.0;
      this.ctx.moveTo(bx - shadowW/2, by);
      this.ctx.lineTo(bx + shadowW/2, by);
      this.ctx.lineTo(bx + shadowW/2 + shadowLength, by + shadowLength);
      this.ctx.lineTo(bx - shadowW/2 + shadowLength, by + shadowLength);
      this.ctx.fill();

      // 2. Draw Building Body
      this.ctx.fillStyle = color;
      
      if (b.type === TileType.HOUSE) {
        const size = TILE_SIZE * 0.6;
        this.ctx.beginPath();
        this.ctx.roundRect(bx - size/2, by - size/2, size, size, 4);
        this.ctx.fill();
        
        // Soft Highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.fillRect(bx - size/2, by - size/2, size, size/4);
      } else {
        const dest = b as Destination;
        const size = TILE_SIZE * 1.4; // Slightly larger factories
        
        // Factory Body
        this.ctx.beginPath();
        this.ctx.roundRect(bx - size / 2, by - size / 2, size, size, 10);
        this.ctx.fill();

        // Top Highlight (Volumetric look)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        this.ctx.beginPath();
        this.ctx.roundRect(bx - size/2 + 4, by - size/2 + 4, size-8, size/3, 4);
        this.ctx.fill();

        // Pin Icon (Droplet Shape) - Scaled down
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.beginPath();
        const pinR = 4.5;
        this.ctx.arc(bx, by - 4, pinR, 0, Math.PI * 2); 
        this.ctx.moveTo(bx - pinR, by - 4);
        this.ctx.lineTo(bx, by + 4); 
        this.ctx.lineTo(bx + pinR, by - 4);
        this.ctx.fill();

        // Tiny inner dot for the pin
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(bx, by - 4, 1.8, 0, Math.PI * 2);
        this.ctx.fill();

        // 3. Demand Counter (High-Contrast Badge) - Scaled down
        if (dest.demand > 0) {
            const badgeR = 6;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(bx + size/2 - 3, by - size/2 + 3, badgeR, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#2d3436';
            this.ctx.font = 'bold 8px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(dest.demand.toString(), bx + size/2 - 3, by - size/2 + 3);
        }

        // Circular timer (Soft and thin)
        const progress = dest.collapseTimer / dest.maxCollapseTime;
        if (progress > 0) {
            const radius = size / 2 + 5;
            this.ctx.strokeStyle = progress > 0.8 ? '#eb4d4b' : 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(bx, by, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
            this.ctx.stroke();
        }
      }
    });
  }

  private drawVehicles(vehicles: Vehicle[], offsetX: number, offsetY: number) {
    vehicles.forEach(v => {
      this.ctx.fillStyle = COLORS.VEHICLE;
      this.ctx.beginPath();
      // ... (color selection)
      this.ctx.fillStyle = v.color === 'RED' ? '#ff7675' : 
                          v.color === 'BLUE' ? '#74b9ff' : 
                          v.color === 'GREEN' ? '#55efc4' : 
                          v.color === 'YELLOW' ? '#ffeaa7' : '#a29bfe';
      
      this.ctx.save();
      this.ctx.translate(offsetX + v.currentPos.x, offsetY + v.currentPos.y);
      this.ctx.rotate(v.angle);
      
      // Draw car body
      const w = 14;
      const h = 8;
      this.ctx.beginPath();
      this.ctx.roundRect(-w / 2, -h / 2, w, h, 2);
      this.ctx.fill();
      
      // Front lights/indicator
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      this.ctx.fillRect(w/2 - 3, -h/2 + 1, 2, 2);
      this.ctx.fillRect(w/2 - 3, h/2 - 3, 2, 2);
      
      this.ctx.restore();
    });
  }
}
