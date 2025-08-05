## Getting Started

1. **Open the Simulation**: Launch the interactive CYK algorithm visualization in your web browser
2. **Review the Interface**: The simulation displays a **Quick Guide** with 4 numbered steps, the main CYK table area, and grammar rules on the right panel

## Understanding the Interface

### Main Controls (Top Panel)
- **Change Grammar**: Cycles through different CNF grammars (Palindromes, Equal a's and b's, Simple Language)
- **Change Input**: Switches between predefined input strings (aab, aabbab, baaba, aaabbb, ab, baa)
- **Auto Step**: Automatically fills the current cell with the correct answer
- **Previous Step**: Go back to the previous step (undo functionality)
- **Show Hint**: Provides guidance for the current cell
- **Reset**: Restart the algorithm from the beginning

### Display Areas
- **Current Grammar**: Shows which CNF grammar is currently selected
- **Input String**: Displays the string being tested against the grammar
- **CYK Table**: Interactive triangular table where you fill in non-terminals
- **Grammar Rules**: Right panel showing all production rules for the current grammar

## Step-by-Step Procedure

### Step 1: Select Grammar and Input
1. Use **Change Grammar** to choose from available CNF grammars
2. Use **Change Input** to select a test string
3. Review the grammar rules displayed in the right panel

### Step 2: Interactive Table Filling
1. The simulation highlights the current cell to be filled
2. Read the question: "What should go in this cell?"
3. Analyze the substring and determine which non-terminals can generate it
4. Click on the correct non-terminal symbols from the choices provided
5. Receive immediate feedback on your selection

### Step 3: Algorithm Progression
For each cell, consider:
- **Single characters**: Find direct production rules (A → a, B → b)
- **Longer substrings**: Look for combinations of smaller parts using rules like S → AB

### Step 4: Complete the Table
1. Work through each cell systematically from bottom to top
2. Use **Show Hint** if you need guidance
3. Use **Auto Step** if you want to see the correct answer
4. Check if the start symbol appears in the top-right cell for string acceptance

## Interactive Features

### Cell Selection Process
- Each cell asks for the non-terminals that can generate a specific substring
- Multiple correct answers may exist for a single cell
- Visual feedback shows correct and incorrect choices

### Navigation Controls
- **Previous Step**: Undo your last action and return to the previous state
- **Reset**: Clear the entire table and start over with the same grammar and input

## Understanding Results

- **String Accepted**: Start symbol (S) appears in the top-right cell
- **String Rejected**: Start symbol (S) does not appear in the top-right cell
- **Visualization**: Completed table shows all possible derivations for each substring