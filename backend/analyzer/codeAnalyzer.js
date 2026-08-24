const { analyzerRules } = require("./");

function analyzeCode(code) {
    const findings = [];

    for (const rule of analyzerRules) {
        const details = rule.detect(code);

        if (details) {
            const result =
                typeof rule.result === "function"
                    ? rule.result(details)
                    : rule.result;

            findings.push({
                rule: rule.name,
                ...result,
            });
        }
    }

    if (findings.length === 0) {
        return {
            detected: false,
            findings: [],
            pattern: "No major inefficiency detected",
            timeComplexity: "O(n)",
            spaceComplexity: "O(1)",
            recommendation: "No optimization suggested",
            explanation:
                "No supported inefficient array pattern was detected by the current analyzer.",
            optimizedComplexity: "Already efficient",
        };
    }

    return {
        detected: true,
        findings,
    };
}

module.exports = analyzeCode;