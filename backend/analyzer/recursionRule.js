function detectRecursion(code) {
    if (
        !code ||
        typeof code !== "string"
    ) {
        return null;
    }

    // =========================================================
    // Find function definitions
    // =========================================================

    const functionRegex =
        /\b(?:bool|int|long|long long|double|float|void|string|vector\s*<[^>]+>)\s+(\w+)\s*\([^)]*\)\s*\{/g;

    const functions = [
        ...code.matchAll(functionRegex),
    ];

    for (const match of functions) {
        const functionName =
            match[1];

        const functionStart =
            match.index;

        const bodyStart =
            functionStart +
            match[0].length;

        const functionBody =
            code.slice(bodyStart);

        // =====================================================
        // Check whether function calls itself
        // =====================================================

        const recursiveCall =
            new RegExp(
                `\\b${functionName}\\s*\\(`
            ).test(functionBody);

        if (!recursiveCall) {
            continue;
        }

        // =====================================================
        // Detect memoization / DP
        // =====================================================

        const hasMemoization =
            /\b(memo|cache|dp)\b/i.test(
                code
            ) ||
            /\bvector\s*<\s*(?:bool|int|long|long long|double)\s*>\s+(?:memo|cache|dp)\b/i.test(
                code
            );

        // =====================================================
        // If recursion + memoization exists,
        // this is NOT the naive exponential case.
        // =====================================================

        if (hasMemoization) {
            continue;
        }

        // =====================================================
        // Determine function lines
        // =====================================================

        const lines =
            code.split("\n");

        let startLine = 1;
        let endLine =
            lines.length;

        let braceDepth = 0;
        let started = false;

        for (
            let i = 0;
            i < lines.length;
            i++
        ) {
            if (
                i + 1 <
                lines.length &&
                lines[i].includes(
                    functionName
                ) &&
                /\(/.test(lines[i])
            ) {
                startLine = i + 1;
                break;
            }
        }

        for (
            let i = startLine - 1;
            i < lines.length;
            i++
        ) {
            for (
                const char of lines[i]
            ) {
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
                endLine = i + 1;
                break;
            }
        }

        return {
            functionName,

            startLine,

            endLine,
        };
    }

    return null;
}

module.exports = {
    detectRecursion,
};