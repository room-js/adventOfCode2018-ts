import * as fs from 'fs';
import * as path from 'path';

const pathToInput = path.join(__dirname, 'input.txt');
const input = fs.readFileSync(pathToInput, 'utf8');
const inputArray = input.split('\n').map(Number);
const result = inputArray.reduce((acc, n) => (acc + n), 0);

console.log(result);
