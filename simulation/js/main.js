/*****
 * File containing main logic to display CNF and runs of CYK algorithm
 *
 */

width = 500;
height = 200;
radius = 25;

cnf = [cnf1, cnf2, cnf3];
cnfIndex = 0

inputIndex = 0
inputPointer = -1
stepCounter = 0;
maxStep = -1;

nodes = []
edges = []

textColor = "black";

function refreshCanvas(){
  clearElem(canvas);

  curr = ""
  // if(inputPointer != -1){
  //   console.log("before", inputPointer, curr);
  //   console.log(dfa[dfaIndex]["input"]);
  //   curr = dfa[dfaIndex]["input"][inputIndex]["states"][inputPointer];
  //   console.log("after", inputPointer, curr);
  // }

  CNFDescriptionContainer = document.getElementById("CNF_description_container");
  clearElem(CNFDescriptionContainer);
  span = newElement("font", [["id", "CNF_description"], ["color", textColor]]);
  text = document.createTextNode(cnf[cnfIndex]["description"]);
  span.appendChild(text);
  CNFDescriptionContainer.appendChild(text);

  res = displayCanvas(canvas, cnf[cnfIndex], inputIndex, maxStep, stepCounter);

  // nodes = res[0]
  // edges = res[1]
}

function resetInput(){
  inputIndex = 0;
  inputPointer = -1;
  stepCounter = 0;

  refreshInput();
}

function refreshInput(){
  inputContainer = document.getElementById("input_container");
  clearElem(inputContainer);
  for(let i=0;i<cnf[cnfIndex]["input"][inputIndex]["string"].length;++i){
    // if(inputPointer == i){
    //   textColor = "red";
    // }
    // span = newElement("font", [["id", "text_"+i], ["color", "black"]]);
    inputCharacter = cnf[cnfIndex]["input"][inputIndex]["string"][i];
    if(i == cnf[cnfIndex]["input"][inputIndex]["string"].length - 1){
      // inputCharacter = inputCharacter + "|";
    }
    text = document.createTextNode(inputCharacter);
    // span.appendChild(text);
    inputContainer.appendChild(text);
  }
}

function resetStack(){
  stack = document.getElementById("stack_list");
  clearElem(stack);
}

function addToStack(str){
  stack = document.getElementById("stack_list");
  listElem = newElement("li", []);
  textNode = document.createTextNode(str);
  listElem.appendChild(textNode)
  stack.appendChild(listElem);

}

function removeFromStack(){
  stack = document.getElementById("stack_list");
  if(stack.firstChild){
    stack.removeChild(stack.lastChild);
  }
}

function displayCNFTransitions(){
  CNFTransitionContainer = document.getElementById("CNF_transition_container");

  clearElem(CNFTransitionContainer);

  cnf[cnfIndex]["transitions"].forEach(function(transition, idx){
      // span = newElement("font", [["id", "CNF_description"], ["color", textColor]]);
      // text = document.createTextNode(cnf[cnfIndex]["description"]);
      // span.appendChild(text);
      text = transition["from"]+" -> ";
      transition["to"].forEach(function(destination, index, arr){
        text = text + destination;
        if(index != arr.length - 1){
          text = text + " | ";
        }
      });
      transitionText = document.createTextNode(text);
      transitionDiv = newElement("div", [["id", "transition_"+idx]]);
      transitionDiv.appendChild(transitionText);
      CNFTransitionContainer.appendChild(transitionDiv);
    });
}

function calculateMaxStep(){
  inputLength = cnf[cnfIndex]["input"][inputIndex]["string"].length;
  maxStep = inputLength*(inputLength+1)/2;
  // console.log(maxStep);
}

