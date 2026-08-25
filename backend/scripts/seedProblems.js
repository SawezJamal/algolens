const mongoose = require("mongoose");
require("dotenv").config();

const Problem = require("../models/Problem");

const problems = [
    {
        title: "Contains Duplicate",
        slug: "contains-duplicate",
        difficulty: "Easy",
        category: "Arrays",

        description:
            "Given an integer array nums, return true if any value appears at least twice, and return false if every element is distinct.",

        examples: [
            {
                input: "nums = [1, 2, 3, 1]",
                output: "true",
            },
        ],

        constraints: [],

        starterCode: `#include <bits/stdc++.h>
using namespace std;

bool containsDuplicate(vector<int>& nums) {
    // Write your solution here

    return false;
}`,

        expectedTimeComplexity: "O(n)",
        expectedSpaceComplexity: "O(n)",

        tags: ["array", "hashing"],

        source: "AlgoLens",
        sourceUrl: "",
    },

    {
        title: "Two Sum",
        slug: "two-sum",
        difficulty: "Easy",
        category: "Hashing",

        description:
            "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.",

        examples: [
            {
                input: "nums = [2, 7, 11, 15], target = 9",
                output: "[0, 1]",
            },
        ],

        constraints: [],

        starterCode: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here

    return {};
}`,

        expectedTimeComplexity: "O(n)",
        expectedSpaceComplexity: "O(n)",

        tags: ["array", "hash-map"],

        source: "AlgoLens",
        sourceUrl: "",
    },

    {
        title: "Best Time to Buy and Sell Stock",
        slug: "best-time-to-buy-and-sell-stock",
        difficulty: "Easy",
        category: "Arrays",

        description:
            "Given an array of prices where prices[i] is the price of a stock on the ith day, find the maximum profit you can achieve by choosing a single day to buy and a later day to sell.",

        examples: [
            {
                input: "prices = [7, 1, 5, 3, 6, 4]",
                output: "5",
            },
        ],

        constraints: [],

        starterCode: `#include <bits/stdc++.h>
using namespace std;

int maxProfit(vector<int>& prices) {
    // Write your solution here

    return 0;
}`,

        expectedTimeComplexity: "O(n)",
        expectedSpaceComplexity: "O(1)",

        tags: ["array", "greedy"],

        source: "AlgoLens",
        sourceUrl: "",
    },

    {
        title: "Valid Parentheses",
        slug: "valid-parentheses",
        difficulty: "Easy",
        category: "Stack",

        description:
            "Given a string containing brackets, determine whether the input string has valid matching and properly ordered parentheses.",

        examples: [
            {
                input: 's = "()[]{}"',
                output: "true",
            },
        ],

        constraints: [],

        starterCode: `#include <bits/stdc++.h>
using namespace std;

bool isValid(string s) {
    // Write your solution here

    return false;
}`,

        expectedTimeComplexity: "O(n)",
        expectedSpaceComplexity: "O(n)",

        tags: ["string", "stack"],

        source: "AlgoLens",
        sourceUrl: "",
    },

    {
        title: "Binary Search",
        slug: "binary-search",
        difficulty: "Easy",
        category: "Binary Search",

        description:
            "Given a sorted array of integers and a target value, return the index of the target if it exists. Otherwise, return -1.",

        examples: [
            {
                input: "nums = [-1, 0, 3, 5, 9, 12], target = 9",
                output: "4",
            },
        ],

        constraints: [],

        starterCode: `#include <bits/stdc++.h>
using namespace std;

int search(vector<int>& nums, int target) {
    // Write your solution here

    return -1;
}`,

        expectedTimeComplexity: "O(log n)",
        expectedSpaceComplexity: "O(1)",

        tags: ["array", "binary-search"],

        source: "AlgoLens",
        sourceUrl: "",
    },
];

async function seedProblems() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Problem.deleteMany({});

        await Problem.insertMany(problems);

        console.log(`${problems.length} problems inserted successfully`);

        await mongoose.disconnect();

        console.log("MongoDB disconnected");
    } catch (error) {
        console.error("Seeding failed:", error);

        await mongoose.disconnect();

        process.exit(1);
    }
}

seedProblems();