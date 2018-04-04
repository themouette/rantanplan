import os from 'os';

import createDebug from 'debug';


const debug = createDebug('rantanplan:monitoring:debug');
const error = createDebug('rantanplan:monitoring:error');

// A scheduler executes `task` every `interval` (ms).
//
// Use it as follows:
//
// ```
// const scheduler = createScheduler(func, 1000);
// scheduler.start();
// scheduler.stop();
// ```
export const createScheduler = (task, interval) => {
  // Keep track of next scheduled execution.
  let timer = undefined;

  const executeAndSchedule = () => {
    const startTime = (new Date()).getTime();

    try {
      debug('execute task');
      task();
    } catch(err) {
      error('Unexpected error while executing task\n', err);
    }

    // compute in how long we should execute the next task
    // To make sure we do not drift from original schedule, take into
    // consideration curent task execution time.
    const endTime = (new Date()).getTime();
    const executionTime = endTime - startTime;
    const timeBeforeNextExecution = Math.max(0, interval - executionTime);

    debug(`setup next execution in ${timeBeforeNextExecution}ms`);
    timer = setTimeout(executeAndSchedule, timeBeforeNextExecution);
  }

  const start = () => {
    // If the scheduler is already started, do not restart it.
    if (timer) return true;

    // execute task imediately
    executeAndSchedule();
  };

  const stop = () => {
    if (!timer) return undefined;

    clearTimeout(timer);
    timer = undefined;

    return undefined;
  };

  return { start, stop };
};

// Truncate an array to `maxLength`.
// this function mutate the original array.
export const mutateTruncate = (arr, maxLength) => {
  if (arr.length <= maxLength) return arr;
  arr.splice(0, arr.length - maxLength);
}

// Create a monitoring daemon.
// This daemon relies on `createScheduler` to execute a task that monitors the
// current machine state.
//
// Under the hood, it uses [os native module](https://nodejs.org/api/os.html)
// to get the information.
//
// Data are persisted in memory only.
//
// ```
// const monitoring = createMonitoring(1000);
//
// monitoring.start();
//
// monitoring.getData();
//
// monitoring.stop();
// ```
const createMonitoring = (interval) => {
  // we remove one item to ensure the graph scale does not blink
  const maxItems = (10 * 60 * 1000 / interval) - 1;

  const data = {
    sampling: interval,
    hostname: os.hostname(),
    uptime: os.uptime(),
    memory: {
      free: os.freemem(),
      total: os.totalmem(),
    },
    loadAverage: {
      time: [],
      oneMinute: [],
      fiveMinutes: [],
      fifteenMinutes: [],
    },
  };

  const task = () => {
    const load = os.loadavg();
    const now = (new Date()).getTime();

    // append data
    data.loadAverage.time.push(now);
    data.loadAverage.oneMinute.push(load[0]);
    data.loadAverage.fiveMinutes.push(load[1]);
    data.loadAverage.fifteenMinutes.push(load[2]);

    mutateTruncate(data.loadAverage.time, maxItems);
    mutateTruncate(data.loadAverage.oneMinute, maxItems);
    mutateTruncate(data.loadAverage.fiveMinutes, maxItems);
    mutateTruncate(data.loadAverage.fifteenMinutes, maxItems);

    data.memory.free = os.freemem();
    data.uptime = os.uptime();
  };

  const { start, stop } = createScheduler(task, interval);
  const getData = () => data;

  return { start, stop, getData };
};

export default createMonitoring;
