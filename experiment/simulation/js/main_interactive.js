// Global variables for interactive mode
let currentGrammar = cnf1; // Start with first grammar
let currentInputString = "aabbab"; // Default input
let currentStep = 0;
let totalSteps = 0;
let cykTable = {};
let interactiveMode = true; // Always in interactive mode
let currentCellRow = 0;
let currentCellCol = 0;
let correctAnswers = new Set(); // Track correct answers for current cell
let allSymbols = []; // All possible symbols from grammar
let processedCells = new Set(); // Track cells that have been processed (including empty ones)
let stepHistory = []; // Track history of steps for undo functionality

// Initialize the application
function init() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize the CYK algorithm
    initializeCYK();
    
    // Start interactive mode
    startInteractiveMode();
}

function setupEventListeners() {
    // Change grammar button
    document.getElementById('change_grammar').addEventListener('click', changeGrammar);
    
    // Change input button
    document.getElementById('change_input').addEventListener('click', changeInput);
    
    // Auto step button
    document.getElementById('auto_step').addEventListener('click', autoStep);
    
    // Previous step button
    document.getElementById('previous_step').addEventListener('click', previousStep);
    
    // Show hint button
    document.getElementById('show_hint').addEventListener('click', showHint);
    
    // Reset button
    document.getElementById('reset_algorithm').addEventListener('click', resetAlgorithm);
}

function changeGrammar() {
    // Cycle through available grammars
    if (currentGrammar === cnf1) {
        currentGrammar = cnf2;
    } else if (currentGrammar === cnf2) {
        currentGrammar = cnf3;
    } else {
        currentGrammar = cnf1;
    }
    
    updateGrammarDisplay();
    resetAlgorithm();
}

function changeInput() {
    const inputs = ["aab", "aabbab", "baaba", "aaabbb", "ab", "baa"];
    const currentIndex = inputs.indexOf(currentInputString);
    const nextIndex = (currentIndex + 1) % inputs.length;
    currentInputString = inputs[nextIndex];
    
    updateInputDisplay();
    resetAlgorithm();
}

function updateGrammarDisplay() {
    // Update grammar description
    document.getElementById('CNF_description_container').innerHTML = 
        `<div class="input-string">${currentGrammar.description}</div>`;
    
    // Update grammar rules display in right panel
    const rulesContainer = document.getElementById('CNF_transition_container');
    rulesContainer.innerHTML = '';
    
    currentGrammar.transitions.forEach(rule => {
        const ruleElement = document.createElement('div');
        ruleElement.className = 'production-rule';
        ruleElement.textContent = rule;
        rulesContainer.appendChild(ruleElement);
    });
    
    // Update all possible symbols
    allSymbols = extractAllSymbols(currentGrammar);
}

function updateInputDisplay() {
    document.getElementById('input_container').innerHTML = 
        `<div class="input-string">${currentInputString}</div>`;
}

function extractAllSymbols(grammar) {
    const symbols = new Set();
    
    // Extract all non-terminals and terminals from transitions
    grammar.transitions.forEach(rule => {
        const [left, right] = rule.split(' → ');
        symbols.add(left.trim());
        
        // Split right side by | for multiple productions
        const productions = right.split('|');
        productions.forEach(prod => {
            const trimmed = prod.trim();
            // If it's a single character, it might be a terminal
            if (trimmed.length === 1 && /[a-z]/.test(trimmed)) {
                // This is a terminal, don't add to symbol choices
            } else {
                // For productions like "AB", add each character as potential symbol
                for (let char of trimmed) {
                    if (/[A-Z]/.test(char)) {
                        symbols.add(char);
                    }
                }
            }
        });
    });
    
    return Array.from(symbols).sort();
}

