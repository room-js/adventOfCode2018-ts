import * as fs from 'fs';
import * as path from 'path';

// Part 1
const pathToInput = path.join(__dirname, 'input.txt');
const input = fs.readFileSync(pathToInput, 'utf8');
const inputArray: number[] = input.split('\n').map(Number);
const resultPart1: number = inputArray.reduce((acc, n) => (acc + n), 0);

// Part 2
let currentFrequency: number = 0;
let isRepeatingFrequencyFound: boolean = false;
const frequencies: number[] = [currentFrequency];
let resultPart2: number | undefined;

while (!isRepeatingFrequencyFound) {
  let index = 0;
  while (index < inputArray.length) {
    currentFrequency = frequencies[frequencies.length - 1] + inputArray[index];

    if (frequencies.includes(currentFrequency)) {
      isRepeatingFrequencyFound = true;
      resultPart2 = currentFrequency;
      break;
    }

    frequencies.push(currentFrequency);
    index++;
  }
}

console.log('Answer for the Part 1: ', resultPart1);
console.log('Answer for the Part 2: ', resultPart2);
