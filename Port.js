var Port = function(id, wrapper, dir, attrs) {
  if(['in','out'].indexOf(dir) === -1) throw 'port direction must be \'in\' or \'out\'';
  this._el = Sticky.createElement('circle', attrs);
  this._el.wrapper = this;
  this._id = id;
  this.wrapper = wrapper;
  this.type = 'port';
  this.dir = dir; //dir -> direction, not directory

  return this;
};

Port.prototype = Object.create(SVGCircleElement.prototype);

Port.prototype.attr = function(key, value) {
  if(value) return this._el.setAttribute(key, value);
  else return this._el.getAttribute(key);
};

// Port.prototype = {
//   get x () { return this.attr('cx') *1; },
//   get y () { return this.attr('cy') *1; },
//   attr: function(key, value) {
//     if(value) return this._el.setAttribute(key, value);
//     else return this._el.getAttribute(key);
//   },
//   value: function() {
//     this.wrapper.getValue();
//     // this.wrapper.getValue(this._id);
//   },
//   getPoint: function() {
//     return { x: this.wrapper.x + this.attr('cx') *1, y: this.wrapper.y + this.attr('cy') *1 };
//     // *1 -> convert from string to number
//   }
// };


// Port.prototype
