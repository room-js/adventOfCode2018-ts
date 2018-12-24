import readInput from '../helpers/readInput';

interface IPoint {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
}

const input: string[] = readInput(__dirname);
const regexPattern: RegExp = /position=<(?<position>.+)>\svelocity=<(?<velocity>.+)>/;
let startTextPos: number = 0;
let endTextPos: number = 0;

let xMin: number = 0;
let xMax: number = 0;
let yMin: number = 0;
let yMax: number = 0;

const points: IPoint[] = input.map((str) => {
  const [ wholeStr, positionStr, velocityStr] = str.match(regexPattern);
  const position: number[] = positionStr.split(',').map(Number);
  const velocity: number[] = velocityStr.split(',').map(Number);

  updateLimits(position[0], position[1]);

  return {
    position: {
      x: position[0],
      y: position[1],
    },
    velocity: {
      x: velocity[0],
      y: velocity[1],
    },
  };
});

function move(): void {
  points.forEach((p) => {
    p.position = {
      x: p.position.x + p.velocity.x,
      y: p.position.y + p.velocity.y,
    };
    updateLimits(p.position.x, p.position.y);
  });
}

function updateLimits(x: number, y: number): void {
    xMin = Math.min(x, xMin);
    xMax = Math.max(x, xMax);
    yMin = Math.min(y, yMin);
    yMax = Math.max(y, yMax);
}

function isFirstLetterAppeared(): boolean {
  const firstPointCoord: number[] = [];

  const pointsByRow: Map<number, number[]> = new Map();
  points.forEach((p) => {
    const values: number[] = pointsByRow.get(p.position.y) || [];
    pointsByRow.set(p.position.y, [...values, p.position.x]);
  });

  endTextPos = -99999;
  Array.from(pointsByRow.values()).forEach((p) => {
    startTextPos = Math.min(...p);
    endTextPos = Math.max(Math.max(...p), endTextPos);
    firstPointCoord.push(startTextPos);
  });

  return firstPointCoord.length && firstPointCoord.every((item) => item === firstPointCoord[0]);
}

function printGrid() {
  for (let row = yMin; row <= yMax; row++) {
    const rowPoints: IPoint[] = points.filter(({ position }) => position.y === row);

    if (!rowPoints.length) {
      continue;
    }

    const rowLog: string[] = new Array(xMax - xMin + 1).fill('.');

    rowPoints.forEach((p) => {
      rowLog[p.position.x - xMin] = '#';
    });

    const str: string = rowLog
      .join('')
      .substr(startTextPos - xMin, endTextPos - startTextPos + 1);

    console.log(str);
  }
}

let secondsPassed: number = 0;
while (!isFirstLetterAppeared()) {
  move();
  secondsPassed++;
}

console.log('[PART 1] Message:');
printGrid();

console.log('[PART 2] How many seconds passed:', secondsPassed);
