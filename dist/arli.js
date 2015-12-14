/*!
 * arli.js 0.2.0
 * https://elkebirmed.github.io/arli
 * (c) 2015 Mohamed Elkebir <elkebir.med@gmail.com>
 * Arli may be freely distributed under the MIT license.
 */
(function(root, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.arli = factory();
  }
}(this, function() {

  /* ***************************************************************************
   * Constants                                                                 *
   * **************************************************************************/

  // Constants.
  var CONSTANTS = {

    // Arabic date separator.
    arabicDateSeparator: '؍',

    // Arabic decimal separator.
    arabicDecimalSeparator: '٫',

    // Arabic tatweel.
    arabicTatweel: 'ـ',

    // Arabic thousands separator.
    arabicThousandsSeparator: '٬',
  };

  // Lists.
  var LISTS = {

    // Indian digits format.
    indianDigits: [
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
    ],

    // Arabic word ligatures.
    wordLigatures: [
      'صلى الله عليه و سلم', // Sallallahou Alayhe Wassallam
      'جل جلاله', // Jalla Jalalouhou
      'عليه السلام', // Alayhe Assallam
      'رحمة الله عليه', // Rahmatu Allahi Alayhe
      'رضي الله عنه', // Radi Allahou Anhu
    ],

    // Arabic word ligatures replacements.
    wordLigaturesReplacements: [
      'ﷺ', // Sallallahou Alayhe Wassallam
      'ﷻ', // Jalla Jalalouhou
      'ؑ', // Alayhe Assallam
      'ؒ', // Rahmatu Allahi Alayhe
      'ؓ', // Radi Allahou Anhu
    ],

    // Arabic punctuations.
    punctuations: [
      ',', // Comma
      ';', // Semicolon
      '?', // Question mark
      '(', // Left parenthesis
      ')', // Right parenthesis
      '%', // Percent sign
    ],

    // Arabic punctuations replacements
    punctuationsReplacements: [
      '،', // Comma
      '؛', // Semicolon
      '؟', // Question mark
      '﴾', // Left parenthesis
      '﴿', // Right parenthesis
      '٪', // Percent sign
    ],
  };

  // Regular expression source patterns.
  var REGS = {

    // Date format: MM/DD/YY[YY] MM.DD.YY[YY] MM-DD-YY[YY] MM,DD,YY[YY]
    arabicDateDMY: /(?=\D?)(31|30|(?:0[1-9]|[1-2][0-9]))(\/|\.|-)(12|11|10|0[1-9])(\2)(\d{4}|\d{2})(?=\D?)/,

    // Date format: MM/DD/YY[YY] MM.DD.YY[YY] MM-DD-YY[YY] MM,DD,YY[YY]
    arabicDateMDY: /(?=\D?)(12|11|10|0[1-9])(\/|\.|-)(31|30|(?:0[1-9]|[1-2][0-9]))(\2)(\d{4}|\d{2})(?=\D?)/,

    // Arabic tatweel.
    arabicTatweel: /\u0640+/,

    // Number with decimal separator
    numberWithDecimal: /(?:^|[^\d.])(\d+\.\d+)(?![.\d])/,

    // Number with decimal and thousand separators.
    numberWithDecimalThousand: /(?:^|[^\d.])(?!0(?!\.))\d{1,3}(,\d{3})*(\.\d+)?(?!\.)(?!\d)/,
  };

  /* ***************************************************************************
   * Helpers                                                                   *
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
   * Regular expression generator.
   *
   * @private
   * @param  {RegExp} pattern - Source pattern.
   * @param  {String} [flags] - Flags `gmiy`.
   * @return {RegExp} Returns a new generated regular expression object.
   */
  function _reg(pattern, flags) {
    return new RegExp(pattern.source, flags || '');
  }

  /* -------------------------------------------------------------------------*/

  /* ***************************************************************************
   * Public API                                                                *
   * **************************************************************************/

  // check.

  function log(value, options) {

    if (_isString(value)) {
      var logs = [];

      return value;
    }
  }

  /**
   * Transform a normal string to be more Arabian string.
   *
   * @public
   * @param  {String} value - String to Transform.
   * @param  {Object} [options] - Options of transforming.
   * @param  {Boolean} [options.clean=true] - Enable or disable string cleaning.
   * @param  {Boolean} [options.date=true] - Enable or disable date transforming.
   * @param  {String} [options.dateFrom='all'] - What date format to get from the string (all, DMY or MDY).
   * @param  {String} [options.dateTo='all'] - What date format to output in the string (all, DMY or MDY).
   * @param  {Boolean} [options.digit=true] - Enable or disable digit transforming.
   * @param  {Array} [options.excludeLigatures] - Exclude some ligatures from transforming.
   * @param  {String} [options.excludePunc] - Exclude some punctuations from transforming.
   * @param  {Boolean} [options.ligatures=true] - Enable or disable transforming word ligatures.
   * @param  {Boolean} [options.numberSep=true] - Enable or disable number separators.
   * @param  {Boolean} [options.punc=true] - Enable or disable punctuation transforming.
   * @param  {String} [options.removeTatweel='extra'] - Remove tatweel character from the string (extra, all, none).
   * @return {String} Returns a new transformed string.
   */
  function transform(value, options) {

    // Assign default options.
    options = _assign({
      clean: true,
      date: true,
      dateFrom: 'all',
      dateTo: 'all',
      digit: true,
      excludeLigatures: [' '],
      excludePunc: ' ',
      ligatures: true,
      numberSep: true,
      punc: true,
      removeTatweel: 'extra',
    }, options || {});

    // Transforming the given value.
    if (_isString(value)) {

      // Cleaning the value.
      /* istanbul ignore else */
      if (options.clean) {
        value = value.trim();
      }

      // Converting date formats.
      if (options.dateTo === 'DMY') { // From MM/DD to DD/MM
        value = value.replace(_reg(REGS.arabicDateMDY, 'gm'), '$3$2$1$4$5');
      } else if (options.dateTo === 'MDY') { // From DD/MM to MM/DD
        value = value.replace(_reg(REGS.arabicDateDMY, 'gm'), '$3$2$1$4$5');
      }

      // Transforming dates to the Arabic format if digit is true.
      /* istanbul ignore else */
      if (options.digit && options.date) {
        if (options.dateFrom === 'all' || options.dateFrom === 'DMY') { // Get DD/MM/YY[YY]
          value = value.replace(_reg(REGS.arabicDateDMY, 'gm'), '$1' + CONSTANTS.arabicDateSeparator + '$3' + CONSTANTS.arabicDateSeparator + '$5');
        }

        if (options.dateFrom === 'all' || options.dateFrom === 'MDY') { // Get MM/DD/YY[YY]
          value = value.replace(_reg(REGS.arabicDateMDY, 'gm'), '$1' + CONSTANTS.arabicDateSeparator + '$3' + CONSTANTS.arabicDateSeparator + '$5');
        }
      }

      // Transforming numbers separators.
      /* istanbul ignore else */
      if (options.numberSep) {
        value = value.replace(_reg(REGS.numberWithDecimalThousand, 'gm'), function(match) {
          match = match.replace(_reg(/,/, 'g'), CONSTANTS.arabicThousandsSeparator);
          return match.replace(_reg(/\./), CONSTANTS.arabicDecimalSeparator);
        });

        value = value.replace(_reg(REGS.numberWithDecimal, 'gm'), function(match) {
          return match.replace(_reg(/\./), CONSTANTS.arabicDecimalSeparator);
        });
      }

      // Transforming Arabic digits to Indian digits.
      /* istanbul ignore else */
      if (options.digit) {
        value = value.replace(_reg(/[0-9]/, 'g'), function(d) {
          return LISTS.indianDigits[+d];
        });
      }

      // Transforming Latin punctuations to Arabic.
      /* istanbul ignore else */
      if (options.punc) {
        for (var i = 0; i < LISTS.punctuations.length; i++) {
          value = value.replace(LISTS.punctuations[i], function(match) {
            if (options.excludePunc.indexOf(match) === -1) {
              return LISTS.punctuationsReplacements[i];
            } else {
              return match;
            }
          });
        }
      }

      // Remove Tatweel character.
      /* istanbul ignore else */
      if (options.removeTatweel === 'extra') {
        value = value.replace(REGS.arabicTatweel, CONSTANTS.arabicTatweel);
      } else if (options.removeTatweel === 'all') {
        value = value.replace(REGS.arabicTatweel, '');
      }

      // Transforming Arabic word ligatures.
      /* istanbul ignore else */
      if (options.ligatures) {
        for (var i = 0; i < LISTS.wordLigatures.length; i++) {
          value = value.replace(LISTS.wordLigatures[i], function(match) {
            for (var y = 0; y < options.excludeLigatures.length; y++) {
              if (options.excludeLigatures[y].indexOf(match) === -1) {
                return LISTS.wordLigaturesReplacements[i];
              } else {
                return match;
              }
            }
          });
        }
      }
    }

    // Converting any data type to a string type.
    return value + '';
  }

  /* -------------------------------------------------------------------------*/

  return {
    log: log,
    transform: transform,
    _version: '0.2.0'
  };
}));

//# sourceMappingURL=arli.js.map
