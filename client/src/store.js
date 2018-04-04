/* @flow */
import ExtendableError from 'es6-error';
import type { Component } from 'react';


export type FetchResponse = {
  status: number,
};
export type AlertData = {
  type: 'BELOW_THRESHOLD' | 'ABOVE_THRESHOLD',
  time: number,
  value: number,
};
export type MetricsResponseBody = {
  sampling: number,
  hostname: string,
  uptime: number,
  memory: { free: number, total: number },
  loadAverage: {
    last2Minutes: number,
    time: Array<number>,
    oneMinute: Array<number>,
    fiveMinutes: Array<number>,
    fifteenMinutes: Array<number>,
  },
  alerts: Array<AlertData>,
};

export type Props = { interval: number }
export type State = {
  isFetching: boolean,
  isSuccess: boolean,
  isFailure: boolean,
  data?: MetricsResponseBody,
};
type SetState = $PropertyType<Component<Props, State>, 'setState'>;
export type Store = {
  fetchData: () => Promise<any>,
  getInitialState: () => State,
};

class HttpError extends ExtendableError {
  response: FetchResponse;

  constructor(response: FetchResponse) {
    const statusString = response.status.toString();
    super(`Request rutrned an unexpected status code ${statusString}`);

    this.response = response;
  }
}


// Base actions
// ============
//
// We directly forward actions to `React.Component.setState`.
export const fetchStart = () => (prevState: State) => ({
  ...prevState,
  isFetching: true,
});
export const fetchSuccess = (data: MetricsResponseBody) =>
  (prevState: State) => ({
    ...prevState,
    isFetching: false,
    isSuccess: true,
    isFailure: false,
    data,
  });
export const fetchFailure = (response: FetchResponse) =>
  (prevState: State) => ({
    ...prevState,
    isFetching: false,
    isSuccess: false,
    isFailure: true,
  });
export const fetchUnexpectedError = () =>
  (prevState: State) => ({
    ...prevState,
    isFetching: false,
    isSuccess: false,
    isFailure: true,
  });

// Combine the base actions into high level actions, handling the state
// transtitions depending on the IO.
export const fetchData = (setState: SetState): Promise<any> => {
  const dispatch = (action) => setState(action);

  dispatch(fetchStart());

  return fetch('/api/statistics')
    .then((response) => {
      if (response.status === 200) return response.json();

      return Promise.reject(new HttpError(response));
    })
    .then(
      (data) => dispatch(fetchSuccess(data)),
      (error) => {
        if ('response' in error && error.response) {
          return dispatch(fetchFailure(error.response));
        }
        return dispatch(fetchUnexpectedError());
      }
    );
};

const createStore = (component: Component<Props, State>): Store => {
  const setState = (...args) => component.setState(...args);

  return {
    fetchData: () => fetchData(setState),
    getInitialState: () => ({
      isFetching: false,
      isSuccess: false,
      isFailure: false,
    }),
  }
};

export default createStore;
