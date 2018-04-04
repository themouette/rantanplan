import React from 'react';
import { shallow } from 'enzyme';

import Dashboard from './Dashboard';
import Header from './Header';
import Loading from './Loading';
import Alert from './Alert';
import Metrics from './Metrics';

describe('<Dashboard />', () => {
  it('should render when data is not available', () => {
    const wrapper = shallow(
      <Dashboard
        isFetching={false}
        isFailure={false}
        isSuccess={false}
      />
    );

    expect(wrapper.find(Loading)).toHaveLength(1);
  });

  it('should render < Header/> when data is not available', () => {
    const wrapper = shallow(
      <Dashboard
        isFetching={false}
        isFailure={false}
        isSuccess={false}
      />
    );

    expect(wrapper.find(Header)).toHaveLength(1);
  });

  it('should render when loading', () => {
    const wrapper = shallow(
      <Dashboard
        isFetching
        isFailure={false}
        isSuccess={false}
      />
    );

    expect(wrapper.find(Loading)).toHaveLength(1);
  });

  it('should render <Header /> when loading', () => {
    const wrapper = shallow(
      <Dashboard
        isFetching
        isFailure={false}
        isSuccess={false}
      />
    );

    expect(wrapper.find(Header)).toHaveLength(1);
  });

  it('should render when failure', () => {
    const wrapper = shallow(
      <Dashboard
        isFetching={false}
        isFailure
        isSuccess={false}
      />
    );

    expect(wrapper.find(Alert)).toHaveLength(1);
    expect(wrapper.find(Alert)).toHaveProp('type', 'error');
  });

  describe('when metrics are available', () => {
    function shallowSuccess(data = {}) {
      return shallow(
        <Dashboard
          isFetching={false}
          isFailure={false}
          isSuccess
          data={{
            sampling: 1000,
            hostname: 'laptop',
            uptime: 12345,
            freeMemory: 1024,
            totalMemory: 2048,
            loadAverage: {
              time: [],
              oneMinute: [],
              fiveMinutes: [],
              fifteenMinutes: [],
              ...(data.loadAverage || {}),
            },
            ...data,
          }}
        />
      );
    }

    it('should render Metrics', () => {
      const wrapper = shallowSuccess();

      expect(wrapper.find(Metrics)).toHaveLength(1);
    });

    it('should format uptime (plural)', () => {
      const wrapper = shallowSuccess({
        uptime: 50 + 60 * 3 + 60 * 60 * 4 + 60 * 60 * 24 * 5,
        //  50 sec   3 minutes  4 hours      5 days
      });

      expect(wrapper.find(Metrics))
        .toHaveProp('uptime', '5 days 4 hours 3 minutes 50 seconds');
    });

    it('should format uptime (singular)', () => {
      const wrapper = shallowSuccess({
        uptime: 1 + 60 * 1 + 60 * 60 * 1 + 60 * 60 * 24 * 1,
        //  1 sec   1 minute    1 hour      1 days
      });

      expect(wrapper.find(Metrics))
        .toHaveProp('uptime', '1 day 1 hour 1 minute 1 second');
    });

    it('should forward hostname', () => {
      const wrapper = shallowSuccess({ hostname: 'themouette' });

      expect(wrapper.find(Metrics)).toHaveProp('hostname', 'themouette');
    });

    it('should format memory bytes', () => {
      const wrapper = shallowSuccess({ memory: { free: 500 } });

      expect(wrapper.find(Metrics)).toHaveProp('freeMemory', '500bytes');
    });

    it('should format memory kB', () => {
      const wrapper = shallowSuccess({ memory: { free: 500 * 1024 } });

      expect(wrapper.find(Metrics)).toHaveProp('freeMemory', '500kB');
    });

    it('should format memory MB', () => {
      const wrapper = shallowSuccess({ memory: { free: 500 * 1024 * 1024 } });

      expect(wrapper.find(Metrics)).toHaveProp('freeMemory', '500MB');
    });

    it('should format memory GB', () => {
      const wrapper = shallowSuccess({
        memory: {
          free: 500 * 1024 * 1024 + 3 * 1024 * 1024 * 1024,
        },
      });

      expect(wrapper.find(Metrics)).toHaveProp('freeMemory', '3.5GB');
    });

    it('should compute time to ellapsed seconds', () => {
      const now = Date.now();
      const second = 1000;
      const wrapper = shallowSuccess({
        loadAverage: {
          oneMinute: [1.4, 0.2, 1.3, 0.7, 0.5],
          time: [
            now - 3 * second,
            now - 2 * second,
            now - 1 * second,
            now,
          ]
        },
      });
      const expected = [- 3 * second, - 2 * second, - second, 0];

      expect(wrapper.find(Metrics)).toHaveProp('time', expected);
    });

    it('should compute load average extremums', () => {
      const wrapper = shallowSuccess({
        loadAverage: {
          oneMinute: [1.4, 0.2, 1.3, 0.7, 0.5],
        },
      });

      expect(wrapper.find(Metrics))
        .toHaveProp('loadAverageExtremums', { min: 0.2, max: 1.4 });
    });

    it('should compute load average extremums with no data', () => {
      const wrapper = shallowSuccess({
        loadAverage: {
          oneMinute: [],
        },
      });

      expect(wrapper.find(Metrics))
        .toHaveProp('loadAverageExtremums', { min: 0, max: 0 });
    });

    it('should compute 2 minutes average', () => {
      const now = Date.now();
      const minute = 60 * 1000;
      const wrapper = shallowSuccess({
        loadAverage: {
          oneMinute: [1.4, 0.2, 0.7, 0.5],
          time: [
            now - 3 * minute,
            now - 2 * minute + 2,
            now - 1 * minute,
            now,
          ]
        },
      });

      expect(wrapper.find(Metrics))
        .toHaveProp('last2MinutesLoad', (0.2 + 0.7 + 0.5) / 3);
    });

    it('should compute 2 minutes average when missing data', () => {
      const now = Date.now();
      const second = 1000;
      const wrapper = shallowSuccess({
        loadAverage: {
          oneMinute: [1.4, 0.2, 0.7, 0.5],
          time: [
            now - 3 * second,
            now - 2 * second,
            now - 1 * second,
            now,
          ]
        },
      });

      expect(wrapper.find(Metrics))
        .toHaveProp('last2MinutesLoad', (1.4 + 0.2 + 0.7 + 0.5) / 4);
    });
  });
});
