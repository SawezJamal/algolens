function detectBinarySearch(code) {
    const lines = code.split("\n");

    let hasLow = false;
    let hasHigh = false;
    let hasMid = false;
    let hasHalving = false;

    let startLine = null;
    let endLine = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (
            line.includes("low") ||
            line.includes("left")
        ) {
            hasLow = true;
        }

        if (
            line.includes("high") ||
            line.includes("right")
        ) {
            hasHigh = true;
        }

        if (
            line.includes("mid") ||
            line.includes("middle")
        ) {
            hasMid = true;
        }

        if (
            line.includes("/ 2") ||
            line.includes(">> 1")
        ) {
            hasHalving = true;
        }

        if (
            (line.includes("low") ||
                line.includes("left")) &&
            (line.includes("high") ||
                line.includes("right"))
        ) {
            if (startLine === null) {
                startLine = i + 1;
            }

            endLine = i + 1;
        }
    }

    if (
        hasLow &&
        hasHigh &&
        hasMid &&
        hasHalving
    ) {
        return {
            startLine: startLine || 1,
            endLine: endLine || lines.length,
        };
    }

    return null;
}

module.exports = {
    detectBinarySearch,
};