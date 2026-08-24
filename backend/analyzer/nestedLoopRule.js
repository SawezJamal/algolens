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
                const endLine = findLoopEnd(lines, j);

                const duplicatePattern = detectDuplicateComparison(
                    lines,
                    i,
                    j,
                    endLine
                );

                return {
                    startLine: i + 1,
                    endLine,
                    type: duplicatePattern
                        ? "duplicate-detection"
                        : "nested-loop",
                };
            }

            if (loopStarted && braceDepth === 0) {
                break;
            }
        }
    }

    return null;
}

function findLoopEnd(lines, startLine) {
    let braceDepth = 0;
    let started = false;

    for (let i = startLine; i < lines.length; i++) {
        for (const char of lines[i]) {
            if (char === "{") {
                braceDepth++;
                started = true;
            }

            if (char === "}") {
                braceDepth--;
            }
        }

        if (started && braceDepth === 0) {
            return i + 1;
        }
    }

    return startLine + 1;
}

function detectDuplicateComparison(lines, outerStart, innerStart, endLine) {
    const relevantLines = lines
        .slice(innerStart, endLine)
        .join(" ");

    return (
        relevantLines.includes("==") &&
        (
            relevantLines.includes("[i]") ||
            relevantLines.includes("[j]")
        )
    );
}

module.exports = {
    detectNestedLoop,
};