"use client"

// This file will manage the code challenges data and refresh mechanism

import { useEffect, useState } from "react"

export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  timeEstimate: string
  dateAdded: string
  sampleInput?: string
  sampleOutput?: string
  hints?: string[]
  solution?: string
}

// Base challenges that will be used to generate daily challenges
const baseChallenges: Challenge[] = [
  // Beginner challenges
  {
    id: "beginner-1",
    title: "Reverse a String",
    description: "Create a function that reverses a string without using the built-in reverse() method.",
    difficulty: "beginner",
    timeEstimate: "15 minutes",
    dateAdded: "2023-01-01",
    sampleInput: '"hello"',
    sampleOutput: '"olleh"',
    hints: [
      "Try using a for loop that starts from the end of the string",
      "You can also use array methods by converting the string to an array first",
    ],
    solution: `function reverseString(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}`,
  },
  {
    id: "beginner-2",
    title: "FizzBuzz",
    description:
      'Write a program that prints numbers from 1 to 100, but for multiples of 3 print "Fizz" and for multiples of 5 print "Buzz". For numbers which are multiples of both 3 and 5, print "FizzBuzz".',
    difficulty: "beginner",
    timeEstimate: "20 minutes",
    dateAdded: "2023-01-02",
    sampleInput: "n = 15",
    sampleOutput: "1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz",
    hints: [
      "Use the modulo operator (%) to check if a number is divisible by another number",
      "Check for multiples of both 3 and 5 first",
    ],
    solution: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      result.push("FizzBuzz");
    } else if (i % 3 === 0) {
      result.push("Fizz");
    } else if (i % 5 === 0) {
      result.push("Buzz");
    } else {
      result.push(i.toString());
    }
  }
  return result;
}`,
  },
  {
    id: "beginner-3",
    title: "Find the Largest Number",
    description: "Write a function that finds the largest number in an array of integers.",
    difficulty: "beginner",
    timeEstimate: "10 minutes",
    dateAdded: "2023-01-03",
    sampleInput: "[3, 7, 2, 9, 1]",
    sampleOutput: "9",
    hints: [
      "Initialize a variable to store the maximum value",
      "Iterate through the array and update the maximum if a larger value is found",
    ],
    solution: `function findLargestNumber(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`,
  },

  // Intermediate challenges
  {
    id: "intermediate-1",
    title: "Palindrome Checker",
    description:
      "Create a function that checks if a given string is a palindrome, considering only alphanumeric characters and ignoring case.",
    difficulty: "intermediate",
    timeEstimate: "30 minutes",
    dateAdded: "2023-01-04",
    sampleInput: '"A man, a plan, a canal: Panama"',
    sampleOutput: "true",
    hints: [
      "Remove all non-alphanumeric characters and convert to lowercase first",
      "Compare the string with its reverse",
    ],
    solution: `function isPalindrome(str) {
  // Remove non-alphanumeric characters and convert to lowercase
  const cleanStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  // Check if the string is equal to its reverse
  return cleanStr === cleanStr.split('').reverse().join('');
}`,
  },
  {
    id: "intermediate-2",
    title: "Find Missing Number",
    description: "Given an array containing n distinct numbers taken from 0 to n, find the missing number.",
    difficulty: "intermediate",
    timeEstimate: "25 minutes",
    dateAdded: "2023-01-05",
    sampleInput: "[3, 0, 1]",
    sampleOutput: "2",
    hints: [
      "The sum of numbers from 0 to n should be n*(n+1)/2",
      "Calculate the expected sum and subtract the actual sum",
    ],
    solution: `function findMissingNumber(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((sum, num) => sum + num, 0);
  return expectedSum - actualSum;
}`,
  },
  {
    id: "intermediate-3",
    title: "First Non-Repeating Character",
    description:
      "Find the first non-repeating character in a string and return its index. If it doesn't exist, return -1.",
    difficulty: "intermediate",
    timeEstimate: "35 minutes",
    dateAdded: "2023-01-06",
    sampleInput: '"leetcode"',
    sampleOutput: '0 (because "l" is the first non-repeating character)',
    hints: [
      "Use a hash map to count the occurrences of each character",
      "Then iterate through the string again to find the first character with count 1",
    ],
    solution: `function firstUniqChar(s) {
  const charCount = {};
  
  // Count occurrences of each character
  for (let char of s) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  
  // Find the first character with count 1
  for (let i = 0; i < s.length; i++) {
    if (charCount[s[i]] === 1) {
      return i;
    }
  }
  
  return -1;
}`,
  },

  // Advanced challenges
  {
    id: "advanced-1",
    title: "Implement a LRU Cache",
    description: "Design and implement a data structure for Least Recently Used (LRU) cache with O(1) operations.",
    difficulty: "advanced",
    timeEstimate: "45 minutes",
    dateAdded: "2023-01-07",
    sampleInput:
      "LRUCache cache = new LRUCache(2); cache.put(1, 1); cache.put(2, 2); cache.get(1); cache.put(3, 3); cache.get(2);",
    sampleOutput: "cache.get(1) returns 1; cache.get(2) returns -1 (not found); cache.get(3) returns 3",
    hints: [
      "Use a combination of a hash map and a doubly linked list",
      "The hash map provides O(1) lookup, while the linked list helps maintain the order",
    ],
    solution: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) return -1;
    
    // Update the "recently used" status by deleting and re-adding
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  put(key, value) {
    // If key exists, delete it first
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // If at capacity, delete the least recently used item (first item)
    if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    // Add the new key-value pair
    this.cache.set(key, value);
  }
}`,
  },
  {
    id: "advanced-2",
    title: "Merge K Sorted Lists",
    description: "Merge k sorted linked lists into one sorted linked list.",
    difficulty: "advanced",
    timeEstimate: "50 minutes",
    dateAdded: "2023-01-08",
    sampleInput: "[[1,4,5],[1,3,4],[2,6]]",
    sampleOutput: "[1,1,2,3,4,4,5,6]",
    hints: [
      "Use a min-heap (priority queue) to efficiently find the smallest element",
      "Alternatively, merge lists two at a time",
    ],
    solution: `function mergeKLists(lists) {
  if (!lists || lists.length === 0) return null;
  
  // Helper function to merge two sorted lists
  function mergeTwoLists(l1, l2) {
    const dummy = { val: 0, next: null };
    let current = dummy;
    
    while (l1 && l2) {
      if (l1.val < l2.val) {
        current.next = l1;
        l1 = l1.next;
      } else {
        current.next = l2;
        l2 = l2.next;
      }
      current = current.next;
    }
    
    current.next = l1 || l2;
    return dummy.next;
  }
  
  // Merge lists two at a time
  while (lists.length > 1) {
    const mergedLists = [];
    for (let i = 0; i < lists.length; i += 2) {
      const l1 = lists[i];
      const l2 = i + 1 < lists.length ? lists[i + 1] : null;
      mergedLists.push(mergeTwoLists(l1, l2));
    }
    lists = mergedLists;
  }
  
  return lists[0] || null;
}`,
  },
  {
    id: "advanced-3",
    title: "Word Search II",
    description: "Given an m x n board of characters and a list of strings words, return all words on the board.",
    difficulty: "advanced",
    timeEstimate: "60 minutes",
    dateAdded: "2023-01-09",
    sampleInput:
      'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]',
    sampleOutput: '["eat","oath"]',
    hints: [
      "Use a trie data structure to efficiently store and search for words",
      "Implement a backtracking algorithm to explore the board",
    ],
    solution: `function findWords(board, words) {
  // Implement Trie node
  class TrieNode {
    constructor() {
      this.children = {};
      this.isEndOfWord = false;
      this.word = '';
    }
  }
  
  // Build Trie from words
  const root = new TrieNode();
  for (const word of words) {
    let node = root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
    node.word = word;
  }
  
  const result = [];
  const m = board.length;
  const n = board[0].length;
  
  // DFS function
  function dfs(i, j, node) {
    // Check boundaries and if the character exists in the trie
    if (i < 0 || i >= m || j < 0 || j >= n || !board[i][j] || !node.children[board[i][j]]) {
      return;
    }
    
    const char = board[i][j];
    node = node.children[char];
    
    // If we found a word, add it to the result
    if (node.isEndOfWord) {
      result.push(node.word);
      node.isEndOfWord = false; // Avoid duplicates
    }
    
    // Mark as visited
    board[i][j] = '#';
    
    // Explore in all four directions
    dfs(i + 1, j, node);
    dfs(i - 1, j, node);
    dfs(i, j + 1, node);
    dfs(i, j - 1, node);
    
    // Restore the cell
    board[i][j] = char;
  }
  
  // Start DFS from each cell
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      dfs(i, j, root);
    }
  }
  
  return result;
}`,
  },
]

