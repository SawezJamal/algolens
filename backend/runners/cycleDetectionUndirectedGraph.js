function buildCycleDetectionHarness(code, testCases) {
    const testCasesCode = testCases
        .map((testCase) => {
            const input = JSON.parse(testCase.input);

            const edges = input.edges || [];
            const numNodes = input.num_nodes;

            const edgesInitializer = `{${edges
                .map(
                    (edge) =>
                        `{${edge.join(", ")}}`
                )
                .join(", ")}}`;

            return `
    {
        int n = ${numNodes};

        vector<vector<int>> edges =
            ${edgesInitializer};

        cout << hasCycle(n, edges) << endl;
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

module.exports = buildCycleDetectionHarness;