function initializeCYK() {
    const n = currentInputString.length;
    
    // Initialize CYK table
    cykTable = {};
    for (let i = 0; i < n; i++) {
        cykTable[i] = {};
        for (let j = 0; j < n; j++) {
            cykTable[i][j] = new Set();
        }
    }
    
    // Calculate total steps and reset current step
    totalSteps = (n * (n + 1)) / 2; // Total cells in upper triangular matrix
    currentStep = 0;
    currentCellRow = 0;
    currentCellCol = 0;
    processedCells.clear(); // Clear processed cells tracking
    stepHistory.length = 0; // Clear step history
}

function startInteractiveMode() {
    // Update displays
    updateGrammarDisplay();
    updateInputDisplay();
    
    // Display the CYK table
    displayCYKTable(cykTable, currentInputString, currentGrammar, 0, processedCells);
    
    // Start with first cell
    showNextQuestion();
}

function showNextQuestion() {
    const n = currentInputString.length;
    
    // Find next unprocessed cell
    let found = false;
    for (let length = 1; length <= n && !found; length++) {
        for (let i = 0; i <= n - length && !found; i++) {
            const j = i + length - 1;
            const cellKey = `${i}_${j}`;
            if (!processedCells.has(cellKey)) {
                currentCellRow = i;
                currentCellCol = j;
                found = true;
            }
        }
    }
    
    if (!found) {
        // Algorithm complete
        showCompletionMessage();
        return;
    }
    
    // Calculate correct answer for this cell
    correctAnswers = calculateCorrectAnswer(currentCellRow, currentCellCol);
    
    // Show the question
    displayQuestion();
    
    // Highlight current cell in the table
    highlightCurrentCell();
}

function calculateCorrectAnswer(i, j) {
    const correctSymbols = new Set();
    const substring = currentInputString.substring(i, j + 1);
    
    if (i === j) {
        // Base case: single character
        const char = currentInputString[i];
        currentGrammar.transitions.forEach(rule => {
            const [left, right] = rule.split(' → ');
            const productions = right.split('|');
            productions.forEach(prod => {
                if (prod.trim() === char) {
                    correctSymbols.add(left.trim());
                }
            });
        });
    } else {
        // Recursive case: combinations
        for (let k = i; k < j; k++) {
            const leftSet = cykTable[i][k];
            const rightSet = cykTable[k + 1][j];
            
            for (let leftSymbol of leftSet) {
                for (let rightSymbol of rightSet) {
                    const combination = leftSymbol + rightSymbol;
                    currentGrammar.transitions.forEach(rule => {
                        const [left, right] = rule.split(' → ');
                        const productions = right.split('|');
                        productions.forEach(prod => {
                            if (prod.trim() === combination) {
                                correctSymbols.add(left.trim());
                            }
                        });
                    });
                }
            }
        }
    }
    
    return correctSymbols;
}

function displayQuestion() {
    const substring = currentInputString.substring(currentCellRow, currentCellCol + 1);
    const cellPos = `(${currentCellRow + 1}, ${currentCellCol + 1})`;
    
    // Update question text
    document.getElementById('cell_question_text').textContent = 
        `Fill cell ${cellPos} for substring "${substring}"`;
    
    // Create symbol choice buttons
    const choicesContainer = document.getElementById('symbol_choices');
    choicesContainer.innerHTML = '';
    
    // Add option for "nothing" (empty set)
    const emptyBtn = document.createElement('button');
    emptyBtn.className = 'symbol-choice-btn';
    emptyBtn.textContent = '∅';
    emptyBtn.title = 'Nothing can generate this substring';
    emptyBtn.addEventListener('click', () => handleSymbolChoice('∅'));
    choicesContainer.appendChild(emptyBtn);
    
    // Add all possible symbols as choices
    allSymbols.forEach(symbol => {
        const btn = document.createElement('button');
        btn.className = 'symbol-choice-btn';
        btn.textContent = symbol;
        btn.addEventListener('click', () => handleSymbolChoice(symbol));
        choicesContainer.appendChild(btn);
    });
    
    // Show the question container and hide default instructions
    document.getElementById('interactive_question_container').style.display = 'block';
    document.getElementById('default_instructions').style.display = 'none';
}

