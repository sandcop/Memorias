import type { GridPos } from '../core/Types';
import { Grid } from '../map/Grid';
import { TileType } from '../core/Types';

interface Node {
  pos: GridPos;
  g: number;
  h: number;
  f: number;
  parent: Node | null;
}

export class Pathfinder {
  static findPath(grid: Grid, start: GridPos, end: GridPos): GridPos[] | null {
    const openSet: Node[] = [];
    const closedSet: Set<string> = new Set();

    const startNode: Node = {
      pos: start,
      g: 0,
      h: this.heuristic(start, end),
      f: 0,
      parent: null
    };
    startNode.f = startNode.g + startNode.h;

    openSet.push(startNode);

    while (openSet.length > 0) {
      // Get node with lowest f
      let currentIndex = 0;
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < openSet[currentIndex].f) {
          currentIndex = i;
        }
      }

      const current = openSet[currentIndex];

      // Reached goal
      if (current.pos.r === end.r && current.pos.c === end.c) {
        return this.reconstructPath(current);
      }

      // Remove from open, add to closed
      openSet.splice(currentIndex, 1);
      closedSet.add(`${current.pos.r},${current.pos.c}`);

      // Check neighbors
      const neighbors = this.getNeighbors(grid, current.pos);
      for (const neighborPos of neighbors) {
        if (closedSet.has(`${neighborPos.r},${neighborPos.c}`)) continue;

        const gScore = current.g + 1;
        let neighborNode = openSet.find(n => n.pos.r === neighborPos.r && n.pos.c === neighborPos.c);

        if (!neighborNode) {
          neighborNode = {
            pos: neighborPos,
            g: gScore,
            h: this.heuristic(neighborPos, end),
            f: 0,
            parent: current
          };
          neighborNode.f = neighborNode.g + neighborNode.h;
          openSet.push(neighborNode);
        } else if (gScore < neighborNode.g) {
          neighborNode.g = gScore;
          neighborNode.f = neighborNode.g + neighborNode.h;
          neighborNode.parent = current;
        }
      }
    }

    return null; // No path found
  }

  private static heuristic(a: GridPos, b: GridPos): number {
    return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
  }

  private static getNeighbors(grid: Grid, pos: GridPos): GridPos[] {
    const neighbors: GridPos[] = [];
    const dirs = [
      { r: -1, c: 0 }, { r: 1, c: 0 },
      { r: 0, c: -1 }, { r: 0, c: 1 }
    ];

    // Check normal neighbors
    for (const d of dirs) {
      const nr = pos.r + d.r;
      const nc = pos.c + d.c;
      const tile = grid.getTile(nr, nc);
      
      if (tile && (tile.type === TileType.ROAD || tile.type === TileType.HOUSE || tile.type === TileType.DESTINATION)) {
        neighbors.push({ r: nr, c: nc });
      }
    }

    // Check Highway shortcuts
    grid.highways.forEach(hw => {
      if (hw.start.r === pos.r && hw.start.c === pos.c) {
        neighbors.push(hw.end);
      } else if (hw.end.r === pos.r && hw.end.c === pos.c) {
        neighbors.push(hw.start);
      }
    });

    return neighbors;
  }

  private static reconstructPath(node: Node): GridPos[] {
    const path: GridPos[] = [];
    let current: Node | null = node;
    while (current) {
      path.unshift(current.pos);
      current = current.parent;
    }
    return path;
  }
}
