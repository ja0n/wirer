import BaseWire from './BaseWire';
import { createElement } from './utils/dom';
import { _p } from './utils/points';

export default class Wire extends BaseWire {
  constructor(config, ...args) {
    super(config, ...args);

    // if (config.render.internalRender)
    //   this.initDom();

    return this;
  }
}
