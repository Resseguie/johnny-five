<!--remove-start-->

# Motor - Current

<!--remove-end-->






##### Breadboard for "Motor - Current"



![docs/breadboard/motor-current.png](breadboard/motor-current.png)<br>

Fritzing diagram: [docs/breadboard/motor-current.fzz](breadboard/motor-current.fzz)

&nbsp;




Run with:
```bash
node eg/motor-current.js
```


```javascript
var five = require("johnny-five"),
  board = new five.Board();

board.on("ready", function() {
  var motor;
  /*
    Arduino Motor Shield R3
      Motor A
        pwm: 3
        dir: 12
        brake: 9
        current: "A0"

      Motor B
        pwm: 11
        dir: 13
        brake: 8
        current: "A1"

   */

  motor = new five.Motor({
    pins: {
      pwm: 3,
      dir: 12,
      brake: 9
    },

    // The current options are passed to a new instance of Sensor
    current: {
      pin: "A0",
      freq: 250,
      threshold: 10
    }
  });

  board.repl.inject({
    motor: motor
  });

  motor.current.scale([0, 3030]).on("change", function() {
    console.log("Motor A: " + this.value.toFixed(2) + "mA");
  });

  motor.on("start", function() {
    console.log("start");
  });

  motor.on("stop", function() {
    console.log("automated stop on timer");
  });

  motor.on("brake", function() {
    console.log("automated brake on timer");
  });

  motor.on("forward", function() {
    console.log("forward");

    // demonstrate switching to reverse after 5 seconds
    board.wait(5000, function() {
      motor.reverse(150);
    });
  });

  motor.on("reverse", function() {
    console.log("reverse");

    // demonstrate stopping after 5 seconds
    board.wait(5000, function() {

      // Apply the brake for 500ms and call stop()
      motor.brake(500);
    });
  });

  // set the motor going forward full speed
  motor.forward(255);
});

```








&nbsp;

<!--remove-start-->

## License
Copyright (c) 2012, 2013, 2014 Rick Waldron <waldron.rick@gmail.com>
Licensed under the MIT license.
Copyright (c) 2014, 2015 The Johnny-Five Contributors
Licensed under the MIT license.

<!--remove-end-->
