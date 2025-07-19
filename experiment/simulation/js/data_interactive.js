/*****
 * File containing CNF grammar descriptions for interactive CYK algorithm
 *
 */

const cnf1 = {
  "description": "CNF Grammar 1: Palindromes",
  "start": "S",
  "transitions": [
    "S → AB | BA | SS | AC | BD",
    "A → a",
    "B → b", 
    "C → SB",
    "D → SA"
  ]
};

const cnf2 = {
  "description": "CNF Grammar 2: Equal a's and b's",
  "start": "S",
  "transitions": [
    "S → AB | BA | SS",
    "A → a",
    "B → b"
  ]
};

const cnf3 = {
  "description": "CNF Grammar 3: Simple Language",
  "start": "S", 
  "transitions": [
    "S → AB | SS",
    "A → a",
    "B → b"
  ]
};
