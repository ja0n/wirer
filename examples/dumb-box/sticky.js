(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Sticky", [], factory);
	else if(typeof exports === 'object')
		exports["Sticky"] = factory();
	else
		root["Sticky"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Wire = __webpack_require__(1);
	
	var _Wire2 = _interopRequireDefault(_Wire);
	
	var _Brick2 = __webpack_require__(3);
	
	var _Brick3 = _interopRequireDefault(_Brick2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Sticky = function () {
	  function Sticky(id) {
	    var _this = this;
	
	    _classCallCheck(this, Sticky);
	
	    this.el = document.getElementById(id);
	    if (!this.el) throw "Couldn't find element :(";
	    var svg = Sticky.createElement('svg', { class: 'svg-content', viewBox: "0 0 800 600", preserveAspectRatio: "xMidYMid meet" });
	    // let svg = Sticky.createElement('svg', { class: 'svg-content', width: 800, height: 400 });
	    this._uid = 0;
	    this._aux = {};
	    this._blocks = {};
	    this._objects = [];
	    this._wires = [];
	    this._state = null;
	
	    var lastDownTarget = undefined;
	
	    svg.addEventListener('mousedown', function (e) {
	      // lastDownTarget = svg;
	      if (e.target.type === 'wire') {
	        return _this.selectedWire = e.target.wrapper;
	      }
	      if (e.target.type === 'port' && e.target.dir === 'out') {
	        return _this.startAttach(e.target);
	      }
	
	      if (e.target.type === 'block' || e.target.type === 'title') {
	        _this.dragging = e.target.parentNode;
	        var wrapper = _this.dragging.wrapper;
	        var SVGbox = wrapper._svg.getBoundingClientRect();
	        var OffsetX = e.x - SVGbox.left;
	        var OffsetY = e.y - SVGbox.top;
	        _this._aux.mouseDown = { x: OffsetX - wrapper.x, y: OffsetY - wrapper.y };
	        _this._svg.appendChild(_this.dragging);
	        wrapper.wires.forEach(function (wire) {
	          return _this._svg.appendChild(wire._el);
	        });
	      }
	    }, false);
	
	    document.addEventListener('mousedown', function (e) {
	      // lastDownTarget = e.target;
	      // console.log(lastDownTarget);
	    }, false);
	
	    document.addEventListener('keydown', function (e) {
	      // if (lastDownTarget == svg) {
	      if (e.keyCode == 46) _this.selectedWire.delete();
	      // }
	    }, false);
	
	    svg.addEventListener('keydown', function (e) {
	      console.log(e);
	    }, false);
	
	    svg.addEventListener('mouseup', function (e) {
	      _this.dragging = null;
	      if (e.target.type === 'port') return _this.endAttach(e.target);
	
	      if (_this.isState('attaching')) {
	        _this.setState(null);
	        svg.removeChild(_this._aux['wire']._el);
	      }
	    });
	
	    svg.addEventListener('mousemove', function (e) {
	      return _this.attachMove(e);
	    });
	
	    svg.addEventListener('mousemove', function (e) {
	      if (_this.dragging) {
	        var wrapper = _this.dragging.wrapper;
	        var SVGbox = wrapper._svg.getBoundingClientRect();
	        var OffsetX = e.x - SVGbox.left;
	        var OffsetY = e.y - SVGbox.top;
	
	        var firstState = _this._aux.mouseDown;
	        wrapper.x = OffsetX - firstState.x;
	        wrapper.y = OffsetY - firstState.y;
	        wrapper.updateWires();
	      }
	    });
	
	    this._svg = svg;
	    this.el.appendChild(this._svg);
	
	    this.registerBlock('start', {
	      width: 35, height: 60, rx: 10, ry: 10, fill: '#AF2B37', ports: { data_in: 0, data_out: 0, flow_in: 0, flow_out: 1 },
	      title: '',
	      icon: 'img/icon.png',
	      behavior: function behavior() {
	        return 0;
	      }
	    });
	    // this.registerBlock('actuator', ActuatorBrick);
	
	    this.clearCanvas();
	
	    this.colors = ["#B8D430", "#3AB745", "#029990", "#3501CB", "#2E2C75", "#673A7E", "#CC0071", "#F80120", "#F35B20", "#FB9A00", "#FFCC00", "#FEF200"];
	
	    return this;
	  }
	
	  //static methods
	
	
	  _createClass(Sticky, [{
	    key: 'Brick',
	    value: function Brick(name, attrs) {
	      var el = Sticky.createElement(name, attrs);
	      var brick = new _Brick3.default(el, this);
	      brick._id = this._uid++;
	      this._objects.push(brick);
	
	      return brick;
	    }
	  }, {
	    key: 'addObj',
	    value: function addObj(obj) {
	      if (obj._id == null) obj._id = this._uid++;
	      this._objects.push(obj);
	      this.addElement(obj._el);
	    }
	  }, {
	    key: 'removeObj',
	    value: function removeObj(obj, update) {
	      var index = this._objects.indexOf(obj);
	      if (index == -1) return;
	
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = Object.keys(obj._ports)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var port_type = _step.value;
	
	          if (obj._ports[port_type][0]) {
	            // if there's any connection
	            var _iteratorNormalCompletion3 = true;
	            var _didIteratorError3 = false;
	            var _iteratorError3 = undefined;
	
	            try {
	              for (var _iterator3 = obj._ports[port_type][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                // port.dettach();
	
	                var port = _step3.value;
	              }
	            } catch (err) {
	              _didIteratorError3 = true;
	              _iteratorError3 = err;
	            } finally {
	              try {
	                if (!_iteratorNormalCompletion3 && _iterator3.return) {
	                  _iterator3.return();
	                }
	              } finally {
	                if (_didIteratorError3) {
	                  throw _iteratorError3;
	                }
	              }
	            }
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;
	
	      try {
	        for (var _iterator2 = obj.wires[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var _wire = _step2.value;
	
	          _wire.delete();
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	
	      this.removeElement(obj._el);
	      if (update) return this._objects.splice(index, 1);
	    }
	  }, {
	    key: 'addElement',
	    value: function addElement(el) {
	      this._svg.appendChild(el);
	    }
	  }, {
	    key: 'removeElement',
	    value: function removeElement(el) {
	      this._svg.removeChild(el);
	    }
	  }, {
	    key: 'startAttach',
	    value: function startAttach(port) {
	      var wire = new _Wire2.default(port.wrapper);
	      wire._inverted = port.wrapper.dir === 'in';
	      this.setState('attaching');
	      this._aux['wire'] = wire;
	      this.addElement(wire._el);
	    }
	  }, {
	    key: 'startDrag',
	    value: function startDrag(port) {
	      this.setState('attaching');
	      this._aux['wire'] = wire;
	      this.addElement(wire._el);
	    }
	  }, {
	    key: 'endAttach',
	    value: function endAttach(port) {
	      if (this.isState('attaching')) {
	        this.setState(null);
	        var wire = this._aux['wire'];
	        wire._cp2 = port.wrapper;
	
	        if (wire.seal()) {
	          wire.render();
	          this._wires.push(wire);
	        } else {
	          this.removeElement(wire._el);
	        }
	        delete this._aux['wire'];
	      }
	    }
	  }, {
	    key: 'setState',
	    value: function setState(state) {
	      return this._state = state;
	    }
	  }, {
	    key: 'isState',
	    value: function isState(state) {
	      return this._state === state;
	    }
	  }, {
	    key: 'attachMove',
	    value: function attachMove(mouse) {
	      if (this.isState('attaching')) {
	        var wire = this._aux['wire'];
	        var SVGbox = this._svg.getBoundingClientRect();
	        //(below) pixel for removing the wire from the way so we can detect the event on port
	        var offset = wire._inverted ? 1 : -1;
	        var mouse = { x: mouse.x - SVGbox.left + offset, y: mouse.y - SVGbox.top };
	        var port = wire._cp1.getPoint();
	
	        wire._render(port, mouse, wire._inverted);
	      }
	    }
	  }, {
	    key: 'clearCanvas',
	    value: function clearCanvas() {
	      var start = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	      var _iteratorNormalCompletion4 = true;
	      var _didIteratorError4 = false;
	      var _iteratorError4 = undefined;
	
	      try {
	        for (var _iterator4 = this._objects[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	          var obj = _step4.value;
	
	          // this.removeElement(obj._el);
	          this.removeObj(obj, false);
	        }
	      } catch (err) {
	        _didIteratorError4 = true;
	        _iteratorError4 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion4 && _iterator4.return) {
	            _iterator4.return();
	          }
	        } finally {
	          if (_didIteratorError4) {
	            throw _iteratorError4;
	          }
	        }
	      }
	
	      this._objects = [];
	
	      if (!start) return;
	
	      var start = this.createBlock('start');
	      start.x = 10;start.y = this._svg.getAttribute('height') / 2;
	      start.behavior = function () {
	        return 0;
	      };
	
	      this.addObj(start);
	    }
	  }, {
	    key: 'registerBlock',
	    value: function registerBlock(name, obj) {
	      this._blocks[name] = obj;
	      this._blocks[name].id = name;
	
	      if (obj.behavior && typeof obj.behavior !== 'function') {
	        this._blocks[name].behavior = new Function('findById', obj.behavior);
	      }
	    }
	  }, {
	    key: 'createBlock',
	    value: function createBlock(name) {
	      var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	      if (!this._blocks[name]) throw "Block not registered";
	      return Object.assign(new _Brick3.default(this._blocks[name]), data);
	    }
	  }, {
	    key: 'findById',
	    value: function findById(id) {
	      if (id == undefined) return null;
	      var _iteratorNormalCompletion5 = true;
	      var _didIteratorError5 = false;
	      var _iteratorError5 = undefined;
	
	      try {
	        for (var _iterator5 = this._objects[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	          var obj = _step5.value;
	
	          if (obj._id === id) return obj;
	        }
	      } catch (err) {
	        _didIteratorError5 = true;
	        _iteratorError5 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion5 && _iterator5.return) {
	            _iterator5.return();
	          }
	        } finally {
	          if (_didIteratorError5) {
	            throw _iteratorError5;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'toJSON',
	    value: function toJSON() {
	      var fluxgram = this._objects.map(function (obj) {
	        var object = {
	          refBlock: obj._refBlock,
	          id: obj._id,
	          x: obj.x,
	          y: obj.y,
	          ports: {} // flow_in, flow_out, in, out
	        };
	
	        for (var type in obj._ports) {
	          console.log(type, obj._ports[type]);
	          object.ports[type] = obj._ports[type].map(function (port) {
	            return [].concat(_toConsumableArray(port._conn));
	          });
	        }
	
	        return object;
	      });
	
	      // var refBlock = this._blocks.map(block => ({
	      //   // ...block,
	      //   behavior: block.behavior.toString
	      // }));
	
	      var refBlock = {};
	
	      return { refBlock: refBlock, fluxgram: fluxgram };
	    }
	  }, {
	    key: 'loadJSON',
	    value: function loadJSON(data) {
	      this.clearCanvas(false);
	
	      var _iteratorNormalCompletion6 = true;
	      var _didIteratorError6 = false;
	      var _iteratorError6 = undefined;
	
	      try {
	        for (var _iterator6 = data[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	          var block = _step6.value;
	
	          var refBlock = this._blocks[block.refBlock];
	          var obj = this.createBlock(block.refBlock, refBlock);
	          obj.x = block.x;
	          obj.y = block.y;
	          obj.value = block.value;
	          obj._id = block.id;
	          console.log(block.id, obj._id);
	          this.addObj(obj);
	        }
	
	        // load wires
	        // PLEASE REFACTORATE ME
	      } catch (err) {
	        _didIteratorError6 = true;
	        _iteratorError6 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion6 && _iterator6.return) {
	            _iterator6.return();
	          }
	        } finally {
	          if (_didIteratorError6) {
	            throw _iteratorError6;
	          }
	        }
	      }
	
	      var _iteratorNormalCompletion7 = true;
	      var _didIteratorError7 = false;
	      var _iteratorError7 = undefined;
	
	      try {
	        for (var _iterator7 = data[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	          var block = _step7.value;
	
	          var blocky = this.findById(block.id);
	          console.log(blocky, block.id);
	
	          var _iteratorNormalCompletion8 = true;
	          var _didIteratorError8 = false;
	          var _iteratorError8 = undefined;
	
	          try {
	            for (var _iterator8 = block.ports.out[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	              var port = _step8.value;
	
	              if (!port[0]) {
	                console.log('end of flux');
	                break;
	              }
	              var blocky2 = this.findById(port[0].brick);
	              var _wire2 = new _Wire2.default(blocky._ports['out'][0], blocky2._ports['in'][port[0].id]);
	              this.addElement(_wire2._el);
	              if (_wire2.seal()) {
	                _wire2.render();
	                this._wires.push(_wire2);
	              } else {
	                this.removeElement(_wire2._el);
	              }
	            }
	          } catch (err) {
	            _didIteratorError8 = true;
	            _iteratorError8 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion8 && _iterator8.return) {
	                _iterator8.return();
	              }
	            } finally {
	              if (_didIteratorError8) {
	                throw _iteratorError8;
	              }
	            }
	          }
	
	          var _iteratorNormalCompletion9 = true;
	          var _didIteratorError9 = false;
	          var _iteratorError9 = undefined;
	
	          try {
	            for (var _iterator9 = block.ports.flow_out[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	              var port = _step9.value;
	
	              console.log(port);
	              if (!port[0]) {
	                console.log('end of flux');
	                break;
	              }
	              var blocky2 = this.findById(port[0].brick);
	              var _wire3 = new _Wire2.default(blocky._ports['flow_out'][0], blocky2._ports['flow_in'][0]);
	              this.addElement(_wire3._el);
	
	              if (_wire3.seal()) {
	                _wire3.render();
	                this._wires.push(_wire3);
	              } else {
	                this.removeElement(_wire3._el);
	              }
	            }
	          } catch (err) {
	            _didIteratorError9 = true;
	            _iteratorError9 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion9 && _iterator9.return) {
	                _iterator9.return();
	              }
	            } finally {
	              if (_didIteratorError9) {
	                throw _iteratorError9;
	              }
	            }
	          }
	        }
	      } catch (err) {
	        _didIteratorError7 = true;
	        _iteratorError7 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion7 && _iterator7.return) {
	            _iterator7.return();
	          }
	        } finally {
	          if (_didIteratorError7) {
	            throw _iteratorError7;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'run',
	    value: function run() {
	      var block = this._objects[0],
	          flow = undefined,
	          id = undefined,
	          refBlock = undefined;
	      console.log(block);
	
	      // flow = start.behavior();
	      // an ActuatorBrick should return the flow_out port id
	      // it'll be useful for if block
	
	      do {
	        refBlock = this._blocks[block._refBlock];
	        flow = refBlock.behavior.call(block, this.findById.bind(this));
	        // console.log(block._ports);
	        id = block._ports['flow_out'][flow]._conn[0] ? block._ports['flow_out'][flow]._conn[0].brick : null;
	        block = this.findById(id);
	        console.log(refBlock, flow, block);
	      } while (block);
	    }
	  }, {
	    key: 'compile',
	    value: function compile() {}
	  }], [{
	    key: 'createElement',
	    value: function createElement(name, attrs) {
	      var el = document.createElementNS('http://www.w3.org/2000/svg', name);
	
	      for (var key in attrs) {
	        el.setAttribute(key, attrs[key]);
	      }return el;
	    }
	  }]);
	
	  return Sticky;
	}();

	exports.default = Sticky;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Wire;
	
	var _utils = __webpack_require__(2);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function Wire(p1, p2) {
	  this._el = (0, _utils2.default)('path', { stroke: 'red', 'stroke-width': 6, fill: 'none', opacity: 0.8 });
	  this._el.type = 'wire';
	  this._el.wrapper = this;
	  this._cp1 = p1;
	  this._cp2 = p2;
	  this._inverted = false;
	  this._behavior = undefined;
	
	  return this;
	}
	
	//static methods
	
	Wire.describeJoint = function (x1, y1, x2, y2, offset) {
	  return ["M", x1, y1, "C", x1 + offset, y1, x2 - offset, y2, x2, y2].join(" ");
	};
	
	Wire.dt2p = function (x1, y1, x2, y2) {
	  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	};
	
	Wire.prototype = {
	  _render: function _render(p1, p2, inv) {
	    inv = inv ? -1 : 1;
	    var offset = Wire.dt2p(p1.x, p1.y, p2.x, p2.y) / 2;
	    var d = Wire.describeJoint(p1.x, p1.y, p2.x, p2.y, offset * inv);
	    this._el.setAttribute('d', d);
	  },
	  seal: function seal() {
	    if (this._cp1.dir == this._cp2.dir) return false;
	    var wrapper1 = this._cp1._brick;
	    var wrapper2 = this._cp2._brick;
	
	    if (this._cp1.attach(this._cp2)) {
	      wrapper1.wires.push(this);
	      wrapper2.wires.push(this);
	      return true;
	    } else {
	      return false;
	    }
	  },
	  delete: function _delete() {
	    var wrapper1 = this._cp1._brick;
	    var wrapper2 = this._cp2._brick;
	    spliceByIndex(wrapper1.wires, this);
	    spliceByIndex(wrapper2.wires, this);
	    this._cp1.dettach(this._cp2);
	    this._el.parentNode.removeChild(this._el);
	  },
	  render: function render() {
	    this._render(this._cp1.getPoint(), this._cp2.getPoint(), this._inverted);
	  }
	};
	
	function spliceByIndex(arr, obj) {
	  var index = arr.indexOf(obj);
	  console.log(index);
	  if (index != -1) {
	    arr.splice(index, 1);
	    return true;
	  }
	  return false;
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createElement;
	function createElement(name, attrs) {
	  var el = document.createElementNS('http://www.w3.org/2000/svg', name);
	
	  for (var key in attrs) {
	    el.setAttribute(key, attrs[key]);
	  }return el;
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Brick;
	
	var _ports = __webpack_require__(4);
	
	var _blockBuilder = __webpack_require__(6);
	
	var _blockBuilder2 = _interopRequireDefault(_blockBuilder);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function Brick(_ref) {
	  var behavior = _ref.behavior;
	  var title = _ref.title;
	  var ports = _ref.ports;
	  var icon = _ref.icon;
	  var gui = _ref.gui;
	  var id = _ref.id;
	  var x = _ref.x;
	  var y = _ref.y;
	
	  this._el = (0, _blockBuilder2.default)(arguments[0]);
	  this._el.wrapper = this;
	
	  // this._id = id;
	  this.behavior = behavior;
	  this._container = null;
	  this._refBlock = id;
	  this.x = x || 0;
	  this.y = y || 0;
	
	  this._ports = {
	    in: [],
	    out: []
	  };
	
	  this.wires = [];
	
	  this._aux = { attaching: {} };
	  this._states = { dragging: false };
	
	  arrangePorts.call(this, ports);
	
	  return this;
	}
	
	Brick.prototype = {
	  get data() {
	    return this.behavior();
	  },
	  get main() {
	    return this._el.getElementById('main');
	  },
	  get _svg() {
	    return getSvg(this._el);
	  },
	  get x() {
	    return this._el.getAttribute('x') * 1;
	  }, // multiply by one just to convert from string to number
	  get y() {
	    return this._el.getAttribute('y') * 1;
	  }, //
	  get text() {
	    return this._el.innerHTML;
	  },
	  set x(val) {
	    return this._el.setAttribute('x', val);
	  },
	  set y(val) {
	    return this._el.setAttribute('y', val);
	  },
	  set text(val) {
	    return this._el.innerHTML = val;
	  },
	
	  attr: function attr(key, value) {
	    if (value) return this._el.setAttribute(key, value);else if (key) return this._el.getAttribute(key);
	  },
	  detach: function detach() {
	    this._el.parentNode.removeChild(this._el);
	    return this;
	  },
	  arrangePorts: function arrangePorts() {},
	  updateWires: function updateWires() {
	    this.wires.forEach(function (wire) {
	      return wire.render();
	    });
	  },
	  getValue: function getValue(id) {
	    // var args = this._
	    var args = [];
	    var In = this._ports.in;
	
	    for (var i = 0; i < In.length; i++) {
	      args.push([]);
	      for (var j = 0; j < In[i].length; j++) {
	        args[i].push(In[i][j].value());
	      }
	    }
	
	    if (id) return this._behavior(args)[id];else return this._behavior(args);
	  }
	};
	
	function getSvg(el) {
	  if (el.parentNode.nodeName === 'svg') {
	    return el.parentNode;
	  }
	  return getSvg(el.parentNode);
	}
	
	function arrangePorts() {
	  var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  var _ref2$data_in = _ref2.data_in;
	  var data_in = _ref2$data_in === undefined ? 1 : _ref2$data_in;
	  var _ref2$data_out = _ref2.data_out;
	  var data_out = _ref2$data_out === undefined ? 1 : _ref2$data_out;
	  var _ref2$flow_in = _ref2.flow_in;
	  var flow_in = _ref2$flow_in === undefined ? 1 : _ref2$flow_in;
	  var _ref2$flow_out = _ref2.flow_out;
	  var flow_out = _ref2$flow_out === undefined ? 1 : _ref2$flow_out;
	
	  var radius = 10;
	  var dist = 10; //distance beetween ports
	  var strokeWidth = 3.5;
	  var ports = this._ports;
	  var main = this.main;
	  // var rectBox = main.getBBox ? main.getBBox() : main.getBoundingClientRect();
	  var rectBox = main.getBoundingClientRect();
	  var maxPorts = Math.max(data_in + flow_in, data_out + flow_out);
	  // var maxPorts = Math.max(ports.in.length, ports.out.length);
	  var Radius = radius + strokeWidth / 2; //total radius -> circle radius plus its stroke width
	  var tRadius = dist + Radius;
	  var height = (dist + Radius * 2) * maxPorts + dist; //dist + diameter * number of ports + final dist
	  var width = main.getAttribute('width') * 1;
	
	  this._ports.in = [];
	  this._ports.out = [];
	  this._ports.flow_in = [];
	  this._ports.flow_out = [];
	
	  main.setAttribute('height', height);
	
	  var attrs = { id: null, r: radius, fill: '#B8D430', stroke: 'black', 'stroke-width': strokeWidth };
	  var flow_attrs = { id: null, r: radius, fill: '#2549e4', stroke: 'black', 'stroke-width': strokeWidth };
	  var i, y, ds;
	  // attrs.cx = margin; attrs.cy = rectBox.height/2;
	
	  ds = height / (data_in + flow_in);
	  y = ds / 2;
	
	  for (i = 0; i < flow_in; i++, y += ds) {
	    var port = new _ports.FlowPort(i, 'in', this);
	    port.attr('cx', Radius);
	    port.attr('cy', y);
	    ports.flow_in.push(port);
	    this._el.appendChild(port._el);
	  }
	
	  for (i = 0; i < data_in; i++, y += ds) {
	    var port = new _ports.DataPort(i, 'in', this);
	    port.attr('cx', Radius);
	    port.attr('cy', y);
	    ports.in.push(port);
	    this._el.appendChild(port._el);
	  }
	
	  ds = height / (data_out + flow_out);
	  y = ds / 2; //initially get half the distance cuz we drawin a circle, then we increment by the total distance
	  //cuz it means the missing half for the current circle and the initial half for the next circle
	  //so every 'y' means one center of circle
	  for (i = 0; i < flow_out; i++, y += ds) {
	    var port = new _ports.FlowPort(i, 'out', this);
	    port.attr('cx', width + Radius);
	    port.attr('cy', y);
	    ports.flow_out.push(port);
	    this._el.appendChild(port._el);
	  }
	
	  for (i = 0; i < data_out; i++, y += ds) {
	    var port = new _ports.DataPort(i, 'out', this);
	    port.attr('cx', width + Radius);
	    port.attr('cy', y);
	    ports.out.push(port);
	    this._el.appendChild(port._el);
	  }
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DataPort = DataPort;
	exports.FlowPort = FlowPort;
	
	var _Port = __webpack_require__(5);
	
	var _Port2 = _interopRequireDefault(_Port);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function DataPort(id, dir, brick) {
	  _Port2.default.call(this, { id: id, dir: dir, brick: brick, type: 'data' });
	
	  var opts = { fill: '#B8D43' };
	
	  return this;
	}
	
	DataPort.prototype = {
	  __proto__: Object.create(_Port2.default.prototype)
	};
	
	function FlowPort(id, dir, brick) {
	  _Port2.default.call(this, { id: id, dir: dir, brick: brick, type: 'flow' });
	
	  this._maxcon = 1;
	
	  this._el.setAttribute('fill', '#2549e4');
	
	  var opts = { fill: '#2549e4' };
	
	  return this;
	}
	
	FlowPort.prototype = {
	  __proto__: Object.create(_Port2.default.prototype)
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Port;
	
	var _utils = __webpack_require__(2);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function Port(_ref) {
	  var id = _ref.id;
	  var type = _ref.type;
	  var dir = _ref.dir;
	  var brick = _ref.brick;
	
	  if (['in', 'out'].indexOf(dir) == -1) throw "port direction must be 'in' or 'out'";
	  if (['data', 'flow'].indexOf(type) == -1) throw "type must be 'data' or 'flow'";
	  // var attrs = { width: 30, height: 30, fill: '#B8D430', stroke: 'black', 'stroke-width': 3 };
	  var attrs = { r: 10, fill: '#B8D430', stroke: 'black', 'stroke-width': 3.5 };
	
	  // Object.assign(attrs, { wrapper: this, type: 'port', dir: dir });
	  this._el = (0, _utils2.default)('circle', attrs);
	  this._el.wrapper = this;
	  this._el.type = 'port';
	  this._el.dir = dir;
	
	  this._brick = brick;
	  this._maxcon = 2;
	  this._conn = [];
	  this.id = id;
	  this.type = type;
	  this.dir = dir; //dir -> direction, not directory
	
	  return this;
	}
	
	Port.prototype = {
	  get x() {
	    return this.attr('cx') * 1;
	  }, //force coercion to number
	  get y() {
	    return this.attr('cy') * 1;
	  },
	  get available() {
	    return this._conn.length < this._maxcon;
	  },
	  attr: function attr(key, value) {
	    if (value) return this._el.setAttribute(key, value);else return this._el.getAttribute(key);
	  },
	  value: function value() {
	    this._brick.getValue();
	    // this.wrapper.getValue(this._id);
	  },
	  getPoint: function getPoint() {
	    return { x: this._brick.x + this.x, y: this._brick.y + this.y };
	  },
	  attach: function attach(to) {
	    if (this.canAttach(to)) {
	      this._conn.push({ brick: to._brick._id, id: to.id });
	      to._conn.push({ brick: this._brick._id, id: this.id });
	      // console.log(this, to);
	      return true;
	    }
	    return false;
	  },
	  dettach: function dettach(to) {
	    var index1 = this._conn.indexOf({ brick: to._brick._id, id: to.id });
	    var index2 = this._conn.indexOf({ brick: this._brick._id, id: this.id });
	    this._conn.splice(index1, 1);
	    to._conn.splice(index2, 1);
	  },
	  canAttach: function canAttach(to) {
	    return this.available && to.available && this.type === to.type ? true : false;
	  }
	};
	
	// module.exports = Port;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = blockBuilder;
	
	var _utils = __webpack_require__(2);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// function SVGBuilder({ strokeWidth, marginLeft, width, opacity, height, rx, ry, fill, stroke, ...rest }) {
	function blockBuilder(_ref) {
	  var strokeWidth = _ref.strokeWidth;
	  var marginLeft = _ref.marginLeft;
	  var width = _ref.width;
	  var opacity = _ref.opacity;
	  var height = _ref.height;
	  var rx = _ref.rx;
	  var ry = _ref.ry;
	  var fill = _ref.fill;
	  var stroke = _ref.stroke;
	  var title = _ref.title;
	
	  // { strokeWidth = 3, marginLeft = 10, width = 150, opacity = 1, height = 50, rx = 20, ry = 20, fill = '#1F8244', stroke = '#000000' }
	  strokeWidth = strokeWidth || 3;
	  marginLeft = marginLeft || 10;
	  width = width || 150;
	  opacity = opacity || 1;
	  height = height || 50;
	  rx = rx || 20;
	  ry = ry || 20;
	  fill = fill || '#1F8244';
	  stroke = '#000000';
	
	  var svg = (0, _utils2.default)('svg');
	
	  var attrs = {
	    x: marginLeft + strokeWidth / 2,
	    y: strokeWidth / 2,
	    width: width,
	    height: height,
	    rx: rx,
	    ry: ry,
	    'stroke-width': strokeWidth,
	    style: 'fill: ' + fill + '; stroke: ' + stroke + '; opacity: ' + opacity,
	    id: 'main'
	  };
	
	  var rect = (0, _utils2.default)('rect', attrs);
	  rect.type = 'block';
	  var text = (0, _utils2.default)('text', { x: 25, y: 30, style: 'cursor: default' });
	  text.type = 'title';
	  var txtNode = document.createTextNode(title);
	  text.appendChild(txtNode);
	
	  svg.appendChild(rect);
	  svg.appendChild(text);
	  return svg;
	}
	
	blockBuilder.prototype = {};
	
	var test = {
	  fill: '#31dfaf',
	  border: '#e695bf',
	  ports: { data_in: 0, data_out: 0, flow_in: 1, flow_out: 1 },
	  title: 'Test Block',
	  icon: 'img/icon.png',
	  gui: [{ type: 'select', options: ['USA', 'BR', 'CND'] }, { type: 'text' }, { type: 'number' }]
	
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=sticky.js.map