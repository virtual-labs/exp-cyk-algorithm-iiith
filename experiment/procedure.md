### Prerequisites

Before starting the experiment, ensure you have:
1. A modern web browser (Chrome, Firefox, or Safari)
2. Basic understanding of context-free grammars
3. Knowledge of Chomsky Normal Form

### Steps to Perform the Experiment

#### 1. Starting the Experiment

1. Open the experiment in your web browser
2. Read the introduction and objectives
3. Familiarize yourself with the interface

#### 2. Input Grammar

1. Enter a context-free grammar in Chomsky Normal Form
2. The grammar should follow the format:
   ```
   S → AB | BC
   A → BA | a
   B → CC | b
   C → AB | a
   ```
3. Click "Validate Grammar" to check if the grammar is in CNF

#### 3. Input String

1. Enter the string you want to test
2. The string should only contain terminal symbols
3. Click "Validate String" to check the input

#### 4. Running the Algorithm

1. Click "Start Algorithm" to begin the CYK parsing
2. Observe the step-by-step construction of the CYK table
3. For each step:
   - Note the current cell being filled
   - Understand the splitting of substrings
   - See which production rules are being applied
   - Observe the non-terminals being added to the cell

#### 5. Analyzing Results

1. After the algorithm completes:
   - Check if the start symbol S is in the top-right cell
   - If present, the string is accepted by the grammar
   - If not present, the string is rejected
2. Review the complete CYK table
3. Understand the derivation process

#### 6. Experimentation

1. Try different input strings
2. Modify the grammar and observe the changes
3. Test edge cases:
   - Empty string
   - Single character strings
   - Long strings
   - Invalid inputs

#### 7. Understanding the Visualization

1. The CYK table is displayed as a triangular matrix
2. Each cell shows:
   - The substring being considered
   - The non-terminals that can generate it
   - The production rules used
3. The color coding indicates:
   - Current cell being processed
   - Accepted derivations
   - Rejected paths

#### 8. Recording Observations

1. Note down the results for each test case
2. Document any patterns or insights
3. Compare the theoretical complexity with actual performance

### Tips for Better Understanding

1. Start with simple grammars and short strings
2. Use the step-by-step mode to understand the algorithm
3. Try to predict the next step before proceeding
4. Experiment with different grammar structures
5. Compare results with manual calculations

### Common Mistakes to Avoid

1. Using grammars not in Chomsky Normal Form
2. Entering invalid terminal symbols
3. Missing production rules
4. Incorrect string format
5. Not considering all possible splits