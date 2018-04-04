import React from 'react';
import { shallow } from 'enzyme';

import LoadAverage from './LoadAverage';


describe('<LoadAverage />', () => {
  it('should render with truncated value', () => {
    const wrapper = shallow(<LoadAverage>1.234567</LoadAverage>);

    expect(wrapper.text()).toBe('1.23');
  });

  it('should render unknown', () => {
    const wrapper = shallow(<LoadAverage>{undefined}</LoadAverage>);

    expect(wrapper.text()).toBe('Unknown');
  });
});
