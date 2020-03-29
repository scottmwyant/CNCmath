
const app = {};

app.trigSolver = (function () {

  let inputConfig = {};

  const dom = {
    "angleInputs": [
      document.getElementById("angleA"),
      document.getElementById("angleB"),
      document.getElementById("angleC")
    ],
    "lengthInputs": [
      document.getElementById("lengthA"),
      document.getElementById("lengthB"),
      document.getElementById("lengthC")
    ],
    "status": document.getElementById("status"),
    "solution": document.getElementById("solution")
  };

  function getInputValues() {
    const arr = [];
    ForEachInput(function (input) {
      if (!input.classList.contains('output')) {
        arr.push(new DataPoint(
          input.id.substring(input.id.length - 1).toLowerCase(),
          input.id.substring(0, input.id.length - 1).toLowerCase(),
          (input.value === "" ? input.placeholder : input.value)
        ));
      };
    });
    return arr;
  }

  function WriteDebugInfo() {
    dom.solution.textContent = 'solutionId=' + inputConfig.caseId + ' (' + inputConfig.caseId.toString(2) + ')';
    dom.status.textContent = ('Angles=' + inputConfig.angleCount + ', Lengths=' + inputConfig.lengthCount);
  }

  function ForEachInput(fn) {
    const inputs = dom.lengthInputs.concat(dom.angleInputs);
    for (let i = 0; i < inputs.length; i++) {
      fn(inputs[i]);
    }
  }

  function getInputConfig() {

    function LoopOverInputs(arr) {
      let obj = { "binary": '', "count": 0 };
      arr.forEach(element => {
        const x = (element.classList.contains('output') ? 0 : 1);
        obj.binary += x.toString();
        obj.count += x;
      });
      return obj;
    }

    function getCaseId(binary) {
      const id = parseInt(binary, 2);
      return isNaN(id) ? 0 : id;
    }

    const ang = LoopOverInputs(dom.angleInputs);
    const len = LoopOverInputs(dom.lengthInputs);

    return {
      "binary": len.binary + ang.binary,
      "caseId": getCaseId(len.binary + ang.binary),
      "angleCount": ang.count,
      "lengthCount": len.count,
      "totalCount": ang.count + len.count
    };
  }

  function getValidationObject(caseId) {
    // + this is a factory that returns a validation object
    // + the object is constructed with an array of rules
    // + the object provides a method to transverse the rules in the array
    const rulesForCase = [];
    const obj = new validationObject(rulesForCase);
    return obj;
  }

  function validationObject(rulesArray) {
    // this object provides a method to transverse rules in the array.
    this.error = false;
    this.rules = rulesArray;
    this.execute = function () {
      this.rules.forEach(function (rule) {
        let isValid = rule.test();
      });
      return this.error;
    };
  }

  function onInput() {
    const v = getValidationObject();
    const inputs = getInputValues();
    console.log(inputs);

  }

  function onConfigChange() {
    inputConfig = getInputConfig();
    WriteDebugInfo();
  }

  function addHandlers() {
    dom.lengthInputs.concat(dom.angleInputs).forEach(function (input) {
      input.addEventListener('dblclick', function () {
        input.classList.toggle("output");
        input.toggleAttribute("readonly");
        onConfigChange();
      });
      input.addEventListener('input', onInput);
    });
  }

  return {
    "initialize": function () {
      addHandlers();
      onConfigChange();
      onInput();
      WriteDebugInfo();
    }
  };
})();

function DataPoint(label, feature, value) {
  this.label = label;
  this.feature = feature;
  this.value = value;
}

app.trigSolver.initialize();


/*

How is this thing going to work?


The double click event triggers a config change.
Part of handling the config change is getting an object
out of the trigSolver that will handle doing the validation
and generating the solution.  The validation and, if that goes well,
the solution step will be called through the 'onInput' handler.

*/