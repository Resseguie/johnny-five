var LedControl = require("./ledcontrol"),
  _ = require("lodash");

// stub implementation; extract functionality from ledcontrol.js
var Matrix = function(opts) {
  opts.isMatrix = true;
  return new LedControl(opts);
};
_.extend(Matrix, LedControl, {
  CHARS: LedControl.MATRIX_CHARS
});

module.exports = Matrix;
