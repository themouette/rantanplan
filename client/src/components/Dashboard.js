/* @flow */
import React, { Component } from 'react';
import idx from 'idx';

import type { State as StoreState } from '../store';
import Loading from './Loading';
import Alert from './Alert';
import Metrics from './Metrics';


type Props = StoreState;


const SECONDS_IN_MINUTES = 60;
const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTES;
const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;

const formatNumber = (unit: string, main: number, decimal: number) => {
  const num = (main * 1000 + decimal) / 1000;
  return `${num.toLocaleString()}${unit}`;
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

  render() {
    if (this.props.isSuccess) {
      return (
        <Metrics
          hostname={this.getHostname()}
          uptime={this.getUptime()}
          freeMemory={this.getFreeMemory()}
          totalMemory={this.getTotalMemory()}
        />
      );
    }

    if (this.props.isFailure) {
      return (
        <Alert type="error">
          An unexpected error occured.
        </Alert>
      );
    }

    return (
      <Loading />
    );
  }
}

export default Dashboard;