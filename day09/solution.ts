import readInput from '../helpers/readInput';

// Part 1

interface IMarble {
  index: number;
  number: number;
}

const input: string = readInput(__dirname)[0];
const [ wholeStr, numOfPlayers, lastMarble ]: number[] = input
  .match(/(?<numOfPlayers>[0-9]+)\splayers;\slast\smarble\sis\sworth\s(?<lastMarble>[0-9]+)\spoints/)
  .map(Number);

let currentMarble: IMarble = {
  index: 1,
  number: 1,
};
let currentPlayer: number = 1;
let currentPoints: number = 0;
let index: number = 0;
const marbles: number[] = [0];
const scores: number[] = new Array(numOfPlayers).fill(0);

function calcNextIndex(): number {
  if (marbles.length === 1 || marbles.length === 2) {
    return 1;
  }

  return (currentMarble.index === (marbles.length - 1)) ? 1 : currentMarble.index + 2;
}

while (currentMarble.number < lastMarble) {
  currentPoints = 0;

  if (currentMarble.number % 23) {
    index = calcNextIndex();
    marbles.splice(index, 0, currentMarble.number);
  } else {
    const indexOfRemovingElement: number = currentMarble.index > 7
      ? currentMarble.index - 7
      : marbles.length + currentMarble.index - 7;

    currentPoints = currentMarble.number + marbles.splice(indexOfRemovingElement, 1)[0];
    scores[currentPlayer - 1] += currentPoints;
    index = indexOfRemovingElement;
  }

  currentPlayer = (currentPlayer === numOfPlayers) ? 1 : (currentPlayer + 1);

  currentMarble = {
    index,
    number: currentMarble.number + 1,
  };
}

const maxScore = Math.max(...scores);

console.log('[PART 1] Max score:', maxScore);

// Part 2
// Implementation from the Part 1 doesn't work with such a large number.
// So let's reimplement the logic with a linked list

class Marble {
  public num: number;
  public prev: Marble;
  public next: Marble;

  constructor(num: number) {
    this.num = num;
    this.prev = this;
    this.next = this;
  }

  public addNextNode(node: Marble): void {
    if (this.next) {
      this.next.prev = node;
    }
    node.next = this.next;
    node.prev = this;
    this.next = node;
  }

  public getPrevNode(steps: number): Marble {
    let node: Marble = this;
    for (let i = 0; i < steps; i++) {
      node = node.prev;
    }
    return node;
  }

  public removeCurrentNode(): void {
    const prev: Marble = this.prev;
    const next: Marble = this.next;
    next.prev = prev;
    prev.next = next;
    this.prev = null;
    this.next = null;
  }
}

function calcScores(steps: number): number[] {
  const playersScores: number[] = new Array(numOfPlayers).fill(0);
  let curMarble: Marble = new Marble(0);

  for (let step = 1; step <= steps; step++) {
    const newMarble = new Marble(step);

    if (step % 23) {
      curMarble.next.addNextNode(newMarble);
      curMarble = newMarble;
    } else {
      const curPlayer: number = step % numOfPlayers; // last player is placed on the first position in the scores array
      const marbleToRemove: Marble = curMarble.getPrevNode(7);
      playersScores[curPlayer] += step + marbleToRemove.num;
      curMarble = marbleToRemove.next;
      marbleToRemove.removeCurrentNode();
    }
  }

  return playersScores;
}

const scoresPart2: number[] = calcScores(lastMarble * 100);
const maxScorePart2: number = Math.max(...scoresPart2);

console.log('[PART 2] Max score:', maxScorePart2);
