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
