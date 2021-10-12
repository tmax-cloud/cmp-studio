import * as React from 'react';
import TopologyGraph, { GraphProps } from './TopologyGraph';

const TopologyGraphLayout = (props: TopologyGraphLayoutProps) => {
  return <TopologyGraph {...props} />;
};

// export interface GraphLayoutProps {} // TODO

export type TopologyGraphLayoutProps = GraphProps;

export default TopologyGraphLayout;
