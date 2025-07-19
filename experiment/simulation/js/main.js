/*****
 * File containing main logic to display CNF and runs of CYK algorithm
 *
 */

// Global variables (matching original)
let currentCnfIndex = 0;
let currentInputIndex = 0;
let currentStep = 0;
let maxSteps = 0;

// Stack for step tracking (like original)
let stepStack = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing CYK Algorithm Visualization...');
    
    // Set up event listeners for buttons
    document.getElementById('change_grammar').addEventListener('click', changeGrammar);
    document.getElementById('change_input').addEventListener('click', changeInput);
    document.getElementById('prev_step').addEventListener('click', prevStep);
    document.getElementById('next_step').addEventListener('click', nextStep);
    document.getElementById('show_hint').addEventListener('click', showHint);
    
    // Initialize display
    refreshDisplay();
});

// Function to refresh the entire display
function refreshDisplay() {
    const cnf = cnfGrammars[currentCnfIndex];
    const input = cnf.input[currentInputIndex];
    
    // Calculate maximum steps
    maxSteps = getTotalSteps(input.string.length);
    
    // Update grammar description
    updateGrammarDescription();
    
    // Update input string display
    updateInputDisplay();
    
    // Update grammar rules display
    updateGrammarRules();
    
    // Update CYK table
    updateCYKTable();
    
    // Update step information
    updateStepInfo();
    
    console.log('Display refreshed:', {
        grammar: currentCnfIndex,
        input: currentInputIndex,
        step: currentStep,
        maxSteps: maxSteps
    });
}

// Function to update grammar description
function updateGrammarDescription() {
    const cnf = cnfGrammars[currentCnfIndex];
    const descriptionContainer = document.getElementById('CNF_description_container');
    clearElem(descriptionContainer);
    
    const description = newElement('div', [['class', 'input-string']]);
    description.textContent = cnf.description;
    descriptionContainer.appendChild(description);
}

// Function to update input string display
function updateInputDisplay() {
    const cnf = cnfGrammars[currentCnfIndex];
    const input = cnf.input[currentInputIndex];
    const inputContainer = document.getElementById('input_container');
    clearElem(inputContainer);
    
    const inputString = newElement('div', [['class', 'input-string']]);
    inputString.textContent = input.string;
    inputContainer.appendChild(inputString);
}

// Function to update grammar rules display
function updateGrammarRules() {
    const cnf = cnfGrammars[currentCnfIndex];
    const rulesContainer = document.getElementById('CNF_transition_container');
    clearElem(rulesContainer);
    
    cnf.transitions.forEach(function(transition, idx) {
        let ruleText = transition.from + " → ";
        ruleText += transition.to.join(" | ");
        
        const ruleDiv = newElement('div', [
            ['id', 'transition_' + idx],
            ['style', 'margin-bottom: 8px; padding: 6px 10px; background: rgba(124, 58, 237, 0.08); border-radius: 6px; color: #5b21b6; font-weight: 500;']
        ]);
        ruleDiv.textContent = ruleText;
        rulesContainer.appendChild(ruleDiv);
    });
}

// Function to update CYK table (using original displayCanvas function)
function updateCYKTable() {
    const cnf = cnfGrammars[currentCnfIndex];
    const canvas = document.getElementById('cyk_table_svg');
    
    displayCYKTable(canvas, cnf, currentInputIndex, maxSteps, currentStep);
}

