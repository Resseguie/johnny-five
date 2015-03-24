var LedControl = require("./ledcontrol"),
  _ = require("lodash");

// stub implementation; extract functionality from ledcontrol.js
var Digits = function(opts) {
  opts.isMatrix = false;
  return new LedControl(opts);
};
_.extend(Digits, LedControl, {
  CHARS: LedControl.DIGIT_CHARS
});

module.exports = Digits;
