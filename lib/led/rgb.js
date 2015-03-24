module.exports = function(Led, priv) {

  /**
   * LedRGB
   *
   *
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   * @alias Led.RGB
   */
  var LedRGB = function(opts) {
    if (!(this instanceof LedRGB)) {
      return new LedRGB(opts);
    }

    var color, colors, k, state;

    colors = LedRGB.colors.slice();
    k = -1;

    // This will normalize an array of pins in [ r, g, b ]
    // order to an object that's shaped like:
    // {
    //   red: r,
    //   green: g,
    //   blue: b
    // }
    if (Array.isArray(opts.pins)) {
      opts.pins = colors.reduce(function(pins, pin, i, list) {
        return (pins[list[i]] = opts.pins[i], pins);
      }, {});
    }

    // Initialize each Led instance
    while (colors.length) {
      color = colors.shift();
      this[color] = new Led({
        pin: opts.pins[color],
        board: opts.board,
        address: opts.address,
        controller: opts.controller,
        isAnode: opts.isAnode
      });
    }

    this.interval = null;

    state = {
      red: 255,
      green: 255,
      blue: 255,
      isAnode: opts.isAnode || false,
      isRunning: false
    };

    priv.set(this, state);

    Object.defineProperties(this, {
      isOn: {
        get: function() {
          return LedRGB.colors.some(function(color) {
            return this[color].isOn;
          }, this);
        }
      },
      isRunning: {
        get: function() {
          return state.isRunning;
        }
      },
      isAnode: {
        get: function () {
          return state.isAnode;
        }
      },
      values: {
        get: function() {
          return LedRGB.colors.reduce(function(current, color) {
            return (current[color] = this[color].value, current);
          }.bind(this), {});
        }
      }
    });
  };

  LedRGB.colors = ["red", "green", "blue"];

  /**
   * color
   *
   * @param  {String} color Hexadecimal color string
   * @param  {Array} color Array of color values
   *
   * @return {LedRGB}
   */
  LedRGB.prototype.color = function(value) {
    var state, update;

    state = priv.get(this);

    update = {
      red: null,
      green: null,
      blue: null
    };

    if (!value) {
      // Return a "copy" of the state values,
      // not a reference to the state object itself.
      return LedRGB.colors.reduce(function(current, color) {
        return (current[color] = state[color], current);
      }, {});
    }

    // Allows hex colors with leading #:
    // eg. #ff00ff
    if (value[0] === "#") {
      value = value.slice(1);
    }

    if (typeof value === "string") {
      update.red = parseInt(value.slice(0, 2), 16);
      update.green = parseInt(value.slice(2, 4), 16);
      update.blue = parseInt(value.slice(4, 6), 16);
    } else {
      update.red = value[0];
      update.green = value[1];
      update.blue = value[2];
    }

    LedRGB.colors.forEach(function(color) {
      state[color] = update[color];
      this[color].brightness(update[color]);
    }, this);

    return this;
  };

  LedRGB.prototype.on = function() {
    var state = priv.get(this);

    // If it's not already on, we turn
    // them on to previous color value
    if (!this.isOn) {
      LedRGB.colors.forEach(function(color) {
        this[color].brightness(state[color]);
      }, this);
    }

    return this;
  };

  LedRGB.prototype.off = function() {
    LedRGB.colors.forEach(function(color) {
      this[color].off();
    }, this);

    return this;
  };

  /**
   * strobe
   * @param  {Number} rate Time in ms to strobe/blink
   * @return {Led}
   */
  LedRGB.prototype.strobe = function(rate) {
    var isHigh = false;
    var state = priv.get(this);

    // Avoid traffic jams
    if (this.interval) {
      clearInterval(this.interval);
    }

    state.isRunning = true;

    this.interval = setInterval(function() {
      this.toggle();
    }.bind(this), rate || 100);

    return this;
  };

  LedRGB.prototype.blink = LedRGB.prototype.strobe;
  LedRGB.prototype.toggle = Led.prototype.toggle;
  LedRGB.prototype.stop = Led.prototype.stop;

  return LedRGB;
};
