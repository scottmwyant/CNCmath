
class Vector {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }
  scale(factor) {
    return {
      x: factor * this.x,
      y: factor * this.y,
      z: factor * this.z
    }
  }
  scalarSum(vector) {
    var v = new Vector();
    v.x = this.x + vector.x;
    v.y = this.y + vector.y;
    v.z = this.z + vector.z;
    return v;
  }
  rotate(axis, angle) {
    // assumes the axis of rotation passes through the tail of *this* vector

    // sanitize input
    axis = axis.toLowerCase();
    if (axis == "x") { axis = "a"; }
    if (axis == "y") { axis = "b"; }
    if (axis == "z") { axis = "c"; }
    if (axis != "a" && axis != "b" && axis != "c") { angle = 0; }

    // assume the angle argument is in degrees, convert to radians
    angle = angle * (Math.PI / 180);
    var ans = new Vector();

    switch (axis) {
      case "a":
        ans.x = this.x;
        ans.y = (Math.cos(angle) * this.y) + (-1 * Math.sin(angle) * this.z);
        ans.z = (Math.sin(angle) * this.y) + (Math.cos(angle) * this.z);
        break;
      case "b":
        ans.x = (Math.cos(angle) * this.x) + (Math.sin(angle) * this.z);
        ans.y = this.y;
        ans.z = (-1 * Math.sin(angle) * this.x) + (Math.cos(angle) * this.z);
        break;
      case "c":
        ans.x = (Math.cos(angle) * this.x) + (-1 * Math.sin(angle) * this.y);
        ans.y = (Math.sin(angle) * this.x) + (Math.cos(angle) * this.y);
        ans.z = this.z;
        break;
      default:
        break;
    }

    return ans;

    /*   
    * 
    * -- Documentation on the linear algebra used to caclulate the rotational transformation --
    *
    *    Rotation about the:
    *    
    *         X-axis        Y-axis        Z-axis
    *        [1  0   0  ]  [cos 0 -sin]  [cos  sin 0]
    *    R = [0  cos sin]  [0   1  0  ]  [-sin cos 0]
    *        [0 -sin cos]  [sin 0  cos]  [ 0   0   1]
    *
    *        Note:
    *         (1) Switch the signs on the SIN term effectively switches the sign on the angle given.
    *         (2) The 1 is the axis of rotation.
    *
    *        [x]
    *    v = [y]
    *        [z]
    *
    *                [x']
    *    v' = (R)v = [y']
    *                [z']
    *
    *    Multiply row by column.  Each component of the resultant vector is the sum of 3 terms,
    *    though at leastone of the terms has a (multiply by zero) component, negating that
    *    whole term.
    *
    * 
    *    -- Rotation about X --
    *     x' = x + 0 + 0                  = x
    *     y' = 0x + cos(A)y + sin(A)z     = cos(A)y + sin(A)z
    *     z' = 0x + (-sin(A))y + cos(A)z  = (-sin(A))(y) + cos(A)z 
    *
    *    -- Rotation about Y --
    *     x' = cos(B)x + 0y + (-sin(B))z  = cos(B)x + (-sin(B))z
    *     y' = 0x + y + 0z                = y
    *     z' = sin(B)x + 0y + cos(B)z     = sin(B)x + cos(B)z
    *
    *    -- Rotation about Z --
    *     x' = cos(C)x + sin(C)y + 0z     = cos(C)x + sin(C)y
    *     y' = (-sin(C))x + cos(C)y + 0z  = (-sin(C))x + cos(C)y 
    *     z' = 0x + 0y + z                = z
    *
    * -----------------------------------------------------------------------------------------
    */

  }
}

