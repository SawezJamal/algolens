function detectLoopInvariant(code) {
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

            /*
             * nums.size() in a loop condition such as:
             *
             * for (int i = 0; i < nums.size(); i++)
             *
             * is normal loop-bound usage and should not
             * be reported as a loop-invariant optimization.
             */
            const isLoopCondition = j === i;

            const containsSizeCall =
                currentLine.includes(".size()") ||
                currentLine.includes(".size ()");

            const sizeUsedOutsideCondition =
                containsSizeCall && !isLoopCondition;

            /*
             * Detect an actual assignment/repeated computation
             * involving size inside the loop.
             */
            const repeatedSizeComputation =
                sizeUsedOutsideCondition &&
                (
                    /\bint\s+\w+\s*=\s*\w+\.size\s*\(\s*\)/.test(
                        currentLine
                    ) ||
                    /\b\w+\s*=\s*\w+\.size\s*\(\s*\)/.test(
                        currentLine
                    )
                );

            if (
                j > i &&
                loopStarted &&
                braceDepth > 0 &&
                repeatedSizeComputation
            ) {
                return {
                    startLine: i + 1,
                    endLine: j + 1,
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

module.exports = {
    detectLoopInvariant,
};