window.addEventListener('load', function(e){
  canvas = document.getElementById("canvas1");

  refreshInput();
  resetStack();
  calculateMaxStep();
  displayCNFTransitions();
  refreshCanvas();

  // Event listener for changing CNF
  changeCNF = document.getElementById("change_cnf");
  changeCNF.addEventListener("click", function(e){
    clearElem(canvas);
    cnfIndex = cnfIndex + 1;
    if(cnfIndex >= cnf.length){
      cnfIndex = 0;
    }
    resetInput();
    refreshCanvas();
    resetStack();
    calculateMaxStep();
    displayCNFTransitions();
  });

  // Event listener for changing input
  changeInput = document.getElementById("change_input");
  changeInput.addEventListener("click", function(e){
    inputIndex = inputIndex + 1;
    if(inputIndex >= cnf[cnfIndex]["input"].length){
      inputIndex = 0;
    }
    inputPointer = -1;
    stepCounter = 0;
    refreshInput();
    refreshCanvas();
    resetStack();
    calculateMaxStep();
  });

  // Event listener for next
  next = document.getElementById("next");
  next.addEventListener("click", function(e){
    if(stepCounter < maxStep){
      ++stepCounter;
      refreshInput();
      refreshCanvas();

      if(stepCounter != 0){
        tempCounter = 0;
        tempFlag = 0;
        currX = 0;
        currY = 0;
        for(i = 0;i<cnf[cnfIndex]["input"][inputIndex]["string"].length;++i){
          for(j = 0;j<cnf[cnfIndex]["input"][inputIndex]["string"].length - i;++j){

            currX = j+i+1;
            currY = j;

            ++tempCounter;
            if(tempCounter >= stepCounter){

              console.log(i, j, currX, currY);

              tempFlag = 1;
              break;
            }
            
          }
          if(tempFlag == 1){
            break;
          }
        }

        str = "Look at cells to fill ("+currX+","+currY+")";

        addToStack(str);
      }

      
    }
  });
  // next.addEventListener("click", function(e){
  //   if(inputPointer != cnf[cnfIndex]["input"][inputIndex]["string"].length){
  //     inputPointer = inputPointer + 1;
  //     refreshInput();
  //     refreshCanvas();
  //     str = "";
  //     if(inputPointer!=0){
  //       str += "read character "+cnf[cnfIndex]["input"][inputIndex]["string"][inputPointer-1];
  //       str += " and moved from state "+cnf[cnfIndex]["input"][inputIndex]["states"][inputPointer-1];
  //       str += " to state "+cnf[cnfIndex]["input"][inputIndex]["states"][inputPointer];
  //     }
  //     if(inputPointer==0){
  //       str += "moved to start state";
  //     }
  //     addToStack(str);

  //     // Display popup at end
  //     if(inputPointer==cnf[cnfIndex]["input"][inputIndex]["string"].length){

  //       computationStatus = "Rejected";

  //       for(itr=0;itr<cnf[cnfIndex]["vertices"].length;++itr){
  //         if(cnf[cnfIndex]["vertices"][itr]["text"] == curr){
  //           if(cnf[cnfIndex]["vertices"][itr]["type"] == "accept"){
  //             computationStatus = "Accepted";
  //           }
  //           break;
  //         }
  //       }
  //       swal("Input string was "+computationStatus);
  //     }
  //   }
  // });

  // Event listener for prev
  prev = document.getElementById("prev");
  prev.addEventListener("click", function(e){
    if(stepCounter > 0){
      --stepCounter;
      refreshInput();
      refreshCanvas();
      removeFromStack();
    }
    // if(inputPointer != -1){
    //   inputPointer = inputPointer - 1;
    //   refreshInput();
    //   refreshCanvas();
    //   removeFromStack();
    // }
  });

  controlContainerDisplay = 0;
  instructionContainerDisplay = 0;
  traceContainerDisplay = 0;

  controlsToggle = document.getElementById("dfa-controls-toggle");
  controlsToggle.addEventListener("click", function(e){
    
    controlContainer = document.getElementById("control-container");
    
    if(controlContainerDisplay == 0){
      controlContainer.classList.remove("control-container-hide");
      controlContainer.classList.add("control-container-show");
      controlContainerDisplay = 1;
    }else{
      controlContainer.classList.remove("control-container-show");
      controlContainer.classList.add("control-container-hide");
      controlContainerDisplay = 0;
    }

  });

  instructionToggle = document.getElementById("dfa-instructions-toggle");
  instructionToggle.addEventListener("click", function(e){

    instructionContainer = document.getElementById("instruction-container");

    if(instructionContainerDisplay == 0){
      instructionContainer.classList.remove("instruction-container-hide");
      instructionContainer.classList.add("instruction-container-show");
      instructionContainerDisplay = 1;
    }else{
      instructionContainer.classList.remove("instruction-container-show");
      instructionContainer.classList.add("instruction-container-hide");
      instructionContainerDisplay = 0;
    }

  });

  traceToggle = document.getElementById("dfa-stack-trace-toggle");
  traceToggle.addEventListener("click", function(e){
    
    traceContainer = document.getElementById("trace-container");

    if(traceContainerDisplay == 0){
      traceContainer.classList.remove("trace-container-hide");
      traceContainer.classList.add("trace-container-show");
      traceContainerDisplay = 1;
    }else{
      traceContainer.classList.remove("trace-container-show");
      traceContainer.classList.add("trace-container-hide");
      traceContainerDisplay = 0;
    }

  });

});
