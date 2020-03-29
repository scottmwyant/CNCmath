export default function (inputs) {
  return new TrigSolver(inputs)
}

function TrigSolver(inputIds) {

  /*
      Pass this function an array of strings.  Each string must
      take the following form: <{feature}{label}>, where feature
      is either 'angle' or 'length' and label is either 'a', 'b', or 'c'.
      
      Example: ['lengthA', 'lengthB', 'angleC']
 
      Get back an object that has two methods.  The methods
      that are returned are used to validate inputs and generate
      a solution based on the known characteristics.
  */

  // This array is no longer used, it is retained to show how the 
  // binary converts to an integer and which algorithm is associated
  // to each case.
  const data = [
    { "binary": "111000", "id": 56, "algorithm": "side-side-side" },
    { "binary": "001110", "id": 14, "algorithm": "side-angle-angle" },
    { "binary": "010101", "id": 21, "algorithm": "side-angle-angle" },
    { "binary": "100011", "id": 35, "algorithm": "side-angle-angle" },
    { "binary": "110001", "id": 49, "algorithm": "side-side-angle" },
    { "binary": "011100", "id": 28, "algorithm": "side-side-angle" },
    { "binary": "101010", "id": 42, "algorithm": "side-side-angle" },
    { "binary": "110100", "id": 52, "algorithm": "pair-and-side" },
    { "binary": "101100", "id": 44, "algorithm": "pair-and-side" },
    { "binary": "110010", "id": 50, "algorithm": "pair-and-side" },
    { "binary": "011010", "id": 26, "algorithm": "pair-and-side" },
    { "binary": "101001", "id": 41, "algorithm": "pair-and-side" },
    { "binary": "011001", "id": 25, "algorithm": "pair-and-side" },
    { "binary": "100110", "id": 38, "algorithm": "pair-and-angle" },
    { "binary": "100101", "id": 37, "algorithm": "pair-and-angle" },
    { "binary": "010110", "id": 22, "algorithm": "pair-and-angle" },
    { "binary": "010011", "id": 19, "algorithm": "pair-and-angle" },
    { "binary": "001101", "id": 13, "algorithm": "pair-and-angle" },
    { "binary": "001011", "id": 11, "algorithm": "pair-and-angle" },
    { "binary": "000111", "id": 7, "algorithm": null }
  ];

  const inputs = (function () {
    function Input(given) {
      this.id = given;
      this.feature = this.id.substring(0, this.id.length - 1).toLowerCase();
      this.label = this.id.substring(this.id.length - 1).toLowerCase();
    }
    return inputIds.map(input => new Input(input));
  })();

  const transform = {
    "getMissingLabel": function (label1, label2) {
      return 'abc'.replace(label1, '').replace(label2, '');
    },
    "filterByFeature": function (data, feature) {
      return data.filter(item => item.feature === feature);
    },
    "getPair": function (data) {
      // Assumptions: 
      // - This object is constructed wtih a 3-element array.  
      // - The array passed to the constructor has two different labels.

      // Put the labels into an array
      const labels = data.map(p => p.label);

      // Provide an internal method to filter to a given label
      function filterLabel(label) {
        return data.filter(p => p.label == label);
      }

      // The constructor for the return object
      function Pair(arr) {
        this.label = arr[0].label;
        this[arr[0].feature] = arr[0].value;
        this[arr[1].feature] = arr[1].value;
      }

      // The two data points are passed to
      // to the constructor of the return object as an
      // array.
      const myArr = (function () {
        let test = filterLabel(labels[0]);
        if (test.length == 2) {
          return test;
        }
        else {
          test = filterLabel(labels[1]);
          return test.length == 2 ? test : null;
        }
      })();

      return myArr === null ? null : new Pair(myArr);

    },
    "getOther": function (data) {
      const pair = this.getPair(data);
      return pair === null ? null : data.filter(item => item.label != pair.label)[0];
    }
  };

  const trig = (function () {

    function DataPoint(label, feature, value) {
      this.label = label;
      this.feature = feature;
      this.value = value;
      this.id = (feature.toLowerCase() + label.toUpperCase());
    }

    const equations = {
      "sumOfAngles": function (angle1, angle2) {
        return (Math.PI - angle1 - angle2);
      },
      "lawOf": {
        "cosines": {
          "solveAngle1": function (length1, length2, length3) {
            return (Math.acos((Math.pow(length1, 2) - Math.pow(length2, 2) - Math.pow(length3, 2)) / (-2 * length2 * length3)));
          },
          "solveLength3": function (length1, length2, angle3) {
            return Math.pow((Math.pow(length1, 2) + Math.pow(length2, 2)) - (2 * length1 * length2 * Math.cos(angle3)), 0.5);
          }
        },
        "sines": {
          "solveAngle2": function (length1, angle1, length2) {
            return Math.asin((Math.sin(angle1) / length1) * length2);
          },
          "solveLength2": function (length1, angle1, angle2) {
            return (length1 / Math.sin(angle1)) * Math.sin(angle2);
          }
        }
      }
    };

    return {

      "lawOfCosines": function (lengths, complement) {
        // Accepts a 2-element array of type DataPoint, followed by a single DataPoint.
        // The return will match the label of the second parameter and the feature of the return will
        // be the complement of the second parameter.
        if (complement.feature == 'length') {
          return new DataPoint(complement.label, 'angle', equations.lawOf.cosines.solveAngle1(complement.value, lengths[0].value, lengths[1].value));
        }
        else if (complement.feature == 'angle') {
          return new DataPoint(complement.label, 'length', equations.lawOf.cosines.solveLength3(lengths[0].value, lengths[1].value, complement.value));
        }
        else {
          return null;
        }
      },
      "lawOfSines": function (pair, complement) {
        if (complement.feature == 'angle') {
          return new DataPoint(complement.label, 'length', equations.lawOf.sines.solveLength2(pair.length, pair.angle, complement.value));
        }
        else if (complement.feature == 'length') {
          return new DataPoint(complement.label, 'angle', equations.lawOf.sines.solveAngle2(pair.length, pair.angle, complement.value));
        }
        else {
          return null;
        }
      },
      "sumOfAngles": function (angles) {
        // Accepts a two element array
        return new DataPoint(transform.getMissingLabel(angles[0].label, angles[1].label), 'angle', equations.sumOfAngles(angles[0].value, angles[1].value));
      }
    }

  })();

  const solver = (function () {

    const caseId = (function () {
      const rtn = [0, 0, 0, 0, 0, 0];
      inputs.forEach(element => {
        switch (element.feature.toLowerCase() + element.label.toUpperCase()) {
          case 'lengthA': rtn[0] = 1; break;
          case 'lengthB': rtn[1] = 1; break;
          case 'lengthC': rtn[2] = 1; break;
          case 'angleA': rtn[3] = 1; break;
          case 'angleB': rtn[4] = 1; break;
          case 'angleC': rtn[5] = 1; break;
        }
      });
      return parseInt(rtn.join(''), 2);
    })();

    return (
      [
        {
          "name": "side-side-side",
          "scope": [56],
          "solve": function (given) {
            // -- All three sides given --
            // Get angle that pairs with given[0]
            // Get angle that pairs with given[1]
            // Then get the last angle
            const out0 = trig.lawOfCosines([given[1], given[2]], given[0]);
            const out1 = trig.lawOfCosines([given[0], given[2]], given[1]);
            const out2 = trig.sumOfAngles([out0, out1]);
            return [out0, out1, out2];
          }
        },
        {
          "name": "side-side-angle",
          "scope": [28, 42, 49],
          "solve": function (given) {
            // One feature from each pair is known; two sides and one angle.
            // Use law of cosines to get the last side then law of sines to get
            // one of the missing angles, then sum of angles.
            const lengths = transform.filterByFeature(given, 'length');
            const angle = transform.filterByFeature(given, 'angle')[0];
            const out0 = trig.lawOfCosines(lengths, angle);
            const out1 = trig.lawOfSines(transform.getPair([angle, out0]), lengths[0]);
            const out2 = trig.sumOfAngles([angle, out1]);
            return [out0, out1, out2];
          }
        },
        {
          "name": "side-angle-angle",
          "scope": [14, 21, 35],
          "solve": function (given) {
            // One feature from each pair is known; one side and two angles.
            // Solve the missing angle that pairs with the given side, then use
            // law of sines to get the other two sides.
            const angles = transform.filterByFeature(given, 'angle');
            const length = transform.filterByFeature(given, 'length')[0];
            const out0 = trig.sumOfAngles(angles);
            const pair = transform.getPair([length, out0]);
            const out1 = trig.lawOfSines(pair, angles[0]);
            const out2 = trig.lawOfSines(pair, angles[1]);
            return [out0, out1, out2];
          }
        },
        {
          "name": "pair-and-angle",
          "scope": [11, 13, 19, 22, 37, 38],
          "solve": function (given) {
            // One side and two angles given; the side and one of the angles form a pair (have the same label).
            // ** Something is wrong here **  the algorithm for this case should not be the same as the case above.
            const pair = transform.getPair(given);
            const angle = transform.getOther(given);
            const angles = transform.filterByFeature(given, 'angle');
            const out0 = trig.sumOfAngles(angles);
            const out1 = trig.lawOfSines(pair, angle);
            const out2 = trig.lawOfSines(pair, out0);
            return [out0, out1, out2];
          }
        },
        {
          "name": "pair-and-side",
          "scope": [25, 26, 41, 44, 50, 52],
          "solve": function (given) {
            // Two sides and one angle given; one of the sides and the angle form a pair (have the same label).
            // Get the angle for the 'other' side that is given.  Then use sum of angles to get the last angle.
            // Use law of sines with the given pair to get the last side.

            // Consult: https://en.wikipedia.org/wiki/Solution_of_triangles#Solving_plane_triangles

            const pair = transform.getPair(given);
            const length = transform.getOther(given);
            const angle = transform.filterByFeature(given, 'angle')[0];
            const out0 = trig.lawOfSines(pair, length);
            const out1 = trig.sumOfAngles([angle, out0]);
            const out2 = trig.lawOfSines(pair, out1);
            return [out0, out1, out2];
          }
        }

      ].filter(item => item.scope.includes(caseId))[0]

    );

  })();

  const caseValidation = (function () {

    function Rule(name, description, scope, test) {
      this.name = name;
      this.description = description;
      this.scope = scope;
      this.test = test;
      this.okay = null;
      this.text = null;
    }

    const rules = [

      new Rule(
        'sum-of-sides',
        'description needed',
        ['side-side-side'],
        function (given) {
          let totalLength = given[0].value + given[1].value + given[2].value;
          let max = Math.max(...(given.map(input => input.value)));
          const delta = totalLength - (2 * max);
          this.okay = delta >= 0;
          this.text = this.okay ? null : ('Longest side is too long by ' + delta);
        }
      ),

      new Rule(
        'sum-of-anlges',
        'Sum of two angles given must be less than 180deg',
        ['pair-and-angle', 'side-angle-angle'],
        function (given) {
          const angles = transform.filterByFeature(given, 'angle');
          this.okay = (angles[0].value + angles[1].value) < Math.PI;
          this.text = this.okay ? null : 'Sum of angles is greater than pi!';
        }
      ),

      new Rule(
        'long-enough-side',
        ['pair-and-side'],
        'Check if the complement side is long enough to intersect the leg of the known pair.',
        function (given) {
          // Assume the one angle is 90, which will produce the shortest possible leg.  Then compare that to the given leg length.
          const minLenght = trig.lawOfSines({ "length": transform.getOther(given).value, "angle": 90 * Math.PI / 180 }, transform.filterByFeature(given, 'angle')[0]).value;
          this.okay = (transform.getOther(given).value >= minLenght);
          this.text = this.okay ? null : 'The complement side is too short.  It needs to be at least ' + minLenght;
        }
      )

    ];

    // Filtrer the repository of rules down to ones that apply to this specific set of inputs
    const myRules = rules.filter(item => item.scope.includes(solver.name));

    // remove the scope property, it's meaningless at this point
    myRules.forEach(rule => {
      delete rule.scope
    });

    return function (input) {

      myRules.forEach(rule => {
        rule.test(input);
      });

      if (!((rules.filter(rule => rule.okay == false).length == 0))) {
        const err = new Error('Invalid input');
        err.detail = myRules;
        throw err;
      }

      return myRules;

    }
  })();


  this.validation = (function () {

    function Rule(name, description, satisifed) {
      this.name = name;
      this.description = description;
      this.okay = satisifed;
    }

    const rules = [
      new Rule('3-inputs', 'Specify three inputs', (inputs.length == 3)),
      new Rule('1-length', 'At least one length', (inputs.filter(input => input.feature == 'length').length > 0))
    ];

    // Since all the rules must be tested each time the input configuration is
    // changed, the logic to test if the rule is written into the constructor
    // From here we just have to test for rules that are not satisfied.

    if (!(rules.filter(rule => rule.okay == false).length == 0)) {
      const err = new Error('Invalid configuration');
      err.detail = rules;
      throw err;
    }

    return rules;

  })();

  this.solve = function (input) {

    input = (function () {
      function Input(given) {
        this.id = given.id;
        this.value = given.value;
        this.feature = this.id.substring(0, this.id.length - 1).toLowerCase();
        this.label = this.id.substring(this.id.length - 1).toLowerCase();
      }
      return input.map(input => new Input(input));
    })();

    // Validate the numerical input, an error will be thrown if it's invalid
    const inputValidationResult = caseValidation(input);

    return {
      "solution": solver.solve(input),
      "validation": inputValidationResult
    }

  }
};
