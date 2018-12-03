import * as fs from 'fs';
import * as path from 'path';

const INPUT_FILENAME = 'input.txt';

export default function(dirPath: string): string[] {
  const pathToInput = path.join(dirPath, INPUT_FILENAME);
  const input = fs.readFileSync(pathToInput, 'utf8');
  const inputArray: string[] = input.split('\n');

  return inputArray;
}
