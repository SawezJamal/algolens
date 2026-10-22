function parseTestCaseInput(testCase, index) {
    try {
        return typeof testCase.input === "string"
            ? JSON.parse(testCase.input)
            : testCase.input;
    } catch (error) {
        throw new Error(
            `Invalid JSON input for test case ${index + 1}: ${error.message}`
        );
    }
}


/*
 * Converts a level-order array such as:
 *
 * [5, 3, 6, 2, 4, null, 7]
 *
 * into the object representation expected by buildTree().
 */
function normalizeTree(value) {
    if (value === null || value === undefined) {
        return null;
    }

    // Already an object representation.
    if (!Array.isArray(value)) {
        return value;
    }

    if (value.length === 0 || value[0] === null) {
        return null;
    }

    const root = {
        val: value[0],
        left: null,
        right: null,
    };

    const queue = [root];
    let index = 1;

    while (queue.length > 0 && index < value.length) {
        const current = queue.shift();

        // Left child
        if (index < value.length) {
            const leftValue = value[index++];

            if (
                leftValue !== null &&
                leftValue !== undefined
            ) {
                current.left = {
                    val: leftValue,
                    left: null,
                    right: null,
                };

                queue.push(current.left);
            }
        }

        // Right child
        if (index < value.length) {
            const rightValue = value[index++];

            if (
                rightValue !== null &&
                rightValue !== undefined
            ) {
                current.right = {
                    val: rightValue,
                    left: null,
                    right: null,
                };

                queue.push(current.right);
            }
        }
    }

    return root;
}


function buildTree(value, name) {
    value = normalizeTree(value);

    if (value === null || value === undefined) {
        return `
        TreeNode* ${name} = nullptr;
        `;
    }

    const nodes = [];

    function collect(node, path) {
        if (!node) {
            return;
        }

        const index = nodes.length;

        nodes.push({
            node,
            path,
            index,
        });

        collect(node.left, `${path}.left`);
        collect(node.right, `${path}.right`);
    }

    collect(value, name);

    /*
     * IMPORTANT:
     *
     * Never use node0/node1/node2 here.
     *
     * A problem can have parameters called node1/node2.
     * Use a dedicated prefix for generated tree nodes.
     */
    const declarations =
        nodes
            .map(item => `
        TreeNode* __treeNode${item.index} =
            new TreeNode(${item.node.val});
        `)
            .join("\n");

    const links = [];

    for (const item of nodes) {
        if (item.node.left) {
            const child = nodes.find(
                child =>
                    child.path ===
                    `${item.path}.left`
            );

            if (child) {
                links.push(
                    `__treeNode${item.index}->left = __treeNode${child.index};`
                );
            }
        }

        if (item.node.right) {
            const child = nodes.find(
                child =>
                    child.path ===
                    `${item.path}.right`
            );

            if (child) {
                links.push(
                    `__treeNode${item.index}->right = __treeNode${child.index};`
                );
            }
        }
    }

    return `
        ${declarations}

        ${links.join("\n")}

        TreeNode* ${name} = __treeNode0;
    `;
}


function buildParameterDeclaration(
    parameter,
    value
) {
    if (parameter.type === "int") {
        return `
        int ${parameter.name} =
            ${value ?? 0};
        `;
    }

    if (parameter.type === "bool") {
        return `
        bool ${parameter.name} =
            ${value ? "true" : "false"};
        `;
    }

    if (parameter.type === "tree") {
        return buildTree(
            value,
            parameter.name
        );
    }

    throw new Error(
        `Unsupported tree parameter type: ${parameter.type}`
    );
}


function buildOutputCode(
    functionName,
    functionArguments,
    returnType
) {
    if (returnType === "bool") {
        return `
        cout << (
            ${functionName}(
                ${functionArguments}
            )
            ? 1
            : 0
        ) << endl;
        `;
    }

    return `
        cout << ${functionName}(
            ${functionArguments}
        ) << endl;
    `;
}


function buildTreeHarness(
    code,
    testCases,
    functionName,
    parameters,
    returnType
) {
    if (!code) {
        throw new Error(
            "Code is required to build tree harness"
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
            "At least one tree parameter is required"
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
                        .map(parameter => {
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
                            parameter =>
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
    buildTreeHarness;
