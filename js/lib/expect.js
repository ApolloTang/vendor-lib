!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.expect=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _isRegexp = require('is-regexp');

var _isRegexp2 = _interopRequireDefault(_isRegexp);

var _assert = require('./assert');

var _assert2 = _interopRequireDefault(_assert);

var _SpyUtils = require('./SpyUtils');

var _TestUtils = require('./TestUtils');

/**
 * An Expectation is a wrapper around an assertion that allows it to be written
 * in a more natural style, without the need to remember the order of arguments.
 * This helps prevent you from making mistakes when writing tests.
 */

var Expectation = (function () {
  function Expectation(actual) {
    _classCallCheck(this, Expectation);

    this.actual = actual;

    if (_TestUtils.isFunction(actual)) {
      this.context = null;
      this.args = [];
    }
  }

  Expectation.prototype.toExist = function toExist(message) {
    _assert2['default'](this.actual, message || 'Expected %s to exist', this.actual);

    return this;
  };

  Expectation.prototype.toNotExist = function toNotExist(message) {
    _assert2['default'](!this.actual, message || 'Expected %s to not exist', this.actual);

    return this;
  };

  Expectation.prototype.toBe = function toBe(value, message) {
    _assert2['default'](this.actual === value, message || 'Expected %s to be %s', this.actual, value);

    return this;
  };

  Expectation.prototype.toNotBe = function toNotBe(value, message) {
    _assert2['default'](this.actual !== value, message || 'Expected %s to not be %s', this.actual, value);

    return this;
  };

  Expectation.prototype.toEqual = function toEqual(value, message) {
    try {
      _assert2['default'](_deepEqual2['default'](this.actual, value), message || 'Expected %s to equal %s', this.actual, value);
    } catch (e) {
      // These attributes are consumed by Mocha to produce a diff output.
      e.showDiff = true;
      e.actual = this.actual;
      e.expected = value;
      throw e;
    }

    return this;
  };

  Expectation.prototype.toNotEqual = function toNotEqual(value, message) {
    _assert2['default'](!_deepEqual2['default'](this.actual, value), message || 'Expected %s to not equal %s', this.actual, value);

    return this;
  };

  Expectation.prototype.toThrow = function toThrow(value, message) {
    _assert2['default'](_TestUtils.isFunction(this.actual), 'The "actual" argument in expect(actual).toThrow() must be a function, %s was given', this.actual);

    _assert2['default'](_TestUtils.functionThrows(this.actual, this.context, this.args, value), message || 'Expected %s to throw %s', this.actual, value || 'an error');

    return this;
  };

  Expectation.prototype.toNotThrow = function toNotThrow(value, message) {
    _assert2['default'](_TestUtils.isFunction(this.actual), 'The "actual" argument in expect(actual).toNotThrow() must be a function, %s was given', this.actual);

    _assert2['default'](!_TestUtils.functionThrows(this.actual, this.context, this.args, value), message || 'Expected %s to not throw %s', this.actual, value || 'an error');

    return this;
  };

  Expectation.prototype.toBeA = function toBeA(value, message) {
    _assert2['default'](_TestUtils.isFunction(value) || typeof value === 'string', 'The "value" argument in toBeA(value) must be a function or a string');

    _assert2['default'](_TestUtils.isA(this.actual, value), message || 'Expected %s to be a %s', this.actual, value);

    return this;
  };

  Expectation.prototype.toNotBeA = function toNotBeA(value, message) {
    _assert2['default'](_TestUtils.isFunction(value) || typeof value === 'string', 'The "value" argument in toNotBeA(value) must be a function or a string');

    _assert2['default'](!_TestUtils.isA(this.actual, value), message || 'Expected %s to be a %s', this.actual, value);

    return this;
  };

  Expectation.prototype.toMatch = function toMatch(pattern, message) {
    _assert2['default'](typeof this.actual === 'string', 'The "actual" argument in expect(actual).toMatch() must be a string');

    _assert2['default'](_isRegexp2['default'](pattern), 'The "value" argument in toMatch(value) must be a RegExp');

    _assert2['default'](pattern.test(this.actual), message || 'Expected %s to match %s', this.actual, pattern);

    return this;
  };

  Expectation.prototype.toNotMatch = function toNotMatch(pattern, message) {
    _assert2['default'](typeof this.actual === 'string', 'The "actual" argument in expect(actual).toNotMatch() must be a string');

    _assert2['default'](_isRegexp2['default'](pattern), 'The "value" argument in toNotMatch(value) must be a RegExp');

    _assert2['default'](!pattern.test(this.actual), message || 'Expected %s to not match %s', this.actual, pattern);

    return this;
  };

  Expectation.prototype.toBeLessThan = function toBeLessThan(value, message) {
    _assert2['default'](typeof this.actual === 'number', 'The "actual" argument in expect(actual).toBeLessThan() must be a number');

    _assert2['default'](typeof value === 'number', 'The "value" argument in toBeLessThan(value) must be a number');

    _assert2['default'](this.actual < value, message || 'Expected %s to be less than %s', this.actual, value);

    return this;
  };

  Expectation.prototype.toBeGreaterThan = function toBeGreaterThan(value, message) {
    _assert2['default'](typeof this.actual === 'number', 'The "actual" argument in expect(actual).toBeGreaterThan() must be a number');

    _assert2['default'](typeof value === 'number', 'The "value" argument in toBeGreaterThan(value) must be a number');

    _assert2['default'](this.actual > value, message || 'Expected %s to be greater than %s', this.actual, value);

    return this;
  };

  Expectation.prototype.toInclude = function toInclude(value, comparator, message) {
    _assert2['default'](_TestUtils.isArray(this.actual) || typeof this.actual === 'string', 'The "actual" argument in expect(actual).toInclude() must be an array or a string');

    if (typeof comparator === 'string') {
      message = comparator;
      comparator = null;
    }

    message = message || 'Expected %s to include %s';

    if (_TestUtils.isArray(this.actual)) {
      _assert2['default'](_TestUtils.arrayContains(this.actual, value, comparator), message, this.actual, value);
    } else {
      _assert2['default'](_TestUtils.stringContains(this.actual, value), message, this.actual, value);
    }

    return this;
  };

  Expectation.prototype.toExclude = function toExclude(value, comparator, message) {
    _assert2['default'](_TestUtils.isArray(this.actual) || typeof this.actual === 'string', 'The "actual" argument in expect(actual).toExclude() must be an array or a string');

    if (typeof comparator === 'string') {
      message = comparator;
      comparator = null;
    }

    message = message || 'Expected %s to exclude %s';

    if (_TestUtils.isArray(this.actual)) {
      _assert2['default'](!_TestUtils.arrayContains(this.actual, value, comparator), message, this.actual, value);
    } else {
      _assert2['default'](!_TestUtils.stringContains(this.actual, value), message, this.actual, value);
    }

    return this;
  };

  Expectation.prototype.toHaveBeenCalled = function toHaveBeenCalled(message) {
    var spy = this.actual;

    _assert2['default'](_SpyUtils.isSpy(spy), 'The "actual" argument in expect(actual).toHaveBeenCalled() must be a spy');

    _assert2['default'](spy.calls.length > 0, message || 'spy was not called');

    return this;
  };

  Expectation.prototype.toHaveBeenCalledWith = function toHaveBeenCalledWith() {
    var spy = this.actual;

    _assert2['default'](_SpyUtils.isSpy(spy), 'The "actual" argument in expect(actual).toHaveBeenCalledWith() must be a spy');

    var expectedArgs = Array.prototype.slice.call(arguments, 0);

    _assert2['default'](spy.calls.some(function (call) {
      return _deepEqual2['default'](call.arguments, expectedArgs);
    }), 'spy was never called with %s', expectedArgs);

    return this;
  };

  Expectation.prototype.toNotHaveBeenCalled = function toNotHaveBeenCalled(message) {
    var spy = this.actual;

    _assert2['default'](_SpyUtils.isSpy(spy), 'The "actual" argument in expect(actual).toNotHaveBeenCalled() must be a spy');

    _assert2['default'](spy.calls.length === 0, message || 'spy was not supposed to be called');

    return this;
  };

  Expectation.prototype.withContext = function withContext(context) {
    _assert2['default'](_TestUtils.isFunction(this.actual), 'The "actual" argument in expect(actual).withContext() must be a function');

    this.context = context;

    return this;
  };

  Expectation.prototype.withArgs = function withArgs() {
    _assert2['default'](_TestUtils.isFunction(this.actual), 'The "actual" argument in expect(actual).withArgs() must be a function');

    if (arguments.length) this.args = this.args.concat(Array.prototype.slice.call(arguments, 0));

    return this;
  };

  return Expectation;
})();

