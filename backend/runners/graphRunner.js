function parseTestCaseInput(testCase, index) {
    try {
        return typeof testCase.input === "string"
            ? JSON.parse(testCase.input)
            : testCase.input;
    } catch (error) {
        throw new Error(
            `Invalid JSON input for test case ${
                index + 1
            }: ${error.message}`
        );
    }
}


function buildVectorInitializer(value) {
    const values =
        Array.isArray(value)
            ? value
            : [];

    return `{${values.join(", ")}}`;
}


function buildNestedVectorInitializer(value) {
    const rows =
        Array.isArray(value)
            ? value
            : [];

    return `{${rows
        .map((row) =>
            buildVectorInitializer(row)
        )
        .join(", ")}}`;
}


function buildParameterDeclaration(
    parameter,
    value
) {
    if (parameter.type === "int") {
        return `
        int ${parameter.name} =
            ${value ?? 0};`;
    }

    if (parameter.type === "bool") {
        return `
        bool ${parameter.name} =
            ${value ? "true" : "false"};`;
    }

    if (parameter.type === "vector<int>") {
        return `
        vector<int> ${parameter.name} =
            ${buildVectorInitializer(value)};`;
    }

    if (
        parameter.type ===
        "vector<vector<int>>"
    ) {
        return `
        vector<vector<int>> ${parameter.name} =
            ${buildNestedVectorInitializer(value)};`;
    }

    throw new Error(
        `Unsupported graph parameter type: ${parameter.type}`
    );
}


function buildOutputCode(
    functionName,
    functionArguments,
    returnType
) {
    if (returnType === "vector<int>") {
        return `
        vector<int> result =
            ${functionName}(
                ${functionArguments}
            );

        for (int value : result) {
            cout << value << " ";
        }

        cout << endl;`;
    }

    if (
        returnType ===
        "vector<vector<int>>"
    ) {
        return `
        vector<vector<int>> result =
            ${functionName}(
                ${functionArguments}
            );

        for (const auto& row : result) {
            for (int value : row) {
                cout << value << " ";
            }

            cout << "| ";
        }

        cout << endl;`;
    }

    if (returnType === "bool") {
        return `
        cout << (
            ${functionName}(
                ${functionArguments}
            )
            ? "true"
            : "false"
        ) << endl;`;
    }

    return `
        cout << ${functionName}(
            ${functionArguments}
        ) << endl;`;
}


function buildGraphHarness(
    code,
    testCases,
    functionName,
    parameters,
    returnType
) {
    if (!code) {
        throw new Error(
            "Code is required to build graph harness"
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

    if (parameters.length === 0) {
        throw new Error(
            "At least one graph parameter is required"
        );
    }

    const testCasesCode =
        testCases
            .map((testCase, index) => {
                const input =
                    parseTestCaseInput(
                        testCase,
                        index
                    );

                const parameterDeclarations =
                    parameters
                        .map((parameter) => {
                            const value =
                                input[
                                    parameter.name
                                ];

                            return buildParameterDeclaration(
                                parameter,
                                value
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

                const outputCode =
                    buildOutputCode(
                        functionName,
                        functionArguments,
                        returnType
                    );

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
    buildGraphHarness;