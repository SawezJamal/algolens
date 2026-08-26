function buildCoinChangeHarness(code, testCases) {
    const testData = testCases.map((testCase) => {
        const input = JSON.parse(testCase.input);

        return {
            coins: input.coins || [],
            amount: input.amount,
        };
    });

    const testCasesCode = testData
        .map((testCase) => {
            const coinsInitializer =
                `{${testCase.coins.join(", ")}}`;

            return `
    {
        vector<int> coins = ${coinsInitializer};
        int amount = ${testCase.amount};

        cout << canMakeChange(coins, amount) << endl;
    }
`;
        })
        .join("\n");

    return `
#include <bits/stdc++.h>
using namespace std;

${code}

int main() {
${testCasesCode}

    return 0;
}
`;
}

module.exports = buildCoinChangeHarness;