var aliases = {
  toBeAn: 'toBeA',
  toNotBeAn: 'toNotBeA',
  toBeTruthy: 'toExist',
  toBeFalsy: 'toNotExist',
  toBeFewerThan: 'toBeLessThan',
  toBeMoreThan: 'toBeGreaterThan',
  toContain: 'toInclude',
  toNotContain: 'toExclude'
};

for (var alias in aliases) {
  Expectation.prototype[alias] = Expectation.prototype[aliases[alias]];
}exports['default'] = Expectation;
module.exports = exports['default'];
},{"./SpyUtils":2,"./TestUtils":3,"./assert":4,"deep-equal":7,"is-regexp":10}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.createSpy = createSpy;
exports.spyOn = spyOn;
exports.isSpy = isSpy;
exports.restoreSpies = restoreSpies;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert = require('./assert');

var _assert2 = _interopRequireDefault(_assert);

var _TestUtils = require('./TestUtils');

function noop() {}

var spies = [];

function createSpy(fn) {
  var restore = arguments.length <= 1 || arguments[1] === undefined ? noop : arguments[1];

  if (fn == null) fn = noop;

  _assert2['default'](_TestUtils.isFunction(fn), 'createSpy needs a function');

  var targetFn = undefined,
      thrownValue = undefined,
      returnValue = undefined;

  var spy = function spy() {
    spy.calls.push({
      context: this,
      arguments: Array.prototype.slice.call(arguments, 0)
    });

    if (targetFn) return targetFn.apply(this, arguments);

    if (thrownValue) throw thrownValue;

    return returnValue;
  };

  spy.calls = [];

  spy.andCall = function (fn) {
    targetFn = fn;
    return spy;
  };

  spy.andCallThrough = function () {
    return spy.andCall(fn);
  };

  spy.andThrow = function (object) {
    thrownValue = object;
    return spy;
  };

  spy.andReturn = function (value) {
    returnValue = value;
    return spy;
  };

  spy.getLastCall = function () {
    return spy.calls[spy.calls.length - 1];
  };

  spy.restore = spy.destroy = restore;

  spy.__isSpy = true;

  spies.push(spy);

  return spy;
}