// Function to get today's date in YYYY-MM-DD format
function getTodayDateString() {
  const today = new Date()
  return today.toISOString().split("T")[0]
}

// Function to get a deterministic set of challenges based on the date
export function getDailyChallenges() {
  const today = getTodayDateString()

  // Use the date to seed a simple random number generator
  const dateNum = Number.parseInt(today.replace(/-/g, ""))
  const seed = dateNum % 1000

  // Select challenges for today based on the seed
  const beginnerIndex = seed % 3
  const intermediateIndex = (seed + 1) % 3
  const advancedIndex = (seed + 2) % 3

  return {
    beginner: baseChallenges.filter((c) => c.difficulty === "beginner")[beginnerIndex],
    intermediate: baseChallenges.filter((c) => c.difficulty === "intermediate")[intermediateIndex],
    advanced: baseChallenges.filter((c) => c.difficulty === "advanced")[advancedIndex],
  }
}

// Custom hook to get daily challenges with client-side refresh
export function useDailyChallenges() {
  const [challenges, setChallenges] = useState<{
    beginner: Challenge | null
    intermediate: Challenge | null
    advanced: Challenge | null
  }>({
    beginner: null,
    intermediate: null,
    advanced: null,
  })

  const [lastUpdated, setLastUpdated] = useState<string>("")

  useEffect(() => {
    // Function to update challenges
    const updateChallenges = () => {
      const today = getTodayDateString()
      if (today !== lastUpdated) {
        setChallenges(getDailyChallenges())
        setLastUpdated(today)
      }
    }

    // Update immediately
    updateChallenges()

    // Set up interval to check for date change (every hour)
    const intervalId = setInterval(updateChallenges, 60 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [lastUpdated])

  return challenges
}

// Function to get all challenges (for admin or archive view)
export function getAllChallenges() {
  return baseChallenges
}
