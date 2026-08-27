function detectCoinChange(code) {
    const lines = code.split("\n");

    let hasAmountLoop = false;
    let hasCoinsLoop = false;
    let hasDPArray = false;

    let startLine = null;
    let endLine = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Detect DP array such as:
        // vector<bool> dp(amount + 1, false);
        // vector<int> dp(amount + 1, 0);
        if (
            /\bvector\s*<\s*(bool|int)\s*>\s+dp\s*\(/.test(
                line
            ) &&
            line.includes("amount")
        ) {
            hasDPArray = true;

            if (startLine === null) {
                startLine = i + 1;
            }
        }

        // Detect outer amount loop:
        // for (int i = 1; i <= amount; i++)
        if (
            line.startsWith("for") &&
            line.includes("amount")
        ) {
            hasAmountLoop = true;

            if (startLine === null) {
                startLine = i + 1;
            }

            endLine = i + 1;
        }

        // Detect range-based coins loop:
        // for (int coin : coins)
        if (
            line.startsWith("for") &&
            /:\s*coins\b/.test(line)
        ) {
            hasCoinsLoop = true;
            endLine = i + 1;
        }
    }

    if (
        hasAmountLoop &&
        hasCoinsLoop &&
        hasDPArray
    ) {
        return {
            startLine: startLine || 1,
            endLine: endLine || lines.length,
        };
    }

    return null;
}

module.exports = {
    detectCoinChange,
};