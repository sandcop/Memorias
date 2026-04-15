export const GRID_SIZE = 60;
export const TILE_SIZE = 22;
export const WORLD_SIZE = GRID_SIZE * TILE_SIZE;

export const COLORS = {
  BACKGROUND: '#f0f4f5', // Soft land color
  SHORE: '#e9e4d0',      // Sand color for coasts
  WATER: '#7bc8e2',       // Sky blue water
  VEHICLE: '#ffffff',
  ROAD: '#2d3436',        // Asphalt color
  ROAD_HOVER: 'rgba(255, 255, 255, 0.4)',
  GRID_LINES: '#e8e4e1',
  HIGHWAY: '#eb4d4b',     // Motorways are vibrant
  MOUNTAIN: '#eb4d4b',    // Topographic red
  BUILDINGS: {
    RED: '#ff5e57',
    BLUE: '#3c40c6',
    GREEN: '#05c46b',
    YELLOW: '#ffa801',
    PURPLE: '#845ef7'
  }
};

export const CITY_NAMES = [
    'Reykjavík', 'Tegucigalpa', 'Antananarivo', 'Ouagadougou', 
    'Sri Jayawardenepura Kotte', 'Thiruvananthapuram', 'Bandar Seri Begawan',
    'Ulaanbaatar', 'Ashgabat', 'Naypyidaw', 'Antsirabe', 'Tsimbazaza'
];

export type ResourceColor = keyof typeof COLORS.BUILDINGS;