// Function to update step information (more educational and detailed)
function updateStepInfo() {
    const cnf = cnfGrammars[currentCnfIndex];
    const stepInfo = getStepInfo(cnf, currentInputIndex, currentStep);
    const stepContainer = document.getElementById('step_details');
    const inputString = cnf.input[currentInputIndex].string;
    
    let stepText = '';
    if (currentStep < maxSteps) {
        stepText = `<strong>Step ${stepInfo.step} of ${maxSteps}</strong><br><br>`;
        
        // Determine what substring we're working with
        const startPos = stepInfo.start - 1; // Convert to 0-based
        const length = stepInfo.length;
        const substring = inputString.substring(startPos, startPos + length);
        
        stepText += `<strong>🎯 Current Task:</strong> Fill cell (${stepInfo.row}, ${stepInfo.col})<br>`;
        stepText += `<strong>📝 Processing substring:</strong> "${substring}"<br>`;
        stepText += `<strong>📏 Length:</strong> ${length}, <strong>📍 Position:</strong> ${startPos + 1}-${startPos + length}<br><br>`;
        
        // Explain what this step means in CYK algorithm terms
        if (length === 1) {
            stepText += `<strong>🔍 Algorithm Logic:</strong><br>`;
            stepText += `• This is a <em>terminal symbol</em> (single character)<br>`;
            stepText += `• Find which non-terminals can produce "${substring}"<br>`;
            stepText += `• Look for rules like: X → ${substring}<br><br>`;
        } else {
            stepText += `<strong>🔍 Algorithm Logic:</strong><br>`;
            stepText += `• This is a <em>substring of length ${length}</em><br>`;
            stepText += `• Try all ways to split "${substring}" into two parts<br>`;
            stepText += `• For each split, combine non-terminals from smaller cells<br>`;
            stepText += `• Look for rules like: X → YZ where Y generates left part, Z generates right part<br><br>`;
            
            // Show possible splits
            stepText += `<strong>💡 Possible splits for "${substring}":</strong><br>`;
            for (let i = 1; i < length; i++) {
                const leftPart = substring.substring(0, i);
                const rightPart = substring.substring(i);
                stepText += `• "${leftPart}" + "${rightPart}"<br>`;
            }
            stepText += `<br>`;
        }
        
        // Show the result
        if (stepInfo.cellContent !== "-") {
            stepText += `<strong>✅ Result:</strong> <span style="color: #047857; font-weight: bold;">${stepInfo.cellContent}</span><br>`;
            stepText += `<em>These non-terminals can generate "${substring}"</em>`;
        } else {
            stepText += `<strong>❌ Result:</strong> <span style="color: #dc2626; font-weight: bold;">∅ (Empty)</span><br>`;
            stepText += `<em>No grammar rules can generate "${substring}"</em>`;
        }
    } else {
        // Final step - check if accepted
        const inputLength = cnf.input[currentInputIndex].string.length;
        const finalCell = cnf.input[currentInputIndex].matrix[inputLength - 1][0];
        const isAccepted = finalCell.includes("S");
        
        stepText = `<strong>🎉 CYK Algorithm Complete!</strong><br><br>`;
        stepText += `<strong>📊 Final Analysis:</strong><br>`;
        stepText += `• Input string: "${inputString}"<br>`;
        stepText += `• Top-left cell contains: ${finalCell !== "-" ? finalCell : "∅"}<br>`;
        stepText += `• Start symbol "S" ${isAccepted ? "IS" : "IS NOT"} present<br><br>`;
        
        stepText += `<strong>🏁 Final Result:</strong> `;
        if (isAccepted) {
            stepText += '<span style="color: #047857; font-weight: bold; font-size: 1.1em;">✅ ACCEPTED</span><br><br>';
            stepText += `<strong>Why Accepted?</strong><br>`;
            stepText += `The start symbol "S" appears in cell (${inputLength}, 1), meaning the entire string can be generated from the start symbol using the grammar rules.`;
        } else {
            stepText += '<span style="color: #dc2626; font-weight: bold; font-size: 1.1em;">❌ REJECTED</span><br><br>';
            stepText += `<strong>Why Rejected?</strong><br>`;
            stepText += `The start symbol "S" does NOT appear in cell (${inputLength}, 1), meaning the entire string cannot be generated from the start symbol using the grammar rules.`;
        }
    }
    
    stepContainer.innerHTML = stepText;
    
    // Update the step indicator in the right panel
    const stepIndicator = document.getElementById('current_step_info');
    if (currentStep < maxSteps) {
        stepIndicator.textContent = `Step ${currentStep + 1} of ${maxSteps}`;
        stepIndicator.className = 'current-derivation';
    } else {
        stepIndicator.textContent = 'Complete';
        stepIndicator.className = 'current-derivation left'; // Green styling for completion
    }
}

