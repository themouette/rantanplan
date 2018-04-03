import React from 'react';
import { shallow } from 'enzyme';

import Alert from './Alert';

describe('<Alert />', () => {
  it('should render without error', () => {
    const wrapper = shallow(<Alert />);

    expect(wrapper.exists()).toBeTruthy();
  });

  it('should render with type success', () => {
    const wrapper = shallow(<Alert type="success" />);

    expect(wrapper).toHaveClassName('Alert Alert-success');
  });

  it('should render with type warning', () => {
    const wrapper = shallow(<Alert type="warning" />);

    expect(wrapper).toHaveClassName('Alert Alert-warning');
  });

  it('should render with type error', () => {
    const wrapper = shallow(<Alert type="error" />);

    expect(wrapper).toHaveClassName('Alert Alert-error');
  });

  it('should translate type to lower case', () => {
    const wrapper = shallow(<Alert type="ERRor" />);

    expect(wrapper).toHaveClassName('Alert Alert-error');
  });
});
