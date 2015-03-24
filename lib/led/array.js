module.exports = function(Led, priv) {

  /**
   * LedArray()
   * new LedArray()
   *
   * Create an Array-like object instance of Leds
   * @alias Led.Array
   * @return {LedArray}
   */
  var LedArray = function(numsOrObjects) {
    if (!(this instanceof LedArray)) {
      return new LedArray(numsOrObjects);
    }

    var pins = [];

    if (numsOrObjects) {
      while (numsOrObjects.length) {
        var numOrObject = numsOrObjects.shift();
        if (!(numOrObject instanceof Led)) {
          numOrObject = new Led(numOrObject);
        }
        pins.push(numOrObject);
      }
    } else {
      pins = pins.concat(Array.from(priv.keys()));
    }

    this.length = pins.length;

    pins.forEach(function(pin, index) {
      this[index] = pin;
    }, this);
  };


  /**
   * each Execute callbackFn for each active led instance in an LedArray
   * @param  {Function} callbackFn
   * @return {LedArray}
   */
  LedArray.prototype.each = function(callbackFn) {
    var length = this.length;

    for (var i = 0; i < length; i++) {
      callbackFn.call(this[i], this[i], i);
    }

    return this;
  };


  [

    "on", "off", "toggle", "brightness",
    "fade", "fadeIn", "fadeOut",
    "pulse", "strobe",
    "stop"

  ].forEach(function(method) {
    // Create LedArray wrappers for each method listed.
    // This will allow us control over all Led instances
    // simultaneously.
    LedArray.prototype[method] = function() {
      var length = this.length;

      for (var i = 0; i < length; i++) {
        this[i][method].apply(this[i], arguments);
      }
      return this;
    };
  });

  LedArray.prototype.blink = LedArray.prototype.strobe;

  return LedArray;

};
