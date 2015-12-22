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
          if (options.excludePunc.indexOf(LISTS.punctuations[i]) === -1) {
            value = value.replace(_reg(LISTS.punctuations[i], 'g'), LISTS.punctuationsReplacements[i]);
          }
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
          value = value.replace(_reg(LISTS.wordLigatures[i], 'g'), function(match) {
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
