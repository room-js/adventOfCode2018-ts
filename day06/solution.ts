import readInput from '../helpers/readInput';

interface ICell {
  coord?: number; // if it exists - that means the cell is one of the coordinates. Number is a coordinate index
  isEqualMinDist?: boolean;
  minDistIndex?: number;
  smallDistance?: boolean;
}

const inputArray: string[] = readInput(__dirname);

let maxX: number = 0;
let maxY: number = 0;

const coords: number[][] = inputArray.map((str) => {
  const [x, y] = str.split(', ').map(Number);
  if (x > maxX) { maxX = x; }
  if (y > maxY) { maxY = y; }
  return [x, y];
});

function calcDistance([x1, y1]: number[], [x2, y2]: number[]): number {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

const grid: ICell[][] = [[]];
const infiniteIndices: Set<number> = new Set();
const areas: number[] = [];
let curCoordIndex: number | undefined;
let curDistances: number[];
let curMinDistance: number;
let isEqualMinDist: boolean;
let minDistIndex: number;
let shortLocationRegionArea: number = 0;
let curTotalDistance: number;

for (let x = 0; x <= maxX; x++) {
  grid[x] = grid[x] || [];
  for (let y = 0; y <= maxY; y++) {
    grid[x][y] = {};
    curCoordIndex = coords.findIndex((c) => c[0] === x && c[1] === y);
    curDistances = coords.map((c, index) => calcDistance(c, [x, y]));
    curMinDistance = Math.min(...curDistances);
    isEqualMinDist = curDistances.filter((d) => d === curMinDistance).length > 1;
    minDistIndex = curDistances.findIndex((cd) => cd === curMinDistance);
    curTotalDistance = curDistances.reduce((dist: number, curDist: number) => (dist + curDist), 0);

    if (curTotalDistance < 10000) {
      shortLocationRegionArea++;
    }

    if (curCoordIndex !== -1) {
      grid[x][y].coord = curCoordIndex;
      continue;
    }

    if (isEqualMinDist) {
      grid[x][y].isEqualMinDist = true;
      continue;
    }

    grid[x][y].minDistIndex = minDistIndex;
    if (x === 0 || x === maxX || y === 0 || y === maxY) {
      infiniteIndices.add(minDistIndex);
    } else {
      areas[minDistIndex] = areas[minDistIndex] ? (areas[minDistIndex] + 1) : 1;
    }
  }
}

const finiteAreas: number[] = areas.filter((v, i) => v && !infiniteIndices.has(i));
const maxFiniteArea: number = Math.max(...finiteAreas) + 1; // include 1 for coordinate itself

console.log('[PART 1]: Size of the largest finite area:', maxFiniteArea);
console.log('[PART 2]: Size of region with short total distance:', shortLocationRegionArea);
