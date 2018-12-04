import readInput from '../helpers/readInput';

interface ISleepTimeTable {
  [id: number]: number[];
}

interface ICurrentGuard {
  id: number;
  sleepsFrom: string | null; // HH:MM. null if he is awake at the moment
}

interface ICurrentRecord {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  message: string; // Whole message standing after a timestamp
}

interface IMostSleepingGuard {
  id: number;
  sleepMinutes: number;
  minutes: number[];
  maxValue: number;
}

// TODO: optimize the sorting algorithm
function sortRecords(a: string, b: string): number {
  const ms1 = new Date(a.slice(1, 17)).getTime();
  const ms2 = new Date(b.slice(1, 17)).getTime();

  if (ms1 < ms2) {
    return -1;
  } else if (ms1 > ms2) {
    return 1;
  } else {
    return 0;
  }
}

const inputArray: string[] = readInput(__dirname).sort(sortRecords);

const currentGuard: ICurrentGuard = {
  id: 0,
  sleepsFrom: null,
};

let currentRecord: ICurrentRecord;
const sleepTimeTable: ISleepTimeTable = {};

function processRecord(inputStr: string): void {
  currentRecord = {
    date: inputStr.slice(1, 11),
    message: inputStr.slice(19),
    time: inputStr.slice(12, 17),
  };

  if (currentRecord.message.startsWith('Guard #')) {
    currentGuard.id = Number(currentRecord.message.split(' ')[1].replace('#', ''));
    currentGuard.sleepsFrom = null;
  } else if (currentRecord.message.startsWith('falls asleep')) {
    currentGuard.sleepsFrom = currentRecord.time;
  } else if (currentRecord.message.startsWith('wakes up') && currentGuard.sleepsFrom) {
    sleepTimeTable[currentGuard.id] = sleepTimeTable[currentGuard.id] || new Array(60).fill(0);
    const sleepFromMinutes: number = Number(currentGuard.sleepsFrom.split(':')[1]);
    const currentMinutes: number = Number(currentRecord.time.split(':')[1]);
    for (let i = sleepFromMinutes; i < currentMinutes; i++) {
      sleepTimeTable[currentGuard.id][i]++;
    }
  }
}

inputArray.forEach(processRecord);

const mostSleepingGuard: IMostSleepingGuard = {
  id: 0,
  maxValue: 0,
  minutes: [],
  sleepMinutes: 0,
};

const allGuardIds: string[] = Object.keys(sleepTimeTable);

allGuardIds.forEach((guardId: string) => {
  const minutes = sleepTimeTable[Number(guardId)];
  const sleepMinutes = minutes.filter(Boolean).length;
  const maxValue = Math.max(...minutes);

  if (sleepMinutes >= mostSleepingGuard.sleepMinutes && maxValue > mostSleepingGuard.maxValue) {
    mostSleepingGuard.id = Number(guardId);
    mostSleepingGuard.sleepMinutes = sleepMinutes;
    mostSleepingGuard.minutes = minutes;
    mostSleepingGuard.maxValue = maxValue;
  }
});

const maxSleepyValue: number = Math.max(...mostSleepingGuard.minutes);
const mostSleepyMinute: number = mostSleepingGuard.minutes.indexOf(maxSleepyValue);

const part1Result = mostSleepingGuard.id * mostSleepyMinute;

console.log('[PART 1] Answer:', part1Result);
