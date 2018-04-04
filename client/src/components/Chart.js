/* @flow */
import React, { Component } from 'react';
import ChartJs from 'chart.js';


type Props = {
  time: ?Array<number>,
  oneMinute: ?Array<number>,
  fiveMinutes: ?Array<number>,
  fifteenMinutes: ?Array<number>,
};

const containerStyle = {
  position: 'absolute',
  top: 10,
  left: 10,
  right: 10,
  bottom: 10,
};

const formatLoad = (load: number) => {
  const precision = 100;
  const round = Math.round(load * precision) / precision;
  return round.toLocaleString();
}

/**
 * Chart component
 */
class Chart extends Component<Props> {
  static defaultProps = {};

  canvas: ?HTMLCanvasElement;
  chart: any;

  setCanvasRef = (ref: ?HTMLCanvasElement) => {
    this.canvas = ref;
  }

  getLabels() {
    return this.props.time || [];
  }

  getFormattedLabels() {
    return this.getLabels().map(t => Math.round(t / 60000));
  }

  getDatasets() {
    return [
      { label: '1 minute', data: this.props.oneMinute, pointRadius: 0 },
      { label: '5 minutes', data: this.props.fiveMinutes, pointRadius: 0 },
      { label: '15 minutes', data: this.props.fifteenMinutes, pointRadius: 0 },
    ];
  }

  componentDidMount() {
    if (!this.canvas) return undefined;

    this.chart = new ChartJs(this.canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: this.getLabels(),
        datasets: this.getDatasets(),
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              display: true,
              ticks: {
                // show all labels
                autoSkip: false,
                // return empty label when not wanted
                callback: function(value, index, values) {
                  const formattedValue = -Math.floor(value / 60000);

                  // always show the first value
                  if (index === 0) return formattedValue;
                  // always show the last value
                  if (index === values.length - 1) return formattedValue;

                  // only show value if we changed minutes value
                  const nextValue = -Math.floor(values[index - 1] / 60000);
                  if (nextValue === formattedValue) return '';

                  return formattedValue;
                },
                maxRotation: 0,
                minRotation: 0,
              },
              // no vertical line
              gridLines: false,
              // Show the x-axis label
              scaleLabel: {
                display: true,
                labelString: 'minutes ago',
              },
            },
          ],
        },
        tooltips: {
          mode: 'label',
          intersect: false,
          callbacks: {
            label: (tooltipItem, data) => {
              const label = data.datasets[tooltipItem.datasetIndex].label;
              const value = tooltipItem.yLabel;

              return `${label}: ${formatLoad(value)}`;
            },
            title: (tooltipItems, data) => {
              const msAgo = -data.labels[tooltipItems[0].index];
              const minutes = Math.floor(msAgo / 60000);
              const seconds = Math.floor(msAgo % 60000 / 1000);

              if (!minutes) return `${seconds} seconds ago`;

              return `${minutes} minutes and ${seconds} seconds ago`;
            },
          },
        },
        // those are options for performance,
        // from https://www.chartjs.org/docs/latest/charts/line.html
        animation: { duration: 0 },
        responsiveAnimationDuration: 0,
        elements: { line: { tension: 0 } },
      }
    });
  }

  componentWillUnmout() {
    this.chart.destroy();
    delete this.chart;
  }

  componentWillReceiveProps(newProps: Props) {
    this.chart.data.labels = this.getLabels();
    this.chart.data.datasets = this.getDatasets();
    this.chart.options.animation = false;
    this.chart.update();
  }

  render() {
    return (
      <div style={containerStyle}>
        <canvas ref={this.setCanvasRef} />
      </div>
    );
  }
}

export default Chart;
