require("dotenv").config();

const {
    generateRecommendation,
} = require("./geminiRecommender");

const code = `
vector<int> twoSum(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++) {
        for (int j = i + 1; j < nums.size(); j++) {
            if (nums[i] + nums[j] == target) {
                return {i, j};
            }
        }
    }

    return {};
}
`;

const findings = [
    {
        rule: "Nested Loop",
        pattern: "Nested Loop",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        recommendation:
            "Consider a more efficient algorithm or data structure",
    },
];

const mlAnalysis = {
    prediction: "Needs Optimization",
    confidence: 100,
};

generateRecommendation({
    code,
    findings,
    mlAnalysis,
})
    .then((result) => {
        console.log("\n===== GEMINI RECOMMENDATION =====\n");
        console.log(result);
    })
    .catch((error) => {
        console.error("\nGemini Error:", error);
    });