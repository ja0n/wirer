import React from 'react';
import _get from 'lodash/get';
import BaseWire from '../../BaseWire';
import { Offset, Zoom } from '../../types';
import Port from '../../Port';

type Props = {
  wrapper: BaseWire;
  zoom: Zoom;
  offset: Offset;
}

export default class Wire extends React.Component<Props> {
  setupInstance (ref: SVGElement) {
    if (ref) {
      const { wrapper } = this.props;
      wrapper.setupInstance(ref)
    }
  }

  render() {
    const { wrapper, offset, zoom } = this.props;
    const [p1, p2] = wrapper.getControlPoints();
    // handle port position or an arbitrary one
    const sourcePoint = p1 instanceof Port ? p1.getPoint(offset, zoom) : p1;
    const targetPoint = p2 instanceof Port ? p2.getPoint(offset, zoom) : p2;
    const direction = wrapper._inverted ? -1 : 1;
    const jointOffset = dt2p(sourcePoint.x, sourcePoint.y, targetPoint.x, targetPoint.y)/2;
    const d = describeJoint(sourcePoint.x, sourcePoint.y, targetPoint.x, targetPoint.y, jointOffset * direction);
    const setupRef = (ref) => {
      if (ref) {
        ref.wrapper = wrapper;
        ref.type = 'wire';
      }
    }
    return (
      <g ref={ref => this.setupInstance(ref)}>
        {styles.map(style => <path key={style.stroke} d={d} type="wire" {...style} ref={setupRef} />)}
      </g>
    );
  }
}

const describeJoint = (x1: any, y1: any, x2: number, y2: any, offset: number) =>
  [ "M", x1, y1,
    "C", x1 + offset, y1, x2 - offset, y2, x2, y2
  ].join(" ");

const dt2p = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

const styles: React.SVGProps<SVGPathElement>[] = [
  {
    'stroke': '#505050',
    'strokeWidth': 6,
    'strokeLinejoin': 'round',
    'strokeLinecap': 'round',
    'fill': 'none',
    'opacity': 1
  },
  {
    'stroke': '#F3F375',
    'strokeWidth': 2,
    'strokeLinecap': 'round',
    'strokeDasharray': 6,
    'fill': 'none',
    'opacity': 0.8
  },
];