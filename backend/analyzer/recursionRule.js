function detectRecursion(code) {
    const functionMatch = code.match(
        /\b(?:bool|int|long|double|float|void|vector\s*<[^>]+>)\s+(\w+)\s*\([^)]*\)\s*\{/
    );

    if (!functionMatch) {
        return null;
    }

    const functionName = functionMatch[1];

    /*
     * Detect a call to the same function from
     * inside its own body.
     */
    const functionBodyStart =
        functionMatch.index +
        functionMatch[0].length;

    const functionBody =
        code.slice(functionBodyStart);

    const recursiveCall = new RegExp(
        `\\b${functionName}\\s*\\(`
    ).test(functionBody);

    if (!recursiveCall) {
        return null;
    }

    /*
     * Ignore recursion when memoization / DP is
     * already clearly present.
     */
    const hasMemoization =
        /\b(memo|dp|cache)\b/i.test(code) ||
        /\bvector\s*<\s*(bool|int|long|long long)\s*>\s+(dp|memo|cache)\b/i.test(
            code
        );

    if (hasMemoization) {
        return null;
    }

    const lines = code.split("\n");

    let startLine = 1;
    let endLine = lines.length;

    for (let i = 0; i < lines.length; i++) {
        if (
            lines[i].includes(
                functionName
            )
        ) {
            startLine = i + 1;
            break;
        }
    }

    return {
        functionName,
        startLine,
        endLine,
    };
}

module.exports = {
    detectRecursion,
};