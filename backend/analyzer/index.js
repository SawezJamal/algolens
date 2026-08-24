const { detectNestedLoop } = require("./nestedLoopRule");
const { detectRepeatedLinearSearch } = require("./linearSearchRule");
const { detectSortingInsideLoop } = require("./sortingInsideLoopRule");

const analyzerRules = [
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

                    optimizedComplexity: "O(n) average time · O(n) space",

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
];

module.exports = { analyzerRules };