class Graph {
  constructor(htmlCanvas, plane) {
    this.ctx = (function () {
      var dpr = window.devicePixelRatio || 1;
      htmlCanvas.width = htmlCanvas.width * dpr;
      htmlCanvas.height = htmlCanvas.height * dpr;
      var ctx = htmlCanvas.getContext('2d');
      ctx.scale(dpr, dpr);
      return ctx;
    })();
    this.width = htmlCanvas.width / window.devicePixelRatio;
    this.height = htmlCanvas.height / window.devicePixelRatio;
    this.size = Math.min(this.height, this.width);
    this.origin = { x: this.width / 2, y: this.height / 2 }
    this.style = { axis1Color: "black", axis2Color: "black" }
    this.setPlane(plane);
    this.reset();
    this.angle = { display: 0, target: 0 };
  }
  reset() {
    // clear everything
    this.ctx.clearRect(0, 0, this.width, this.height)

    // draw horizontal axis
    this.ctx.beginPath();
    this.ctx.lineCap = "round";
    this.ctx.moveTo(this.origin.x - (this.width / 2), this.origin.y);
    this.ctx.lineTo(this.origin.x + (this.width / 2), this.origin.y);
    this.ctx.lineWidth = .5;
    this.ctx.strokeStyle = this.style.axis1Color;
    this.ctx.stroke();

    // draw vertical axis
    this.ctx.beginPath();
    this.ctx.lineCap = "round";
    this.ctx.moveTo(this.origin.x, this.origin.y + (this.height / 2));
    this.ctx.lineTo(this.origin.x, this.origin.y - (this.height / 2));
    this.ctx.lineWidth = .5;
    this.ctx.strokeStyle = this.style.axis2Color;
    this.ctx.stroke();

    // draw encompassing circle
    this.ctx.beginPath();
    this.ctx.arc(this.origin.x, this.origin.y, Math.min(this.width, this.height) * .8 * .5, 0, (2 * Math.PI), false);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#eaecef';
    this.ctx.stroke();

    if (this.positiveQuadrant > 0) {
      var length = 10;
      var width = 2;

      var dimension = {
        long: (this.size / 2) - (length / 2),
        short: (length / 2) * (1.5)
      }

      var k = { x: 0, y: 0 }

      switch (this.positiveQuadrant) {
        case 1:
          k.x = 1;
          k.y = 1;
          break;
        case 2:
          k.x = -1;
          k.y = 1;
          break;
        case 3:
          k.x = -1;
          k.y = -1;
          break
        case 4:
          k.x = 1;
          k.y = -1;
          break;
        default:
          k.x = 1;
          k.y = 1;
          break;
      }

      // set color for horizontal axis
      this.ctx.fillStyle = "Dark" + this.style.axis1Color;

      // plus sign on the horizontal axis - the horizontal tick
      this.ctx.fillRect((this.origin.x) + (k.x * dimension.long) + (-1 * k.x * length / 2), (this.origin.y + (-1 * k.y * dimension.short) + (-1 * k.y * width / 2)), k.x * length, k.y * width);

      // plus sign on horizontal axis - the vertical tick
      this.ctx.fillRect((this.origin.x) + (k.x * dimension.long) + (-1 * k.x * width / 2), (this.origin.y + (-1 * k.y * dimension.short) + (-1 * k.y * length / 2)), k.x * width, k.y * length);



      // set color for vertical axis
      this.ctx.fillStyle = "Dark" + this.style.axis2Color

      // plus sign on vertical axis - horizontal tick
      this.ctx.fillRect((this.origin.x) + (k.x * dimension.short) + (-1 * k.x * length / 2), (this.origin.y + (-1 * k.y * dimension.long) + (-1 * k.y * width / 2)), k.x * length, k.y * width);

      // plus sign on vertical axis - vertical tick
      this.ctx.fillRect((this.origin.x) + (k.x * dimension.short) + (-1 * k.x * width / 2), (this.origin.y + (-1 * k.y * dimension.long) + (-1 * k.y * length / 2)), k.x * width, k.y * length);

    }

  }
  setPlane(plane) {
    switch (plane.toLowerCase()) {
      case "xy":
        this.style.axis1Color = "red";
        this.style.axis2Color = "green";
        break;
      case "xz":
        this.style.axis1Color = "red";
        this.style.axis2Color = "blue";
        break;
      case "yz":
        this.style.axis1Color = "green";
        this.style.axis2Color = "blue";
        break;
      default: break;
    }
  }
  drawTicks(hAxisTick, vAxisTick) {

    let positiveQuadrant = null;
    let width = 10;
    let thickness = 2;
    let scale = (0.8) * this.size;

    if (hAxisTick == null) { hAxisTick = 0; }
    if (vAxisTick == null) { vAxisTick = 0; }

    // tick on horizontal axis
    this.ctx.fillStyle = "Dark" + this.style.axis1Color;
    this.ctx.fillRect(((this.origin.x - (thickness / 2)) + ((scale / (0.99 * thickness)) * (hAxisTick))), (this.origin.y - (width / 2)), thickness, width);

    // tick on vertical axis
    this.ctx.fillStyle = "Dark" + this.style.axis2Color;
    this.ctx.fillRect((this.origin.x - (width / 2)), (this.origin.y - (thickness / 2)) - ((scale / (0.99 * thickness))) * (vAxisTick), width, thickness);
  }
  drawAngledLine(angle) {

    // clear the current line
    this.reset();

    // start drawing the line here
    let scale = (0.8) * this.size;

    // angled line
    this.ctx.beginPath();
    this.ctx.lineCap = "round";
    this.ctx.moveTo(this.origin.x, this.origin.y);
    this.ctx.lineTo(this.origin.x + (scale / 2) * (Math.cos(angle)), this.origin.y - (scale / 2) * (Math.sin(angle)));
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "black";
    this.ctx.stroke();

  }
  drawPoint(hAxisValue, vAxisValue, color) {
    if (color == null) { color = "black"; }
    var dist = Math.pow((Math.pow(hAxisValue, 2) + Math.pow(vAxisValue, 2)), (1 / 2));
    var k = ((0.8 * this.size) / 2) * (1 / dist);
    hAxisValue = Number(hAxisValue) * k;
    vAxisValue = Number(vAxisValue) * k;

    var r = 6;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this.origin.x + hAxisValue - (r / 2), this.origin.y - vAxisValue - (r / 2), r, r);
  }

  setOrientation(quadrant) {
    this.positiveQuadrant = Number(quadrant);
  }
}

