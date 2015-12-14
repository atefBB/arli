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
