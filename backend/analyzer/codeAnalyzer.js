const { analyzerRules } = require("./");

function detectEfficientPattern(code) {
    // -----------------------------------------
    // Binary Search
    // -----------------------------------------
    const hasBinarySearch =
        /\bwhile\s*\([^)]*(low|left)[^)]*(high|right)[^)]*\)/i.test(code) &&
        /\b(mid|middle)\b/.test(code) &&
        /\b(low|left)\s*=|\b(high|right)\s*=/.test(code);

    if (hasBinarySearch) {
        return {
            pattern: "Binary Search",
            timeComplexity: "O(log n)",
            spaceComplexity: "O(1)",
        };
    }

    // -----------------------------------------
    // Hash Map
    // -----------------------------------------
    const hasHashMap =
        /\b(unordered_map|map)\s*</.test(code);

    if (hasHashMap) {
        const hasLoop =
            /\b(for|while)\s*\(/.test(code);

        if (hasLoop) {
            return {
                pattern: "Hash Map Lookup",
                timeComplexity:
                    "O(n) average",
                spaceComplexity: "O(n)",
            };
        }
    }

    // -----------------------------------------
    // Hash Set
    // -----------------------------------------
    const hasHashSet =
        /\b(unordered_set|set)\s*</.test(code);

    if (hasHashSet) {
        const hasLoop =
            /\b(for|while)\s*\(/.test(code);

        if (hasLoop) {
            return {
                pattern: "Hash Set Lookup",
                timeComplexity:
                    "O(n) average",
                spaceComplexity: "O(n)",
            };
        }
    }

    // -----------------------------------------
    // Single Array Traversal
    // -----------------------------------------
    const loopCount =
        (code.match(/\bfor\s*\(/g) || [])
            .length +
        (code.match(/\bwhile\s*\(/g) || [])
            .length;

    const hasNestedLoop =
        /\bfor\s*\([^)]*\)\s*\{[\s\S]*?\bfor\s*\(/.test(
            code
        );

    if (
        loopCount === 1 &&
        !hasNestedLoop
    ) {
        return {
            pattern: "Single Array Traversal",
            timeComplexity: "O(n)",
            spaceComplexity: "O(1)",
        };
    }

    return null;
}

function analyzeCode(code) {
    let findings = [];

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

    /*
     * Some patterns are intentionally more specific
     * than the generic Nested Loop rule.
     *
     * Example:
     * Coin Change DP contains nested loops, but its
     * actual complexity is O(amount × C), not O(n²).
     */
    const hasDynamicProgramming =
        findings.some(
            (finding) =>
                finding.pattern ===
                "Dynamic Programming"
        );

    if (hasDynamicProgramming) {
        findings = findings.filter(
            (finding) =>
                finding.pattern !==
                "Nested Loop"
        );
    }

    /*
     * Remove generic Nested Loop findings if a
     * specific Binary Search rule already exists.
     */
    const hasBinarySearch =
        findings.some(
            (finding) =>
                finding.pattern ===
                "Binary Search"
        );

    if (hasBinarySearch) {
        findings = findings.filter(
            (finding) =>
                finding.pattern !==
                "Nested Loop"
        );
    }

    /*
     * If an inefficiency was detected, return the
     * existing rule-based analysis.
     */
    if (findings.length > 0) {
        return {
            detected: true,
            findings,
        };
    }

    /*
     * No inefficient rule detected.
     *
     * Try to identify a known efficient pattern
     * so complexity is not displayed as
     * "Not determined".
     */
    const efficientPattern =
        detectEfficientPattern(code);

    if (efficientPattern) {
        return {
            detected: false,
            findings: [],

            pattern:
                efficientPattern.pattern,

            timeComplexity:
                efficientPattern.timeComplexity,

            spaceComplexity:
                efficientPattern.spaceComplexity,

            recommendation:
                "No optimization suggested",

            explanation:
                "No supported inefficient pattern was detected. The current implementation uses a recognized efficient algorithmic pattern.",

            optimizedComplexity:
                "Already efficient",
        };
    }

    /*
     * Unknown code:
     * Do NOT guess the complexity.
     */
    return {
        detected: false,
        findings: [],

        pattern:
            "No major inefficiency detected",

        timeComplexity:
            "Not determined",

        spaceComplexity:
            "Not determined",

        recommendation:
            "No optimization suggested",

        explanation:
            "No supported inefficient pattern was detected by the current analyzer.",

        optimizedComplexity:
            "Already efficient",
    };
}

module.exports = analyzeCode;