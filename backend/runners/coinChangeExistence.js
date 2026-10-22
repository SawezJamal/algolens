function buildCoinChangeHarness(
    code,
    testCases,
    functionName,
    parameters,
    returnType
) {
    if (!code) {
        throw new Error(
            "Code is required to build coin change harness"
        );
    }

    if (!Array.isArray(testCases)) {
        throw new Error(
            "Test cases must be an array"
        );
    }

    if (!functionName) {
        throw new Error(
            "Function name is required"
        );
    }

    if (!Array.isArray(parameters)) {
        throw new Error(
            "Parameters must be an array"
        );
    }

    const testCasesCode = testCases
        .map((testCase, index) => {
            let input;

            try {
                input =
                    typeof testCase.input ===
                    "string"
                        ? JSON.parse(
                              testCase.input
                          )
                        : testCase.input;
            } catch (error) {
                throw new Error(
                    `Invalid JSON input for test case ${
                        index + 1
                    }: ${error.message}`
                );
            }

            const parameterDeclarations =
                parameters
                    .map((parameter) => {
                        const value =
                            input[
                                parameter.name
                            ];

                        if (
                            parameter.type ===
                            "vector<int>"
                        ) {
                            const values =
                                Array.isArray(value)
                                    ? value
                                    : [];

                            return `
        vector<int> ${
            parameter.name
        } = {
            ${values.join(", ")}
        };`;
                        }

                        if (
                            parameter.type ===
                            "int"
                        ) {
                            return `
        int ${
            parameter.name
        } =
            ${value ?? 0};`;
                        }

                        if (
                            parameter.type ===
                            "bool"
                        ) {
                            return `
        bool ${
            parameter.name
        } =
            ${
                value
                    ? "true"
                    : "false"
            };`;
                        }

                        throw new Error(
                            `Unsupported parameter type: ${parameter.type}`
                        );
                    })
                    .join("\n");

            const functionArguments =
                parameters
                    .map(
                        (parameter) =>
                            parameter.name
                    )
                    .join(", ");

            let outputCode;

            if (
                returnType ===
                "vector<int>"
            ) {
                outputCode = `
        vector<int> result =
            ${functionName}(
                ${functionArguments}
            );

        for (int value : result) {
            cout << value << " ";
        }

        cout << endl;`;
            } else if (
                returnType === "bool"
            ) {
                outputCode = `
        cout << (
            ${functionName}(
                ${functionArguments}
            )
            ? "true"
            : "false"
        ) << endl;`;
            } else {
                outputCode = `
        cout << ${functionName}(
            ${functionArguments}
        ) << endl;`;
            }

            return `
    // Test case ${index + 1}
    {
${parameterDeclarations}

${outputCode}
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

module.exports =
    buildCoinChangeHarness;