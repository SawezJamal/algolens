function detectRedundantTraversal(code) {
    const lines = code.split("\n");

    const traversals = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line.startsWith("for")) continue;

        // Detect: for(... < array.size() ...)
        const match = line.match(/([a-zA-Z_][a-zA-Z0-9_]*)\.size\s*\(/);

        if (!match) continue;

        const arrayName = match[1];

        traversals.push({
            array: arrayName,
            startLine: i + 1,
        });
    }

    for (let i = 0; i < traversals.length; i++) {
        for (let j = i + 1; j < traversals.length; j++) {
            if (traversals[i].array === traversals[j].array) {
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

module.exports = { detectRedundantTraversal };