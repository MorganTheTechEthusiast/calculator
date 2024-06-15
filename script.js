const output = document.getElementById("output");
const form = document.getElementById("calc_form");
const operand_btns = document.querySelectorAll("button[data-type=operand]");
const operator_btns = document.querySelectorAll("button[data-type=operator]");

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

let is_operator = false;
let equation = [];

// Function to safely evaluate a mathematical expression
const safeEval = (expression) => {
  try {
    // Use Function constructor as a safer alternative to eval
    return new Function('return ' + expression)();
  } catch (error) {
    // Handle invalid expressions
    return 'Error';
  }
};

operand_btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (output.value == "0" || is_operator) {
      output.value = e.target.value;
      is_operator = false;
    } else if (output.value.includes(".") && e.target.value == ".") {
      // Prevent multiple decimal points in a single number
      return;
    } else {
      output.value += e.target.value;
    }
  });
});

operator_btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.currentTarget.classList.add("active");

    switch (e.target.value) {
      case "%":
        output.value = parseFloat(output.value) / 100;
        break;
      case "invert":
        output.value = parseFloat(output.value) * -1;
        break;
      case "=":
        equation.push(output.value);
        const result = safeEval(equation.join(""));
        output.value = result === 'Error' ? 'Error' : result;
        equation = [];
        break;
      default:
        let last_item = equation[equation.length - 1];
        if (["/", "*", "+", "-"].includes(last_item) && is_operator) {
          equation.pop();
          equation.push(e.target.value);
        } else {
          equation.push(output.value);
          equation.push(e.target.value);
        }
        is_operator = true;
        break;
    }
  });
});

// Clear the "active" class from operator buttons after an action
const clearActiveClasses = () => {
  operator_btns.forEach(btn => btn.classList.remove("active"));
};

operand_btns.forEach((btn) => {
  btn.addEventListener("click", clearActiveClasses);
});

operator_btns.forEach((btn) => {
  btn.addEventListener("click", clearActiveClasses);
});
