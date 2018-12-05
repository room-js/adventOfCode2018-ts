import readInput from '../helpers/readInput';

// Part 1

let input: string = readInput(__dirname)[0];

const resultArray: string[] = input.split('');

type Range = number[] | null;

function getRangeToRemove(index: number): Range {
  let internalIndex = 0;
  const getCurChar = () => input.charAt(index - internalIndex);
  const getNextChar = () => input.charAt(index + 1 + internalIndex);
  while (
    getCurChar() !== getNextChar() &&
    getCurChar().toUpperCase() === getNextChar().toUpperCase()
  ) {
    internalIndex++;
  }
  if (internalIndex) {
    return [index + 1 - internalIndex, index + internalIndex];
  }
  return null;
}

let currentRange: Range;
let subStr1: string;
let subStr2: string;

for (let i = 0; i < input.length; i++) {
  currentRange = getRangeToRemove(i);
  if (!currentRange) {
    continue;
  }
  subStr1 = input.slice(0, currentRange[0]);
  subStr2 = input.slice(currentRange[1] + 1);
  input = subStr1 + subStr2;
  i -= (currentRange[1] - currentRange[0]) / 2 + 1;
}

const part1Result = input.length;

console.log('[PART 1] Answer:', part1Result);
