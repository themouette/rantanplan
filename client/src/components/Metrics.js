/* @flow */
import React, { Component, Fragment, type Node } from 'react';

import './Metrics.css';
import Chart from './Chart';
import Alert from './Alert';


type Props = {
  freeMemory: ?string,
  totalMemory: ?string,
  hostname: ?string,
  uptime: ?string,
  loadAverageExtremums: { min: number, max: number },
  last2MinutesLoad: number,
  time: ?Array<number>,
  oneMinute: ?Array<number>,
  fiveMinutes: ?Array<number>,
  fifteenMinutes: ?Array<number>,
};

type MetricProps = { label: string, value: ?(string | Node), icon?: string };
const Metric = (props: MetricProps) => (
  <div className="Metrics-value-widget">
    <p className="Metrics-value-widget-value">{props.value || 'Unknown'}</p>
    <p className="Metrics-value-widget-title">{props.label}</p>
  </div>
);

type LoadAverageProps = {
  children: number,
};
const LoadAverage = (props: LoadAverageProps) => {
  const precision = 100;
  const round = Math.round(props.children * precision) / precision;
  return <span>{round.toLocaleString()}</span>
}

/**
 * Metrics component
 */
class Metrics extends Component<Props> {
  static defaultProps = {};

  decorateContent(...content: Array<Node>) {
    return (
      <Fragment>
        {this.renderAlert()}
        {this.renderInfos()}
        {React.Children.toArray(content.filter(Boolean))}
      </Fragment>
    );
  }

  renderAlert() {
    if (this.props.last2MinutesLoad < 2) {
      return false;
    }

    return (
      <div className="Metrics-alert">
        <Alert type="warning">
          Your computer is experiencing a heavy load.<br />
          <span>The average load for the last 2 minutes is </span>
          <strong>
            <LoadAverage>{this.props.last2MinutesLoad}</LoadAverage>
          </strong>
        </Alert>
      </div>
    )
  }

  renderInfos() {
    if (!this.props.hostname) return false;

    return (
      <div className="Metrics-infos">
        <p className="Metrics-infos-item">
          <span className="Metrics-infos-item-label">Hostname</span>
          <span className="Metrics-infos-item-value">{this.props.hostname}</span>
        </p>
        <p className="Metrics-infos-item">
          <span className="Metrics-infos-item-label">Uptime</span>
          <span className="Metrics-infos-item-value">{this.props.uptime}</span>
        </p>
      </div>
    );
  }

  render() {
    const { max: maxLoad, min: minLoad } = this.props.loadAverageExtremums;

    return this.decorateContent(
      <div className="Metrics-main">
        <div className="Metrics-values">
          <Metric
            label="2 Minutes average"
            value={<LoadAverage>{this.props.last2MinutesLoad}</LoadAverage>}
          />
          <Metric
            label="Maximum Load"
            value={<LoadAverage>{maxLoad}</LoadAverage>}
          />
          <Metric
            label="Minimum Load"
            value={<LoadAverage>{minLoad}</LoadAverage>}
          />
          <Metric
            label="Memory Available"
            value={
              `${this.props.freeMemory || ''}/${this.props.totalMemory || ''}`
            }
          />
        </div>
        <div className="Metrics-chart">
          <Chart
            time={this.props.time || []}
            oneMinute={this.props.oneMinute || []}
            fiveMinutes={this.props.fiveMinutes || []}
            fifteenMinutes={this.props.fifteenMinutes || []}
           />
        </div>
      </div>
    );
  }
}

export default Metrics;
