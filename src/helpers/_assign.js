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
