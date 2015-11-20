'use strict';

/**
 * @license
 * arstring.js 0.0.1
 * https://elkebirmed.github.io/arstring
 * (c) 2015 Mohamed Elkebir <elkebir.med@gmail.com>
 * arstring may be freely distributed under the MIT license.
 */
(function (global) {

  /************************************************
   * Private constants to use inside the library. *
   ************************************************/

  /** Regular expression patterns. */
  var _regs = {
    ra: /[\u0621-\u0652]/g, // Arabic characters.
    ran: /[^\u0621-\u0652]/g, // Non Arabic characters.
    ral: /[\u0621-\u063A\u0641-\u064A]/g, // Arabic letters.
    raln: /[^\u0621-\u063A\u0641-\u064A]/g, // Non Arabic letters.
    ras: /[\u0621-\u063A\u0640-\u0652]/g, // Strict Arabic characters.
    rasn: /[^\u0621-\u063A\u0640-\u0652]/g, // Non strict Arabic characters.
    raa: /[\u0600-\u06FF]/g, // All Arabic standard characters.
    raan: /[^\u0600-\u06FF]/g, // Non all Arabic.
    rae: /[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, // Every Arabic characters.
    raen: /[^\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, // Non every Arabic characters.
    rap: /[\u064B-\u0652]/g, // Arabic punctuation characters.
    rapn: /[^\u064B-\u0652]/g, // Non Arabic punctuation characters.
    rad: /[\u0660-\u0669]/g, // Arabic digits.
    radn: /[^\u0660-\u0669]/g };

  /** Arabic numbers list. */
  // Non Arabic digits.
  var _arabicNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  /** Special Arabic characters. */
  var _arSpecialChars = ['،', // Comma.
  '؛', // SemiColon.
  '؟', // Question Mark.
  '٪', // Percent Sign.
  '٭', // Asterisk.
  '﴿', // Right parenthesis.
  '﴾'];

  /** Special English characters. */
  // Left parenthesis.
  var _enSpecialChars = [',', // Comma.
  ';', // SemiColon.
  '?', // Question Mark.
  '%', // Percent Sign.
  '*', // Asterisk.
  ')', // Right parenthesis.
  '('];

  /************************************************
   * Private functions to use inside the library. *
   ************************************************/

  /**
   * Checks if `value` is classified as a `String` primitive or object, and it's not empty.
   *
   * @private
   * @param   {*} value - A value to check.
   * @returns {Boolean} - Returns `true` if `value` is a string, `false` otherwise.
   */
  // Left parenthesis.
  function _initStr(value) {
    return (typeof value === 'string' || value instanceof String) && value !== 'undefined' && value !== '';
  }

  /**
   * Checks if a `option` is in the `arr` array.
   *
   * @private
   * @param {Array} arr - The array to search in.
   * @param {String} option - The option to find in the array.
   * @return {Boolean} - Returns `true` if `option` is inside `arr`, `false` otherwise.
   */
  function _isIn(arr, option) {
    return Array.isArray(arr) && arr.indexOf(option) !== -1 ? true : false;
  }

  /**
   * Extract a specified RegExp pattern from `_regs` object.
   *
   * @private
   * @param {String} [type] - A pattern to be used.
   * @param {Boolean} [negative] - Get the nehative pattern if set to `true`.
   * @returns {RegExp} Returns a regular expression pattern.
   */
  function _regType(type, negative) {
    var result;

    switch (type) {
      case 'strict':
        result = 'ras';
        break;
      case 'all':
        result = 'raa';
        break;
      case 'letter':
        result = 'ral';
        break;
      case 'every':
        result = 'rae';
        break;
      case 'punct':
        result = 'rap';
        break;
      case 'digit':
        result = 'rad';
        break;
      default:
        result = 'ra';
    }

    return negative ? _regs[result + 'n'] : _regs[result];
  }

  /****************************************************
   * Public constants to be exported with the module. *
   ****************************************************/

  /** Used as the semantic version number. */
  var VERSION = '0.0.1';

  /****************************************************
   * Public functions to be exported with the module. *
   ****************************************************/

  var arabize = function arabize(str, options) {
    if (_initStr(str)) {
      var defaultOptions = ['date', 'number', 'dash', 'char'];
      options = options && _isArray(options) && options.length > 0 ? options : defaultOptions;

      str = _isIn(options, 'date') && !_isIn(options, 'date-reverse') ? dateize(str) : str;
      str = _isIn(options, 'date-reverse') ? dateize(str, true) : str;
      str = _isIn(options, 'number') || _isIn(options, 'date') || _isIn(options, 'date-reverse') ? numerize(str) : str;
      str = _isIn(options, 'dash') && !_isIn(options, 'dasg-extra') ? removeDash(str) : str;
      str = _isIn(options, 'dash-extra') ? removeDash(str, true) : str;

      if (_isIn(options, 'char')) {
        for (var i = 0; i < _arSpecialChars.length; i++) {
          str = str.replace(_enSpecialChars[i], _arSpecialChars[i]);
        }
      }

      return str;
    } else {
      return str;
    }
  };

  var count = function count(str, type) {
    if (_initStr(str)) {
      return (str.match(_regType(type)) || '').length;
    } else {
      return 0;
    }
  };

  var countRest = function countRest(str, type) {
    if (_initStr(str)) {
      return (str.match(_regType(type, true)) || '').length;
    } else {
      return 0;
    }
  };

  var dateize = function dateize(str, reverse) {
    if (_initStr(str)) {
      var regArabicDate = /\b([\d]{2})[\./،]([\d]{2})[\./،]([\d]{2}|[\d]{4})\b/g;
      return reverse ? str.replace(regArabicDate, '$2' + '؍' + '$1' + '؍' + '$3') : str.replace(regArabicDate, '$1' + '؍' + '$2' + '؍' + '$3');
    } else {
      return str;
    }
  };

  var extract = function extract(str, type) {
    if (_initStr(str)) {
      return str.replace(_regType(type, true), '');
    } else {
      return str;
    }
  };

  var has = function has(str, type) {
    if (_initStr(str)) {
      return _regType(type).test(str) ? true : false;
    } else {
      return false;
    }
  };

  var how = function how(str, type) {
    if (has(str, type)) {
      return count(str, type) / str.length * 100;
    } else {
      return 0;
    }
  };

  var howRest = function howRest(str, type) {
    return 100 - how(str, type);
  };

  var numerize = function numerize(str) {
    if (_initStr(str)) {
      return str.replace(/[0-9]/g, function (n) {
        return _arabicNumbers[+n];
      });
    } else {
      return str;
    }
  };

  var remove = function remove(str, type) {
    if (_initStr(str)) {
      return str.replace(_regType(type), '');
    } else {
      return str;
    }
  };

  var removeDash = function removeDash(str, extra) {
    if (_initStr(str)) {
      return extra ? str.replace(/ـ{2,}/g, 'ـ') : str.replace(/ـ/g, '');
    } else {
      return str;
    }
  };

  var arstring = {
    _VERSION: _VERSION,
    arabize: arabize,
    count: count,
    countRest: countRest,
    dateize: dateize,
    extract: extract,
    has: has,
    how: how,
    howRest: howRest,
    numerize: numerize,
    remove: remove,
    removeDash: removeDash
  };

  // CommonJS, AMD, script tag
  if (typeof exports !== 'undefined') {
    module.exports = arstring;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return arstring;
    });
  } else {
    global.arstring = arstring;
  }
})(typeof global !== 'undefined' ? global : window);
//# sourceMappingURL=arstring.js.map
