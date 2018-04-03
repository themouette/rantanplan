import createStore, {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  fetchError,
  fetchData,
} from './store';


const initialState = (state = {}) => ({
  isFetching: false,
  isSuccess: false,
  isFailure: false,
  ...state,
});

describe('fetchStart', () => {
  it('should toggle `isFetching` to true', () => {
    const state = initialState({ isFetching: false });
    const newState = fetchStart()(state);

    expect(newState).toHaveProperty('isFetching', true);
  });

  it('should keep `isFetching` to true', () => {
    const state = initialState({ isFetching: true });
    const newState = fetchStart()(state);

    expect(newState).toHaveProperty('isFetching', true);
  });

  it('should keep previous state keys', () => {
    const state = initialState({ foo: 'bar' });
    const newState = fetchStart()(state);

    expect(newState).toHaveProperty('foo', 'bar');
  });
});

describe('fetchSuccess', () => {
  it('should toggle `isFetching` to false', () => {
    const state = initialState({ isFetching: true });
    const newState = fetchSuccess({})(state);

    expect(newState).toHaveProperty('isFetching', false);
  });

  it('should keep `isFetching` to false', () => {
    const state = initialState({ isFetching: false });
    const newState = fetchSuccess({})(state);

    expect(newState).toHaveProperty('isFetching', false);
  });

  it('should toggle `isSuccess` to true', () => {
    const state = initialState({ isSuccess: false });
    const newState = fetchSuccess({})(state);

    expect(newState).toHaveProperty('isSuccess', true);
  });

  it('should keep `isSuccess` to true', () => {
    const state = initialState({ isSuccess: true });
    const newState = fetchSuccess({})(state);

    expect(newState).toHaveProperty('isSuccess', true);
  });

  it('should toggle `isFailure` to false', () => {
    const state = initialState({ isFailure: true });
    const newState = fetchSuccess({})(state);

    expect(newState).toHaveProperty('isFailure', false);
  });

  it('should keep `isFailure` to true', () => {
    const state = initialState({ isFailure: false });
    const newState = fetchSuccess({})(state);

    expect(newState).toHaveProperty('isFailure', false);
  });

  it('should set `data` if not set yet', () => {
    const state = initialState();
    const newState = fetchSuccess({ foo: 'bar' })(state);

    expect(newState).toHaveProperty('data.foo', 'bar');
  });

  it('should replace `data`', () => {
    const state = initialState({ data: { bar: 'bar' } });
    const newState = fetchSuccess({ foo: 'bar' })(state);

    expect(newState).not.toHaveProperty('data.bar');
    expect(newState).toHaveProperty('data.foo', 'bar');
  });
});

describe('fetchFailure', () => {
  it('should toggle `isFetching` to false', () => {
    const state = initialState({ isFetching: true });
    const newState = fetchFailure({})(state);

    expect(newState).toHaveProperty('isFetching', false);
  });

  it('should keep `isFetching` to false', () => {
    const state = initialState({ isFetching: false });
    const newState = fetchFailure({})(state);

    expect(newState).toHaveProperty('isFetching', false);
  });

  it('should toggle `isSuccess` to false', () => {
    const state = initialState({ isSuccess: true });
    const newState = fetchFailure({})(state);

    expect(newState).toHaveProperty('isSuccess', false);
  });

  it('should keep `isSuccess` to true', () => {
    const state = initialState({ isSuccess: false });
    const newState = fetchFailure({})(state);

    expect(newState).toHaveProperty('isSuccess', false);
  });

  it('should toggle `isFailure` to true', () => {
    const state = initialState({ isFailure: false });
    const newState = fetchFailure({})(state);

    expect(newState).toHaveProperty('isFailure', true);
  });

  it('should keep `isFailure` to true', () => {
    const state = initialState({ isFailure: true });
    const newState = fetchFailure({})(state);

    expect(newState).toHaveProperty('isFailure', true);
  });

  it('should not set `data`', () => {
    const state = initialState();
    const newState = fetchFailure({})(state);

    expect(newState).not.toHaveProperty('data');
  });

  it('should not replace `data`', () => {
    const state = initialState({ data: { bar: 'bar' } });
    const newState = fetchFailure({})(state);

    expect(newState).toHaveProperty('data.bar', 'bar');
  });
});

describe('fetchData', () => {
  const originalFetch = fetch;

  function mockFetch(status, response) {
    fetch = () => new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status,
          json: () => Promise.resolve(response),
          text: () => Promise.resolve(JSON.stringify(response)),
        });
      }, 1);
    });
  }

  function mockSetState(initialState = {}, props = {}) {
    let state = initialState;
    let states = [];
    return {
      setState(action) {
        state = action(state, props);
        states.push(state);
      },
      expectStates(desiredStates) {
        expect(states).toHaveLength(states.length);
        let stateIndex;
        for (stateIndex = 0; stateIndex < states.length; stateIndex++) {
          expect(states[stateIndex]).toMatchObject(desiredStates[stateIndex])
        }
      },
    };
  }

  afterEach(() => {
    // restore original fetch in case it was mocked.
    fetch = originalFetch;
  });

  it('should handle response status "200"', () => {
    mockFetch(200, { foo: 'bar' });
    const { setState, expectStates } = mockSetState();

    return fetchData(setState)
      .then(() => {
        expectStates([
          { isFetching: true },
          { isFetching: false, isSuccess: true, data: { foo: 'bar' } },
        ]);
      });
  });

  it('should handle response status "500"', () => {
    mockFetch(500, { foo: 'bar' });
    const { setState, expectStates } = mockSetState();

    return fetchData(setState)
      .then(() => {
        expectStates([
          { isFetching: true },
          { isFetching: false, isSuccess: false, isFailure: true },
        ]);
      });
  });

  it('should handle internal errors', () => {
    mockFetch(500, () => Promise.reject(new Error('Internal error')));
    const { setState, expectStates } = mockSetState();

    return fetchData(setState)
      .then(() => {
        expectStates([
          { isFetching: true },
          { isFetching: false, isSuccess: false, isFailure: true },
        ]);
      });
  });
});
