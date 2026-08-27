function buildArrayHarness(
    code,
    testCases,
    functionName,
    parameters,
    returnType
) {
    const testCasesCode = testCases
        .map((testCase) => {
            const input = JSON.parse(testCase.input);

            const vectorParameter = parameters.find(
                (parameter) =>
                    parameter.type === "vector<int>"
            );

            const intParameter = parameters.find(
                (parameter) =>
                    parameter.type === "int"
            );

            if (!vectorParameter) {
                throw new Error(
                    "Array runner requires a vector<int> parameter."
                );
            }

            const vectorName =
                vectorParameter.name;

            const vectorValues =
                input[vectorName] || [];

            const vectorInitializer =
                `{${vectorValues.join(", ")}}`;

            // ----------------------------------
            // vector<int> only
            // ----------------------------------
            // ----------------------------------
            // vector<int> only
            // ----------------------------------
            if (!intParameter) {
                if (returnType === "vector<int>") {
                    return `
    {
        vector<int> ${vectorName} =
            ${vectorInitializer};

        vector<int> result =
            ${functionName}(
                ${vectorName}
            );

        for (int value : result) {
            cout << value << " ";
        }

        cout << endl;
    }
`;
                }

                return `
    {
        vector<int> ${vectorName} =
            ${vectorInitializer};

        bool result =
            ${functionName}(
                ${vectorName}
            );

        cout << (result ? "true" : "false") << endl;
    }
`;
            }

            // ----------------------------------
            // vector<int> + int
            // ----------------------------------

            const intName =
                intParameter.name;

            const intValue =
                input[intName];

            if (returnType === "vector<int>") {
                return `
    {
        vector<int> ${vectorName} =
            ${vectorInitializer};

        int ${intName} =
            ${intValue};

        vector<int> result =
            ${functionName}(
                ${vectorName},
                ${intName}
            );

        for (int value : result) {
            cout << value << " ";
        }

        cout << endl;
    }
`;
            }

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