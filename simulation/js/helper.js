/****
 * File containing helper functions for CYK algorithm visualization
 *
 */

function newElementNS(tag, attr) {
  const elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if (attr && Array.isArray(attr)) {
    attr.forEach(function (item) {
      elem.setAttribute(item[0], item[1]);
    });
  }
  return elem;
}

function newElement(tag, attr) {
  const elem = document.createElement(tag);
  if (attr && Array.isArray(attr)) {
    attr.forEach(function (item) {
      elem.setAttribute(item[0], item[1]);
    });
  }
  return elem;
}

function clearElem(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

// Function to display the CYK table for interactive mode
function displayCYKTable(cykTable, inputString, grammar, currentStep, processedCells = new Set()) {
  console.log("Displaying CYK table for interactive mode");
  
  const canvas = document.getElementById('cyk_table_svg');
  clearElem(canvas);

  const originX = 50;
  const originY = 20;
  const color = "black";
  const stroke_width = "1px";
  const fillColor = "#ffe4c4";
  const cellWidth = 70;
  const cellHeight = 50;
  const n = inputString.length;

  // Draw the table structure
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      const x = originX + cellWidth * j;
      const y = originY + cellHeight * i;

      // Display cells
      const cell = newElementNS('rect', [
        ["id", `cell_${j}_${i}`],
        ["x", x],
        ["y", y],
        ["width", cellWidth],
        ["height", cellHeight],
        ["stroke", color],
        ["fill", fillColor],
        ["stroke-width", stroke_width]
      ]);

      canvas.appendChild(cell);

      // Display row labels (substring length)
      if (j === 0) {
        const text = newElementNS('text', [
          ["id", `row_${i}`],
          ["x", x - 15],
          ["y", y + cellHeight / 2 + 5],
          ["fill", color],
          ["font-weight", "bold"],
          ["text-anchor", "middle"],
          ["dominant-baseline", "middle"]
        ]);

        text.appendChild(document.createTextNode(i + 1));
        canvas.appendChild(text);
      }

      // Display column labels (start position)
      if (j === i) {
        const text = newElementNS('text', [
          ["id", `col_${i}`],
          ["x", x + cellWidth / 2],
          ["y", y - 5],
          ["fill", color],
          ["font-weight", "bold"],
          ["text-anchor", "middle"],
          ["dominant-baseline", "middle"]
        ]);

        text.appendChild(document.createTextNode(j + 1));
        canvas.appendChild(text);
      }

      // Fill cell content
      const cellKey = `${j}_${i}`;
      let cellContent = '';
      
      if (cykTable[j] && cykTable[j][i] && cykTable[j][i].size > 0) {
        // Cell has symbols
        cellContent = Array.from(cykTable[j][i]).join(', ');
      } else if (processedCells.has(cellKey)) {
        // Cell has been processed but is empty (phi)
        cellContent = '∅';
      }
      
      if (cellContent) {
        const text = newElementNS('text', [
          ["id", `text_${j}_${i}`],
          ["x", x + cellWidth / 2],
          ["y", y + cellHeight / 2 + 5],
          ["fill", cellContent === '∅' ? '#666' : color],
          ["font-weight", "bold"],
          ["text-anchor", "middle"],
          ["dominant-baseline", "middle"],
          ["font-size", cellContent === '∅' ? "16px" : "12px"]
        ]);

        text.appendChild(document.createTextNode(cellContent));
        canvas.appendChild(text);
      }
    }
  }

  // Add input string labels at the bottom
  for (let i = 0; i < n; i++) {
    const x = originX + cellWidth * i + cellWidth / 2;
    const y = originY + cellHeight * n + 20;
    
    const text = newElementNS('text', [
      ["id", `input_${i}`],
      ["x", x],
      ["y", y],
      ["fill", color],
      ["font-weight", "bold"],
      ["text-anchor", "middle"],
      ["dominant-baseline", "middle"],
      ["font-size", "14px"]
    ]);

    text.appendChild(document.createTextNode(inputString[i]));
    canvas.appendChild(text);
  }
}

// Function to get the total number of steps for a given string (original calculation)
function getTotalSteps(stringLength) {
  return (stringLength * (stringLength + 1)) / 2;
}

// Function to get step information (matching original algorithm)
function getStepInfo(cnf, inputIndex, stepCounter) {
  const stringLength = cnf["input"][inputIndex]["string"].length;
  let currentStep = 0;
  
  for (let i = 0; i < stringLength; i++) {
    for (let j = 0; j < stringLength - i; j++) {
      if (currentStep === stepCounter) {
        const currX = j + i + 1; // Row (length)
        const currY = j + 1;     // Column (start position)
        const cellContent = cnf["input"][inputIndex]["matrix"][j + i][j];
        
        return {
          step: stepCounter + 1,
          row: currX,
          col: currY,
          length: i + 1,
          start: j + 1,
          cellContent: cellContent,
          description: `Look at cells to fill (${currX},${currY})`
        };
      }
      currentStep++;
    }
  }
  
  return {
    step: stepCounter + 1,
    row: 0,
    col: 0,
    length: 0,
    start: 0,
    cellContent: "",
    description: "Algorithm complete"
  };
}
