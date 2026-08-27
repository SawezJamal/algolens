const { detectNestedLoop } = require("./nestedLoopRule");
const { detectRepeatedLinearSearch } = require("./linearSearchRule");
const { detectSortingInsideLoop } = require("./sortingInsideLoopRule");
const { detectLoopInvariant } = require("./loopInvariantRule");
const { detectRedundantTraversal } = require("./redundantTraversalRule");
const {
    detectBinarySearch,
} = require("./binarySearchRule");
const {
    detectCoinChange,
} = require("./coinChangeRule");
const {
    detectRecursion,
} = require("./recursionRule");

const analyzerRules = [
    {
    name: "Binary Search",

    detect: detectBinarySearch,

    result: (details) => ({
        detected: true,

        pattern: "Binary Search",

        startLine: details.startLine,
        endLine: details.endLine,

        timeComplexity: "O(log n)",

        spaceComplexity: "O(1)",

        recommendation:
            "No optimization needed",

        explanation:
            "The solution repeatedly halves the search space, resulting in logarithmic time complexity.",

        optimizedComplexity:
            "Already optimal: O(log n) time · O(1) space",
    }),
},
{
    name: "Coin Change DP",

    detect: detectCoinChange,

    result: (details) => ({
        detected: true,

        pattern: "Dynamic Programming",

        startLine: details.startLine,
        endLine: details.endLine,

        timeComplexity:
            "O(amount × C)",

        spaceComplexity:
            "O(amount)",

        recommendation:
            "No major optimization needed",

        explanation:
            "The solution uses dynamic programming to determine whether each amount can be formed using the available coin denominations. The outer loop processes each amount and the inner loop checks the available coins.",

        optimizedComplexity:
            "O(amount × C) time · O(amount) space",
    }),
},

{
    name: "Recursive Solution",

    detect: detectRecursion,

    result: (details) => ({
        detected: true,

        pattern: "Recursive Solution",

        startLine: details.startLine,
        endLine: details.endLine,

        timeComplexity: "O(C^amount)",

        spaceComplexity: "O(amount)",

        recommendation:
            "Use Memoization or Dynamic Programming",

        explanation:
            "The solution recursively explores multiple ways to construct the target amount and repeatedly evaluates the same subproblems. Without memoization, the number of recursive calls can grow exponentially.",

        optimizedComplexity:
            "O(amount × C) time · O(amount) space",

        optimizedCode: `bool canMakeChange(const vector<int>& coins, int amount) {
    vector<bool> dp(amount + 1, false);
    dp[0] = true;

    for (int current = 1; current <= amount; current++) {
        for (int coin : coins) {
            if (current >= coin &&
                dp[current - coin]) {
                dp[current] = true;
                break;
            }
        }
    }

    return dp[amount];
}`,
    }),
},

    {
        name: "Nested Loop",

        detect: detectNestedLoop,

        result: (details) => {
if (details.type === "duplicate-detection") {
    return {
        detected: true,
        pattern: "Duplicate Detection Pattern",
        startLine: details.startLine,
        endLine: details.endLine,

        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",

        recommendation: "Use a Hash Set",

        explanation:
            "The solution compares pairs of array elements using nested loops to determine whether a duplicate exists. This causes repeated comparisons and results in quadratic time complexity.",

        optimizedComplexity:
            "O(n) average time · O(n) space",

        optimizedCode: `bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;

    for (int num : nums) {
        if (seen.count(num)) {
            return true;
        }

        seen.insert(num);
    }

    return false;
}`,
    };
}

if (details.type === "two-sum") {
    return {
        detected: true,
        pattern: "Two Sum Brute Force",

        startLine: details.startLine,
        endLine: details.endLine,

        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",

        recommendation:
            "Use a Hash Map",

        explanation:
            "The solution checks pairs of array elements using nested loops. A hash map can store previously visited values and find the required complement in constant average time.",

        optimizedComplexity:
            "O(n) average time · O(n) space",

        optimizedCode: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;

    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];

        if (seen.count(complement)) {
            return {seen[complement], i};
        }

        seen[nums[i]] = i;
    }

    return {};
}`,
    };
}

            return {
                detected: true,
                pattern: "Nested Loop",
                startLine: details.startLine,
                endLine: details.endLine,
                timeComplexity: "O(n²)",
                spaceComplexity: "O(1)",
                recommendation:
                    "Consider a more efficient algorithm or data structure",
                explanation:
                    "A nested loop performs repeated operations across the input, which can lead to quadratic time complexity.",
                optimizedComplexity: "Depends on the optimization",
            };
        },
    },

    {
        name: "Repeated Linear Search",

        detect: detectRepeatedLinearSearch,

        result: (details) => ({
            detected: true,

            pattern: "Repeated Linear Search",

            startLine: details.startLine,
            endLine: details.endLine,

            timeComplexity: "O(n²)",
            spaceComplexity: "O(1)",

            recommendation: "Use a Hash Set or Hash Map",

            explanation:
                "A linear search is being performed inside a loop. Each search may scan the array, causing repeated traversal of the input.",

            optimizedComplexity: "O(n) average time · O(n) space",

            optimizedCode: `unordered_set<int> seen;

for (int num : nums) {
    seen.insert(num);
}

for (int target : targets) {
    if (seen.count(target)) {
        cout << "Found";
    }
}`,
        }),
    },

    {
    name: "Sorting Inside Loop",

    detect: detectSortingInsideLoop,

    result: (details) => ({
        detected: true,

        pattern: "Sorting Inside Loop",

        startLine: details.startLine,
        endLine: details.endLine,

        timeComplexity: "O(n² log n)",
        spaceComplexity: "O(1)",

        recommendation:
            "Move sorting outside the loop or use a more efficient data structure",

        explanation:
            "A sorting operation is being performed inside a loop. Sorting typically takes O(n log n), so repeatedly sorting inside a loop can significantly increase the overall running time.",

        optimizedComplexity:
            "Potentially O(n log n) or better",

        optimizedCode: `// Sort once before the loop
sort(nums.begin(), nums.end());

for (int i = 0; i < n; i++) {
    // Perform the required loop operations
}`,
    }),
},

{
    name: "Loop-Invariant Computation",

    detect: detectLoopInvariant,

    result: (details) => ({
        detected: true,

        pattern: "Loop-Invariant Computation",

        startLine: details.startLine,
        endLine: details.endLine,

        timeComplexity: "O(n)",

        spaceComplexity: "O(1)",

        recommendation:
            "Move the repeated computation outside the loop",

        explanation:
            "A computation that does not depend on the loop variable is being repeated inside the loop. Moving it outside avoids unnecessary work on every iteration.",

        optimizedComplexity:
            "O(n) with reduced constant work",

        optimizedCode: `int size = nums.size();

for (int i = 0; i < n; i++) {
    // Use size instead of calling nums.size()
}`,
    }),
},
{
    name: "Redundant Array Traversal",

    detect: detectRedundantTraversal,

    result: (details) => ({
        detected: true,

        pattern: "Redundant Array Traversal",

        startLine: details.startLine,
        endLine: details.endLine,

        timeComplexity: "O(2n)",

        spaceComplexity: "O(1)",

        recommendation:
            "Combine multiple traversals into a single loop when possible.",

        explanation:
            `The array "${details.array}" is traversed multiple times. Independent computations like sum, minimum, maximum, or counting can often be merged into one pass.`,

        optimizedComplexity: "O(n)",

        optimizedCode: `int sum = 0;
int maxVal = nums[0];

for (int i = 0; i < nums.size(); i++) {
    sum += nums[i];
    maxVal = max(maxVal, nums[i]);
}`,
    }),
},
];

module.exports = { analyzerRules };