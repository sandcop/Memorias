import { Grid } from '../map/Grid';
import { Renderer } from '../ui/Renderer';
import { Building, House, Destination } from '../buildings/Building';
import { Vehicle } from '../traffic/Vehicle';
import { Train } from '../traffic/Train';
import { AudioEngine } from './AudioEngine';
import { GRID_SIZE, WORLD_SIZE, CITY_NAMES } from './Constants';
import type { ResourceColor } from './Constants';
import { TileType, VehicleState, TerrainType } from './Types';
import type { GridPos } from './Types';

export class Game {
  grid: Grid;
  renderer: Renderer;
  audio: AudioEngine;
  buildings: Building[] = [];
  vehicles: Vehicle[] = [];
  trains: Train[] = [];
  
  roadsLimit: number = 30;
  highwaysLimit: number = 2; 
  trafficLightsLimit: number = 2; 
  roundaboutsLimit: number = 1;
  tracksLimit: number = 10;
  bridgesLimit: number = 5;
  tunnelsLimit: number = 5;
  activeTool: 'ROAD' | 'HIGHWAY' | 'TRAFFIC_LIGHT' | 'ROUNDABOUT' | 'TRACK' | 'BULLDOZER' | 'BRIDGE' | 'TUNNEL' = 'ROAD';
  highwayStartPos: GridPos | null = null;
  
  score: number = 0;
  days: number = 1;
  timer: number = 0;
  spawnTimer: number = 0;
  
  gameSpeed: number = 1;
  cameraX: number = 0;
  cameraY: number = 0;

  offsetX: number = 0;
  offsetY: number = 0;
  cityName: string = '';

  isGameOver: boolean = false;
  isPaused: boolean = false;
  isStarted: boolean = false;
  isDrawing: boolean = false;
  hoverTile: GridPos | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.grid = new Grid();
    this.renderer = new Renderer(canvas);
    this.audio = new AudioEngine();
    this.setupInput(canvas);
    this.calculateOffsets();
    
    // Choose City
    this.cityName = CITY_NAMES[Math.floor(Math.random() * CITY_NAMES.length)];
    const mapTypes: ('ISLAND' | 'MOUNTAIN' | 'CONTINENT')[] = ['ISLAND', 'MOUNTAIN', 'CONTINENT'];
    this.grid.generateTerrain(mapTypes[Math.floor(Math.random() * mapTypes.length)]);

