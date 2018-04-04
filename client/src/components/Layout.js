/* @flow */
import React, { type Node } from 'react';

import './Layout.css';

export type RootProps = {
  children: Node,
};
export const Root = (props: RootProps) => (
  <div className="Layout">{props.children}</div>
);

export type HeaderProps = {
  children: Node,
};
export const Header = (props: HeaderProps) => (
  <div className="Layout-Header">{props.children}</div>
);

export type ContentProps = {
  children: Node,
};
export const Content = (props: ContentProps) => (
  <div className="Layout-Content">{props.children}</div>
);

export type LayoutContentCenteredProps = {
  children: Node,
};
export const LayoutContentCentered = (props: LayoutContentCenteredProps) => (
  <div className="Layout-Content-Centered">{props.children}</div>
);

export type LayoutContentColumnsProps = {
  children: Node,
};
export const LayoutContentColumns = (props: LayoutContentColumnsProps) => (
  <div className="Layout-Content-Columns">{props.children}</div>
);

