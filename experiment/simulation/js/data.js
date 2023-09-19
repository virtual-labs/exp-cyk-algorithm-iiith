/****
  * File containing DFA descriptions
  *
  */

const cnf1 = {
  "description": "Given the following CNF, check if given input is accepted or not.",
  "transitions": [
    {"from": "S", "to": ["AB", "BA", "SS", "AC", "BD"]},
    {"from": "A", "to": ["a"]},
    {"from": "B", "to": ["b"]},
    {"from": "C", "to": ["SB"]},
    {"from": "D", "to": ["SA"]}
  ],
  "input": [
    {
      "string": "aabbab",
      "matrix": [
        ["A"],
        ["-", "A"],
        ["-", "S", "B"],
        ["S", "C", "-", "B"],
        ["D", "S", "-", "S", "A"],
        ["S", "C", "-", "C", "S", "B"]
      ]
    },
    {
      "string": "ababab",
      "matrix": [
        ["A"],
        ["S", "B"],
        ["D", "S", "A"],
        ["S", "C", "S", "B"],
        ["D", "S", "D", "S", "A"],
        ["S", "C", "S", "C", "S", "B"]
      ]
    },
    {
      "string": "aaabbb",
      "matrix": [
        ["A"],
        ["-", "A"],
        ["-", "-", "A"],
        ["-", "-", "S", "B"],
        ["-", "S", "C", "-", "B"],
        ["S", "C", "-", "-", "-", "B"]
      ]
    },
    {
      "string": "aababa",
      "matrix": [
        ["A"],
        ["-", "A"],
        ["-", "S", "B"],
        ["-", "D", "S", "A"],
        ["-", "S", "C", "S", "B"],
        ["-", "D", "S", "D", "S", "A"]
      ]
    }
  ]
}

const cnf2 = {
  "description": "Given the following CNF, check if given input is accepted or not.",
  "transitions": [
    {"from": "S", "to": ["AB", "BC"]},
    {"from": "A", "to": ["BA", "a"]},
    {"from": "B", "to": ["C", "b"]},
    {"from": "C", "to": ["AB", "a"]}
  ],
  "input": [
    {
      "string": "baaba",
      "matrix": [
        ["B"],
        ["S, A", "A, C"],
        ["-", "B", "A, C"],
        ["-", "B", "S, C", "B"],
        ["S, A, C", "S, A, C", "B", "S, A", "A, C"]
      ]
    },
    {
      "string": "ababbb",
      "matrix": [
        ["A, C"],
        ["S, C", "B"],
        ["B", "A", "A, C"],
        ["B", "S, C", "S, C", "B"],
        ["-", "-", "-", "-", "B"],
        ["-", "-", "-", "-", "-", "B"]
      ]
    },
    {
      "string": "baaaba",
      "matrix": [
        ["B"],
        ["A, S", "A, C"],
        ["-", "B", "A, C"],
        ["S, A, C", "S, A, C", "B", "A, C"],
        ["S, C", "S, C", "B", "S, C", "B"],
        ["S, B", "B", "S, C, A", "B", "A, S", "A, C"]
      ]
    }
  ]
}

const cnf3 = {
  "description": "Given the following CNF, check if given input is accepted or not.",
  "transitions": [
    {"from": "S", "to": ["AB"]},
    {"from": "A", "to": ["CD", "CF"]},
    {"from": "B", "to": ["EB", "c"]},
    {"from": "C", "to": ["a"]},
    {"from": "D", "to": ["b"]},
    {"from": "E", "to": ["c"]},
    {"from": "F", "to": ["AD"]}
  ],
  "input": [
    {
      "string": "aabbcc",
      "matrix": [
        ["C"],
        ["-", "C"],
        ["-", "A", "D"],
        ["A", "F", "-", "D"],
        ["S", "-", "-", "-", "B, E"],
        ["S", "-", "-", "-", "B", "B, E"]
      ]
    },
    {
      "string": "aaabbc",
      "matrix": [
        ["C"],
        ["-", "C"],
        ["-", "-", "C"],
        ["-", "-", "A", "C"],
        ["-", "A", "F", "-", "D"],
        ["-", "S", "-", "-", "-", "B, E"]
      ]
    },
    {
      "string": "abcccc",
      "matrix": [
        ["C"],
        ["A", "D"],
        ["S", "-", "B, E"],
        ["S", "-", "B", "B, E"],
        ["S", "-", "B", "B", "B, E"],
        ["S", "-", "B", "B", "B", "B, E"]
      ]
    }
  ]
}