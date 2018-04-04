/* @flow */
import React, { Component, Fragment } from 'react';
import moment from 'moment';

import './AlertTray.css';
import type { AlertData } from '../store';
import LoadAverage from './LoadAverage';


type Props = {
  alerts: Array<AlertData>
};
type State = {
  open: boolean,
  lastView: ?number,
};


/**
 * AlertTray component
 */
class AlertTray extends Component<Props, State> {
  static defaultProps = {};

  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      lastView: undefined,
    };
  }

  renderAlert = (alert: AlertData) => {
    const value = <LoadAverage>{alert.value}</LoadAverage>;
    const time = moment(new Date(alert.time)).format('LLL')

    if (alert.type === 'BELOW_THRESHOLD') {
      return (
        <p key={alert.time} className="AlertTray-Alert AlertTray-Alert-success">
          Recovered from high load - load = {value}, triggered at {time}
        </p>
      );
    }
    if (alert.type === 'ABOVE_THRESHOLD') {
      return (
        <p key={alert.time} className="AlertTray-Alert AlertTray-Alert-warning">
          High load generated an alert - load = {value}, triggered at {time}
        </p>
      );
    }
  }

  toggleState = () => {
    this.setState((prevState) => ({
      ...prevState,
      open: !prevState.open,
      lastView: Date.now(),
    }));
  }

  getUnseenAlerts() {
    const lastView = this.state.lastView;
    const alerts = this.props.alerts;

    if (!lastView) return alerts;

    return alerts.filter(alert => alert.time > lastView);
  }

  getButtonText() {
    const unseenAlerts = this.getUnseenAlerts();
    const allAlertsCount = this.props.alerts.length;

    if (unseenAlerts.length === 0) {
      return (
        <span className="AlertTray-Button-Title">
          Alerts ({allAlertsCount})
        </span>
      );
    }

    return (
      <Fragment>
        <span className="AlertTray-Button-Title">{`Alerts `}</span>
        <span className="AlertTray-Button-Counter">{unseenAlerts.length}</span>
      </Fragment>
    );
  }

  getButtonClassName() {
    if (this.state.open) {
      return 'AlertTray-Button AlertTray-Button-open';
    }

    if (this.getUnseenAlerts().length) {
      return 'AlertTray-Button AlertTray-Button-hasNew';
    }

    return 'AlertTray-Button';
  }

  renderContent() {
    if (!this.state.open) return undefined;

    if (!this.props.alerts.length) {
      return (
        <p
          key={alert.time}
          className="AlertTray-Alert AlertTray-Alert-info"
          style={{ textAlign: 'center' }}
        >
          You have no alert for now.
        </p>
      );
    }

    return this.props.alerts.map(this.renderAlert);
  }

  render() {
    const buttonClassName = this.getButtonClassName();
    return (
      <div className="AlertTray">
        <div
          className={buttonClassName}
          onClick={this.toggleState}
        >
          {this.getButtonText()}
        </div>
        {this.state.open && (
          <div className="AlertTray-Content">
            {this.renderContent()}
          </div>
        )}
      </div>
    );
  }
}

export default AlertTray;
