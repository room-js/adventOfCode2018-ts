import readInput from '../helpers/readInput';

const input: string[] = readInput(__dirname);
const serialNumber: number = Number(input[0]);
const gridSize: number = 300;
const fragmentSize: number = 3;
const grid: number[][] = [];

function calcCellPower(x: number, y: number): number {
  const rackId: number = x + 10;
  const powerLevel: number = (rackId * y + serialNumber) * rackId;
  const digit = Math.trunc(powerLevel % 1000 / 100) - 5;

  return digit;
}

function calcTotalPower(
  firstCellX: number,
  firstCellY: number,
  size: number = fragmentSize,
): number {
  let totalPower: number = 0;

  for (let y = firstCellY; y < firstCellY + size; y++) {
    for (let x = firstCellX; x < firstCellX + size; x++) {
      totalPower += grid[y][x];
    }
  }

  return totalPower;
}

function fillGrid(): void {
  for (let y = 1; y <= gridSize + 1; y++) {
    grid[y] = [];
    for (let x = 1; x <= gridSize + 1; x++) {
      grid[y][x] = calcCellPower(x, y);
    }
  }
}

function getCoordsOfSquare(size: number = fragmentSize): [number, number] {
  let currentTotalPower: number = 0;
  let maxTotalPower: number = 0;
  let maxPowerCoords: [number, number] = [0, 0];

  for (let y = 1; y <= gridSize - size; y++) {
    for (let x = 1; x <= gridSize - size; x++) {
      currentTotalPower = calcTotalPower(x, y);
      if (currentTotalPower > maxTotalPower) {
        maxPowerCoords = [x, y];
        maxTotalPower = currentTotalPower;
      }
    }
  }

  return maxPowerCoords;
}

function getMaxPowerSquare(): { x: number, y: number, size: number } {
  let coordsAndSize: number[] = [];
  let maxPower: number;

  for (let row = 1; row < gridSize; row++) {
    for (let cell = 1; cell < gridSize; cell++) {
      let squareSize: number = 1;
      while (Math.max(row, cell) + squareSize <= gridSize + 1) {
        const currentTotalPower: number = calcTotalPower(cell, row, squareSize);

        if (maxPower === undefined || currentTotalPower >= maxPower) {
          maxPower = currentTotalPower;
          coordsAndSize = [cell, row, squareSize];
        }

        squareSize++;
      }
    }
  }

  return {
    size: coordsAndSize[2],
    x: coordsAndSize[0],
    y: coordsAndSize[1],
  };
}

fillGrid();

const coordsOfFixedSquare = getCoordsOfSquare();
const maxPowerSquare = getMaxPowerSquare();

console.log('[PART 1] Coordinates of square with largest total power is:', coordsOfFixedSquare.join(','));
console.log('[PART 2] Coordinates and size of a square with largest power are:',
  `${maxPowerSquare.x},${maxPowerSquare.y},${maxPowerSquare.size}`);
