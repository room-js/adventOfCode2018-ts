import readInput from '../helpers/readInput';

// Part 1

type ISteps = string[][];
interface IDependencies {
  [step: string]: {
    dependencies: string[],
    dependents: string[],
  };
}

const inputArray: string[] = readInput(__dirname);

const steps: ISteps = inputArray.map((str) => ([
  str.charAt(5),
  str.charAt(36),
]));

const allDeps: IDependencies = {};
steps.forEach(([dcy, dt]) => {
  allDeps[dt] = allDeps[dt] || {};
  allDeps[dcy] = allDeps[dcy] || {};
  allDeps[dcy].dependents = [...(allDeps[dcy].dependents || []), dt].sort();
  allDeps[dt].dependencies = [...(allDeps[dt].dependencies || []), dcy].sort();
});

const completedSteps: string[] = [];
let curDeps: string[];
completedSteps.push(steps[0][0]);
let letters: string[] = Object.keys(allDeps).sort();

while (letters.length) {
  for (const key of letters) {
    curDeps = Array.from(allDeps[key].dependencies || new Set());

    if (
      curDeps.every((d) => completedSteps.includes(d))
      && !completedSteps.includes(key)
    ) {
      completedSteps.push(key);
      letters = letters.filter((l) => !completedSteps.includes(l));
      break;
    }
  }
}

const part1Result: string = completedSteps.join('');

console.log('[PART 1] Result:', part1Result);

// Part 2

const MAX_WORKERS: number = 5;

interface IWorker {
  job: string;
  startTime: number;
  duration: number;
}

const workers: Set<IWorker> = new Set();
let totalTime: number = 0;
const completedSteps2: string[] = [];
let jobsQueue: string[] = [];
let nextJob: string;
let curJobs: Set<string>;
let jobsToComplete: string[] = Object.keys(allDeps).sort();

function calcDuration(letter: string): number {
  return 60 + (letter.charCodeAt(0) - 64);
}

function createWorker(job: string): IWorker {
  const duration: number = calcDuration(job);

  return {
    duration,
    job,
    startTime: totalTime,
  };
}

function isJobAvailable(job: string): boolean {
  const isJobCompleted = completedSteps2.includes(job);
  const isJobRunning = Array.from(workers).some((w) => w.job === job);
  const isJobInQueue = jobsQueue.includes(job);
  const isDepResolved = !allDeps[job].dependencies
    || allDeps[job].dependencies.every((d) => completedSteps2.includes(d));

  return !isJobCompleted && !isJobRunning && !isJobInQueue && isDepResolved;
}

function updateJobsQueue(): void {
  jobsToComplete = jobsToComplete
    .filter((job) => !completedSteps2.includes(job))
    .sort();
  curJobs = new Set();

  workers.forEach((w: IWorker) => curJobs.add(w.job));

  jobsToComplete.forEach((key) => {
    if (isJobAvailable(key)) {
      jobsQueue = [...jobsQueue, key].sort();
    }
  });
}

function runWorkers(): void {
  while (workers.size < MAX_WORKERS && jobsQueue.length) {
    nextJob = jobsQueue.shift() || steps[0][0];
    workers.add(createWorker(nextJob));
  }
}

const stepsAmount: number = Object.keys(allDeps).length;

workers.add(createWorker(steps[0][0]));

while (completedSteps2.length < stepsAmount) {
  workers.forEach((worker) => {
    if (totalTime !== (worker.startTime + worker.duration)) {
      return;
    }

    completedSteps2.push(worker.job);

    workers.delete(worker);
  });

  updateJobsQueue();
  runWorkers();

  totalTime++;
}

totalTime--;

console.log('[PART 2] Total time:', totalTime);
