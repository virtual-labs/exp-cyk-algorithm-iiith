/*****
 * File containing main logic to display CNF and runs of CYK algorithm
 *
 */

width = 500;
height = 200;
radius = 25;

cnf = [cnf1, cnf2, cnf3];
cnfIndex = 0;

inputIndex = 0;
inputPointer = -1;
stepCounter = 0;
maxStep = -1;

nodes = [];
edges = [];

textColor = "black";

function refreshCanvas() {
  clearElem(canvas);

  CNFDescriptionContainer = document.getElementById("CNF_description_container");
  clearElem(CNFDescriptionContainer);
  span = newElement("font", [["id", "CNF_description"], ["color", textColor]]);
  text = document.createTextNode(cnf[cnfIndex]["description"]);
  span.appendChild(text);
  CNFDescriptionContainer.appendChild(text);

  displayCanvas(canvas, cnf[cnfIndex], inputIndex, maxStep, stepCounter);
}

function resetInput() {
  inputIndex = 0;
  inputPointer = -1;
  stepCounter = 0;

  refreshInput();
}

function refreshInput() {
  inputContainer = document.getElementById("input_container");
  clearElem(inputContainer);
  for (let i = 0; i < cnf[cnfIndex]["input"][inputIndex]["string"].length; ++i) {
    inputCharacter = cnf[cnfIndex]["input"][inputIndex]["string"][i];
    text = document.createTextNode(inputCharacter);
    inputContainer.appendChild(text);
  }
}

function resetStack() {
  stack = document.getElementById("stack_list");
  clearElem(stack);
}

function addToStack(str) {
  stack = document.getElementById("stack_list");
  listElem = newElement("li", []);
  textNode = document.createTextNode(str);
  listElem.appendChild(textNode);
  if (stack.firstChild) {
    stack.firstChild.style.fontWeight = "normal";
    stack.insertBefore(listElem, stack.firstChild);
  } else {
    stack.appendChild(listElem);
  }
  stack.firstChild.style.fontWeight = "bold";
}

function removeFromStack() {
  stack = document.getElementById("stack_list");
  if (stack.firstChild) {
    stack.removeChild(stack.firstChild);

    if (stack.firstChild) {
      stack.firstChild.style.fontWeight = "bold";
    }
  }
}

function displayCNFTransitions() {
  CNFTransitionContainer = document.getElementById("CNF_transition_container");
  clearElem(CNFTransitionContainer);

  cnf[cnfIndex]["transitions"].forEach(function (transition, idx) {
    text = transition["from"] + " -> ";
    transition["to"].forEach(function (destination, index, arr) {
      text = text + destination;
      if (index != arr.length - 1) {
        text = text + " | ";
      }
    });

    transitionDiv = newElement("div", [["id", "transition_" + idx], ["style", "font-weight: bold;"]]); // Made transitions bold
    transitionDiv.appendChild(document.createTextNode(text));
    CNFTransitionContainer.appendChild(transitionDiv);
  });
}

function calculateMaxStep() {
  inputLength = cnf[cnfIndex]["input"][inputIndex]["string"].length;
  maxStep = (inputLength * (inputLength + 1)) / 2;
}

window.addEventListener("load", function (e) {
  canvas = document.getElementById("canvas1");

  refreshInput();
  resetStack();
  calculateMaxStep();
  displayCNFTransitions();
  refreshCanvas();

  // Event listener for changing CNF
  changeCNF = document.getElementById("change_cnf");
  changeCNF.addEventListener("click", function (e) {
    clearElem(canvas);
    cnfIndex = (cnfIndex + 1) % cnf.length;
    resetInput();
    refreshCanvas();
    resetStack();
    calculateMaxStep();
    displayCNFTransitions();
  });

  // Event listener for changing input
  changeInput = document.getElementById("change_input");
  changeInput.addEventListener("click", function (e) {
    inputIndex = (inputIndex + 1) % cnf[cnfIndex]["input"].length;
    inputPointer = -1;
    stepCounter = 0;
    refreshInput();
    refreshCanvas();
    resetStack();
    calculateMaxStep();
  });

  // Event listener for next step
  next = document.getElementById("next");
  next.addEventListener("click", function (e) {
    if (stepCounter < maxStep) {
      ++stepCounter;
      refreshInput();
      refreshCanvas();

      if (stepCounter != 0) {
        tempCounter = 0;
        tempFlag = 0;
        currX = 0;
        currY = 0;
        for (i = 0; i < cnf[cnfIndex]["input"][inputIndex]["string"].length; ++i) {
          for (j = 0; j < cnf[cnfIndex]["input"][inputIndex]["string"].length - i; ++j) {
            currX = j + i + 1;
            currY = j;
            ++tempCounter;
            if (tempCounter >= stepCounter) {
              tempFlag = 1;
              break;
            }
          }
          if (tempFlag == 1) {
            break;
          }
        }

        str = "Look at cells to fill (" + currX + "," + currY + ")";
        addToStack(str);
      }
    }

    // Check if input is accepted at the final step
    if (stepCounter === maxStep) {
      let inputLength = cnf[cnfIndex]["input"][inputIndex]["string"].length;
      let finalCell = cnf[cnfIndex]["input"][inputIndex]["matrix"][inputLength - 1][0]; // Top-right cell

      let computationStatus = "Rejected";
      if (finalCell.includes("S")) { // Assuming "S" is the start symbol
        computationStatus = "Accepted";
      }

      swal({
        // title: "Computation Complete",
        text: "Input string was " + computationStatus + " by the CNF.",
        // icon: computationStatus === "Accepted" ? "success" : "error",
        // button: "OK",
      });
    }
  });

  // Event listener for previous step
  prev = document.getElementById("prev");
  prev.addEventListener("click", function (e) {
    if (stepCounter > 0) {
      --stepCounter;
      refreshInput();
      refreshCanvas();
      removeFromStack();
    }
  });

  // Mobile view toggles
  controlContainerDisplay = 0;
  instructionContainerDisplay = 0;
  traceContainerDisplay = 0;

  controlsToggle = document.getElementById("dfa-controls-toggle");
  controlsToggle.addEventListener("click", function (e) {
    controlContainer = document.getElementById("control-container");
    controlContainer.classList.toggle("control-container-show");
    controlContainer.classList.toggle("control-container-hide");
    controlContainerDisplay = 1 - controlContainerDisplay;
  });

  instructionToggle = document.getElementById("dfa-instructions-toggle");
  instructionToggle.addEventListener("click", function (e) {
    instructionContainer = document.getElementById("instruction-container");
    instructionContainer.classList.toggle("instruction-container-show");
    instructionContainer.classList.toggle("instruction-container-hide");
    instructionContainerDisplay = 1 - instructionContainerDisplay;
  });

  traceToggle = document.getElementById("dfa-stack-trace-toggle");
  traceToggle.addEventListener("click", function (e) {
    traceContainer = document.getElementById("trace-container");
    traceContainer.classList.toggle("trace-container-show");
    traceContainer.classList.toggle("trace-container-hide");
    traceContainerDisplay = 1 - traceContainerDisplay;
  });
});
