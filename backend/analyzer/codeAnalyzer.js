const { analyzerRules } = require("./");

/*
|--------------------------------------------------------------------------
| Utility: count loops
|--------------------------------------------------------------------------
*/

function countLoops(code) {
    return (
        (code.match(/\bfor\s*\(/g) || []).length +
        (code.match(/\bwhile\s*\(/g) || []).length
    );
}

/*
|--------------------------------------------------------------------------
| Utility: detect nested loops
|--------------------------------------------------------------------------
*/

function detectNestedLoopStructure(code) {
    const lines = code.split("\n");

    let depth = 0;
    let loopDepth = 0;
    let maxLoopDepth = 0;

    for (const line of lines) {
        const trimmed = line.trim();

        if (/^(for|while)\s*\(/.test(trimmed)) {
            loopDepth++;
            maxLoopDepth = Math.max(
                maxLoopDepth,
                loopDepth
            );
        }

        for (const char of line) {
            if (char === "{") {
                depth++;
            }

            if (char === "}") {
                depth = Math.max(0, depth - 1);
            }
        }

        /*
         * Approximation for common C++ formatting.
         * Existing specific rules remain responsible
         * for exact pattern detection.
         */
    }

    return maxLoopDepth;
}

/*
|--------------------------------------------------------------------------
| Detect efficient algorithmic patterns
|--------------------------------------------------------------------------
|
| These are used only when no inefficient rule fires.
|
*/

function detectEfficientPattern(code) {

    // --------------------------------------------------------
    // Binary Search
    // --------------------------------------------------------

    const hasBinarySearchStructure =
        /\b(low|left)\b/.test(code) &&
        /\b(high|right)\b/.test(code) &&
        /\b(mid|middle)\b/.test(code) &&
        /\bwhile\s*\(/.test(code);

    if (hasBinarySearchStructure) {
        return {
            pattern: "Binary Search",

            timeComplexity:
                "O(log n)",

            spaceComplexity:
                "O(1)",

            explanation:
                "The algorithm repeatedly divides the search interval into smaller halves.",
        };
    }

    // --------------------------------------------------------
    // Hash Map
    // --------------------------------------------------------

    const hasHashMap =
        /\b(unordered_map|unordered_multimap|map|multimap)\s*</.test(
            code
        );

    if (hasHashMap) {

        const hasTraversal =
            /\b(for|while)\s*\(/.test(code);

        if (hasTraversal) {

            return {
                pattern:
                    "Hash Map Based Traversal",

                timeComplexity:
                    "O(n) average",

                spaceComplexity:
                    "O(n)",

                explanation:
                    "The implementation combines a traversal with hash-based storage or lookup, giving average constant-time lookups.",
            };
        }
    }

    // --------------------------------------------------------
    // Hash Set
    // --------------------------------------------------------

    const hasHashSet =
        /\b(unordered_set|unordered_multiset|set|multiset)\s*</.test(
            code
        );

    if (hasHashSet) {

        const hasTraversal =
            /\b(for|while)\s*\(/.test(code);

        if (hasTraversal) {

            return {
                pattern:
                    "Hash Set Based Traversal",

                timeComplexity:
                    "O(n) average",

                spaceComplexity:
                    "O(n)",

                explanation:
                    "The implementation uses a set for efficient membership checking while traversing the input.",
            };
        }
    }

    // --------------------------------------------------------
    // Sorting
    // --------------------------------------------------------

    const hasSort =
        /\b(sort|stable_sort)\s*\(/.test(
            code
        );

    if (hasSort) {

        return {
            pattern:
                "Sorting",

            timeComplexity:
                "O(n log n)",

            spaceComplexity:
                "O(1)",

            explanation:
                "The algorithm performs comparison-based sorting, which generally requires O(n log n) time.",
        };
    }

    // --------------------------------------------------------
    // Two Pointer Pattern
    // --------------------------------------------------------

    const hasTwoPointers =
        /\b(left|l)\b/.test(code) &&
        /\b(right|r)\b/.test(code) &&
        /\bwhile\s*\(/.test(code);

    if (hasTwoPointers) {

        return {
            pattern:
                "Two Pointer Technique",

            timeComplexity:
                "O(n)",

            spaceComplexity:
                "O(1)",

            explanation:
                "The implementation maintains two positions and moves them through the input without repeatedly restarting the traversal.",
        };
    }

    // --------------------------------------------------------
    // Sliding Window
    // --------------------------------------------------------

    const hasSlidingWindow =
        /\b(window|left|right)\b/.test(code) &&
        /\b(for|while)\s*\(/.test(code) &&
        (
            /\bright\s*\+\+/.test(code) ||
            /\bright\s*\+=/.test(code)
        );

    if (hasSlidingWindow) {

        return {
            pattern:
                "Sliding Window",

            timeComplexity:
                "O(n)",

            spaceComplexity:
                "O(1)",

            explanation:
                "The algorithm maintains a moving window over the input and advances its boundaries without restarting the traversal.",
        };
    }

    // --------------------------------------------------------
    // Prefix Sum
    // --------------------------------------------------------

    const hasPrefixSum =
        /\b(prefix|prefixSum|prefix_sum)\b/i.test(
            code
        );

    if (hasPrefixSum) {

        return {
            pattern:
                "Prefix Sum",

            timeComplexity:
                "O(n)",

            spaceComplexity:
                "O(n)",

            explanation:
                "The implementation precomputes cumulative values so later range or aggregate queries can be answered efficiently.",
        };
    }

    // --------------------------------------------------------
    // Single Traversal
    // --------------------------------------------------------

    const loopCount =
        countLoops(code);

    if (loopCount === 1) {

        return {
            pattern:
                "Single Array Traversal",

            timeComplexity:
                "O(n)",

            spaceComplexity:
                "O(1)",

            explanation:
                "The implementation performs a single traversal over the input.",
        };
    }

    return null;
}

/*
|--------------------------------------------------------------------------
| Select the most important finding
|--------------------------------------------------------------------------
*/

function selectPrimaryFinding(findings) {

    if (
        !findings ||
        findings.length === 0
    ) {
        return null;
    }

    const priority = {

        "Two Sum Brute Force":
            100,

        "Duplicate Detection Pattern":
            100,

        "Sorting Inside Loop":
            95,

        "Repeated Linear Search":
            90,

        "Recursive Solution":
            85,

        "Nested Loop":
            80,

        "Redundant Array Traversal":
            70,

        "Loop-Invariant Computation":
            40,

        "Coin Change DP":
            30,

        "Binary Search":
            10,
    };

    return [...findings].sort(
        (a, b) => {

            const aScore =
                priority[a.pattern] || 0;

            const bScore =
                priority[b.pattern] || 0;

            return (
                bScore - aScore
            );
        }
    )[0];
}

/*
|--------------------------------------------------------------------------
| Remove misleading findings
|--------------------------------------------------------------------------
*/

function cleanFindings(findings) {

    if (
        !Array.isArray(findings)
    ) {
        return [];
    }

    let cleaned = [
        ...findings,
    ];

    /*
     * Specific array patterns should override
     * the generic nested-loop rule.
     */

    const hasSpecificNestedPattern =
        cleaned.some(
            (finding) =>
                finding.pattern ===
                    "Two Sum Brute Force" ||
                finding.pattern ===
                    "Duplicate Detection Pattern"
        );

    if (hasSpecificNestedPattern) {

        cleaned =
            cleaned.filter(
                (finding) =>
                    finding.pattern !==
                    "Nested Loop"
            );
    }

    /*
     * DP should override generic nested-loop
     * detection.
     */

    const hasDP =
        cleaned.some(
            (finding) =>
                finding.pattern ===
                "Dynamic Programming"
        );

    if (hasDP) {

        cleaned =
            cleaned.filter(
                (finding) =>
                    finding.pattern !==
                    "Nested Loop"
            );
    }

    /*
     * Binary search should not also be reported
     * as a generic nested loop.
     */

    const hasBinarySearch =
        cleaned.some(
            (finding) =>
                finding.pattern ===
                "Binary Search"
        );

    if (hasBinarySearch) {

        cleaned =
            cleaned.filter(
                (finding) =>
                    finding.pattern !==
                    "Nested Loop"
            );
    }

    return cleaned;
}

/*
|--------------------------------------------------------------------------
| Main Analyzer
|--------------------------------------------------------------------------
*/

function analyzeCode(code) {

    // --------------------------------------------------------
    // Validate
    // --------------------------------------------------------

    if (
        !code ||
        typeof code !== "string" ||
        !code.trim()
    ) {

        return {

            detected: false,

            findings: [],

            pattern:
                "Invalid Code",

            timeComplexity:
                "Not determined",

            spaceComplexity:
                "Not determined",

            recommendation:
                "Provide valid source code",

            explanation:
                "No source code was provided for analysis.",

            optimizedComplexity:
                "Not determined",

            optimizedCode:
                null,
        };
    }

    let findings = [];

    // --------------------------------------------------------
    // Execute all rules
    // --------------------------------------------------------

    for (
        const rule of analyzerRules
    ) {

        try {

            const details =
                rule.detect(code);

            if (!details) {
                continue;
            }

            const result =
                typeof rule.result ===
                "function"

                    ? rule.result(
                        details
                    )

                    : rule.result;

            if (!result) {
                continue;
            }

            findings.push({

                rule:
                    rule.name,

                ...result,
            });

        } catch (error) {

            console.error(
                `Analyzer rule failed: ${rule.name}`,
                error
            );
        }
    }

    // --------------------------------------------------------
    // Clean conflicting findings
    // --------------------------------------------------------

    findings =
        cleanFindings(findings);

    // --------------------------------------------------------
    // Inefficiency detected
    // --------------------------------------------------------

    if (
        findings.length > 0
    ) {

        const primaryFinding =
            selectPrimaryFinding(
                findings
            );

        return {

            detected: true,

            findings,

            pattern:
                primaryFinding.pattern,

            timeComplexity:
                primaryFinding.timeComplexity ||
                "Not determined",

            spaceComplexity:
                primaryFinding.spaceComplexity ||
                "Not determined",

            recommendation:
                primaryFinding.recommendation ||
                "Review the detected optimization opportunity.",

            explanation:
                primaryFinding.explanation ||
                "An optimization opportunity was detected.",

            optimizedComplexity:
                primaryFinding.optimizedComplexity ||
                "Not determined",

            optimizedCode:
                primaryFinding.optimizedCode ||
                null,
        };
    }

    // --------------------------------------------------------
    // Recognized efficient pattern
    // --------------------------------------------------------

    const efficientPattern =
        detectEfficientPattern(
            code
        );

    if (
        efficientPattern
    ) {

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
                efficientPattern.explanation,

            optimizedComplexity:
                "Already efficient",

            optimizedCode:
                null,
        };
    }

    // --------------------------------------------------------
    // Unknown
    // --------------------------------------------------------

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

        optimizedCode:
            null,
    };
}

module.exports =
    analyzeCode;