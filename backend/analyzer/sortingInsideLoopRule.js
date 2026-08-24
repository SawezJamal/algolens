function detectSortingInsideLoop(code) {
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

            const containsSort =
                currentLine.includes("sort(") ||
                currentLine.includes("sort (") ||
                currentLine.includes("std::sort");

            if (
                j > i &&
                loopStarted &&
                braceDepth > 0 &&
                containsSort
            ) {
                return {
                    startLine: i + 1,
                    endLine: j + 1,
                };
            }

            if (loopStarted && braceDepth === 0) {
                break;
            }
        }
    }

    return null;
}

module.exports = { detectSortingInsideLoop };