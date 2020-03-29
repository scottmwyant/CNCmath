// export default {
//   "sayHello": function(name) {
//     console.log('Hello, ' + name);
//   }
// }



// console.log("[" + getValidationObject(56).length + "] elements in the array")






function listNotCovered() {

  const allCases = [
    0, 1, 2, 3, 4, 5, 6, 7, 8,
    9, 10, 11, 12, 13, 14, 15, 16,
    17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31, 32,
    33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48,
    49, 50, 51, 52, 53, 54, 55, 56,
    57, 58, 59, 60, 61, 62, 63];

  const casesWith3Inputs = [7, 11, 13, 14, 19, 21, 22, 25, 26, 28, 35, 37, 38, 41, 42, 44, 49, 50, 52, 56];

  const covered = (function () {
    const arr = getValidationObject(56);
    let x = [];
    arr.forEach(function (item) {
      item.scope.forEach(function (item2) { if (!x.includes(item2)) { x.push(item2) }; })
    });
    return x;
  })();

  return casesWith3Inputs.filter(value => !covered.includes(value));

};

// console.log("[" + listNotCovered().length + "] Ids are not covered");






/* --- TODO ---
 Build a factory that generates case objects for each id.
 A case will know validation steps.
 A case may be unsolvable.
 A case will be able to send error messages back to the user.
*/


// Old-fashioned object constructor

// function triangle() {
//   this.a = { "angle": null, "length": null };
//   this.b = { "angle": null, "length": null };
//   this.c = { "angle": null, "length": null };
// }

// // send three inputs as objects
// const inputData = [
//   {
//     "label": "a",
//     "feature": "angle",
//     "value": 45
//   },
//   {
//     "label": "b",
//     "feature": "length",
//     "value": 13
//   },
//   {
//     "label": "b",
//     "feature": "angle",
//     "value": 35
//   }
// ];


// What does the onchange handler look like?
// This...?

// function onInput2() {
//   const domFormName = 'TrigSolver';
//   const myObj = TrigSolver();
//   myObj.input = GetInput(domFormName) // Read inputs from HTML form, get data like number of inputs, count of each type, values, etc...
//   myObj.validation = GetValidation(myObj.input); // Call a factory to get an object that does validation
//   myObj.math = GetMath(myObj.input); // Call a factory that gets an object that does the trig
//   myObj.output = GetOutputObject(); // Somehow get an object that can present the output to a user (probably not another factory).
//   myObj.Execute();

// }


// or this...?


// function handler2() {
//   const input = GetInput(dom);
//   const validation = validationFactory(input);
//   const math = mathFactory(input);

//   // Procedural code below to write solution to the form
//   // ..
//   // ...
// }






// Closure

// function TrigSolver(domObj) {

//   this.caseID = GetCaseId();
//   this.validation = null; // get an object from a factory, pass in caseId
//   this.math = null; // again, another factory
//   this.t = new triangle(); // construct the triangle
//   this.graphic = new triangleSketch();
//   this.response = {
//     "message": ["nothing", "at", "all"],
//     "solution": this.t
//   }
//   // then have another object that writes the numeric data, messages, sketch etc once all that's calculated.

//   return {
//     "SetValidation": function (obj) {
//       this.validation = obj;
//     },
//     "SetMath": function (obj) {
//       this.math = obj;
//     }
//   }
// }


// So now we have an easy way to positively identify each possible set of inputs (using binary caseId).
// How can we programatically identify inputs and outputs?
//    We know there are always three inputs and three outputs.
//    Basically, the inputs are ordered, but that's proven very difficult to express since solve order changes with caseId
//    It's like for each case, we need to be able to refer to other elements, something like...
//       inputs.ang1
//       inputs.ang2
//       inputs.len2
