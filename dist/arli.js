/*!
 * arli.js 0.2.0
 * https://elkebirmed.github.io/arli
 * (c) 2015 Mohamed Elkebir <elkebir.med@gmail.com>
 * Arli may be freely distributed under the MIT license.
 */
(function(global) {
  /* ***************************************************************************
   * Private constants to use inside the library.                              *
   * **************************************************************************/

  /** Arabic date separator */
  var ARABIC_DATE_SEP = '؍';

  /** Arabic decimal separator */
  var ARABIC_DECIMAL_SEP = '٫';

  /** Arabic punctuation marks and their replacements */
  var ARABIC_PUNC_AND_REPLACEMENTS = [
    [
      ',', // Comma
      ';', // Semicolon
      '?', // Question mark
      '(', // Left parenthesis
      ')', // Right parenthesis
      '%', // Percent sign
    ],
    [
      '،', // Comma
      '؛', // Semicolon
      '؟', // Question mark
      '﴾', // Left parenthesis
      '﴿', // Right parenthesis
      '٪', // Percent sign
    ]
  ];

  /** Arabic tatweel */
  var ARABIC_TATWEEL = 'ـ';

  /** Arabic thousands separator */
  var ARABIC_THOUSANDS_SEP = '٬';

  /** Arabic word ligatures replacements */
  var ARABIC_WORD_LIGATURES = [
    [
      'صلى الله عليه و سلم', // Sallallahou Alayhe Wassallam
      'ﷺ',
      'ؐ'
    ],
    [
      'جل جلاله', // Jalla Jalalouhou
      'ﷻ'
    ],
    [
      'عليه السلام', // Alayhe Assallam
      'ؑ'
    ],
    [
      'رحمة الله عليه', // Rahmatu Allahi Alayhe
      'ؒ'
    ],
    [
      'رضي الله عنه', // Radi Allahou Anhu
      'ؓ'
    ]
  ];

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

  /** Arabic tatweel */
  var REG_ARABIC_TATWEEL = /\u0640+/gm;

  /** Date format: DD/MM/YY[YY] DD.MM.YY[YY] DD-MM-YY[YY] DD,MM,YY[YY] */
  var REG_DATE_DMY = /(?=\D?)(31|30|(?:0[1-9]|[1-2][0-9]))(\/|\.|-|,)(12|11|10|0[1-9])(\2)(\d{4}|\d{2})(?=\D?)/gm;

  /** Date format: MM/DD/YY[YY] MM.DD.YY[YY] MM-DD-YY[YY] MM,DD,YY[YY] */
  var REG_DATE_MDY = /(?=\D?)(12|11|10|0[1-9])(\/|\.|-|,)(31|30|(?:0[1-9]|[1-2][0-9]))(\2)(\d{4}|\d{2})(?=\D?)/gm;

  /** Full number with decimal separator */
  var REG_NUMBER_D = /((?:0[0-9])|(?:[1-9]\d+))\.(\d+)/gm;

  /** Full number with decimal and thousand separators */
  var REG_NUMBER_DT = /[1-9][0-9]{0,2}(?:,\d{3})+\.\d+/gm;

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
  var VERSION = '0.2.0';

  /* ***************************************************************************
   * Public functions to be exported with the module.                          *
   * **************************************************************************/

  /**
   * Transform a string to be more Arabian.
   *
   * @public
   * @param  {String} string - String to Transform.
   * @param  {Object} [options] - Options of transforming.
   * @param  {Boolean} [options.date=true] - Enable or disable date transforming.
   * @param  {String} [options.dateFrom='all|DMY|MDY'] - What date format to get from the string.
   * @param  {String} [options.dateTo='all|DMY|MDY'] - What date format to output in the string.
   * @param  {Boolean} [options.digit=true] - Enable or disable digit transforming.
   * @param  {String} [options.excludePunc] - Exclude some punctuations from transforming by putting a regular expression source like: `',|;'`.
   * @param  {Boolean} [options.ligatures=true] - Enable or disable transforming word ligatures.
   * @param  {Number} [options.ligaturesDeep=1] - More ligatures are deeper so you can pass a deep level ti look for.
   * @param  {Boolean} [options.punc=true] - Enable or disable punctuation transforming.
   * @param  {String} [options.removeTatweel='extra|all|none'] - Remove extra tatweel or all or leave it as is.
   * @returns {String} Returns a new transformed string.
   *
   * @examples
   */
  function transform(string, options) {
    options = _assign({ // Assign default options.
      date: true,
      dateFrom: 'all',
      dateTo: 'all',
      digit: true,
      excludePunc: ' ',
      ligatures: true,
      ligaturesDeep: 1,
      numberSep: true,
      punc: true,
      removeTatweel: 'extra',
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

      // Transforming numbers separators.
      string = options.numberSep ? string.replace(REG_NUMBER_DT, function(match) {
        match = match.replace(/,/g, ARABIC_THOUSANDS_SEP);
        return match.replace('.', ARABIC_DECIMAL_SEP);
      }) : string;

      string = options.numberSep ? string.replace(REG_NUMBER_D, '$1' + ARABIC_DECIMAL_SEP + '$2') : string;

      // Transforming Arabic digits to Indian digits.
      string = options.digit ? string.replace(/[0-9]/g, function(val) {
        return INDIAN_DIGITS[+val];
      }) : string;

      // Transforming Latin punctuations to Arabic.
      if (options.punc) {
        var exclude = new RegExp(options.excludePunc);

        for (var i = 0; i < ARABIC_PUNC_AND_REPLACEMENTS[0].length; i++) {
          if (!exclude.test(ARABIC_PUNC_AND_REPLACEMENTS[0][i])) {
            string = string.replace(ARABIC_PUNC_AND_REPLACEMENTS[0][i], ARABIC_PUNC_AND_REPLACEMENTS[1][i]);
          }
        }
      }

      // Remove Tatweel
      string = options.removeTatweel === 'extra' ? string.replace(REG_ARABIC_TATWEEL, ARABIC_TATWEEL) : string;
      string = options.removeTatweel === 'all' ? string.replace(REG_ARABIC_TATWEEL, '') : string;

      // Transforming word ligatures.
      if (options.ligatures) {
        for (var i = 0; i < ARABIC_WORD_LIGATURES.length; i++) {
          if (ARABIC_WORD_LIGATURES[i][2] && options.ligaturesDeep === 2) {
            string = string.replace(ARABIC_WORD_LIGATURES[i][0], ARABIC_WORD_LIGATURES[i][2]);
          } else {
            string = string.replace(ARABIC_WORD_LIGATURES[i][0], ARABIC_WORD_LIGATURES[i][1]);
          }
        }
      }

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