function handleSymbolChoice(symbol) {
    const isCorrect = symbol === '∅' ? 
        correctAnswers.size === 0 : 
        correctAnswers.has(symbol);
    
    if (isCorrect) {
        // Save current state before making changes
        saveCurrentState();
        
        if (symbol !== '∅') {
            cykTable[currentCellRow][currentCellCol].add(symbol);
        }
        
        showCorrectFeedback(symbol);
        
        // Check if we need more symbols for this cell
        if (symbol === '∅' || correctAnswers.size === cykTable[currentCellRow][currentCellCol].size) {
            // Mark cell as processed
            const cellKey = `${currentCellRow}_${currentCellCol}`;
            processedCells.add(cellKey);
            
            // Move to next cell after a short delay
            setTimeout(() => {
                currentStep++;
                displayCYKTable(cykTable, currentInputString, currentGrammar, currentStep, processedCells);
                showNextQuestion();
            }, 2000);
        } else {
            // Remove the chosen symbol from choices and continue
            const btn = event.target;
            btn.remove();
            correctAnswers.delete(symbol);
        }
    } else {
        showIncorrectFeedback();
    }
}

function showCorrectFeedback(symbol) {
    const reason = getReasonForCorrectness(symbol, currentCellRow, currentCellCol);
    
    Swal.fire({
        title: 'Correct! 🎉',
        html: reason,
        icon: 'success',
        confirmButtonText: 'Continue',
        confirmButtonColor: '#10B981'
    });
}

function showIncorrectFeedback() {
    Swal.fire({
        title: 'Try Again! 🤔',
        text: 'That symbol cannot generate this substring. Think about which grammar rules apply.',
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#EF4444'
    });
}

function getReasonForCorrectness(symbol, i, j) {
    const substring = currentInputString.substring(i, j + 1);
    
    if (symbol === '∅') {
        return `<p><strong>Correct!</strong> No non-terminal can generate the substring "${substring}".</p>
                <p>This means the substring cannot be derived from the grammar rules.</p>`;
    }
    
    if (i === j) {
        // Terminal case
        const char = currentInputString[i];
        return `<p><strong>Correct!</strong> The non-terminal <strong>${symbol}</strong> can generate "${char}".</p>
                <p>This is because there's a production rule: <strong>${symbol} → ${char}</strong></p>`;
    } else {
        // Non-terminal case
        return `<p><strong>Correct!</strong> The non-terminal <strong>${symbol}</strong> can generate "${substring}".</p>
                <p>This is because <strong>${symbol}</strong> can be derived by combining symbols from smaller substrings according to the grammar rules.</p>`;
    }
}

function autoStep() {
    // Save current state before making changes
    saveCurrentState();
    
    // Automatically fill the current cell with correct answer
    if (correctAnswers.size > 0) {
        correctAnswers.forEach(symbol => {
            cykTable[currentCellRow][currentCellCol].add(symbol);
        });
    }
    // If correctAnswers.size === 0, the cell remains empty (phi case)
    
    // Mark cell as processed
    const cellKey = `${currentCellRow}_${currentCellCol}`;
    processedCells.add(cellKey);
    
    currentStep++;
    displayCYKTable(cykTable, currentInputString, currentGrammar, currentStep, processedCells);
    
    setTimeout(() => {
        showNextQuestion();
    }, 1000);
}

function showHint() {
    const substring = currentInputString.substring(currentCellRow, currentCellCol + 1);
    let hintText = '';
    
    if (currentCellRow === currentCellCol) {
        // Terminal case
        const char = currentInputString[currentCellRow];
        hintText = `💡 <strong>Hint:</strong> Look for grammar rules that have "${char}" on the right side (like X → ${char}).`;
    } else {
        // Non-terminal case
        hintText = `💡 <strong>Hint:</strong> For substring "${substring}", consider how to split it into smaller parts that have already been filled in the table below.`;
    }
    
    Swal.fire({
        title: 'Hint 💡',
        html: hintText,
        icon: 'info',
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#3B82F6'
    });
}