function spyOn(object, methodName) {
  var original = object[methodName];

  if (!isSpy(original)) {
    _assert2['default'](_TestUtils.isFunction(original), 'Cannot spyOn the %s property; it is not a function', methodName);

    object[methodName] = createSpy(original, function () {
      object[methodName] = original;
    });
  }

  return object[methodName];
}

function isSpy(object) {
  return object && object.__isSpy === true;
}

function restoreSpies() {
  for (var i = spies.length - 1; i >= 0; i--) {
    spies[i].restore();
  }spies = [];
}
},{"./TestUtils":3,"./assert":4}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.functionThrows = functionThrows;
exports.arrayContains = arrayContains;
exports.stringContains = stringContains;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isA = isA;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

var _isRegexp = require('is-regexp');

var _isRegexp2 = _interopRequireDefault(_isRegexp);

/**
 * Returns true if the given function throws the given value
 * when invoked. The value may be:
 *
 * - undefined, to merely assert there was a throw
 * - a constructor function, for comparing using instanceof
 * - a regular expression, to compare with the error message
 * - a string, to find in the error message
 */

function functionThrows(fn, context, args, value) {
  try {
    fn.apply(context, args);
  } catch (error) {
    if (value == null) return true;

    if (isFunction(value) && error instanceof value) return true;

    var message = error.message || error;

    if (typeof message === 'string') {
      if (_isRegexp2['default'](value) && value.test(error.message)) return true;

      if (typeof value === 'string' && message.indexOf(value) !== -1) return true;
    }
  }

  return false;
}

