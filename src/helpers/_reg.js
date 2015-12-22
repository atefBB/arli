  /**
   * Regular expression generator.
   *
   * @private
   * @param  {String|RegExp} pattern - Source pattern.
   * @param  {String} [flags] - Flags `gmiy`.
   * @return {RegExp} Returns a new generated regular expression object.
   */
  function _reg(pattern, flags) {

    if (_isString(pattern)) {
      pattern = pattern.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      return new RegExp(pattern, flags || '');
    } else {
      return new RegExp(pattern.source, flags || '');
    }

  }

  /* -------------------------------------------------------------------------*/
