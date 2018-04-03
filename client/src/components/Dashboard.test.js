import React from 'react';
import { shallow } from 'enzyme';

import Dashboard from './Dashboard';
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
            hostname: 'laptop',
            uptime: 12345,
            freeMemory: 1024,
            totalMemory: 2048,
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
  });
});
