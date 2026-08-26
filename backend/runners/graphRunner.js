function buildGraphHarness(
    code,
    testCases,
    functionName,
    parameters
) {
    const testCasesCode = testCases
        .map((testCase) => {
            const input = JSON.parse(testCase.input);

            const firstParameter = parameters[0];
            const secondParameter = parameters[1];

            const firstName =
                firstParameter.name;

            const secondName =
                secondParameter.name;

            const firstValue =
                input[firstName];

            const secondValue =
                input[secondName] || [];

            const edgesInitializer = `{${secondValue
                .map(
                    (edge) =>
                        `{${edge.join(", ")}}`
                )
                .join(", ")}}`;

            return `
    {
        int ${firstName} =
            ${firstValue};

        vector<vector<int>> ${secondName} =
            ${edgesInitializer};

        cout << ${functionName}(
            ${firstName},
            ${secondName}
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

module.exports = buildGraphHarness;