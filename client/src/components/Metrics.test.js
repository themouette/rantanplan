import React from 'react';
import { shallow } from 'enzyme';

import Metrics from './Metrics';
import Alert from './Alert';
import Chart from './Chart';

describe('<Metrics />', () => {
  const second = 1000;
  const minute = 60 * second;

  const shallowMetrics = (props = {}) => shallow(
    <Metrics
      freeMemory="1GB"
      totalMemory="8GB"
      hostname="laptop"
      uptime="1 day 2 hours 3 minutes 1 second"
      loadAverageExtremums={{ min: 1.3, max: 1.5 }}
      last2MinutesLoad={1.3}
      time={[Date.now() - 1 * second, Date.now()]}
      oneMinute={[1.3, 1.5]}
      fiveMinutes={[1.3, 1.5]}
      fifteenMinutes={[1.3, 1.5]}
      {...props}
    />
  );

  it('should render Alert when load is > 2 for 2 minutes', () => {
    const wrapper = shallowMetrics({ last2MinutesLoad: 2.3 });

    expect(wrapper.find(Alert)).toHaveLength(1);
  });

  it('should render Alert when load is = 2 for 2 minutes', () => {
    const wrapper = shallowMetrics({ last2MinutesLoad: 2 });

    expect(wrapper.find(Alert)).toHaveLength(1);
  });

  it('should not render Alert when load is < 2 for 2 minutes', () => {
    const wrapper = shallowMetrics({ last2MinutesLoad: 1.4 });

    expect(wrapper.find(Alert)).toHaveLength(0);
  });

  it('should render Chart', () => {
    const wrapper = shallowMetrics({ last2MinutesLoad: 1.4 });

    expect(wrapper.find(Chart)).toHaveLength(1);
  });
});
