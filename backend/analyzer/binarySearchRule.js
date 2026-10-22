function detectBinarySearch(code) {
    const lines = code.split("\n");

    let startLine = null;
    let endLine = null;

    const hasLow =
        /\b(low|left)\b/.test(code);

    const hasHigh =
        /\b(high|right)\b/.test(code);

    const hasMid =
        /\b(mid|middle)\b/.test(code);

    const hasHalving =
        /\/\s*2|>>\s*1/.test(code);

    const hasSearchLoop =
        /\bwhile\s*\(/.test(code) ||
        /\bfor\s*\(/.test(code);

    const hasRangeUpdate =
        /\b(low|left)\s*=/.test(code) &&
        /\b(high|right)\s*=/.test(code);

    /*
     * Stronger structural evidence:
     *
     * 1. Search boundaries exist
     * 2. Middle position exists
     * 3. Search space is divided
     * 4. A loop performs the search
     * 5. Boundaries are updated
     */
    if (
        !hasLow ||
        !hasHigh ||
        !hasMid ||
        !hasHalving ||
        !hasSearchLoop ||
        !hasRangeUpdate
    ) {
        return null;
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        const hasBoundary =
            /\b(low|left)\b/.test(line) &&
            /\b(high|right)\b/.test(line);

        const hasMidLine =
            /\b(mid|middle)\b/.test(line);

        if (
            hasBoundary ||
            hasMidLine
        ) {
            if (startLine === null) {
                startLine = i + 1;
            }

            endLine = i + 1;
        }
    }

    return {
        startLine: startLine || 1,
        endLine: endLine || lines.length,
    };
}

module.exports = {
    detectBinarySearch,
};