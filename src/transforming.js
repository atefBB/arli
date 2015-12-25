  /**
   * Transform a normal string to be more Arabian string (but options are reversed).
   *
   * @public
   * @param  {String} value - String to Transform.
   * @param  {Object} [options] - Options of transforming (see: transform() for more information).
   * @return {String} Returns a new transformed string.
   */
  function transforming(value, options) {

    // Assign default options.
    options = _assign({
      clean: false,
      date: false,
      dateFrom: 'all',
      dateTo: 'all',
      digit: false,
      excludeLigatures: [' '],
      excludePunc: ' ',
      ligatures: false,
      numberSep: false,
      punc: false,
      removeTatweel: 'none',
    }, options || {});

    return transform(value, options);
  }
