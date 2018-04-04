import createMonitoring, { createScheduler, mutateTruncate } from './monitoring';

describe('Scheduler', () => {
  let task;
  let scheduler;

  beforeEach(() => {
    jest.useFakeTimers();
    task = jest.fn();
    scheduler = createScheduler(task, 1000);
  });

  afterEach(() => {
    jest.clearAllTimers();
    scheduler.stop();
  });

  test('should not start by itself', () => {
    // Fast Forward until all timers have been executed
    jest.runAllTimers();

    expect(setTimeout).not.toBeCalled();
    expect(task).not.toBeCalled();
  });

  test('should call task immediately and setup next call', () => {
    scheduler.start();

    expect(task).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledTimes(1);

    jest.runOnlyPendingTimers();
  });

  test('should call task and setup next call after timer is done', () => {
    scheduler.start();

    jest.runOnlyPendingTimers();

    expect(task).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenCalledTimes(2);
  });

  test('should stop calling task when stop has been called', () => {
    scheduler.start();

    jest.runOnlyPendingTimers();

    scheduler.stop();

    jest.runAllTimers();

    expect(task).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenCalledTimes(2);
  });

  test('should not die if task throws an error', () => {
    const fail = () => { throw new Error('this is expected'); };
    const failScheduler = createScheduler(fail, 1000);

    failScheduler.start();

    jest.runOnlyPendingTimers();

    failScheduler.stop();
  });

  test('should be able to start twice', () => {
    scheduler.start();
    scheduler.start();

    expect(task).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledTimes(1);

    jest.runOnlyPendingTimers();

    expect(task).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenCalledTimes(2);
  });
});

describe('mutateTruncate', () => {
  it('should manipulate the original array', () => {
    const arr = [0, 1, 2, 3];
    mutateTruncate(arr, 3);

    expect(arr).toHaveLength(3);
  });

  it('should not truncate if array is too short', () => {
    const arr = [0, 1, 2, 3];
    mutateTruncate(arr, 5);

    expect(arr).toHaveLength(4);
  });

  it('should not truncate if array is the exact size', () => {
    const arr = [0, 1, 2, 3];
    mutateTruncate(arr, 4);

    expect(arr).toHaveLength(4);
  });
});

describe('createMonitoring', () => {
  let monitoring;

  beforeEach(() => {
    jest.useFakeTimers();
    monitoring = createMonitoring(1000);
  });

  afterEach(() => {
    jest.clearAllTimers();
    monitoring.stop();
  });

  test('should collect data at initialization time', () => {
    const data = monitoring.getData();

    expect(data).toHaveProperty('hostname');

    expect(data).toHaveProperty('uptime');

    expect(data).toHaveProperty('memory.free');
    expect(data).toHaveProperty('memory.total');

    expect(data).toHaveProperty('loadAverage.oneMinute');
    expect(data).toHaveProperty('loadAverage.fiveMinutes');
    expect(data).toHaveProperty('loadAverage.fiveMinutes');

    expect(data.loadAverage).toMatchObject({
      oneMinute: [],
      fiveMinutes: [],
      fifteenMinutes: [],
    });
  });

  test('should collect data when scheduled', () => {
    monitoring.start();

    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();

    const data = monitoring.getData();

    expect(data).toHaveProperty('hostname');

    expect(data).toHaveProperty('uptime');

    expect(data).toHaveProperty('memory.free');
    expect(data).toHaveProperty('memory.total');

    expect(data).toHaveProperty('loadAverage.oneMinute');
    expect(data).toHaveProperty('loadAverage.fiveMinutes');
    expect(data).toHaveProperty('loadAverage.fiveMinutes');

    expect(data.loadAverage.oneMinute).toHaveLength(3);
    expect(data.loadAverage.fiveMinutes).toHaveLength(3);
    expect(data.loadAverage.fifteenMinutes).toHaveLength(3);
  });
});
