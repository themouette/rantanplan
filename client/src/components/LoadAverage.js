import React from 'react';


export type LoadAverageProps = {
  children: ?number,
};
const LoadAverage = (props: LoadAverageProps) => {
  if (!props.children) return <span>Unknown</span>;

  const precision = 100;
  const round = Math.round(props.children * precision) / precision;
  return <span>{round.toLocaleString()}</span>
}

export default LoadAverage;
