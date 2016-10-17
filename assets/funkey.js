/**
 * Funkey - Functional keyboard event handler
 * (c) 2016 Piet van Zoen - http://github.com/pietvanzoen/funkey
 * @version 1.0.2
 * @license MIT (http://www.opensource.org/licenses/mit-license.php)
 */
;(function() {
  'use strict';

  function initKeyCodes() {
    var codes = {
      'tab': 9,
      'backspace': 8,
      'enter': 13,
      'shift': 16,
      'ctrl': 17,
      'alt': 18,
      'pause': 19,
      'capslock': 20,
      'escape': 27,
      'space': 32,
      'pageup': 33,
      'pagedown': 34,
      'end': 35,
      'home': 36,
      'left': 37,
      'up': 38,
      'right': 39,
      'down': 40,
      'insert': 45,
      'delete': 46,
      'superleft': 91,
      'superright': 92,
      'select': 93,
      'multiply': 106,
      'add': 107,
      'subtract': 109,
      'decimal': 110,
      'divide': 111,
      'numlock': 144,
      'scrolllock': 145,
      ';': 186,
      '=': 187,
      ',': 188,
      '-': 189,
      '.': 190,
      '/': 191,
      '`': 192,
      '[': 219,
      '\\': 220,
      ']': 221,
      '\'': 222
    };

    function addKeyItem(startCode, prefix) {
      return function(val, index) {
        codes[(prefix || '') + val] = (startCode + index);
      };
    }
    each(addKeyItem(65), 'abcdefghijklmnopqrstuvwxyz');
    each(addKeyItem(48), '0123456789');
    each(addKeyItem(112, 'f'), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    each(addKeyItem(96, 'numpad'), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    return codes;
  }

  var KEY_CODES = initKeyCodes();

  var MODIFIER_KEYS = {
    shift: 'shiftKey',
    alt: 'altKey',
    super: 'metaKey',
    ctrl: 'ctrlKey'
  };

  var __slice = Array.prototype.slice;
  var FUNKEY_ARITY = funkey.length;

  /**
   * When `keyboardEvent` matches `keyName`, `callback` is invoked with the `keyboardEvent`.
   *
   * `funkey` is self-currying, so it will return a curried function until all the required
   * arguments have been given. See README.md for examples.
   *
   * @param {KeyboardEvent} keyboardEvent  The event to test.
   * @param {String} keyName  The keyboard key combination to match.
   * @param {Function} callback  Function to invoke on event/keystring match.
   * @return {*}  Returns result of callback if invoked, otherwise undefined.
   */
  function funkey(keyboardEvent, keyName, callback) {
    var args = __slice.call(arguments, 0, FUNKEY_ARITY);
    var argsLength = args.length;
    if (argsLength === FUNKEY_ARITY) {
      return runFunkey.apply(this, args);
    }
    return arity(FUNKEY_ARITY - argsLength, function() {
      return funkey.apply(this, args.concat(__slice.call(arguments)));
    });
  }

  var runFunkey = parseArgs(function(event, keyName, callback) {
    if (objectContains(eventFromKeyName(keyName), event)) {
      return callback.call(this, event);
    }
  });

  function objectContains(matchObject, actualObject) {
    for (var prop in matchObject) {
      if (!matchObject.hasOwnProperty(prop)) {
        continue;
      }
      if (matchObject[prop] !== actualObject[prop]) {
        return false;
      }
    }
    return true;
  }

  function eventFromKeyName(keyName) {
    var event = {
      shiftKey: false,
      altKey: false,
      metaKey: false,
      ctrlKey: false
    };
    var keys = keyName.split('+');
    each(function(key) {
      var keyCode = KEY_CODES[key];
      if (keyCode) {
        event.keyCode = keyCode;
      }
      var modifier = MODIFIER_KEYS[key];
      if (modifier) {
        event[modifier] = true;
      }
      if (!keyCode && !modifier) {
        throw new Error('[funkey] Invalid keyName "' + keyName + '"');
      }
    }, keys);
    return event;
  }

  function parseArgs(fn) {
    return function() {
      var args = __slice.call(arguments);
      var event = find(isObject, args);
      args.splice(args.indexOf(event), 1);
      var keyName = args[0];
      var callback = args[1];
      if (!isObject(event) || typeof keyName !== 'string' || typeof callback !== 'function') {
        throw new Error('[,funkey] Invalid call signature. \n' +
          'funkey must be given an event object, a keyName, and a callback function.');
      }
      return fn.call(this, event, keyName, callback);
    };
  }

  function isObject(item) {
    return typeof item === 'object';
  }

  function find(search, items) {
    return search(items[0]) ? items[0] : find(search, __slice.call(items, 1));
  }

  function each(func, items) {
    var index = -1;
    var length = items.length;
    while (++index < length) {
      func(items[index], index, items);
    }
  }

  function arity(n, fn) {
    switch (n) {
      case 1:
        return function(a1) {
          return fn.apply(this, arguments);
        };
      case 2:
        return function(a1, a2) {
          return fn.apply(this, arguments);
        };
      case 3:
        return function(a1, a2, a3) {
          return fn.apply(this, arguments);
        };
      default:
        throw new Error('Arity ' + n + ' not supported.');
    }
  }

  funkey.KEY_CODES = KEY_CODES;

  if (typeof exports === 'object') {
    module.exports = funkey;
  } else if (typeof define === 'function' && define.amd) {
    define(function() {
      return funkey;
    });
  } else {
    this.funkey = funkey;
  }
}.call(this));