// Function to change to the next grammar
function changeGrammar() {
    currentCnfIndex = (currentCnfIndex + 1) % cnfGrammars.length;
    currentInputIndex = 0;
    currentStep = 0;
    stepStack = []; // Reset step stack
    refreshDisplay();
    
    swal({
        title: "Grammar Changed",
        text: `Now using ${cnfGrammars[currentCnfIndex].description}`,
        icon: "info",
        timer: 2000
    });
}

// Function to change to the next input string
function changeInput() {
    const cnf = cnfGrammars[currentCnfIndex];
    currentInputIndex = (currentInputIndex + 1) % cnf.input.length;
    currentStep = 0;
    stepStack = []; // Reset step stack
    refreshDisplay();
    
    swal({
        title: "Input Changed",
        text: `Now processing: "${cnf.input[currentInputIndex].string}"`,
        icon: "info",
        timer: 2000
    });
}

// Function to move to the next step (matching original logic)
function nextStep() {
    if (currentStep < maxSteps) {
        currentStep++;
        refreshDisplay();
        
        // Add to step stack like original
        if (currentStep > 0) {
            const stepInfo = getStepInfo(cnfGrammars[currentCnfIndex], currentInputIndex, currentStep - 1);
            stepStack.push(stepInfo.description);
        }
        
        // Show completion message at final step
        if (currentStep === maxSteps) {
            const cnf = cnfGrammars[currentCnfIndex];
            const inputLength = cnf.input[currentInputIndex].string.length;
            const finalCell = cnf.input[currentInputIndex].matrix[inputLength - 1][0];
            const isAccepted = finalCell.includes("S");
            
            setTimeout(() => {
                swal({
                    title: "Computation Complete",
                    text: `Input string was ${isAccepted ? 'Accepted' : 'Rejected'} by the CNF.`,
                    icon: isAccepted ? "success" : "error",
                    button: "OK"
                });
            }, 500);
        }
    }
}

// Function to move to the previous step (matching original logic)
function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        stepStack.pop(); // Remove last step from stack
        refreshDisplay();
    }
}

// Function to show hint (simplified like original)
function showHint() {
    const cnf = cnfGrammars[currentCnfIndex];
    const stepInfo = getStepInfo(cnf, currentInputIndex, currentStep);
    
    let hintText = '';
    if (currentStep < maxSteps) {
        hintText = `<strong>💡 Hint for Step ${stepInfo.step}</strong><br><br>`;
        hintText += `<strong>Current Task:</strong> ${stepInfo.description}<br>`;
        hintText += `<strong>Cell Position:</strong> (${stepInfo.row}, ${stepInfo.col})<br><br>`;
        
        if (stepInfo.length === 1) {
            hintText += `<strong>Strategy:</strong> This is filling the first row (terminals).<br>`;
            hintText += `Look for grammar rules that directly produce terminal symbols.`;
        } else {
            hintText += `<strong>Strategy:</strong> This cell represents a substring of length ${stepInfo.length}.<br>`;
            hintText += `Use the CYK algorithm: combine results from smaller substrings.`;
        }
        
        if (stepInfo.cellContent !== "-") {
            hintText += `<br><br><strong>Expected Result:</strong> ${stepInfo.cellContent}`;
        } else {
            hintText += `<br><br><strong>Expected Result:</strong> This cell will remain empty.`;
        }
    } else {
        hintText = '<strong>🎯 Algorithm Complete!</strong><br><br>';
        hintText += 'Check the top-left cell to see if the string is accepted.<br>';
        hintText += 'If it contains the start symbol "S", the string is accepted.';
    }
    
    swal({
        title: "CYK Algorithm Hint",
        content: {
            element: "div",
            attributes: {
                innerHTML: hintText
            }
        },
        button: "Got it!"
    });
}