function highlightCurrentCell() {
    // Remove previous highlighting
    document.querySelectorAll('.current-cell').forEach(cell => {
        cell.classList.remove('current-cell');
    });
    
    // Add highlighting to current cell
    const cellId = `cell_${currentCellRow}_${currentCellCol}`;
    const cellElement = document.getElementById(cellId);
    if (cellElement) {
        cellElement.classList.add('current-cell');
    }
}

function showCompletionMessage() {
    // Hide question container and show default instructions
    document.getElementById('interactive_question_container').style.display = 'none';
    document.getElementById('default_instructions').style.display = 'block';
    
    // Check if string is accepted
    const startSymbol = currentGrammar.start || 'S';
    const isAccepted = cykTable[0][currentInputString.length - 1].has(startSymbol);
    
    const title = isAccepted ? 'String Accepted! 🎉' : 'String Rejected! ❌';
    const message = isAccepted ? 
        `The string "${currentInputString}" is accepted by the grammar because the start symbol ${startSymbol} appears in the top-right cell.` :
        `The string "${currentInputString}" is rejected by the grammar because the start symbol ${startSymbol} does not appear in the top-right cell.`;
    
    Swal.fire({
        title: title,
        text: message,
        icon: isAccepted ? 'success' : 'error',
        confirmButtonText: 'Try Another',
        confirmButtonColor: isAccepted ? '#10B981' : '#EF4444'
    }).then(() => {
        resetAlgorithm();
    });
}

function resetAlgorithm() {
    // Hide question container and show default instructions
    document.getElementById('interactive_question_container').style.display = 'none';
    document.getElementById('default_instructions').style.display = 'block';
    
    // Reset state
    currentStep = 0;
    currentCellRow = 0;
    currentCellCol = 0;
    processedCells.clear(); // Clear processed cells tracking
    stepHistory.length = 0; // Clear step history
    
    // Reinitialize
    initializeCYK();
    startInteractiveMode();
}

// Function to save current state for history
function saveCurrentState() {
    const state = {
        step: currentStep,
        cellRow: currentCellRow,
        cellCol: currentCellCol,
        table: deepCopyTable(cykTable),
        processedCells: new Set(processedCells)
    };
    stepHistory.push(state);
}

// Function to create a deep copy of the CYK table
function deepCopyTable(table) {
    const copy = {};
    for (let i in table) {
        copy[i] = {};
        for (let j in table[i]) {
            copy[i][j] = new Set(table[i][j]);
        }
    }
    return copy;
}

// Function to restore state from history
function restoreState(state) {
    currentStep = state.step;
    currentCellRow = state.cellRow;
    currentCellCol = state.cellCol;
    cykTable = deepCopyTable(state.table);
    processedCells = new Set(state.processedCells);
}

function previousStep() {
    if (stepHistory.length === 0) {
        Swal.fire({
            title: 'No Previous Steps',
            text: 'You are already at the beginning of the algorithm.',
            icon: 'info',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3B82F6'
        });
        return;
    }
    
    // Restore the previous state
    const previousState = stepHistory.pop();
    restoreState(previousState);
    
    // Update display
    displayCYKTable(cykTable, currentInputString, currentGrammar, currentStep, processedCells);
    
    // Hide question container if we're back to the beginning
    if (stepHistory.length === 0) {
        document.getElementById('interactive_question_container').style.display = 'none';
        document.getElementById('default_instructions').style.display = 'block';
    } else {
        // Calculate and show the current question
        correctAnswers = calculateCorrectAnswer(currentCellRow, currentCellCol);
        displayQuestion();
        highlightCurrentCell();
    }
}

// Start the application when page loads
document.addEventListener('DOMContentLoaded', init);
