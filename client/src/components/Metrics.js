/* @flow */
import React, { Component } from 'react';


type Props = {
  freeMemory: ?string,
  totalMemory: ?string,
  hostname: ?string,
  uptime: ?string,
};

type MetricProps = { label: string, value: ?string };
const Metric = (props: MetricProps) => (
  <p><strong>{props.label}</strong>: {props.value || 'Unknown'}</p>
);

/**
 * Metrics component
 */
class Metrics extends Component<Props> {
  static defaultProps = {};

  render() {
    return (
      <div>
        <Metric label="Hostname" value={this.props.hostname} />
        <Metric label="Uptime" value={this.props.uptime} />
        <Metric label="Total Memory" value={this.props.totalMemory} />
        <Metric label="Free Memory" value={this.props.freeMemory} />
      </div>
    );
  }
}

export default Metrics;
