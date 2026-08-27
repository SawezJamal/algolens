function detectRedundantTraversal(code) {
    const lines = code.split("\n");

    const traversals = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line.startsWith("for")) continue;

        const match = line.match(
            /([a-zA-Z_][a-zA-Z0-9_]*)\.size\s*\(/
        );

        if (!match) continue;

        const arrayName = match[1];

        traversals.push({
            array: arrayName,
            startLine: i + 1,
        });
    }

    /*
     * Nested loops are not redundant traversals.
     *
     * Example:
     *
     * for (...) {
     *     for (...) {
     *
     * Both loops may use nums.size(), but this
     * represents nested traversal rather than
     * two independent passes.
     */

    for (let i = 0; i < traversals.length; i++) {
        for (let j = i + 1; j < traversals.length; j++) {
            if (
                traversals[i].array ===
                traversals[j].array
            ) {
                const betweenLines = lines.slice(
                    traversals[i].startLine,
                    traversals[j].startLine - 1
                );

                const hasClosingBrace =
                    betweenLines.some((line) =>
                        line.trim() === "}"
                    );

                /*
                 * If the second loop occurs before the
                 * first loop has closed, it is nested.
                 */
                if (!hasClosingBrace) {
                    continue;
                }

                return {
                    array: traversals[i].array,
                    startLine: traversals[i].startLine,
                    endLine: traversals[j].startLine,
                };
            }
        }
    }

    return null;
}

module.exports = {
    detectRedundantTraversal,
};