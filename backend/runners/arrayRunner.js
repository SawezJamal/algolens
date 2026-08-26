function buildArrayHarness(
    code,
    testCases,
    functionName,
    parameters
) {
    const testCasesCode = testCases
        .map((testCase) => {
            const input = JSON.parse(
                testCase.input
            );

            const vectorParameter =
                parameters[0];

            const intParameter =
                parameters[1];

            const vectorName =
                vectorParameter.name;

            const intName =
                intParameter.name;

            const vectorValues =
                input[vectorName] || [];

            const intValue =
                input[intName];

            const vectorInitializer =
                `{${vectorValues.join(", ")}}`;

            return `
    {
        vector<int> ${vectorName} =
            ${vectorInitializer};

        int ${intName} =
            ${intValue};

        cout << ${functionName}(
            ${vectorName},
            ${intName}
        ) << endl;
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

module.exports = buildArrayHarness;