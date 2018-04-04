/* @flow */
import React, { Component, type Node } from 'react';
import idx from 'idx';

import type { State as StoreState } from '../store';
import * as Layout from './Layout';
import Header from './Header';
import Loading from './Loading';
import Alert from './Alert';
import Metrics from './Metrics';
import crashLogo from '../assets/crash.gif';
import './Dashboard.css';


type Props = StoreState;


const SECONDS_IN_MINUTES = 60;
const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTES;
const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;

const formatNumber = (unit: string, main: number, decimal: number) => {
  const precision = 100;
  const num = (main * 1000 + decimal) / 1000;
  const rounded = Math.round(num * precision) / precision;
  return `${rounded.toLocaleString()}${unit}`;
}
const KILO = 1024;
const MEGA = KILO * 1024;
const GIGA = MEGA * 1024;
const TERA = GIGA * 1024;
const PETA = TERA * 1024;

const humanReadableSize = (sizeInByte) => {
  const bytes = Math.floor(sizeInByte % KILO);
  const kiloBytes = Math.floor(sizeInByte % MEGA / KILO);
  const megaBytes = Math.floor(sizeInByte % GIGA / MEGA);
  const gigaBytes = Math.floor(sizeInByte % TERA / GIGA);
  const teraBytes = Math.floor(sizeInByte % PETA / TERA);
  const petaBytes = Math.floor(sizeInByte / PETA);

  if (petaBytes > 0) return formatNumber('PB', petaBytes, teraBytes);
  if (teraBytes > 0) return formatNumber('TB', teraBytes, gigaBytes);
  if (gigaBytes > 0) return formatNumber('GB', gigaBytes, megaBytes);
  if (megaBytes > 0) return formatNumber('MB', megaBytes, kiloBytes);
  if (kiloBytes > 0) return formatNumber('kB', kiloBytes, bytes);

  return formatNumber('bytes', bytes, 0);
};

/**
 * Dashboard component
 */
class Dashboard extends Component<Props> {
  static defaultProps = {};

  getHostname() {
    return idx(this.props, _ => _.data.hostname);
  }

  getUptime() {
    const uptime = idx(this.props, _ => _.data.uptime);
    if (!uptime) return undefined;

    // convert uptime, provided in seconds, to relevant unit
    const seconds = uptime % SECONDS_IN_MINUTES;
    const minutes = Math.floor(uptime % SECONDS_IN_HOUR / SECONDS_IN_MINUTES);
    const hours = Math.floor(uptime % SECONDS_IN_DAY / SECONDS_IN_HOUR);
    const days = Math.floor(uptime / SECONDS_IN_DAY);

    return [
      days.toString(), days > 1 ? 'days' : 'day',
      hours.toString(), hours > 1 ? 'hours' : 'hour',
      minutes.toString(), minutes > 1 ? 'minutes' : 'minute',
      seconds.toString(), seconds > 1 ? 'seconds' : 'second',
    ].join(' ');
  }

  getFreeMemory() {
    const memory = idx(this.props, _ => _.data.memory.free);
    if (!memory) return undefined;

    return humanReadableSize(memory);
  }

  getTotalMemory() {
    const memory = idx(this.props, _ => _.data.memory.total);
    if (!memory) return undefined;

    return humanReadableSize(memory);
  }

  getTime() {
    const time = idx(this.props, _ => _.data.loadAverage.time);
    if (!time) return time;

    const now = (new Date()).getTime();
    // return the time ago in milliseconds
    return time.map(t => t - now);
  }

  getLoadAverage1() {
    return idx(this.props, _ => _.data.loadAverage.oneMinute);
  }

  getLoadAverage5() {
    return idx(this.props, _ => _.data.loadAverage.fiveMinutes);
  }

  getLoadAverage15() {
    return idx(this.props, _ => _.data.loadAverage.fifteenMinutes);
  }

  getLast2MinutesLoad() {
    // iterate over load average values from the end until
    // we reach the start of the array OR we reached the 2 minutes timeframe
    const loads = this.getLoadAverage1() || [];
    const times = this.getTime() || [];

    const two_minutes = -2 * 60 * 1000;

    let index;
    let lastIndex = times.length - 1;
    let sum = 0;
    let count = 0;
    for (index = lastIndex; index >= 0 && times[index] >= two_minutes; index--) {
      count++;
      sum = sum + loads[index];
    }

    return sum / count;
  }

  getLoadAverageExtremums() {
    const loads = this.getLoadAverage1() || [];

    // we need to have a real value for min.
    // if the array is empty, we use 0, otherwise we start with the
    // first item
    const min = loads.length ? loads[0] : 0;
    return loads.reduce(
      (acc, loadAvg) => ({
        max: Math.max(acc.max, loadAvg),
        min: Math.min(acc.min, loadAvg),
      }),
      { max: 0, min }
    );
  }

  decorateContent(content: Node) {
    return (
      <Layout.Root>
        <Layout.Header>
          <Header {...this.state} />
        </Layout.Header>
        <Layout.Content>
          {content}
        </Layout.Content>
      </Layout.Root>
    );
  }

  render() {
    if (this.props.isSuccess) {
      return this.decorateContent(
        <Layout.ContentColumns>
          <Metrics
            hostname={this.getHostname()}
            uptime={this.getUptime()}
            freeMemory={this.getFreeMemory()}
            totalMemory={this.getTotalMemory()}
            last2MinutesLoad={this.getLast2MinutesLoad()}
            loadAverageExtremums={this.getLoadAverageExtremums()}
            time={this.getTime()}
            oneMinute={this.getLoadAverage1()}
            fiveMinutes={this.getLoadAverage5()}
            fifteenMinutes={this.getLoadAverage15()}
          />
        </Layout.ContentColumns>
      );
    }

    if (this.props.isFailure) {
      return this.decorateContent(
        <Layout.ContentCentered>
          <Alert type="error">
            <img src={crashLogo} className="Dashboard-Error-img" />
            <p>An unexpected error occured.</p>
          </Alert>
        </Layout.ContentCentered>
      );
    }

    return this.decorateContent(
      <Layout.ContentCentered>
        <Loading />
      </Layout.ContentCentered>
    );
  }
}

export default Dashboard;
