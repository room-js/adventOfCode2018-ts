import * as fs from 'fs';
import * as path from 'path';

const pathToInput = path.join(__dirname, 'input.txt');
const input = fs.readFileSync(pathToInput, 'utf8');
const inputArray: string[] = input.split('\n');

// Part 1

let x2: number = 0; // total number of characters repeated 2 times
let x3: number = 0; // total number of characters repeated 3 times

/**
 * @method hasRepeated
 *
 * @param {string} str input string
 * @param {number} n - number of repeated symbols
 *
 * @returns {boolean} Returns true if the incoming string has repeated character exactly n times
 */
function hasRepeatedChars(str: string, n: number): boolean {
  let result: boolean = false;
  let repeats: string[] | null;

  for (const char of str) {
    repeats = str.split('').filter((c) => c === char);

    if (repeats && repeats.length === n) {
      result = true;
      break;
    }
  }

  return result;
}

inputArray.forEach((str) => {
  if (hasRepeatedChars(str, 2)) { x2++; }
  if (hasRepeatedChars(str, 3)) { x3++; }
});

const checksum = x2 * x3;

console.log('[PART 1] Checksum is:', checksum);

// Part 2

let currentString: string;
let restOfArray: string[];
let similarString: string | null;
let commonChars: string = '';

/**
 * @method isOneDifferentChar
 *
 * @param {string} str1 First string
 * @param {string} str2 Second string
 *
 * @returns {boolean} returns true if the strings have only one different char, otherwise false
 */
function isOneDifferentChar(str1: string, str2: string): boolean {
  const differentChars = str1.split('')
    .filter((char: string, i: number) => char !== str2[i]);

  return differentChars.length === 1;
}

/**
 * @method findSimilarString Search in array for a string which differ from original one only by one character
 *
 * @param {string} str Original string
 * @param {array} strArray List of strings we compare againt
 *
 * @returns {string | null} Null if similar string is not found. String if it was found.
 */
function findSimilarString(str: string, strArray: string[]): string | null {
  let result: string | null = null;

  for (const currStr of strArray) {
    if (isOneDifferentChar(str, currStr)) {
      result = currStr;
      break;
    }
  }

  return result;
}

for (let i: number = 0; i < inputArray.length; i++) {
  currentString = inputArray[i];
  restOfArray = inputArray.slice(i);
  similarString = findSimilarString(currentString, restOfArray);

  if (similarString) {
    commonChars = similarString
      .split('')
      .filter((c: string, index: number) => c === currentString[index])
      .join('');
    break;
  }
}

console.log('[PART 2] Common characters are:', commonChars);
