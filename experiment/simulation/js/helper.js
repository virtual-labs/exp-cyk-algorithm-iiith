/****
 * File containing helper functions
 *
 */

function newElementNS(tag, attr){
 elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
 attr.forEach(function(item){
   elem.setAttribute(item[0], item[1]);
 });
 return elem;
}

function newElement(tag, attr){
 elem = document.createElement(tag);
 attr.forEach(function(item){
   elem.setAttribute(item[0], item[1]);
 });
 return elem;
}

function clearElem(elem){
  while(elem.firstChild){
    elem.removeChild(elem.lastChild);
  }
}

// Global variables width, height and radius need to be set before invoking this function
function displayCanvas(canvas, cnf, inputIndex, maxStep, stepCounter){
  
  console.log("inside display", stepCounter, maxStep);

  originX = 20;
  originY = 20;
  color = "black";
  stroke_width = "1px";
  fillColor = "#ffe4c4";
  cellWidth = 80;
  cellHeight = 50;

  for(i = 0;i < cnf["input"][inputIndex]["string"].length;++i){
    for(j = 0;j < i+1;++j){

      // console.log(i, j);

      x = originX + cellWidth*j;
      y = originY + cellHeight*i;

      // Display cells
      cell = newElementNS('rect', [
        ["id", "push_down_stack_item_"+i+"_"+j],
        ["x", x],
        ["y", y],
        ["width", cellWidth],
        ["height", cellHeight],
        ["stroke", color],
        ["fill", fillColor],
        ["stroke-width", stroke_width]
      ]);

      canvas.appendChild(cell);

      // Display row labels
      if(j == 0){
        text = newElementNS('text', [
          ["id", "row_"+i],
          ["x", x-15],
          ["y", y+cellHeight/2],
          ["fill", color],
          ["font-weight", "bold"]
        ]);

        text.appendChild(document.createTextNode(i+1));

        canvas.appendChild(text);
      }

      // Display column labels
      if(j == i){
        text = newElementNS('text', [
          ["id", "row_"+i],
          ["x", x+cellWidth/2],
          ["y", y-5],
          ["fill", color],
          ["font-weight", "bold"]
        ]);

        text.appendChild(document.createTextNode(i));

        canvas.appendChild(text);
      }
    }
  }

  // Fill cell values
  step = 0;
  flag = 0;

  for(i = 0;i<cnf["input"][inputIndex]["string"].length;++i){
    for(j = 0;j<cnf["input"][inputIndex]["string"].length - i;++j){
      console.log("here", j+i, j, "matrix", i, j);
      // Fill cell values only untill current step
      if(step == stepCounter){
        flag = 1;
        break;
      }
      step = step + 1;

      x = originX + cellWidth*j;
      y = originY + cellHeight*(j+i);

      text = newElementNS('text', [
        ["id", "text_"+i+"_"+j],
        ["x", x+cellWidth/4],
        ["y", y+cellHeight/2],
        ["fill", color],
        ["font-weight", "bold"]
      ]);

      text.appendChild(document.createTextNode( cnf["input"][inputIndex]["matrix"][j+i][j] ));

      canvas.appendChild(text);

    }
    if(flag == 1){
      break;
    }
  }

  // for(i = 0;i < cnf["input"][inputIndex]["string"].length;++i){
  //   for(j = 0;j < i+1;++j){
  //     // Fill cell values only until current step
  //     if(step == stepCounter){
  //       flag = 1;
  //       break;
  //     }
      
  //   }
  //   if(flag == 1){
  //     break;
  //   }
  // }

}