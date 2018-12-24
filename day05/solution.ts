import readInput from '../helpers/readInput';

// Part 1

const inputStr = readInput(__dirname)[0];

const react = (input: string): number => {

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

  return input.length;
};

console.log('[PART 1] Answer:', react(inputStr));

// Part 2

const counts: { [char: string]: number } = {};

let currentChar: string;

for (const char of inputStr) {
  currentChar = char.toLowerCase();
  counts[currentChar] = counts[currentChar] ? counts[currentChar] + 1 : 1;
}

interface IAcc {
  char: string;
  value: null | number;
}

const initValue: IAcc = {
  char: '',
  value: null,
};

const minLen: IAcc = Object.keys(counts)
  .reduce((acc: IAcc, key: string): IAcc => {
    const reg = new RegExp(`[${key}${key.toUpperCase()}]`, 'g');
    const len = react(inputStr.replace(reg, ''));

    if (acc.value === null)  {
      acc.value = len;
    } else if (len < acc.value) {
      acc = {
        char: key,
        value: len,
      };
    }
    return acc;
  }, initValue);

console.log('[PART 2] Answer:', minLen.value);
