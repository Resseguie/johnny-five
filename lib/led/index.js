// Led, Led.Array and Led.RGB share private state
var priv = new Map(),
  Led = require("./led")(priv);

Led.Array = require("./array")(Led, priv);
Led.RGB = require("./rgb")(Led, priv);
Led.Matrix = require("./matrix");
Led.Digits = require("./digits");

module.exports = Led;
