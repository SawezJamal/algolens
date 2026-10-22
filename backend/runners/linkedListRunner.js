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

function buildLinkedList(testCase, index) {
    const input = parseTestCaseInput(testCase, index);

    const values = Array.isArray(input.head)
        ? input.head
        : [];

    const pos = Number.isInteger(input.pos)
        ? input.pos
        : -1;

    if (values.length === 0) {
        return `
        ListNode* head = nullptr;
        `;
    }

    return `
        vector<ListNode*> nodes;

        for (int value : vector<int>{${values.join(", ")}}) {
            nodes.push_back(new ListNode(value));
        }

        for (size_t i = 0; i + 1 < nodes.size(); ++i) {
            nodes[i]->next = nodes[i + 1];
        }

        ${
            pos >= 0 && pos < values.length
                ? `nodes.back()->next = nodes[${pos}];`
                : ""
        }

        ListNode* head = nodes[0];
    `;
}

function buildLinkedListHarness(
    code,
    testCases,
    functionName,
    parameters,
    returnType
) {
    if (!code) {
        throw new Error(
            "Code is required to build linked list harness"
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

    const testCasesCode = testCases
        .map((testCase, index) => {
            const input = parseTestCaseInput(
                testCase,
                index
            );

            const listCode = buildLinkedList(
                testCase,
                index
            );

            return `
    // Test case ${index + 1}
    {
${listCode}

        cout << (
            ${functionName}(head)
            ? "1"
            : "0"
        ) << endl;
    }
`;
        })
        .join("\n");

    return `#include <bits/stdc++.h>
using namespace std;

${code}

int main() {

${testCasesCode}

    return 0;
}
`;
}

module.exports =
    buildLinkedListHarness;