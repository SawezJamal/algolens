const DRY_RUN = process.argv.includes("--dry-run");

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { parse } = require("csv-parse/sync");

require("dotenv").config();

const Problem = require("../models/Problem");

const CSV_PATH = path.join(
    __dirname,
    "../data/coding_questions.csv"
);

const TARGET_COUNT = 40;

const excludedPhrases = [
    "red-black tree",
    "red black tree",
    "avl tree",
    "avl",
    "b-tree",
    "b tree",
    "forbidden nodes",
    "obstacle removal",
    "sliding window threshold",
    "weighted matching",
    "live stack",
    "flow network",
    "path existence",
    "path exists",
    "path between two nodes",
];

const excludedTitles = new Set([
    "Linked List Palindrome",
    "Valid Parentheses with Wildcards",
    "Valid Parentheses with Wildcard",
    "Search in a Binary Search Tree",
    "Contains Value in Linked List",
    "Linked List Contains Value",
    "Value in Linked List",
    "Connected Components",
    "Connected Components Count",
    "Minimum Bottleneck Spanning Tree Existence",
    "Kth Smallest Element in Two BSTs",
    "Minimum Cost Maximum Flow",

    // Repetitive anagram problems
    "Anagram Checker with Cleaning",
    "Anagram Checker with Variations",

    // Repetitive tree problems
    "Same Level Leaf Sum",

    // Repetitive MST problems
    "Edge in Minimum Spanning Tree",
    "Check MST Edge",
]);

const duplicateGroups = [
    [
        "linked list palindrome",
        "palindrome linked list",
    ],
    [
        "valid parentheses with wildcard",
        "valid parentheses with wildcards",
    ],
    [
        "bst contains value",
        "search in a binary search tree",
    ],
    [
        "contains value in linked list",
        "linked list contains value",
        "value in linked list",
    ],
    [
        "connected components",
        "connected components count",
    ],
    [
        "minimum bottleneck spanning tree",
        "minimum bottleneck spanning tree existence",
    ],
    [
        "kth smallest element in two merged bsts",
        "kth smallest element in two bsts",
    ],
];

const categoryKeywords = {
    Arrays: [
        "array",
        "subarray",
        "subsequence",
        "prefix sum",
    ],

    Strings: [
        "string",
        "substring",
        "palindrome",
        "anagram",
    ],

    Hashing: [
        "hash",
        "hashmap",
        "hash map",
        "frequency",
        "duplicate",
        "anagram",
    ],

    "Two Pointers": [
        "two pointer",
        "two-pointer",
    ],

    "Sliding Window": [
        "sliding window",
        "window",
    ],

    "Binary Search": [
        "binary search",
        "search in sorted",
        "rotated sorted",
    ],

    Sorting: [
        "sort",
        "sorting",
        "sorted array",
        "merge sorted",
    ],

    Stack: [
        "stack",
        "parentheses",
        "brackets",
    ],

    Queue: [
        "queue",
        "deque",
    ],

    "Linked List": [
        "linked list",
        "linked-list",
    ],

    Trees: [
        "binary tree",
        "binary search tree",
        "bst",
        "tree traversal",
    ],

    Graphs: [
        "graph",
        "dfs",
        "bfs",
        "shortest path",
        "minimum spanning",
        "mst",
        "connected components",
        "topological",
    ],

    Greedy: [
        "greedy",
        "activity selection",
        "interval scheduling",
    ],

    "Dynamic Programming": [
        "dynamic programming",
        "coin change",
        "climbing stairs",
        "knapsack",
        "maximum subarray",
        "subproblem",
    ],

    Backtracking: [
        "backtracking",
        "permutation",
        "combination",
        "subset",
    ],

    Heap: [
        "heap",
        "priority queue",
        "kth largest",
        "kth smallest",
    ],
};

