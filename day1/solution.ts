import * as fs from 'fs';
import * as path from 'path';

const pathToInput = path.join(__dirname, 'input.txt');
const input = fs.readFileSync(pathToInput, 'utf8');
const inputArray: number[] = input.split('\n').map(Number);
const result: number = inputArray.reduce((acc, n) => (acc + n), 0);

console.log(result);
