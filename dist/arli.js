'use strict';

/**
 * @license
 * arli.js 0.0.1
 * https://elkebirmed.github.io/arli
 * (c) 2015 Mohamed Elkebir <elkebir.med@gmail.com>
 * Arli may be freely distributed under the MIT license.
 */
(function (global) {

  /*****************************************************************************
   * Private constants to use inside the library.                              *
   ****************************************************************************/

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

  /*****************************************************************************
   * Private functions to use inside the library.                              *
   ****************************************************************************/

  /**
   * Checks if `value` is classified as a `String` primitive or object, and it's not empty.
   *
   * @private
   * @param   {*} value - A value to check.
   * @returns {Boolean} Returns `true` if `value` is a string, `false` otherwise.
   */
  // Left parenthesis.
  function _initStr(value) {
    return (typeof value === 'string' || value instanceof String) && value !== 'undefined' && value !== '';
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Checks if a `option` is in the `arr` array.
   *
   * @private
   * @param {Array} arr - The array to search in.
   * @param {String} option - The option to find in the array.
   * @return {Boolean} Returns `true` if `option` is inside `arr`, `false` otherwise.
   */
  function _isIn(arr, option) {
    return Array.isArray(arr) && arr.indexOf(option) !== -1 ? true : false;
  }

  /*--------------------------------------------------------------------------*/

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

  /*****************************************************************************
   * Public constants to be exported with the module.                          *
   ****************************************************************************/

  /** Used as the semantic version number. */
  var VERSION = '0.0.1';

  /*****************************************************************************
   * Public functions to be exported with the module.                          *
   ****************************************************************************/

  /**
   * Convert some characters to make the text more Arabian.
   *
   * @static
   * @memberOf arli
   * @param {String} str - The string to convert.
   * @param {Array} [options=['date', 'number', 'dash', 'char']] - Decide which features to use in the output.
   * @returns {String} Return an Arabian string.
   * @example
   *
   * arli.arabize('0123456789%(,;*)?');
   * // => '۰۱۲۳۴۵۶۷۸۹٪﴾،؛٭﴿؟''
   *
   * arli.arabize('0123456789%(,;*)?', ['char']);
   * // => '0123456789٪﴾،؛٭﴿؟''
   */
  function arabize(str, options) {
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
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Count the matched characters in the string.
   *
   * @static
   * @memberOf arli
   * @param {String} str - The string to count in.
   * @param {String} [type] - A regular expression pattern to be used.
   * @returns {Number} Return the number of the matched characters in the string.
   * @example
   *
   * arli.count('Hello!');
   * // => 0
   *
   * arli.count('Hello! مرحبا');
   * // => 5
   *
   * arli.count('Hello! مرحبا ۱۲۳', 'digit');
   * // => 3
   */
  function count(str, type) {
    if (_initStr(str)) {
      return (str.match(_regType(type)) || '').length;
    } else {
      return 0;
    }
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Count the non matched characters in the string.
   *
   * @static
   * @memberOf arli
   * @param {String} str - The string to count in.
   * @param {String} [type] - A regular expression pattern to be used.
   * @returns {Number} Return the number of the non matched characters in the string.
   * @example
   *
   * arli.countRest('Hello!');
   * // => 6
   *
   * arli.countRest('Hello! مرحبا');
   * // => 7
   *
   * arli.countRest('Hello! مرحبا ۱۲۳', 'digit');
   * // => 13
   */
  function countRest(str, type) {
    if (_initStr(str)) {
      return (str.match(_regType(type, true)) || '').length;
    } else {
      return 0;
    }
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Convert a date string to an Arabic format.
   *
   * @static
   * @memberOf arli
   * @param {String} str - The string to convert.
   * @param {Boolean} [reverse] - Reverse the month and day in the output if set to true.
   * @returns {String} Return an Arabic date format
   * @example
   *
   * arli.dateize('20,11,2015 20/11/2015 20-11-2015 20.11.2015 20 11 2015');
   * // => '20؍11؍2015 20؍11؍2015 20؍11؍2015 20؍11؍2015 20؍11؍2015'
   *
   * arli.dateize('20/11/2015', true);
   * // => '11؍20؍2015' // Past it to an RTL env to see it right
   */
  function dateize(str, reverse) {
    if (_initStr(str)) {
      var regArabicDate = /\b([\d]{2})[\./,-\s]([\d]{2})[\./,-\s]([\d]{2}|[\d]{4})\b/g;
      return reverse ? str.replace(regArabicDate, '$2' + '؍' + '$1' + '؍' + '$3') : str.replace(regArabicDate, '$1' + '؍' + '$2' + '؍' + '$3');
    } else {
      return str;
    }
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Output the matched characters from the string.
   *
   * @static
   * @memberOf arli
   * @param {String} str - The string to output from.
   * @param {String} [type] - A regular expression pattern to be used.
   * @returns {String} Return the matched characters.
   * @example
   *
   * arli.extract('Hello مرحبا');
   * // => 'مرحبا'
   *
   * arli.extract('Hello مرحبا ۱۲۳', 'digit');
   * // => '۱۲۳'
   */
  function extract(str, type) {
    if (_initStr(str)) {
      return str.replace(_regType(type, true), '');
    } else {
      return str;
    }
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Checks if the string has the matched pattern.
   *
   * @static
   * @memberOf arli
   * @param {String} str - The string to check.
   * @param {String} [type] - A regular expression pattern to be used.
   * @returns {Boolean} Return `true` if the pattern match, `else` otherwise.
   * @example
   *
   * arli.has('Hello مرحبا');
   * // => true
   *
   * arli.has('Hello مرحبا ۱۲۳', 'digit');
   * // => true
   *
   * arli.has('Hello مرحبا', 'digit');
   * // => false
   */
  function has(str, type) {
    if (_initStr(str)) {
      return _regType(type).test(str) ? true : false;
    } else {
      return false;
    }
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Calculate the percentage of the matched pattern in the string.
   *
   * @static
   * @memberOf arli
   * @param {String} str - The string to calculate in.
   * @param {String} [type] - A regular expression pattern to be used.
   * @returns {Number} Return the percentage of the matched pattern.
   * @example
   *
   * arli.how('Hello مرحبا');
   * // => 45.45454545454545
   *
   * arli.how('Hello مرحبا،،،، ۱۲۳', 'char');
   * // => 26.31578947368421
   */
  function how(str, type) {
    if (has(str, type)) {
      return count(str, type) / str.length * 100;
    } else {
      return 0;
    }
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Calculate the percentage of the non matched pattern in the string.
   *
   * @static
   * @memberOf arli
   * @param {String} str - The string to calculate in.
   * @param {String} [type] - A regular expression pattern to be used.
   * @returns {Number} Return the percentage of the non matched pattern.
   * @example
   *
   * arli.howRest('Hello مرحبا');
   * // => 54.54545454545455
   *
   * arli.howRest('Hello مرحبا،،،، ۱۲۳', 'char');
   * // => 73.6842105263158
   */
  function howRest(str, type) {
    return 100 - how(str, type);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Convert a number string to an Arabic format.
   *
   * @static
   * @memberOf arli
   * @param {String} str - The string to convert.
   * @returns {String} Return an Arabic date format
   * @example
   *
   * arli.numerize('0123456789');
   * // => '۰۱۲۳۴۵۶۷۸۹'
   */
  function numerize(str) {
    if (_initStr(str)) {
      return str.replace(/[0-9]/g, function (n) {
        return _arabicNumbers[+n];
      });
    } else {
      return str;
    }
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Output the non matched characters from the string.
   *
   * @static
   * @memberOf arli
   * @param {String} str - The string to output from.
   * @param {String} [type] - A regular expression pattern to be used.
   * @returns {String} Return the non matched characters.
   * @example
   *
   * arli.remove('Hello مرحبا');
   * // => 'Hello '
   *
   * arli.remove('Hello مرحبا ۱۲۳', 'digit');
   * // => 'Hello  مرحبا'
   */
  function remove(str, type) {
    if (_initStr(str)) {
      return str.replace(_regType(type), '');
    } else {
      return str;
    }
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Remove the dash or Tatweel character from the string.
   *
   * @static
   * @memberOf arli
   * @param {String} str - The string to remove from.
   * @param {Boolean} [extra] - Leave a single dash if set to true
   * @returns {String} Return the new prepared string.
   * @example
   *
   * arli.removeDash('مرحبــــــــــا');
   * // => 'مرحبا'
   *
   * arli.removeDash('مرحبــــــــــا', true);
   * // => 'مرحبـا'
   */
  function removeDash(str, extra) {
    if (_initStr(str)) {
      return extra ? str.replace(/ـ{2,}/g, 'ـ') : str.replace(/ـ/g, '');
    } else {
      return str;
    }
  }

  /*****************************************************************************
   * Exporting the arli module to the outside world!                           *
   ****************************************************************************/

  var arli = {
    _VERSION: VERSION,
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
    module.exports = arli;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return arli;
    });
  } else {
    global.arli = arli;
  }
})(typeof global !== 'undefined' ? global : window);
//# sourceMappingURL=arli.js.map
