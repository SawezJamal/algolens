const mongoose = require("mongoose");
require("dotenv").config({
    path: require("path").resolve(
        __dirname,
        "../.env"
    ),
});

const Problem = require("../models/Problem");

const problems = [
    // =========================================================
    // ARRAYS / HASHING
    // =========================================================

    {
        title: "Contains Duplicate",
        slug: "contains-duplicate",
        difficulty: "Easy",

        categories: ["Arrays", "Hashing"],

        description:
            "Given an integer array nums, return true if any value appears at least twice, and return false if every element is distinct.",

        examples: [
            {
                input: "nums = [1, 2, 3, 1]",
                output: "true",
            },
        ],

        testCases: [
            {
                input: "{\"nums\":[1,2,3,1]}",
                output: "true",
            },
            {
                input: "{\"nums\":[1,2,3,4]}",
                output: "false",
            },
            {
                input: "{\"nums\":[1,1,1,3,3,4,3,2,4,2]}",
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

        execution: {
            enabled: true,
            runnerType: "array",
            functionName: "containsDuplicate",
            returnType: "bool",

            parameters: [
                {
                    name: "nums",
                    type: "vector<int>",
                },
            ],
        },
    },

    {
        title: "Two Sum",
        slug: "two-sum",
        difficulty: "Easy",

        categories: ["Arrays", "Hashing"],

        description:
            "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.",

        examples: [
            {
                input: "nums = [2, 7, 11, 15], target = 9",
                output: "[0, 1]",
            },
        ],

        testCases: [
            {
                input: "{\"nums\":[2,7,11,15],\"target\":9}",
                output: "0 1",
            },
            {
                input: "{\"nums\":[3,2,4],\"target\":6}",
                output: "1 2",
            },
            {
                input: "{\"nums\":[3,3],\"target\":6}",
                output: "0 1",
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

        execution: {
            enabled: true,
            runnerType: "array",
            functionName: "twoSum",
            returnType: "vector<int>",

            parameters: [
                {
                    name: "nums",
                    type: "vector<int>",
                },
                {
                    name: "target",
                    type: "int",
                },
            ],
        },
    },

    // =========================================================
    // BINARY SEARCH CATEGORY
    // =========================================================

    {
        title: "Binary Search",
        slug: "binary-search",
        difficulty: "Easy",

        categories: ["Arrays", "Binary Search"],

        description:
            "Given a sorted array of integers and a target value, return the index of the target if it exists. Otherwise, return -1.",

        examples: [
            {
                input:
                    "nums = [-1, 0, 3, 5, 9, 12], target = 9",
                output: "4",
            },
        ],

        testCases: [
            {
                input:
                    "{\"nums\":[-1,0,3,5,9,12],\"target\":9}",
                output: "4",
            },
            {
                input:
                    "{\"nums\":[-1,0,3,5,9,12],\"target\":2}",
                output: "-1",
            },
            {
                input:
                    "{\"nums\":[5],\"target\":5}",
                output: "0",
            },
            {
                input:
                    "{\"nums\":[5],\"target\":2}",
                output: "-1",
            },
            {
                input:
                    "{\"nums\":[1,2,3,4,5,6,7],\"target\":1}",
                output: "0",
            },
        ],

        constraints: [
            "The array is sorted in ascending order.",
        ],

        starterCode: `#include <bits/stdc++.h>
using namespace std;

int search(vector<int>& nums, int target) {
    // Write your solution here

    return -1;
}`,

        expectedTimeComplexity: "O(log n)",
        expectedSpaceComplexity: "O(1)",

        tags: ["array", "binary-search", "search"],

        source: "AlgoLens",
        sourceUrl: "",

        execution: {
            enabled: true,
            runnerType: "array",
            functionName: "search",
            returnType: "int",

            parameters: [
                {
                    name: "nums",
                    type: "vector<int>",
                },
                {
                    name: "target",
                    type: "int",
                },
            ],
        },
    },

    {
        title: "Search Insert Position",
        slug: "search-insert-position",
        difficulty: "Easy",

        categories: ["Arrays", "Binary Search"],

        description:
            "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be inserted in sorted order.",

        examples: [
            {
                input: "nums = [1,3,5,6], target = 5",
                output: "2",
            },
            {
                input: "nums = [1,3,5,6], target = 2",
                output: "1",
            },
        ],

        testCases: [
            {
                input:
                    "{\"nums\":[1,3,5,6],\"target\":5}",
                output: "2",
            },
            {
                input:
                    "{\"nums\":[1,3,5,6],\"target\":2}",
                output: "1",
            },
            {
                input:
                    "{\"nums\":[1,3,5,6],\"target\":7}",
                output: "4",
            },
            {
                input:
                    "{\"nums\":[1,3,5,6],\"target\":0}",
                output: "0",
            },
            {
                input:
                    "{\"nums\":[1],\"target\":1}",
                output: "0",
            },
        ],

        constraints: [
            "The array is sorted in ascending order.",
            "All values are distinct.",
        ],

        starterCode: `#include <bits/stdc++.h>
using namespace std;

int searchInsert(vector<int>& nums, int target) {
    // Write your solution here

    return 0;
}`,

        expectedTimeComplexity: "O(log n)",
        expectedSpaceComplexity: "O(1)",

        tags: [
            "array",
            "binary-search",
            "lower-bound",
        ],

        source: "AlgoLens",
        sourceUrl: "",

        execution: {
            enabled: true,
            runnerType: "array",
            functionName: "searchInsert",
            returnType: "int",

            parameters: [
                {
                    name: "nums",
                    type: "vector<int>",
                },
                {
                    name: "target",
                    type: "int",
                },
            ],
        },
    },

    {
        title: "Find First Occurrence",
        slug: "find-first-occurrence",
        difficulty: "Easy",

        categories: ["Arrays", "Binary Search"],

        description:
            "Given a sorted array that may contain duplicate values, find the first index at which the target occurs. Return -1 if the target is not present.",

        examples: [
            {
                input: "nums = [1,2,2,2,3], target = 2",
                output: "1",
            },
        ],

        testCases: [
            {
                input:
                    "{\"nums\":[1,2,2,2,3],\"target\":2}",
                output: "1",
            },
            {
                input:
                    "{\"nums\":[1,2,2,2,3],\"target\":3}",
                output: "4",
            },
            {
                input:
                    "{\"nums\":[1,2,2,2,3],\"target\":4}",
                output: "-1",
            },
            {
                input:
                    "{\"nums\":[2,2,2],\"target\":2}",
                output: "0",
            },
        ],

        constraints: [
            "The array is sorted in ascending order.",
            "Duplicate values may exist.",
        ],

        starterCode: `#include <bits/stdc++.h>
using namespace std;

int findFirstOccurrence(vector<int>& nums, int target) {
    // Write your solution here

    return -1;
}`,

        expectedTimeComplexity: "O(log n)",
        expectedSpaceComplexity: "O(1)",

        tags: [
            "array",
            "binary-search",
            "duplicates",
            "lower-bound",
        ],

        source: "AlgoLens",
        sourceUrl: "",

        execution: {
            enabled: true,
            runnerType: "array",
            functionName: "findFirstOccurrence",
            returnType: "int",

            parameters: [
                {
                    name: "nums",
                    type: "vector<int>",
                },
                {
                    name: "target",
                    type: "int",
                },
            ],
        },
    },

    {
        title: "Search Range",
        slug: "search-range",
        difficulty: "Medium",

        categories: ["Arrays", "Binary Search"],

        description:
            "Given a sorted array of integers, find the starting and ending position of a given target value. Return [-1,-1] if the target is not present.",

        examples: [
            {
                input: "nums = [5,7,7,8,8,10], target = 8",
                output: "[3,4]",
            },
        ],

        testCases: [
            {
                input:
                    "{\"nums\":[5,7,7,8,8,10],\"target\":8}",
                output: "3 4",
            },
            {
                input:
                    "{\"nums\":[5,7,7,8,8,10],\"target\":6}",
                output: "-1 -1",
            },
            {
                input:
                    "{\"nums\":[1],\"target\":1}",
                output: "0 0",
            },
            {
                input:
                    "{\"nums\":[2,2,2,2],\"target\":2}",
                output: "0 3",
            },
        ],

        constraints: [
            "The array is sorted in ascending order.",
            "Duplicate values may exist.",
        ],

        starterCode: `#include <bits/stdc++.h>
using namespace std;

vector<int> searchRange(vector<int>& nums, int target) {
    // Write your solution here

    return {-1, -1};
}`,

        expectedTimeComplexity: "O(log n)",
        expectedSpaceComplexity: "O(1)",

        tags: [
            "array",
            "binary-search",
            "lower-bound",
            "upper-bound",
        ],

        source: "AlgoLens",
        sourceUrl: "",

        execution: {
            enabled: true,
            runnerType: "array",
            functionName: "searchRange",
            returnType: "vector<int>",

            parameters: [
                {
                    name: "nums",
                    type: "vector<int>",
                },
                {
                    name: "target",
                    type: "int",
                },
            ],
        },
    },

    {
        title: "Perfect Square Check",
        slug: "perfect-square-check-binary-search",
        difficulty: "Easy",

        categories: ["Binary Search", "Math"],

        description:
            "Given a positive integer num, determine whether it is a perfect square using binary search.",

        examples: [
            {
                input: "num = 16",
                output: "true",
            },
            {
                input: "num = 14",
                output: "false",
            },
        ],

        testCases: [
            {
                input: "{\"num\":16}",
                output: "true",
            },
            {
                input: "{\"num\":14}",
                output: "false",
            },
            {
                input: "{\"num\":1}",
                output: "true",
            },
            {
                input: "{\"num\":25}",
                output: "true",
            },
            {
                input: "{\"num\":26}",
                output: "false",
            },
            {
                input: "{\"num\":100}",
                output: "true",
            },
        ],

        constraints: [
            "num is a positive integer.",
            "Use binary search rather than a square-root library function.",
        ],

        starterCode: `#include <bits/stdc++.h>
using namespace std;

bool isPerfectSquare(int num) {
    // Write your solution here

    return false;
}`,

        expectedTimeComplexity: "O(log n)",
        expectedSpaceComplexity: "O(1)",

        tags: [
            "binary-search",
            "math",
            "search",
        ],

        source: "AlgoLens",
        sourceUrl: "",

        execution: {
            enabled: true,
            runnerType: "array",
            functionName: "isPerfectSquare",
            returnType: "bool",

            parameters: [
                {
                    name: "num",
                    type: "int",
                },
            ],
        },
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