function getCategories(problem) {
    const title = (problem.title || "").toLowerCase();
    const description = (
        problem.description || ""
    ).toLowerCase();

    const text = `${title} ${description}`;
    const categories = new Set();

    // ---------- Arrays ----------
    if (
        /\barray\b/.test(text) ||
        /\barrays\b/.test(text) ||
        /\bsubarray\b/.test(text) ||
        /\bsubsequence\b/.test(text)
    ) {
        categories.add("Arrays");
    }

    // ---------- Strings ----------
    if (
        /\bstring\b/.test(text) ||
        /\bstrings\b/.test(text) ||
        /\bsubstring\b/.test(text) ||
        /\bpalindrome\b/.test(text) ||
        /\banagram\b/.test(text)
    ) {
        categories.add("Strings");
    }

    // ---------- Hashing ----------
    if (
        /\bhash\b/.test(text) ||
        /\bhashmap\b/.test(text) ||
        /\bhash map\b/.test(text) ||
        /\bfrequency map\b/.test(text) ||
        /\bduplicate\b/.test(text) ||
        /\banagram\b/.test(text)
    ) {
        categories.add("Hashing");
    }

    // ---------- Two Pointers ----------
    if (
        /\btwo pointer\b/.test(text) ||
        /\btwo-pointer\b/.test(text) ||
        /\btwo pointers\b/.test(text)
    ) {
        categories.add("Two Pointers");
    }

    // ---------- Sliding Window ----------
    if (
        /\bsliding window\b/.test(text)
    ) {
        categories.add("Sliding Window");
    }

    // ---------- Binary Search ----------
    if (
        /\bbinary search\b/.test(text) ||
        /\bsearch insert position\b/.test(title) ||
        /\bsearch in sorted\b/.test(text)
    ) {
        categories.add("Binary Search");
    }

    // ---------- Sorting ----------
    if (
        /\bsorting\b/.test(text) ||
        /\bsorted array\b/.test(text) ||
        /\bmerge sorted\b/.test(text)
    ) {
        categories.add("Sorting");
    }

    // ---------- Stack ----------
    if (
        /\bstack\b/.test(text) ||
        /\bparentheses\b/.test(text) ||
        /\bbrackets\b/.test(text)
    ) {
        categories.add("Stack");
    }

    // ---------- Queue ----------
    if (
        /\bqueue\b/.test(text) ||
        /\bdeque\b/.test(text)
    ) {
        categories.add("Queue");
    }

    // ---------- Linked List ----------
    if (
        /\blinked list\b/.test(text) ||
        /\blinked-list\b/.test(text)
    ) {
        categories.add("Linked List");
    }

    // ---------- Trees ----------
    if (
        /\bbinary tree\b/.test(text) ||
        /\bbinary search tree\b/.test(text) ||
        /\bbst\b/.test(text) ||
        /\btree traversal\b/.test(text) ||
        /\btree node\b/.test(text) ||
        /\btree root\b/.test(text) ||
        /\btree leaf\b/.test(text)
    ) {
        categories.add("Trees");
    }

    // ---------- Graphs ----------
    if (
        /\bgraph\b/.test(text) ||
        /\bgraphs\b/.test(text) ||
        /\bdfs\b/.test(text) ||
        /\bbfs\b/.test(text) ||
        /\bshortest path\b/.test(text) ||
        /\bconnected components\b/.test(text) ||
        /\bcycle detection\b/.test(text) ||
        /\btopological sort\b/.test(text) ||
        /\btopological sorting\b/.test(text) ||
        /\bminimum spanning tree\b/.test(text) ||
        /\bmst\b/.test(text)
    ) {
        categories.add("Graphs");
    }

    // ---------- Greedy ----------
    if (
        /\bgreedy\b/.test(text) ||
        /\bactivity selection\b/.test(text) ||
        /\binterval scheduling\b/.test(text)
    ) {
        categories.add("Greedy");
    }

    // ---------- Dynamic Programming ----------
    if (
        /\bdynamic programming\b/.test(text) ||
        /\bcoin change\b/.test(text) ||
        /\bclimbing stairs\b/.test(text) ||
        /\bknapsack\b/.test(text) ||
        /\bmaximum subarray\b/.test(text)
    ) {
        categories.add("Dynamic Programming");
    }

    // ---------- Backtracking ----------
    if (
    /\bbacktracking\b/.test(text) ||
    /\bpermutation\b/.test(text) ||
    /\bpermutations\b/.test(text) ||
    /\bcombination\b/.test(text) ||
    /\bcombinations\b/.test(text)
) {
    categories.add("Backtracking");
}

    // ---------- Heap ----------
    if (
        /\bheap\b/.test(text) ||
        /\bpriority queue\b/.test(text) ||
        /\bkth largest\b/.test(text) ||
        /\bkth smallest\b/.test(text)
    ) {
        categories.add("Heap");
    }

    if (title === "coin change") {
    categories.delete("Arrays");
    categories.delete("Backtracking");
    categories.add("Dynamic Programming");
}

    return [...categories];
}