/**
 * Returns true if the given array contains the value, false
 * otherwise. The comparator function must return false to
 * indicate a non-match.
 */

function arrayContains(array, value, comparator) {
  if (comparator == null) comparator = _deepEqual2['default'];

  return array.some(function (item) {
    return comparator(item, value) !== false;
  });
}

/**
 * Returns true if the given string contains the value, false otherwise.
 */

function stringContains(string, value) {
  return string.indexOf(value) !== -1;
}

/**
 * Returns true if the given object is an array.
 */

function isArray(object) {
  return Array.isArray(object);
}

/**
 * Returns true if the given object is a function.
 */

function isFunction(object) {
  return typeof object === 'function';
}

/**
 * Returns true if the given object is an instanceof value
 * or its typeof is the given value.
 */

function isA(object, value) {
  if (isFunction(value)) return object instanceof value;

  if (value === 'array') return Array.isArray(object);

  return typeof object === value;
}
},{"deep-equal":7,"is-regexp":10}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectInspect = require('object-inspect');

var _objectInspect2 = _interopRequireDefault(_objectInspect);

function assert(condition, messageFormat) {
  for (var _len = arguments.length, extraArgs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    extraArgs[_key - 2] = arguments[_key];
  }

  if (condition) return;

  var index = 0;

  throw new Error(messageFormat.replace(/%s/g, function () {
    return _objectInspect2['default'](extraArgs[index++]);
  }));
}

exports['default'] = assert;
module.exports = exports['default'];
},{"object-inspect":11}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Expectation = require('./Expectation');

var _Expectation2 = _interopRequireDefault(_Expectation);

var Extensions = [];

function extend(extension) {
  if (Extensions.indexOf(extension) === -1) {
    Extensions.push(extension);

    for (var p in extension) {
      if (extension.hasOwnProperty(p)) _Expectation2['default'].prototype[p] = extension[p];
    }
  }
}

exports['default'] = extend;
module.exports = exports['default'];
},{"./Expectation":1}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Expectation = require('./Expectation');

var _Expectation2 = _interopRequireDefault(_Expectation);

var _SpyUtils = require('./SpyUtils');

var _assert = require('./assert');

var _assert2 = _interopRequireDefault(_assert);

var _extend = require('./extend');

var _extend2 = _interopRequireDefault(_extend);

function expect(actual) {
  return new _Expectation2['default'](actual);
}

expect.createSpy = _SpyUtils.createSpy;
expect.spyOn = _SpyUtils.spyOn;
expect.isSpy = _SpyUtils.isSpy;
expect.restoreSpies = _SpyUtils.restoreSpies;
expect.assert = _assert2['default'];
expect.extend = _extend2['default'];

