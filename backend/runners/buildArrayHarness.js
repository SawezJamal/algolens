function resolveParameterValue(input, parameter) {
    return input[parameter.name];
}


function buildParameterDeclaration(parameter, value) {
    if (parameter.type === "vector<int>") {
        const values =
            Array.isArray(value)
                ? value
                : [];

        return `
        vector<int> ${parameter.name} = {
            ${values.join(", ")}
        };`;
    }


    if (parameter.type === "vector<string>") {
        const values =
            Array.isArray(value)
                ? value
                : [];

        const escapedValues = values.map(
            (item) =>
                `"${String(item)
                    .replace(/\\/g, "\\\\")
                    .replace(/"/g, '\\"')}"`
        );

        return `
        vector<string> ${parameter.name} = {
            ${escapedValues.join(", ")}
        };`;
    }


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


    if (parameter.type === "string") {
        const safeValue =
            typeof value === "string"
                ? value
                    .replace(/\\/g, "\\\\")
                    .replace(/"/g, '\\"')
                : "";

        return `
        string ${parameter.name} =
            "${safeValue}";`;
    }


    throw new Error(
        `Unsupported parameter type: ${parameter.type}`
    );
}


function buildOutputCode(
    functionName,
    functionArguments,
    returnType
) {

    /*
     * int
     */
    if (returnType === "int") {
        return `
        cout << ${functionName}(
            ${functionArguments}
        ) << endl;`;
    }


    /*
     * vector<int>
     *
     * Example:
     * [3, 4]
     *
     * Printed as:
     * 3 4
     */
    if (returnType === "vector<int>") {
        return `
        vector<int> result =
            ${functionName}(
                ${functionArguments}
            );

        for (size_t i = 0; i < result.size(); ++i) {
            if (i > 0) {
                cout << " ";
            }

            cout << result[i];
        }

        cout << endl;`;
    }


    /*
     * vector<string>
     */
    if (returnType === "vector<string>") {
        return `
        vector<string> result =
            ${functionName}(
                ${functionArguments}
            );

        for (size_t i = 0; i < result.size(); ++i) {
            if (i > 0) {
                cout << " ";
            }

            cout << result[i];
        }

        cout << endl;`;
    }


    /*
     * vector<vector<string>>
     *
     * Used by Group Anagrams.
     *
     * Example:
     *
     * {
     *     {"eat","tea","ate"},
     *     {"tan","nat"},
     *     {"bat"}
     * }
     *
     * Prints:
     *
     * {eat,tea,ate} {tan,nat} {bat}
     *
     * Empty string is printed as:
     *
     * <EMPTY>
     */
    if (
        returnType ===
        "vector<vector<string>>"
    ) {
        return `
        vector<vector<string>> result =
            ${functionName}(
                ${functionArguments}
            );

        for (size_t i = 0; i < result.size(); ++i) {

            if (i > 0) {
                cout << " ";
            }

            cout << "{";

            for (
                size_t j = 0;
                j < result[i].size();
                ++j
            ) {

                if (j > 0) {
                    cout << ",";
                }

                if (result[i][j].empty()) {
                    cout << "<EMPTY>";
                } else {
                    cout << result[i][j];
                }
            }

            cout << "}";
        }

        cout << endl;`;
    }


    /*
     * bool
     */
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


    /*
     * string
     */
    if (returnType === "string") {
        return `
        cout << ${functionName}(
            ${functionArguments}
        ) << endl;`;
    }


    throw new Error(
        `Unsupported return type: ${returnType}`
    );
}


function buildArrayHarness(
    code,
    testCases,
    functionName,
    parameters,
    returnType
) {

    if (!code) {
        throw new Error(
            "Code is required to build array harness"
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


    /*
     * Build one main block for every test case.
     */
    const testCasesCode =
        testCases
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


                /*
                 * Build declarations such as:
                 *
                 * vector<int> nums = {1,2,3};
                 * int target = 3;
                 */
                const parameterDeclarations =
                    parameters
                        .map((parameter) => {

                            const value =
                                resolveParameterValue(
                                    input,
                                    parameter
                                );

                            return buildParameterDeclaration(
                                parameter,
                                value
                            );
                        })
                        .join("\n");


                /*
                 * Build:
                 *
                 * nums, target
                 */
                const functionArguments =
                    parameters
                        .map(
                            (parameter) =>
                                parameter.name
                        )
                        .join(", ");


                /*
                 * Build code that calls the
                 * user's function and prints
                 * the result.
                 */
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


    /*
     * IMPORTANT:
     *
     * The user's submitted code is inserted
     * exactly once.
     *
     * We add our own include only once.
     */
    const harness = `#include <bits/stdc++.h>
using namespace std;

${code}

int main() {

${testCasesCode}

    return 0;
}
`;


    console.log(
        "=== GENERATED HARNESS ==="
    );

    console.log(harness);

    console.log(
        "========================"
    );


    return harness;
}


module.exports =
    buildArrayHarness;