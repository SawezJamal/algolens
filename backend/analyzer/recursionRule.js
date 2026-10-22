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

        // =====================================================
        // Extract ONLY this function's body
        // =====================================================

        let braceDepth = 1;
        let bodyEnd = bodyStart;

        for (
            let i = bodyStart;
            i < code.length;
            i++
        ) {

            const char = code[i];

            if (char === "{") {
                braceDepth++;
            }

            if (char === "}") {
                braceDepth--;

                if (braceDepth === 0) {
                    bodyEnd = i;
                    break;
                }
            }
        }

        // Could not determine the function body
        if (bodyEnd <= bodyStart) {
            continue;
        }

        const functionBody =
            code.slice(
                bodyStart,
                bodyEnd
            );

        // =====================================================
        // Check whether function calls itself
        // =====================================================

        const recursiveCallRegex =
            new RegExp(
                `\\b${functionName}\\s*\\(`
            );

        const recursiveCall =
            recursiveCallRegex.test(
                functionBody
            );

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
        let endLine = lines.length;

        let braceDepthForLines = 0;
        let started = false;

        // -----------------------------------------------------
        // Find function starting line
        // -----------------------------------------------------

        for (
            let i = 0;
            i < lines.length;
            i++
        ) {

            if (
                lines[i].includes(
                    functionName
                ) &&
                /\(/.test(lines[i])
            ) {

                startLine = i + 1;
                break;
            }
        }

        // -----------------------------------------------------
        // Find function ending line
        // -----------------------------------------------------

        for (
            let i = startLine - 1;
            i < lines.length;
            i++
        ) {

            for (
                const char of lines[i]
            ) {

                if (char === "{") {
                    braceDepthForLines++;
                    started = true;
                }

                if (char === "}") {
                    braceDepthForLines--;
                }
            }

            if (
                started &&
                braceDepthForLines === 0
            ) {

                endLine = i + 1;
                break;
            }
        }

        // =====================================================
        // Return recursion finding
        // =====================================================

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