exports['default'] = expect;
module.exports = exports['default'];
},{"./Expectation":1,"./SpyUtils":2,"./assert":4,"./extend":5}],7:[function(require,module,exports){
var pSlice = Array.prototype.slice;
var objectKeys = require('./lib/keys.js');
var isArguments = require('./lib/is_arguments.js');

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer (x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b);
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return typeof a === typeof b;
}

},{"./lib/is_arguments.js":8,"./lib/keys.js":9}],8:[function(require,module,exports){
var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
};

exports.unsupported = unsupported;
function unsupported(object){
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
};

},{}],9:[function(require,module,exports){
exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}

},{}],10:[function(require,module,exports){
'use strict';
module.exports = function (re) {
	return Object.prototype.toString.call(re) === '[object RegExp]';
};

},{}],11:[function(require,module,exports){
module.exports = function inspect_ (obj, opts, depth, seen) {
    if (!opts) opts = {};
    
    var maxDepth = opts.depth === undefined ? 5 : opts.depth;
    if (depth === undefined) depth = 0;
    if (depth >= maxDepth && maxDepth > 0
    && obj && typeof obj === 'object') {
        return '[Object]';
    }
    
    if (seen === undefined) seen = [];
    else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }
    
    function inspect (value, from) {
        if (from) {
            seen = seen.slice();
            seen.push(from);
        }
        return inspect_(value, opts, depth + 1, seen);
    }
    
    if (typeof obj === 'string') {
        return inspectString(obj);
    }
    else if (typeof obj === 'function') {
        var name = nameOf(obj);
        return '[Function' + (name ? ': ' + name : '') + ']';
    }
    else if (obj === null) {
        return 'null';
    }
    else if (isSymbol(obj)) {
        var symString = Symbol.prototype.toString.call(obj);
        return typeof obj === 'object' ? 'Object(' + symString + ')' : symString;
    }
    else if (isElement(obj)) {
        var s = '<' + String(obj.nodeName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '="' + quote(attrs[i].value) + '"';
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) s += '...';
        s += '</' + String(obj.nodeName).toLowerCase() + '>';
        return s;
    }
    else if (isArray(obj)) {
        if (obj.length === 0) return '[]';
        var xs = Array(obj.length);
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
        return '[ ' + xs.join(', ') + ' ]';
    }
    else if (isError(obj)) {
        var parts = [];
        for (var key in obj) {
            if (!has(obj, key)) continue;
            
            if (/[^\w$]/.test(key)) {
                parts.push(inspect(key) + ': ' + inspect(obj[key]));
            }
            else {
                parts.push(key + ': ' + inspect(obj[key]));
            }
        }
        if (parts.length === 0) return '[' + obj + ']';
        return '{ [' + obj + '] ' + parts.join(', ') + ' }';
    }
    else if (typeof obj === 'object' && typeof obj.inspect === 'function') {
        return obj.inspect();
    }
    else if (typeof obj === 'object' && !isDate(obj) && !isRegExp(obj)) {
        var xs = [], keys = [];
        for (var key in obj) {
            if (has(obj, key)) keys.push(key);
        }
        keys.sort();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (/[^\w$]/.test(key)) {
                xs.push(inspect(key) + ': ' + inspect(obj[key], obj));
            }
            else xs.push(key + ': ' + inspect(obj[key], obj));
        }
        if (xs.length === 0) return '{}';
        return '{ ' + xs.join(', ') + ' }';
    }
    else return String(obj);
};

function quote (s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray (obj) { return toStr(obj) === '[object Array]' }
function isDate (obj) { return toStr(obj) === '[object Date]' }
function isRegExp (obj) { return toStr(obj) === '[object RegExp]' }
function isError (obj) { return toStr(obj) === '[object Error]' }
function isSymbol (obj) { return toStr(obj) === '[object Symbol]' }

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has (obj, key) {
    return hasOwn.call(obj, key);
}

function toStr (obj) {
    return Object.prototype.toString.call(obj);
}

function nameOf (f) {
    if (f.name) return f.name;
    var m = f.toString().match(/^function\s*([\w$]+)/);
    if (m) return m[1];
}

function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) return i;
    }
    return -1;
}

function isElement (x) {
    if (!x || typeof x !== 'object') return false;
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string'
        && typeof x.getAttribute === 'function'
    ;
}

function inspectString (str) {
    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
    return "'" + s + "'";
    
    function lowbyte (c) {
        var n = c.charCodeAt(0);
        var x = { 8: 'b', 9: 't', 10: 'n', 12: 'f', 13: 'r' }[n];
        if (x) return '\\' + x;
        return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16);
    }
}

},{}]},{},[6])(6)
});