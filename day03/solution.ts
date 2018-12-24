import readInput from '../helpers/readInput';

interface IPieceParams {
  height: number;
  id: number;
  offsetLeft: number;
  offsetTop: number;
  width: number;
}

// Build a grid (two dimensional array) where every cell will contain a Set of the IDs
// of the pieces what are claimed for this cell.
type Cell = Set<number>;
const fabricGrid: Cell[][] = [[]];
const allIDs: Set<number> = new Set([]);

const inputArray: string[] = readInput(__dirname);
let numberOfOverlappedCells: number = 0;

function parseParamsFromString(inputStr: string): IPieceParams {
  const inputArr: string[] = inputStr.split(' ');
  const id: number = Number(inputArr[0].slice(1));
  const offsets: string[] = inputArr[2].replace(':', '').split(',');
  const offsetLeft: number = Number(offsets[0]);
  const offsetTop: number = Number(offsets[1]);
  const size: string[] = inputArr[3].split('x');
  const width: number = Number(size[0]);
  const height: number = Number(size[1]);

  return {
    height,
    id,
    offsetLeft,
    offsetTop,
    width,
  };
}

inputArray.forEach((inputStr) => {
  const currentPiece: IPieceParams = parseParamsFromString(inputStr);
  const {id, height, width, offsetLeft, offsetTop} = currentPiece;

  allIDs.add(currentPiece.id);

  for (let m = offsetTop; m < (offsetTop + height); m++) {
    for (let n = offsetLeft; n < (offsetLeft + width); n++) {
      if (!fabricGrid[m]) {
        fabricGrid[m] = [];
      }

      fabricGrid[m][n] = fabricGrid[m][n] || new Set([]);
      fabricGrid[m][n].add(id);

      if (fabricGrid[m][n].size > 1) {
        fabricGrid[m][n].forEach((pieceId) => allIDs.delete(pieceId));
      }

      if (fabricGrid[m][n].size === 2) {
        numberOfOverlappedCells++;
      }
    }
  }
});

const firstID: number = allIDs.values().next().value;

console.log('[PART 1] Number of overlapped cells:', numberOfOverlappedCells);
console.log('[PART 2] ID of the piece which was not overlapped:', firstID);
