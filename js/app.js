const button = document.querySelectorAll('button.digit, button.operator');
const output = document.getElementById('output');
const outputResult = document.getElementById('result');
const themeToggler = document.querySelector('input[name=theme]');

// Add event listeners to buttons
document.addEventListener('click', listenForButtons, false);

// Execute functions on buttons
function listenForButtons(e) {
  if (e.target.classList.contains('clear')) clear();
  if (e.target.classList.contains('del')) del();
  if (e.target.classList.contains('equals')) equals();
  if (e.target.classList.contains('digit') || e.target.classList.contains('operator')) writeOutput(e);
	if (e.target.classList.contains('square')) square();
	if (e.target.classList.contains('exponent')) exponent(e);
}
// Clear display 
function clear() {
  output.innerHTML = "0";
  outputResult.innerHTML = "";
}
// Delete one digit
function del() {
	if (outputResult.innerHTML == "") output.innerHTML = output.innerHTML.slice(0, -1);
	outputResult.innerHTML = "";
  if (output.innerHTML.length < 1)  output.innerHTML = "0";
}
// Equation function
function equals() {
  // If the last chacrachter is % calculate percentage
  if (output.innerHTML[output.innerHTML.length - 1] == "%") 
  {
    getPercentage(output.innerHTML);
  } 
  else if (outputResult.innerHTML == "") {
    // Evaluate output string
    let result = eval(output.innerHTML);
    outputResult.innerHTML = Math.round(result * 100) / 100;
  } else { // If equals gets released over the existing result, put the result into upper display
		output.innerHTML = outputResult.innerHTML;
		outputResult.innerHTML = "";
	}
}
// Writing on output display
function writeOutput(e) {
    // Get the button text
    let label = e.target.innerHTML;
    const lastChar = output.innerHTML[output.innerHTML.length - 1]; 
    // Write result in output display
    if(outputResult.innerHTML.length > 0) {
      output.innerHTML = outputResult.innerHTML;
      outputResult.innerHTML = "";
    }
    // Write labels in output
     if (output.innerHTML.length < 28 && allowStart(label, lastChar)) {
      removeZero(label);  // Remove initial "0"
      if (label == "x") label = "*";  // replace X with multiplication operator 
      output.innerHTML += label;
    }
}
// Disable digits from chaining or starting a string
function allowStart(label, lastChar) {
  // Do a futher checking if digit (except for parenthesis)
  if ( isNaN(label) && !(label == "(" || label == ")") ) {
    if (output.innerHTML == "0") {
      if (label == "-" || label == ".") return true; 
      else return false; 
    }  // Return false to stop chaining operators except for parentheses
    else if (isNaN(lastChar) && !(lastChar == "(" || lastChar == ")") ) {  //////////// Flip
      replaceOperator(lastChar, label); 
      return false; 
    }
    else return true
  } 
  else return true;
}
// Replace current operator with newly entered one
function replaceOperator(lastChar, label) {
	if (label == "x") label = "*"; 
	let newOutput = output.innerHTML.replace(lastChar, label);
	output.innerHTML = newOutput;
}
// Remove initial zero
function removeZero(label) {
  if (output.innerHTML == "0" && label != ".") {
    output.innerHTML = "";
  }
}
// Calculate percentage function
function getPercentage(outputString) {
  let outputStr = outputString.slice(0, -1); // Remove "%" sign

  for (let i = 0; i < outputStr.length; i++) {
    // Split the string into a numbers array
    if(isNaN(outputStr[i]) && outputStr[i] != ".") {  // Find the operator
      let numbers = outputStr.split(outputStr[i]);  // Split the string on the operator
      let num1 = numbers[0], num2 = numbers[1]; // Get the digits from numbers array
      let percentage = num1 * num2 / 100; 
      // Caluclate percentage based on the operator 
      switch (outputStr[i]) {
        case "-": outputResult.innerHTML = num1 - percentage;
          break;
        case "+": outputResult.innerHTML = parseInt(num1) + percentage; 
          break;
        default: outputResult.innerHTML = num2 / 100; 
          break;
      }
      return;
    }
  }
  // If only one number is typed, get the percentage
  output.innerHTML = outputStr / 100;
}
// Square a number function
function square() {
	const lastChar = output.innerHTML[output.innerHTML.length - 1];
	let squared = lastChar * lastChar;
	output.innerHTML = output.innerHTML.slice(0, -1) + squared;
}
// Exponent function
function exponent() {

	let expBtn = document.querySelector('.exponent');
	let x = output.innerHTML; // Get the first digit
	let y = "";

	output.innerHTML += "<sup>y </sup>";
  expBtn.disabled = true; // Disable exponent button while typing
	expBtn.style.background = 'var(--color-orange)'; // Change the style of a button while function is active
  expBtn.style.color = "#fff";
	
	document.addEventListener('click', raiseNumber); // Listen for buttons

	function raiseNumber(e) {
    // If digit is typed, get the second digit
		if (e.target.classList.contains('digit') && y.length < 3) {
			y += e.target.innerHTML;
			output.innerHTML = output.innerHTML.slice(0, -(11 + y.length)); // Remove default '<sup>' element
			output.innerHTML += `<sup>${y}</sup>`;
		}
		else output.innerHTML = output.innerHTML.slice(0, -1); // If anything else is typed, delete immediatelly
    // If equals is pressed, do a calculation and write output
		if (e.target.classList.contains('equals')) {
			reset();
			let result = x;
			for (let i = 1; i < y; i++) {
				result *= x;
			}
			outputResult.innerHTML = result;
		}
		if (e.target.classList.contains('del')) {
			reset();
			output.innerHTML = 0;
		} 
		if (e.target.classList.contains('clear')) {
			reset();
			output.innerHTML = 0;
		}
}
// Remove listener and revert button design
function reset() {
	document.removeEventListener('click', raiseNumber);
  expBtn.disabled = false;
	expBtn.style.background = 'var(--bg)';
  expBtn.style.color = "var(--color-orange)";
}}
// Theme switcher

themeToggler.addEventListener('change', function() {
  if (this.checked) document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.setAttribute('data-theme', 'light');
})