function slugify(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function parseJson(value, fallback = []) {
    if (!value) {
        return fallback;
    }

    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

function normalizeExamples(value) {
    const examples = parseJson(value);

    if (!Array.isArray(examples)) {
        return [];
    }

    return examples.slice(0, 3).map((example) => ({
        input: JSON.stringify(example.input),
        output: String(example.output),
    }));
}

function normalizeTestCases(value) {
    const testCases = parseJson(value);

    if (!Array.isArray(testCases)) {
        return [];
    }

    return testCases.slice(0, 10).map((testCase) => ({
        input: JSON.stringify(testCase.input),
        output: String(
            testCase.expected_output ??
            testCase.output
        ),
    }));
}

function normalizeConstraints(value) {
    const constraints = parseJson(value);

    if (!Array.isArray(constraints)) {
        return [];
    }

    return constraints.slice(0, 10).map(String);
}

function getStarterCode(title, categories) {
    const normalizedTitle = title
        .toLowerCase()
        .trim();

    const starterCodes = {
        "coin change": `#include <bits/stdc++.h>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    // Write your solution here

    return -1;
}`,

        "coin change existence": `#include <bits/stdc++.h>
using namespace std;

bool canMakeChange(vector<int>& coins, int amount) {
    // Write your solution here

    return false;
}`,

        "climbing stairs": `#include <bits/stdc++.h>
using namespace std;

int climbStairs(int n) {
    // Write your solution here

    return 0;
}`,

        "search insert position": `#include <bits/stdc++.h>
using namespace std;

int searchInsert(vector<int>& nums, int target) {
    // Write your solution here

    return -1;
}`,

        "find target in sorted array": `#include <bits/stdc++.h>
using namespace std;

int search(vector<int>& nums, int target) {
    // Write your solution here

    return -1;
}`,

        "check if element exists (binary search)": `#include <bits/stdc++.h>
using namespace std;

bool binarySearch(vector<int>& nums, int target) {
    // Write your solution here

    return false;
}`,

        "perfect square check (binary search)": `#include <bits/stdc++.h>
using namespace std;

bool isPerfectSquare(int num) {
    // Write your solution here

    return false;
}`,

        "array nesting": `#include <bits/stdc++.h>
using namespace std;

int arrayNesting(vector<int>& nums) {
    // Write your solution here

    return 0;
}`,

        "nearly sorted array": `#include <bits/stdc++.h>
using namespace std;

void solve(vector<int>& nums) {
    // Write your solution here
}`,

        "merge sorted arrays": `#include <bits/stdc++.h>
using namespace std;

vector<int> mergeSortedArrays(
    vector<int>& nums1,
    vector<int>& nums2
) {
    // Write your solution here

    return {};
}`,

        "palindrome queue stack": `#include <bits/stdc++.h>
using namespace std;

bool isPalindrome(string s) {
    // Write your solution here

    return false;
}`,

        "palindrome check using stack and queue": `#include <bits/stdc++.h>
using namespace std;

bool isPalindrome(string s) {
    // Write your solution here

    return false;
}`,

        "palindrome check with stack and queue": `#include <bits/stdc++.h>
using namespace std;

bool isPalindrome(string s) {
    // Write your solution here

    return false;
}`,

        "anagram pair": `#include <bits/stdc++.h>
using namespace std;

bool areAnagrams(string s, string t) {
    // Write your solution here

    return false;
}`,

        "group anagrams count": `#include <bits/stdc++.h>
using namespace std;

int countAnagramGroups(vector<string>& strs) {
    // Write your solution here

    return 0;
}`,

        "anagram checker with cleaning": `#include <bits/stdc++.h>
using namespace std;

bool isAnagram(string s, string t) {
    // Write your solution here

    return false;
}`,

        "anagram checker with variations": `#include <bits/stdc++.h>
using namespace std;

bool isAnagram(string s, string t) {
    // Write your solution here

    return false;
}`,

        "valid parentheses with wildcard": `#include <bits/stdc++.h>
using namespace std;

bool checkValidString(string s) {
    // Write your solution here

    return false;
}`,

        "valid parentheses with wildcards": `#include <bits/stdc++.h>
using namespace std;

bool checkValidString(string s) {
    // Write your solution here

    return false;
}`,

        "linked list cycle detection": `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;

    ListNode(int x) : val(x), next(nullptr) {}
};

bool hasCycle(ListNode* head) {
    // Write your solution here

    return false;
}`,

        "palindrome linked list": `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;

    ListNode(int x) : val(x), next(nullptr) {}
};

bool isPalindrome(ListNode* head) {
    // Write your solution here

    return false;
}`,

        "contains duplicate value in linked list": `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;

    ListNode(int x) : val(x), next(nullptr) {}
};

bool containsDuplicate(ListNode* head) {
    // Write your solution here

    return false;
}`,

        "bst range sum": `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;

    TreeNode(int x)
        : val(x), left(nullptr), right(nullptr) {}
};

int rangeSumBST(
    TreeNode* root,
    int low,
    int high
) {
    // Write your solution here

    return 0;
}`,

        "bst contains value": `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;

    TreeNode(int x)
        : val(x), left(nullptr), right(nullptr) {}
};

bool searchBST(TreeNode* root, int target) {
    // Write your solution here

    return false;
}`,

        "bst distance": `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;

    TreeNode(int x)
        : val(x), left(nullptr), right(nullptr) {}
};

int bstDistance(
    TreeNode* root,
    int a,
    int b
) {
    // Write your solution here

    return -1;
}`,

        "same tree traversal": `#include <bits/stdc++.h>
using namespace std;

bool isSameTree(
    vector<int>& preorder,
    vector<int>& inorder,
    vector<int>& postorder
) {
    // Write your solution here

    return false;
}`,

        "same level sum": `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;

    TreeNode(int x)
        : val(x), left(nullptr), right(nullptr) {}
};

int sameLevelSum(TreeNode* root) {
    // Write your solution here

    return 0;
}`,

        "maximum width of binary tree with null node consideration": `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;

    TreeNode(int x)
        : val(x), left(nullptr), right(nullptr) {}
};

int widthOfBinaryTree(TreeNode* root) {
    // Write your solution here

    return 0;
}`,

        "check if a value exists in a binary tree (preorder)": `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;

    TreeNode(int x)
        : val(x), left(nullptr), right(nullptr) {}
};

bool containsValue(TreeNode* root, int target) {
    // Write your solution here

    return false;
}`,

        "cycle detection in undirected graph": `#include <bits/stdc++.h>
using namespace std;

bool hasCycle(
    int n,
    vector<vector<int>>& edges
) {
    // Write your solution here

    return false;
}`,

        "cycle detection in a directed graph": `#include <bits/stdc++.h>
using namespace std;

bool hasCycle(
    int n,
    vector<vector<int>>& edges
) {
    // Write your solution here

    return false;
}`,

        "check if a graph is a tree": `#include <bits/stdc++.h>
using namespace std;

bool isTree(
    int n,
    vector<vector<int>>& edges
) {
    // Write your solution here

    return false;
}`,

        "minimum bottleneck spanning tree": `#include <bits/stdc++.h>
using namespace std;

int minimumBottleneckSpanningTree(
    int n,
    vector<vector<int>>& edges
) {
    // Write your solution here

    return 0;
}`,

        "longest path in a weighted dag": `#include <bits/stdc++.h>
using namespace std;

int longestPath(
    int n,
    vector<vector<pair<int, int>>>& graph
) {
    // Write your solution here

    return 0;
}`,

        "minimize malware spread ii": `#include <bits/stdc++.h>
using namespace std;

int minMalwareSpread(
    vector<vector<int>>& graph,
    vector<int>& initial
) {
    // Write your solution here

    return 0;
}`,

        "maximum items": `#include <bits/stdc++.h>
using namespace std;

int maximumItems(
    vector<int>& items,
    int capacity
) {
    // Write your solution here

    return 0;
}`,

        "activity selection": `#include <bits/stdc++.h>
using namespace std;

int activitySelection(
    vector<int>& start,
    vector<int>& finish
) {
    // Write your solution here

    return 0;
}`,

        "lemonade change": `#include <bits/stdc++.h>
using namespace std;

bool lemonadeChange(vector<int>& bills) {
    // Write your solution here

    return false;
}`,

        "knapsack": `#include <bits/stdc++.h>
using namespace std;

int knapsack(
    vector<int>& weights,
    vector<int>& values,
    int capacity
) {
    // Write your solution here

    return 0;
}`,

        "target profit knapsack": `#include <bits/stdc++.h>
using namespace std;

int knapsack(
    vector<int>& weights,
    vector<int>& values,
    int capacity
) {
    // Write your solution here

    return 0;
}`,

        "kth smallest element in a sorted matrix": `#include <bits/stdc++.h>
using namespace std;

int kthSmallest(
    vector<vector<int>>& matrix,
    int k
) {
    // Write your solution here

    return 0;
}`,

        "kth smallest element in two merged bsts": `#include <bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;

    TreeNode(int x)
        : val(x), left(nullptr), right(nullptr) {}
};

int kthSmallest(
    TreeNode* root1,
    TreeNode* root2,
    int k
) {
    // Write your solution here

    return 0;
}`,
    };

    if (starterCodes[normalizedTitle]) {
        return starterCodes[normalizedTitle];
    }

    // Safe fallback for any future problem.
    if (categories.includes("Strings")) {
        return `#include <bits/stdc++.h>
using namespace std;

string solve(string s) {
    // Write your solution here

    return "";
}`;
    }

    if (categories.includes("Binary Search")) {
        return `#include <bits/stdc++.h>
using namespace std;

int solve(vector<int>& nums, int target) {
    // Write your solution here

    return -1;
}`;
    }

    return `#include <bits/stdc++.h>
using namespace std;

int solve(vector<int>& nums) {
    // Write your solution here

    return 0;
}`;
}

function normalizeTitle(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function isDuplicateTitle(title, selectedTitles) {
    const normalized = normalizeTitle(title);

    return selectedTitles.some(
        (existing) =>
            normalizeTitle(existing) === normalized
    );
}

function isExcluded(problem) {
    const title = (problem.title || "")
        .trim()
        .toLowerCase();

    const text = (
        `${problem.title} ${problem.description}`
    ).toLowerCase();

    const excludedByTitle = [
        ...excludedTitles,
    ].some(
        (excludedTitle) =>
            excludedTitle.toLowerCase() === title
    );

    const excludedByPhrase =
        excludedPhrases.some((phrase) =>
            text.includes(phrase)
        );

    return (
        excludedByTitle ||
        excludedByPhrase
    );
}

function scoreProblem(
    problem,
    categories
) {
    let score = 0;

    if (problem.difficulty_level === "Easy") {
        score += 3;
    }

    if (
        problem.difficulty_level === "Medium"
    ) {
        score += 4;
    }

    if (
        problem.difficulty_level === "Hard"
    ) {
        score += 3;
    }

    if (problem.examples) {
        score += 2;
    }

    if (problem.constraints) {
        score += 1;
    }

    if (categories.length >= 2) {
        score += 2;
    }

    /*
     * Prefer well-known/common concepts.
     */
    const preferredCategories = [
        "Arrays",
        "Strings",
        "Hashing",
        "Two Pointers",
        "Sliding Window",
        "Binary Search",
        "Sorting",
        "Stack",
        "Queue",
        "Linked List",
        "Trees",
        "Graphs",
        "Greedy",
        "Dynamic Programming",
        "Backtracking",
        "Heap",
    ];

    score += categories.filter(
        (category) =>
            preferredCategories.includes(category)
    ).length;

    return score;
}

function difficultyWeight(difficulty) {
    if (difficulty === "Easy") return 1;
    if (difficulty === "Medium") return 2;
    if (difficulty === "Hard") return 3;

    return 0;
}

async function importProblems() {
    try {
        if (!fs.existsSync(CSV_PATH)) {
            throw new Error(
                `CSV not found at ${CSV_PATH}`
            );
        }

        console.log("Reading dataset...");

        const csv = fs.readFileSync(
            CSV_PATH,
            "utf8"
        );

        const records = parse(csv, {
            columns: true,
            skip_empty_lines: true,
            relax_quotes: true,
        });

        console.log(
            `Dataset contains ${records.length} questions`
        );

        const candidates = [];

        for (const record of records) {
            if (
                !record.title ||
                !record.description
            ) {
                continue;
            }

            const difficulty =
                record.difficulty_level;

            if (
                !["Easy", "Medium", "Hard"].includes(
                    difficulty
                )
            ) {
                continue;
            }

            const categories =
    getCategories(record);

if (categories.length === 0) {
    continue;
}

if (isExcluded(record)) {
    continue;
}

            const examples =
                normalizeExamples(
                    record.examples
                );

            const constraints =
                normalizeConstraints(
                    record.constraints
                );

                const testCases =
    normalizeTestCases(
        record.test_cases
    );
    
            const score = scoreProblem(
                record,
                categories
            );

            candidates.push({
    record,
    categories,
    difficulty,
    examples,
    testCases,
    constraints,
    score,
});
        }

        console.log(
            `DSA candidates found: ${candidates.length}`
        );

        candidates.sort(
            (a, b) => b.score - a.score
        );

        /*
         * Target difficulty distribution:
         * Easy   = 20
         * Medium = 20
         * Hard   = 10
         */
        const difficultyTargets = {
    Easy: 15,
    Medium: 20,
    Hard: 10,
};

        const difficultyCounts = {
            Easy: 0,
            Medium: 0,
            Hard: 0,
        };

        const selected = [];
        const selectedTitles = [];

        /*
         * Keep categories balanced.
         */
        const categoryCounts = {};

        for (const candidate of candidates) {
            if (
                selected.length >= TARGET_COUNT
            ) {
                break;
            }

            const difficulty =
                candidate.difficulty;

            if (
                difficultyCounts[difficulty] >=
                difficultyTargets[difficulty]
            ) {
                continue;
            }

            if (
                isDuplicateTitle(
                    candidate.record.title,
                    selectedTitles
                )
            ) {
                continue;
            }

            /*
             * Don't let one category dominate.
             */
            const dominantCategory =
                candidate.categories.some(
                    (category) =>
                        (categoryCounts[category] ||
                            0) >= 8
                );

            if (dominantCategory) {
                continue;
            }

            selected.push(candidate);

            selectedTitles.push(
                candidate.record.title
            );

            difficultyCounts[difficulty]++;

            for (const category of candidate.categories) {
                categoryCounts[category] =
                    (categoryCounts[category] || 0) +
                    1;
            }
        }

        console.log(
            `Selected ${selected.length} problems`
        );

        console.log(
            "\nDifficulty distribution:"
        );

        console.log(difficultyCounts);

        console.log(
            "\nCategory distribution:"
        );

        console.log(categoryCounts);

        console.log(
            "\nSelected problems:\n"
        );

        selected.forEach(
            (problem, index) => {
                console.log(
                    `${index + 1}. ${
                        problem.record.title
                    } | ${
                        problem.difficulty
                    } | ${
                        problem.categories.join(
                            ", "
                        )
                    }`
                );
            }
        );

        if (selected.length < TARGET_COUNT) {
            console.warn(
                `\nWarning: only ${selected.length} suitable problems were found.`
            );
        }

        if (DRY_RUN) {
            console.log(
                "\nDry run complete. MongoDB was not modified."
            );

            return;
        }

        const operations = selected.map(
    ({
        record,
        categories,
        difficulty,
        examples,
        testCases,
        constraints,
    }) => {
        const slug = slugify(record.title);

        return {
            updateOne: {
                filter: { slug },

                update: {
                    $set: {
                        title: record.title,
                        slug,
                        difficulty,
                        categories,
                        description: record.description,
                        examples,
                        testCases,
                        constraints,

                        starterCode: getStarterCode(
                            record.title,
                            categories
                        ),

                        tags: categories.map(
                            (category) =>
                                category
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")
                        ),

                        source: "Coding Questions Dataset",

                        sourceUrl:
                            "https://www.kaggle.com/datasets/guitaristboy/coding-questions-dataset",
                    },
                },

                upsert: true,
            },
        };
    }
);

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "\nMongoDB connected"
        );

        const result =
            await Problem.bulkWrite(
                operations
            );

        console.log(
            `Inserted: ${result.upsertedCount}`
        );

        console.log(
            `Updated: ${result.modifiedCount}`
        );

        console.log(
            "\nProblem import completed successfully."
        );

        await mongoose.disconnect();
    } catch (error) {
        console.error(
            "Problem import failed:",
            error
        );

        try {
            await mongoose.disconnect();
        } catch {}

        process.exit(1);
    }
}

importProblems();