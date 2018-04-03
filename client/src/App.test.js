import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import App from './App';
import Dashboard from './components/Dashboard';
import Header from './components/Header';


const originalFetch = fetch;

describe('<App />', () => {
  function mockFetch(status, response) {
    const mock = jest.fn();
    fetch = (...args) => new Promise((resolve) => {
      mock(...args);
      setTimeout(() => {
        resolve({
          status,
          json: () => Promise.resolve(response),
          text: () => Promise.resolve(JSON.stringify(response)),
        });
      }, 10);
    });

    return mock;
  }

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    // restore original fetch in case it was mocked.
    fetch = originalFetch;
    jest.clearAllTimers();
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App interval={1000} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('render <Header /> with initial data', () => {
    mockFetch(200, {});

    const wrapper = shallow(<App interval={1000} />);
    const dashboard = wrapper.find(Header).first();

    expect(dashboard).toHaveProp({
      isFetching: true,
      isSuccess: false,
      isFailure: false,
    });
  });

  it('render <Dashboard /> with initial data', () => {
    mockFetch(200, {});

    const wrapper = shallow(<App interval={1000} />);
    const dashboard = wrapper.find(Dashboard).first();

    expect(dashboard).toHaveProp({
      isFetching: true,
      isSuccess: false,
      isFailure: false,
    });
  });

  it('fetch data periodically', () => {
    const mock = mockFetch(200, {});

    const wrapper = shallow(<App interval={1000} />);

    // resolve first timer to ensure componentDidMount has been called
    jest.runTimersToTime(1);
    expect(mock).toHaveBeenCalledTimes(1);
    jest.runTimersToTime(1000);
    expect(mock).toHaveBeenCalledTimes(2);
    jest.runTimersToTime(1000);
    expect(mock).toHaveBeenCalledTimes(3);
  });
});