// add an object to the global namespace
var app = {};

// Add a utility method
app.parse = function () {

  function parseInputElement(inputElement) {
    let txt = inputElement.placeholder;
    if (inputElement.value != "") { txt = inputElement.value; }
    return parseText(txt);
  }

  function parseText(str) {

    let units = ["in", "mm", "ipr", "ipm", "rpm", "sfm", "deg", "rad", "radians", "degrees"];
    let inputUnit = "unknown";
    let inputValue = null;

    // Test if there is a unit given with  the input magnitude
    if (!Number.isNaN(Number(str))) {
      inputUnit = "none";
      inputValue = Number(str);
    }
    else {
      // Check for fractional input here:
      // Test if there is a single "/" in the input text
      if ((str.length - (str.replace(/\//g, '')).length) == 1) {
        // now make sure it is not on either end
        let divisorPosition = str.search(/\//);
        if (divisorPosition != 0 && divisorPosition != str.length - 1) {
          inputUnit = "fractional";
          let arr = str.split("/");
          inputValue = Number((arr[0] / arr[1]));
        }
      }
      if (inputUnit == "unknown") {
        for (let i = 0; i < units.length; i++) {
          let testCase = units[i].toLowerCase();
          let suffix = str.substring(str.length - units[i].length).toLowerCase();
          if (testCase == suffix) { inputUnit = testCase; }
          if (inputUnit != "unknown") {
            inputValue = Number(str.substring(0, str.length - inputUnit.length));
            break;
          }
        }
      }
    }
    if (Number.isNaN(inputValue)) {
      inputValue = null;
      inputUnit = "unknown"
    }
    return { unit: inputUnit, value: inputValue };
  }

  return {
    getAngleRadians: function (inputElement) {
      let data = parseInputElement(inputElement);
      if (data.unit !== "rad" && data.unit !== "radians") { return data.value * Math.PI / 180; }
      else { return data.value; }
    },
    getLengthInches: function (inputElement) {
      let data = parseInputElement(inputElement);
      if (data.unit == "mm") { return data.value * 1 / 25.4; }
      else { return data.value; }
    },
    getValueUnit: parseInputElement

  }
}();

// Add a property to hold the drill-point applet
app.drillPoint = (function () {
  var dom = {
    angle: document.getElementById("drillPointAngle"),
    diameter: document.getElementById("drillPointDiameter"),
    tip: document.getElementById("drillPointTip")
  }
  function getData() {
    return {
      angle: app.parse.getAngleRadians(dom.angle),
      diameter: app.parse.getLengthInches(dom.diameter)
    }
  }
  function onInput() {
    var data = getData();
    var calc = 0;
    if (data.angle != null && data.diameter != null) { calc = (data.diameter / 2) * Math.tan((Math.PI - data.angle) / 2); }
    dom.tip.innerHTML = calc.toFixed(4);
  }
  return {
    initialize: function () {
      dom.angle.addEventListener("input", onInput);
      dom.diameter.addEventListener("input", onInput);
      onInput();
    }
  }
})();

// Add a property and hold an object for the unit circle applet
app.unitCircle = (function () {

  var dom = {
    angle: document.getElementById("myAngle"),
    graph: new Graph(document.getElementById("canvas1"), "xy"),
    scale: document.getElementById("myLength"),
    cosine: document.getElementById("outputCOS"),
    sine: document.getElementById("outputSIN"),
  }

  // simple obj literal to support animation
  var animation = { target: 0, current: 0, scale: 1 }

  function getData() {
    var obj = {};
    // read input values
    obj.angle = app.parse.getAngleRadians(dom.angle);
    obj.scale = app.parse.getLengthInches(dom.scale);

    // manipulate input
    if (obj.angle == null) { obj.angle = 0; }
    if (obj.scale == null || obj.scale == 0) { obj.scale = 1; }
    return obj;
  }

  function prepareAnimation() {

    // hard-code the angle to move on each repaint (using degrees)
    const increment = 0.35;
    const tolerance = 1;

    // Once the displayed angle is sufficiently close to the target, the display angle is assigned the target value
    if (Math.abs(animation.current - animation.target) < (tolerance * Math.PI / 180)) { animation.current = animation.target; }

    // When the targeted angle is not equal to the displayed angle increment the angle toward the target
    if (animation.current != animation.target) {
      window.requestAnimationFrame(animate);
      if (animation.current > animation.target) {
        animation.current = animation.current - (increment * Math.PI / 180);
      }
      else {
        animation.current = animation.current + (increment * Math.PI / 180);
      }
    }
  }

  function animate() {

    prepareAnimation();

    // put a line on the graph        
    dom.graph.drawAngledLine(animation.current);

    // add tick marks
    if (animation.current != 0 || (animation.current == 0 && animation.current > .005)) {
      dom.graph.drawTicks(Math.cos(animation.current), Math.sin(animation.current));
    }

    // update the numerical solution
    updateNumericalOutput(animation.current, animation.scale);

  }

  function onAngleInput() {
    setTimeout(function () {

      // parse input from DOM elements
      var data = getData();

      // write values to private variables
      animation.target = data.angle;
      animation.scale = data.scale;

      animate();

    }, (0.75 * 1000))
  }

  function onScaleInput() {
    var data = getData();
    updateNumericalOutput(data.angle, data.scale);
  }

  function updateNumericalOutput(angle, scale) {
    dom.cosine.innerHTML = (scale * Math.cos(angle)).toFixed(4);
    dom.sine.innerHTML = (scale * Math.sin(angle)).toFixed(4);
  }

  return {
    initialize: function () {
      dom.angle.addEventListener("input", onAngleInput);
      dom.scale.addEventListener("input", onScaleInput);

      var defaultAngle = 0;
      dom.graph.drawAngledLine(defaultAngle, true);
      updateNumericalOutput(0, 1);
    }
  }
})();

// Add a property and hold an object for the feed & speed applet
app.feedAndSpeed = (function () {
  var dom = {
    diameter: document.getElementById("speedDiameter"),
    feed: document.getElementById("feedKnown"),
    speed: document.getElementById("speedKnown"),
    travel: document.getElementById("travel"),
    calculatedFeed: document.getElementById("outputFeed"),
    calculatedSpeed: document.getElementById("outputSpeed"),
    calculatedTime: document.getElementById("outputTime"),
    calculatedDiameter: document.getElementById("outputDiameter")
  }
  function getData() {
    return {
      diameter: app.parse.getValueUnit(dom.diameter),
      feed: app.parse.getValueUnit(dom.feed),
      speed: app.parse.getValueUnit(dom.speed),
      travel: app.parse.getValueUnit(dom.travel)
    }
  }
  function onInput() {

    var data = getData();
    var calcDiameter;
    var calcSpeed;
    var calcFeed;
    var outputUnit;
    var rpm;
    var precision;
    var distance;
    var duration;
    var ipm;
    var diameter;

    // Convert diameter from metric if necesssary
    if (data.diameter.unit == "mm") {
      calcDiameter = (data.diameter.value / 25.4);
      diameter = calcDiameter;
      outputUnit = '';
      precision = 4;
    }
    else {
      calcDiameter = data.diameter.value * 25.4
      diameter = data.diameter.value;
      outputUnit = "mm";
      precision = 2;
    }
    if (Number.isNaN(calcDiameter) || calcDiameter == 0) {
      dom.calculatedDiameter.innerHTML = "";
    }
    else {
      dom.calculatedDiameter.innerHTML = calcDiameter.toFixed(precision) + outputUnit;
    }


    // Make assumptions about units based on the magnitude of the input value
    if (data.speed.unit == "none") {
      if (data.speed.value > 500) { data.speed.unit = "rpm"; } else { data.speed.unit = "sfm" };
    }
    if (data.feed.unit == "none") {
      if (data.feed.value > 0.2) { data.feed.unit = "ipm"; } else { data.feed.unit = "ipr"; }
    }
    // Speed conversion
    if (data.speed.unit == "rpm") {
      outputUnit = "sfm";
      calcSpeed = (data.speed.value * Math.PI * diameter * (1 / 12));
      rpm = data.speed.value;
      precision = 2;
    }
    else if (data.speed.unit == "sfm") {
      outputUnit = "rpm";
      calcSpeed = (12 * data.speed.value) / (Math.PI * diameter);
      rpm = calcSpeed;
      precision = 0;
    }
    if (Number.isNaN(calcSpeed) || !Number.isFinite(calcSpeed) || calcSpeed == 0) {
      dom.calculatedSpeed.innerHTML = "";
    } else {
      dom.calculatedSpeed.innerHTML = calcSpeed.toFixed(precision) + outputUnit;
    }

    // Feed conversion
    if (data.feed.unit == "ipr") {
      outputUnit = "ipm";
      precision = 2;
      calcFeed = rpm * data.feed.value;
      ipm = calcFeed;
    }
    else if (data.feed.unit == "ipm") {
      outputUnit = "ipr";
      precision = 4;
      ipm = data.feed.value
      calcFeed = (ipm / rpm);
    }
    if (Number.isNaN(calcFeed) || calcFeed == 0 || !Number.isFinite(calcFeed)) {
      dom.calculatedFeed.innerHTML = "";
    } else {
      dom.calculatedFeed.innerHTML = calcFeed.toFixed(precision) + outputUnit;
    }

    // Time duration of axial movement at given speed/feed
    distance = data.travel.value;
    if (data.travel.unit == "mm") { distance = (distance / 25.4); }
    duration = (distance * (60 / ipm));
    if (Number.isNaN(duration) || duration == 0 || !Number.isFinite(duration)) {
      dom.calculatedTime.innerHTML = "";
    }
    else {
      precision = 2;
      if (duration > 60) { precision = 0 }
      dom.calculatedTime.innerHTML = duration.toFixed(precision) + "s";
    }


  }
  return {
    initialize: function () {
      dom.diameter.addEventListener("input", onInput);
      dom.feed.addEventListener("input", onInput);
      dom.speed.addEventListener("input", onInput);
      dom.travel.addEventListener("input", onInput);
      onInput();
    }
  }
})();

// Add a property and hold an object for the 4th axis positioning applet
app.fourthAxisPositioning = (function () {

  var axis0 = "a";
  var axis1 = "y";
  var axis2 = "z";
  var axisVector = new Vector();
  var pointVector1 = new Vector();
  var pointVector2 = new Vector();
  var resultantVector = new Vector();

  var dom = {
    axisAngle: document.getElementById("axisAngle"),
    axisLabel: document.getElementById("axisLabel"),
    mz_cor1: document.getElementById("TranslationAxis1"),
    mz_cor2: document.getElementById("TranslationAxis2"),
    cor_p1: document.getElementById("PointAxis1"),
    cor_p2: document.getElementById("PointAxis2"),
    myGraph: new Graph(document.getElementById("canvas2"), "yz"),
    outputRotation: document.getElementById("outputRotation"),
  }
  function getData() {
    rotaryPosition = dom.ParseInput(dom.axisAngle).value;
    locationOfAxis[axis1] = app.parse.getValueUnit(dom.mz_cor1).value;
    locationOfAxis[axis2] = app.parse.getValueUnit(dom.mz_cor2).value;
    pointOfInterest[axis1] = app.parse.getValueUnit(dom.cor_p1).value;
    pointOfInterest[axis2] = app.parse.getValueUnit(dom.cor_p2).value;
    var obj = {};
    obj.rotaryPosition = app.parse.getValueUnit(dom.angle).value;
    //continue adding properties on this object to return to the caller
    return obj;
  }
  function onAxisLabelChange() {
    axis0 = dom.axisLabel.value.toLowerCase().substring(0, 1);
    var ang = "";
    var quad = 0;
    if (axis0 == "a") {
      axis1 = "y";
      ang = unescape('%u03B1');
      quad = 1;
    } else {
      axis1 = "x";
      ang = unescape('%u03B2');
      quad = 2;
    }
    dom.mz_cor1.placeholder = axis1.toUpperCase();
    dom.cor_p1.placeholder = axis1.toUpperCase();
    dom.axisAngle.placeholder = ang;
    dom.myGraph.setPlane(axis1 + axis2);
    dom.myGraph.setOrientation(quad);
    updateSolution();
  }
  function onPointChange() {
    updateSolution();
  }
  function onAngleChange() {
    updateSolution();
  }
  function updateSolution() {
    var axis = dom.axisLabel.value.toLowerCase().substring(0, 1);
    var angle = app.parse.getValueUnit(dom.axisAngle).value;
    pointVector1 = getPointVector();
    pointVector2 = pointVector1.rotate(axis, angle);
    resultantVector = pointVector2.scalarSum(axisVector);

    // Set a scale factor to either 1 or -1 based on axis selection.
    // This is done so the graph will draw with consistent orientation.
    var k = { h: 1, v: 1 }
    if (axis0 == "b") { k.h = -1; }

    dom.myGraph.reset();
    dom.myGraph.drawPoint(k.h * pointVector1[axis1], k.v * pointVector1[axis2], "gray");
    if (angle != 0) { dom.myGraph.drawPoint(k.h * pointVector2[axis1], k.v * pointVector2[axis2], "orange"); }
    writeNumericalSolution();
  }
  function getPointVector() {

    var v = new Vector();
    var axis1 = "x";

    // set axis1 (h-axis label) to y for A-axis rotation
    if (dom.axisLabel.value.toLowerCase().substring(0, 1) == "a") { axis1 = "y"; }

    // read inputs into the vector components
    v[axis1] = app.parse.getValueUnit(dom.cor_p1).value;
    v.z = app.parse.getValueUnit(dom.cor_p2).value;

    return v;
  }
  function getAxisVector() {
    var v = new Vector();
    var axis1 = "x";
    if (dom.axisLabel.value.toLowerCase().substring(0, 1) == "a") { axis1 = "y"; }
    v[axis1] = app.parse.getValueUnit(dom.mz_cor1).value;
    v.z = app.parse.getValueUnit(dom.mz_cor2).value;
    return v;

  }
  function writeNumericalSolution() {
    var v = resultantVector
    if (axis0 == "a") {
      dom.outputRotation.innerHTML = "< X, " + v.y.toFixed(4) + ", " + v.z.toFixed(4) + " >";
    }
    else if (axis0 == "b") {
      dom.outputRotation.innerHTML = "< " + v.x.toFixed(4) + ", Y, " + v.z.toFixed(4) + " >";
    }
    else {
      dom.outputRotation.innerHTML = "< " + v.x.toFixed(4) + ", " + v.y.toFixed(4) + ", " + v.z.toFixed(4) + " >";
    }
  }
  function onAxisLocationChange() {
    // translate the COR back to <0,0,0> then get the new coordinates, then translate to the new coordinates
    var v = axisVector.scale(-1);
    resultantVector = resultantVector.scalarSum(v);
    axisVector = getAxisVector();
    resultantVector = resultantVector.scalarSum(axisVector);
    writeNumericalSolution();
  }
  return {
    initialize: function () {
      dom.axisLabel.addEventListener("change", onAxisLabelChange);
      dom.axisAngle.addEventListener("input", onAngleChange);
      dom.mz_cor1.addEventListener("input", onAxisLocationChange);
      dom.mz_cor2.addEventListener("input", onAxisLocationChange);
      dom.cor_p1.addEventListener("input", onPointChange);
      dom.cor_p2.addEventListener("input", onPointChange);
      dom.myGraph.setOrientation(1);
      dom.myGraph.reset();
    }
  }
})();

// Help toggler    
app.helpToggle = (function (event) {
  // stop default behavior of scrolling to top of page
  event.preventDefault();
  let link = event.target;
  let help = event.target.parentElement.nextElementSibling;
  if (help.style.height !== "") {
    link.innerText = "help";
    help.style.height = null;
  }
  else {
    link.innerText = "hide help";
    help.style.height = help.scrollHeight + "px";
  }
});

// Initialize the different parts of the web app
(function Run(){
  app.unitCircle.initialize();
  app.feedAndSpeed.initialize();
  app.fourthAxisPositioning.initialize();
  app.drillPoint.initialize();

})();