function detectNestedLoop(code) {
    const lines = code.split("\n");

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line.startsWith("for")) {
            continue;
        }

        let braceDepth = 0;
        let loopStarted = false;

        for (let j = i; j < lines.length; j++) {
            const currentLine = lines[j];

            for (const char of currentLine) {
                if (char === "{") {
                    braceDepth++;
                    loopStarted = true;
                }

                if (char === "}") {
                    braceDepth--;
                }
            }

            if (
                j > i &&
                loopStarted &&
                braceDepth > 0 &&
                lines[j].trim().startsWith("for")
            ) {
                const endLine =
                    findLoopEnd(lines, j);

                const relevantLines = lines
                    .slice(i, endLine)
                    .join(" ");

                /*
                 * Detect duplicate comparison:
                 *
                 * nums[i] == nums[j]
                 * nums[j] == nums[i]
                 */
                const duplicatePattern =
                    detectDuplicateComparison(
                        lines,
                        i,
                        j,
                        endLine
                    );

                /*
                 * Detect Two Sum:
                 *
                 * nums[i] + nums[j] == target
                 * target == nums[i] + nums[j]
                 */
                const twoSumPattern =
                    detectTwoSumPattern(
                        relevantLines
                    );

                return {
                    startLine: i + 1,
                    endLine,

                    type: duplicatePattern
                        ? "duplicate-detection"
                        : twoSumPattern
                        ? "two-sum"
                        : "nested-loop",
                };
            }

            if (
                loopStarted &&
                braceDepth === 0
            ) {
                break;
            }
        }
    }

    return null;
}

function findLoopEnd(lines, startLine) {
    let braceDepth = 0;
    let started = false;

    for (
        let i = startLine;
        i < lines.length;
        i++
    ) {
        for (const char of lines[i]) {
            if (char === "{") {
                braceDepth++;
                started = true;
            }

            if (char === "}") {
                braceDepth--;
            }
        }

        if (
            started &&
            braceDepth === 0
        ) {
            return i + 1;
        }
    }

    return startLine + 1;
}

function detectDuplicateComparison(
    lines,
    outerStart,
    innerStart,
    endLine
) {
    const relevantLines = lines
        .slice(innerStart, endLine)
        .join(" ");

    /*
     * True duplicate comparison:
     *
     * nums[i] == nums[j]
     * nums[j] == nums[i]
     */
    const directDuplicateComparison =
        /\b\w+\[\s*i\s*\]\s*==\s*\w+\[\s*j\s*\]/
            .test(relevantLines) ||
        /\b\w+\[\s*j\s*\]\s*==\s*\w+\[\s*i\s*\]/
            .test(relevantLines);

    return directDuplicateComparison;
}

function detectTwoSumPattern(
    relevantLines
) {
    /*
     * Detect:
     *
     * nums[i] + nums[j] == target
     *
     * nums[i] + nums[j] != target
     *
     * target == nums[i] + nums[j]
     *
     * Allow whitespace between tokens.
     */
    const patternOne =
        /\b\w+\[\s*i\s*\]\s*\+\s*\w+\[\s*j\s*\]\s*==\s*\w+/
            .test(relevantLines);

    const patternTwo =
        /\b\w+\[\s*j\s*\]\s*\+\s*\w+\[\s*i\s*\]\s*==\s*\w+/
            .test(relevantLines);

    const patternThree =
        /\b\w+\s*==\s*\w+\[\s*i\s*\]\s*\+\s*\w+\[\s*j\s*\]/
            .test(relevantLines);

    const patternFour =
        /\b\w+\s*==\s*\w+\[\s*j\s*\]\s*\+\s*\w+\[\s*i\s*\]/
            .test(relevantLines);

    return (
        patternOne ||
        patternTwo ||
        patternThree ||
        patternFour
    );
}

module.exports = {
    detectNestedLoop,
};