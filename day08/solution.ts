import readInput from '../helpers/readInput';

interface INode {
  childNodesQuantity: number;
  childNodesPos?: number[];
  value?: number;
}

interface INodes {
  [startPos: number]: INode;
}

const inputArray: number[] = readInput(__dirname)[0]
  .split(' ')
  .map(Number);

const allMetas: number[] = [];

let position: number = 0;

const nodes: INodes = {};

function processMeta(metaNum: number, nodePos: number): void {
  let curMetaValue: number = 0;
  let value: number = 0;
  for (let i = 0; i < metaNum; i++) {
    curMetaValue = inputArray[position + i];
    allMetas.push(curMetaValue);

    if (nodes[nodePos].childNodesQuantity === 0) {
      value += curMetaValue;
      continue;
    }

    if (curMetaValue > 0 && curMetaValue <= nodes[nodePos].childNodesQuantity) {
      const nodeRefIndex: number = nodes[nodePos].childNodesPos[curMetaValue - 1];
      value += nodes[nodeRefIndex].value;
    }
  }
  nodes[nodePos].value = value;
  position += metaNum;
}

function processNode(parentPos: number): void {
  const nodePos: number = position;
  const curNodes: number = inputArray[position];
  const curMetas: number = inputArray[position + 1];
  position += 2;

  nodes[nodePos] = { childNodesQuantity: curNodes };
  nodes[parentPos].childNodesPos = nodes[parentPos].childNodesPos || [];
  nodes[parentPos].childNodesPos.push(nodePos);

  if (curNodes === 0) {
    processMeta(curMetas, nodePos);
    return;
  }

  for (let i = 0; i < curNodes; i++) {
    processNode(nodePos);
  }

  processMeta(curMetas, nodePos);
}

const rootNodePos: number = 0;
const rootNodes: number = inputArray[position];
const rootMetas: number = inputArray[position + 1];
position += 2;
nodes[rootNodePos] = { childNodesQuantity: rootNodes };

for (let i = 0; i < rootNodes; i++) {
  processNode(rootNodePos);
}

processMeta(rootMetas, rootNodePos);

const metaSum: number = allMetas.reduce((acc, val) => acc + val, 0);

console.log('[PART 1] Sum of all meta entries:', metaSum);
console.log('[PART 2] Root node value:', nodes[rootNodePos].value);
