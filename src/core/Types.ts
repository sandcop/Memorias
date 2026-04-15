import type { ResourceColor } from './Constants';
export type { ResourceColor };

export interface Point {
  x: number;
  y: number;
}

export interface GridPos {
  r: number;
  c: number;
}

export const VehicleState = {
  IDLE: 0,
  TOWARDS_DESTINATION: 1,
  TOWARDS_HOUSE: 2,
  ARRIVED: 3
} as const;

export type VehicleState = typeof VehicleState[keyof typeof VehicleState];

export const TileType = {
  EMPTY: 0,
  ROAD: 1,
  HOUSE: 2,
  DESTINATION: 3,
  TRACK: 4
} as const;

export type TileType = typeof TileType[keyof typeof TileType];

export const TerrainType = {
  PLAIN: 0,
  WATER: 1,
  MOUNTAIN: 2
} as const;

export type TerrainType = typeof TerrainType[keyof typeof TerrainType];

export interface IHighway {
  id: string;
  start: GridPos;
  end: GridPos;
  color?: ResourceColor;
}

export interface ITile {
  pos: GridPos;
  type: TileType;
  terrain: TerrainType;
  color?: ResourceColor;
  buildingId?: string;
  highwayId?: string; // ID of highway passing through/starting here
  connections: {
    N: boolean,
    S: boolean,
    E: boolean,
    W: boolean
  };
  roundaboutCenter?: Point;
}