    // Initial Spawn
    this.spawnBuildingPair();
  }

  calculateOffsets() {
    this.offsetX = (window.innerWidth - WORLD_SIZE) / 2 + this.cameraX;
    this.offsetY = (window.innerHeight - WORLD_SIZE) / 2 + this.cameraY;
  }

  setupInput(canvas: HTMLCanvasElement) {
    window.addEventListener('resize', () => {
      this.renderer.resize();
      this.calculateOffsets();
    });

    canvas.addEventListener('mousedown', (e) => {
      if (this.isGameOver || this.isPaused || !this.isStarted) return;
      this.isDrawing = true;
      this.handleInput(e.clientX, e.clientY, false);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isGameOver || this.isPaused || !this.isStarted) return;
      const pos = this.grid.worldToGrid(e.clientX, e.clientY, this.offsetX, this.offsetY);
      if (pos.r >= 0 && pos.r < GRID_SIZE && pos.c >= 0 && pos.c < GRID_SIZE) {
        this.hoverTile = pos;
        if (this.isDrawing) {
          this.handleInput(e.clientX, e.clientY, true);
        }
      } else {
        this.hoverTile = null;
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDrawing = false;
    });

    window.addEventListener('keydown', (e) => {
        if (!this.isStarted) return;

        if (e.code === 'Space') {
            this.togglePause();
        }

        if (e.key === 'h' || e.key === 'H') {
            this.activeTool = 'HIGHWAY';
            this.highwayStartPos = null;
            this.updateUI();
        }

        if (e.key === 't' || e.key === 'T') {
            this.activeTool = 'TRAFFIC_LIGHT';
            this.highwayStartPos = null;
            this.updateUI();
        }

        if (e.key === 'o' || e.key === 'O' || e.key === 'r' || e.key === 'R') {
            this.activeTool = (e.key === 'o' || e.key === 'O') ? 'ROUNDABOUT' : 'ROAD';
            this.highwayStartPos = null;
            this.updateUI();
        }

        if (e.key.toLowerCase() === 'v') {
            this.activeTool = 'TRACK';
            this.highwayStartPos = null;
            this.updateUI();
        }

        if (e.key.toLowerCase() === 'x') {
            this.activeTool = 'BULLDOZER';
            this.highwayStartPos = null;
            this.updateUI();
        }

        if (e.key.toLowerCase() === 'p') {
            this.activeTool = 'BRIDGE';
            this.highwayStartPos = null;
            this.updateUI();
        }

        if (e.key.toLowerCase() === 't') {
            this.activeTool = 'TUNNEL';
            this.highwayStartPos = null;
            this.updateUI();
        }

        const camStep = 20;
        if (e.key.toLowerCase() === 'w') this.cameraY += camStep;
        if (e.key.toLowerCase() === 's') this.cameraY -= camStep;
        if (e.key.toLowerCase() === 'a') this.cameraX += camStep;
        if (e.key.toLowerCase() === 'd') this.cameraX -= camStep;
        this.calculateOffsets();
    });

    // Start Button
    document.getElementById('start-game-btn')?.addEventListener('click', () => {
        this.audio.init();
        this.startGame();
    });
    document.getElementById('track-count-container')!.addEventListener('click', () => { this.activeTool = 'TRACK'; this.highwayStartPos = null; this.updateUI(); });
    document.getElementById('bulldozer-btn')!.addEventListener('click', () => { this.activeTool = 'BULLDOZER'; this.highwayStartPos = null; this.updateUI(); });
    document.getElementById('bridge-count-container')!.addEventListener('click', () => { this.activeTool = 'BRIDGE'; this.highwayStartPos = null; this.updateUI(); });
    document.getElementById('tunnel-count-container')!.addEventListener('click', () => { this.activeTool = 'TUNNEL'; this.highwayStartPos = null; this.updateUI(); });

    // Reward Buttons
    document.getElementById('reward-opt-1')?.addEventListener('click', () => this.applyReward(1));
    document.getElementById('reward-opt-2')?.addEventListener('click', () => this.applyReward(2));

    // Speed Controls
    document.getElementById('speed-x1')?.addEventListener('click', () => {
        this.gameSpeed = 1;
        this.updateSpeedUI();
    });
    document.getElementById('speed-x2')?.addEventListener('click', () => {
        this.gameSpeed = 2;
        this.updateSpeedUI();
    });
  }

  updateSpeedUI() {
      document.getElementById('speed-x1')?.classList.toggle('active', this.gameSpeed === 1);
      document.getElementById('speed-x2')?.classList.toggle('active', this.gameSpeed === 2);
  }

  handleInput(x: number, y: number, isContinuous: boolean) {
    const pos = this.grid.worldToGrid(x, y, this.offsetX, this.offsetY);
    const tile = this.grid.getTile(pos.r, pos.c);
    if (!tile) return;

    if (this.activeTool === 'ROAD' || this.activeTool === 'BRIDGE' || this.activeTool === 'TUNNEL') {
      const isWater = tile.terrain === TerrainType.WATER;
      const isMountain = tile.terrain === TerrainType.MOUNTAIN;

      // Logic check: Bridge for water, Tunnel for mountain, Road for plain
      if (isWater && this.activeTool !== 'BRIDGE') return;
      if (isMountain && this.activeTool !== 'TUNNEL') return;
      if (!isWater && !isMountain && (this.activeTool === 'BRIDGE' || this.activeTool === 'TUNNEL')) return;

      if (isWater && this.bridgesLimit <= 0) return;
      if (isMountain && this.tunnelsLimit <= 0) return;

      if (tile.type === TileType.EMPTY && this.roadsLimit > 0) {
        this.grid.placeRoad(pos.r, pos.c);
        this.roadsLimit--;
        if (isWater) this.bridgesLimit--;
        if (isMountain) this.tunnelsLimit--;
        this.updateUI();
      }
    } else if (this.activeTool === 'HIGHWAY') {
        // Highways should NOT be placed continuously
        if (isContinuous) return;

        if (!this.highwayStartPos) {
            // Check if start is valid
            if (tile.type !== TileType.EMPTY) {
                this.highwayStartPos = pos;
            }
        } else {
            // Check if end is valid and different
            if (pos.r === this.highwayStartPos.r && pos.c === this.highwayStartPos.c) {
                this.highwayStartPos = null; // Cancel
                return;
            }

            if (tile.type !== TileType.EMPTY && this.highwaysLimit > 0) {
                this.grid.highways.push({
                    id: Math.random().toString(),
                    start: this.highwayStartPos,
                    end: pos
                });
                this.highwaysLimit--;
                this.highwayStartPos = null;
                this.updateUI();
            }
        }
    } else if (this.activeTool === 'TRAFFIC_LIGHT') {
        if (isContinuous) return;
        if (tile.type === TileType.ROAD && this.trafficLightsLimit > 0) {
            this.grid.placeTrafficLight(pos.r, pos.c);
            this.trafficLightsLimit--;
            this.updateUI();
        }
    } else if (this.activeTool === 'ROUNDABOUT') {
        if (isContinuous) return;
        if (this.roundaboutsLimit > 0) {
            const success = this.grid.placeRoundabout(pos.r, pos.c);
            if (success) {
                this.roundaboutsLimit--;
                this.updateUI();
            }
        }
    } else if (this.activeTool === 'TRACK') {
        if (tile.type === TileType.EMPTY && this.tracksLimit > 0) {
            this.grid.placeTrack(pos.r, pos.c);
            this.tracksLimit--;
            this.updateUI();
        }
    } else if (this.activeTool === 'BULLDOZER') {
        const removed = this.grid.removeTile(pos.r, pos.c);
        if (removed) {
            this.updateUI();
        }
    }
  }

  spawnBuildingPair() {
    const colors: ResourceColor[] = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Spawn Destination
    const destPos = this.getRandomEmptyPos();
    const dest = new Destination(Math.random().toString(), destPos, color);
    this.buildings.push(dest);
    this.grid.tiles[destPos.r][destPos.c].type = TileType.DESTINATION;
    this.grid.tiles[destPos.r][destPos.c].color = color;
    this.grid.updateConnections(destPos.r, destPos.c);
    this.audio.playBuildingSpawn();

    // Spawn 2 Houses for this destination
    for (let i = 0; i < 2; i++) {
        const housePos = this.getRandomEmptyPosNear(destPos, 5);
        const house = new House(Math.random().toString(), housePos, color);
        this.buildings.push(house);
        this.grid.tiles[housePos.r][housePos.c].type = TileType.HOUSE;
        this.grid.tiles[housePos.r][housePos.c].color = color;
        this.grid.updateConnections(housePos.r, housePos.c);
        this.audio.playBuildingSpawn();
    }
  }

  getRandomEmptyPos(): GridPos {
    let r, c, attempts = 0;
    do {
      r = Math.floor(Math.random() * (GRID_SIZE - 4)) + 2;
      c = Math.floor(Math.random() * (GRID_SIZE - 4)) + 2;
      attempts++;
    } while (attempts < 200 && (this.grid.tiles[r][c].type !== TileType.EMPTY || this.grid.tiles[r][c].terrain !== TerrainType.PLAIN));
    return { r, c };
  }

  getRandomEmptyPosNear(pos: GridPos, dist: number): GridPos {
      let r, c, attempts = 0;
      do {
          r = pos.r + Math.floor(Math.random() * dist * 2) - dist;
          c = pos.c + Math.floor(Math.random() * dist * 2) - dist;
          attempts++;
          if (attempts > 100) return this.getRandomEmptyPos();
      } while (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE || this.grid.tiles[r][c].type !== TileType.EMPTY || this.grid.tiles[r][c].terrain !== TerrainType.PLAIN);
      return { r, c };
  }

  update(dt: number) {
    if (this.isGameOver || this.isPaused || !this.isStarted) return;
    
    dt *= this.gameSpeed;

    this.timer += dt;
    if (this.timer >= 10000) { // Every 10 seconds is a "day"
        this.days++;
        this.timer = 0;
        
        // Weekly Reward (Every 7 days)
        if (this.days % 7 === 1 && this.days > 1) {
            this.handleWeeklyReward();
        } else {
            this.roadsLimit += 3; // Daily bonus
        }
        this.updateUI();
    }

    // Difficulty scaling: New pair every X seconds, decreasing as days pass
    const spawnRate = Math.max(8000, 20000 - (this.days * 500)); 
    this.spawnTimer += dt;
    if (this.spawnTimer >= spawnRate) {
        this.spawnBuildingPair();
        this.spawnTimer = 0;
    }

    // Update Traffic Lights
    this.grid.trafficLights.forEach(l => l.update(dt));

    // Update Buildings (Animations & Demand)
    this.buildings.forEach(b => {
      if (b.spawnProgress < 1) {
          b.spawnProgress = Math.min(1, b.spawnProgress + dt * 0.002); // 500ms anim
      }

      if (b instanceof Destination) {
        b.update(dt);
        if (b.isOverloaded && !this.isGameOver) {
            this.triggerGameOver();
        }
      }
    });

    // Check for car spawning
    this.buildings.forEach(b => {
        if (b instanceof House) {
            const existingVehicle = this.vehicles.find(v => v.homePos.r === b.pos.r && v.homePos.c === b.pos.c && v.state !== VehicleState.ARRIVED);
            
            if (!existingVehicle) {
                // Try to find demand
                const dest = this.buildings.find(d => d instanceof Destination && d.color === b.color && (d as Destination).demand > 0);
                if (dest) {
                    const vehicle = new Vehicle(Math.random().toString(), b.color, b.pos, dest.pos, this.grid);
                    if (vehicle.state !== VehicleState.IDLE) {
                        this.vehicles.push(vehicle);
                        (dest as Destination).demand--;
                    }
                }
            } else if (existingVehicle.state === VehicleState.IDLE) {
                // Retry pathfinding if stuck at home
                existingVehicle.calculatePath(this.grid, existingVehicle.homePos, existingVehicle.destPos);
            }
        }
    });

    // Update Vehicles
    for (let i = this.vehicles.length - 1; i >= 0; i--) {
      const v = this.vehicles[i];
      const reachedDest = v.update(dt, this.grid);
      
      if (reachedDest) {
          this.score++;
          this.updateUI();
          this.audio.playTripSuccess();
          this.renderer.createSmokePuff(v.currentPos.x, v.currentPos.y);
      }

      if (v.state === VehicleState.ARRIVED) {
        this.renderer.createSmokePuff(v.currentPos.x, v.currentPos.y);
        this.vehicles.splice(i, 1);
      }
    }

    // Update Trains
    for (let i = this.trains.length - 1; i >= 0; i--) {
        const t = this.trains[i];
        const reachedEnd = t.update(dt * 2, this.grid); // Trains are fast
        if (reachedEnd) {
            this.score += 5; // Trains are high reward
            this.updateUI();
            this.trains.splice(i, 1);
        }
    }

    // Periodic Train Spawning
    if (this.days > 2 && Math.random() < 0.001) {
        this.spawnTrain();
    }
  }

  spawnTrain() {
    // Basic logic: find consecutive tracks
    // For simplicity, we'll just check if there are many tracks
    const trackTiles = [];
    for(let r=0; r<GRID_SIZE; r++) {
        for(let c=0; c<GRID_SIZE; c++) {
            if (this.grid.tiles[r][c].type === TileType.TRACK) trackTiles.push({r, c});
        }
    }
    if (trackTiles.length > 5) {
        this.trains.push(new Train(Math.random().toString(), trackTiles[0], trackTiles));
    }
  }

  updateUI() {
    document.getElementById('score')!.innerText = this.score.toString();
    document.getElementById('day')!.innerText = this.days.toString();
    document.getElementById('cityName')!.innerText = this.cityName;
    document.getElementById('road-count')!.innerText = this.roadsLimit.toString();
    document.getElementById('highway-count')!.innerText = this.highwaysLimit.toString();
    document.getElementById('traffic-count')!.innerText = this.trafficLightsLimit.toString();
    document.getElementById('roundabout-count')!.innerText = this.roundaboutsLimit.toString();
    document.getElementById('track-count')!.innerText = this.tracksLimit.toString();
    document.getElementById('bridge-count')!.innerText = this.bridgesLimit.toString();
    document.getElementById('tunnel-count')!.innerText = this.tunnelsLimit.toString();
    
    // UI feedback for active tool
    const roadBox = document.getElementById('road-count-container');
    const highwayBox = document.getElementById('highway-count-container');
    const trafficBox = document.getElementById('traffic-count-container');
    const roundaboutBox = document.getElementById('roundabout-count-container');
    const trackBox = document.getElementById('track-count-container');
    const bulldozerBox = document.getElementById('bulldozer-btn');
    const bridgeBox = document.getElementById('bridge-count-container');
    const tunnelBox = document.getElementById('tunnel-count-container');

    if (roadBox && highwayBox && trafficBox && roundaboutBox && trackBox && bulldozerBox && bridgeBox && tunnelBox) {
        roadBox.style.border = this.activeTool === 'ROAD' ? '2px solid #2d3436' : '1px solid rgba(0,0,0,0.08)';
        highwayBox.style.border = this.activeTool === 'HIGHWAY' ? '2px solid #2ecc71' : '1px solid rgba(0,0,0,0.08)';
        trafficBox.style.border = this.activeTool === 'TRAFFIC_LIGHT' ? '2px solid #e74c3c' : '1px solid rgba(0,0,0,0.08)';
        roundaboutBox.style.border = this.activeTool === 'ROUNDABOUT' ? '2px solid #4a90e2' : '1px solid rgba(0,0,0,0.08)';
        trackBox.style.border = this.activeTool === 'TRACK' ? '2px solid #2d3436' : '1px solid rgba(0,0,0,0.08)';
        bulldozerBox.style.border = this.activeTool === 'BULLDOZER' ? '2px solid #e74c3c' : '1px solid rgba(0,0,0,0.08)';
        bridgeBox.style.border = this.activeTool === 'BRIDGE' ? '2px solid #74b9ff' : '1px solid rgba(0,0,0,0.08)';
        tunnelBox.style.border = this.activeTool === 'TUNNEL' ? '2px solid #636e72' : '1px solid rgba(0,0,0,0.08)';
    }
  }

  handleWeeklyReward() {
    this.isPaused = true;
    const overlay = document.getElementById('reward-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        this.generateRewardOptions();
    }
  }

  rewardOptions: any[] = [];

  generateRewardOptions() {
      const types = [
          { name: 'Carreteras', icon: '🛣️', amount: 20, tool: 'ROAD' },
          { name: 'Semáforos', icon: '🚦', amount: 2, tool: 'TRAFFIC_LIGHT' },
          { name: 'Rotonda', icon: '🔄', amount: 1, tool: 'ROUNDABOUT' },
          { name: 'Autopista', icon: '🛣️✨', amount: 1, tool: 'HIGHWAY' }
      ];

      // Pick two random
      const opt1 = types[Math.floor(Math.random() * types.length)];
      let opt2;
      do {
          opt2 = types[Math.floor(Math.random() * types.length)];
      } while (opt1 === opt2);

      this.rewardOptions = [opt1, opt2];

      const btn1 = document.getElementById('reward-opt-1');
      const btn2 = document.getElementById('reward-opt-2');

      if (btn1 && btn2) {
          btn1.querySelector('.label')!.textContent = `${opt1.amount} ${opt1.name}`;
          btn1.querySelector('.icon')!.textContent = opt1.icon;
          btn2.querySelector('.label')!.textContent = `${opt2.amount} ${opt2.name}`;
          btn2.querySelector('.icon')!.textContent = opt2.icon;
      }
  }

  applyReward(index: number) {
      const reward = this.rewardOptions[index - 1];
      if (reward.tool === 'ROAD') this.roadsLimit += reward.amount;
      if (reward.tool === 'TRAFFIC_LIGHT') this.trafficLightsLimit += reward.amount;
      if (reward.tool === 'ROUNDABOUT') this.roundaboutsLimit += reward.amount;
      if (reward.tool === 'HIGHWAY') this.highwaysLimit += reward.amount;

      this.isPaused = false;
      document.getElementById('reward-overlay')?.classList.add('hidden');
      this.updateUI();
  }

  togglePause() {
      this.isPaused = !this.isPaused;
      const pauseOverlay = document.getElementById('pause-overlay');
      if (pauseOverlay) {
          if (this.isPaused) pauseOverlay.classList.remove('hidden');
          else pauseOverlay.classList.add('hidden');
      }
  }

  startGame() {
      this.isStarted = true;
      document.getElementById('start-menu-overlay')?.classList.add('hidden');
      this.updateUI();
  }

  triggerGameOver() {
    this.isGameOver = true;
    document.getElementById('game-over-overlay')!.classList.remove('hidden');
    document.getElementById('final-score')!.innerText = this.score.toString();
    document.getElementById('final-weeks')!.innerText = Math.floor(this.days / 7).toString();
  }

  render(dt: number) {
    this.renderer.render(this.grid, this.buildings, this.vehicles, this.trains, this.offsetX, this.offsetY, this.hoverTile, this.highwayStartPos, dt);
  }

  start() {
    this.renderer.resize();
    let lastTime = performance.now();
    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      this.update(dt);
      this.render(dt);

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
