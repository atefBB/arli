/*!
 * arli.js 0.0.1
 * https://elkebirmed.github.io/arli
 * (c) 2015 Mohamed Elkebir <elkebir.med@gmail.com>
 * Arli may be freely distributed under the MIT license.
 */
(function(global) {
  /* ***************************************************************************
   * Private constants to use inside the library.                              *
   * **************************************************************************/

  /** Indian digits format */
  var INDIAN_DIGITS = [
    '٠', // Zero
    '١', // One
    '٢', // Two
    '٣', // Three
    '٤', // Four
    '٥', // Five
    '٦', // Six
    '٧', // Seven
    '٨', // Eight
    '٩', // Nine
  ];

  /** Arabic date separator */
  var ARABIC_DATE_SEP = '؍';

  /** Date format: DD/MM/YY[YY] DD.MM.YY[YY] DD-MM-YY[YY] DD,MM,YY[YY]*/
  var REG_DATE_DMY = /\b(31|30|(?:0[1-9]|[1-2][0-9]))(\/|\.|-|,)(12|11|10|0[1-9])(\2)(\d{4}|\d{2})\b/gm;

  /** Date format: MM/DD/YY[YY] MM.DD.YY[YY] MM-DD-YY[YY] MM,DD,YY[YY]*/
  var REG_DATE_MDY = /\b(12|11|10|0[1-9])(\/|\.|-|,)(31|30|(?:0[1-9]|[1-2][0-9]))(\2)(\d{4}|\d{2})\b/gm;

  /* ***************************************************************************
   * Private functions to use inside the library.                              *
   * **************************************************************************/

  /**
   * Assign `source` properties to `destination` object if not existed in it.
   *
   * @private
   * @param  {Object} destination - Destination object.
   * @param  {Object} source - Source object.
   * @returns {Object} Returns a new extended object.
   */
  function _assign(destination, source) {
    for (var property in source) {
      destination[property] = source[property];
    }

    return destination;
  }

  /* -------------------------------------------------------------------------*/

  /**
   * Checks if `value` is a string and is not undefined or empty.
   *
   * @private
   * @param  {*} value - Value to check.
   * @returns {Boolean} Returns true if `value` is String, else otherwise.
   */
  function _isString(value) {
    return (typeof value === 'string' || value instanceof String) && value !== 'undefined' && value !== '';
  }

  /* -------------------------------------------------------------------------*/

  /**
   * Checks if `value` is a function.
   *
   * @private
   * @param  {*}  value - Value to check.
   * @returns {Boolean} Returns true if `value` is object, else otherwise.
   */
  function _isFunction(value) {
    var getType = {};
    return value && getType.toString.call(value) === '[object Function]';
  }

  /* ***************************************************************************
   * Public constants to be exported with the module.                          *
   * **************************************************************************/

  /** Used as the semantic version number. */
  var VERSION = '0.1.0';

  /* ***************************************************************************
   * Public functions to be exported with the module.                          *
   * **************************************************************************/

  /**
   * Transform a string to be more Arabian.
   *
   * @public
   * @param  {String} string - String to Transform.
   * @param  {Object} [options] - Options of transforming.
   * @param  {Boolean} [options.digit=true] - Enable or disable digit transforming.
   * @param  {Boolean} [options.date=true] - Enable or disable date transforming.
   * @param  {String} [options.dateFrom='all|DMY|MDY'] - What date format to get from the string.
   * @param  {String} [options.dateTo='all|DMY|MDY'] - What date format to output in the string.
   * @returns {String} Returns a new transformed string.
   *
   * @examples
   */
  function transform(string, options) {
    options = _assign({ // Assign default options.
      digit: true,
      date: true,
      dateFrom: 'all',
      dateTo: 'all',
    }, options || {});

    if (_isString(string)) {
      // Converting date formats.
      if (options.dateTo === 'DMY') { // From MM/DD to DD/MM
        string = string.replace(REG_DATE_MDY, '$3$2$1$4$5');
      } else if (options.dateTo === 'MDY') { // From DD/MM to MM/DD
        string = string.replace(REG_DATE_DMY, '$3$2$1$4$5');
      }

      // Transforming dates to the Arabic format if digit is true.
      if (options.date && options.digit) {
        if (options.dateFrom === 'all' || options.dateFrom === 'DMY') { // Get DD/MM/YY[YY]
          string = string.replace(REG_DATE_DMY, '$1' + ARABIC_DATE_SEP + '$3' + ARABIC_DATE_SEP + '$5');
        }

        if (options.dateFrom === 'all' || options.dateFrom === 'MDY') { // Get MM/DD/YY[YY]
          string = string.replace(REG_DATE_MDY, '$1' + ARABIC_DATE_SEP + '$3' + ARABIC_DATE_SEP + '$5');
        }
      }

      // Transforming Arabic digits to Indian digits.
      string = options.digit ? string.replace(/[0-9]/g, function(val) {
        return INDIAN_DIGITS[+val];
      }) : string;

      return string;
    } else {
      return '';
    }
  }

  /* ***************************************************************************
   * Exporting the arli module to the outside world!                           *
   * **************************************************************************/

  /** Constructor */
  function Ctor() {}

  /** Prototypes */
  Ctor.prototype._VERSION = VERSION;
  Ctor.prototype.transform = transform;

  /** arli object from Ctor */
  var arli = new Ctor();

  /** CommonJS, AMD, script tag */
  if (typeof exports !== 'undefined') {
    module.exports = arli;
  } else if (typeof define === 'function' && define.amd) {
    define(function() {
      return arli;
    });
  } else {
    global.arli = arli;
  }

})(typeof global !== 'undefined' ? global : window);
