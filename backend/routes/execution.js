const express = require("express");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const Problem = require("../models/Problem");
const { getRunner } = require("../runners");

const router = express.Router();

function evaluateTestCases(problem, output) {
    const actualOutputs = output
        .trim()
        .split(/\r?\n/)
        .map((line) => line.trim());

    const results = problem.testCases.map(
        (testCase, index) => {
            const expected =
                testCase.output.trim();

            const actual =
                actualOutputs[index] ?? "";

            let passed =
                actual === expected;

            /*
             * Boolean outputs
             */
            if (
                problem.execution &&
                problem.execution.returnType === "bool"
            ) {
                const normalizeBool = (value) => {
                    const normalized =
                        String(value)
                            .trim()
                            .toLowerCase();

                    if (
                        normalized === "true" ||
                        normalized === "1"
                    ) {
                        return true;
                    }

                    if (
                        normalized === "false" ||
                        normalized === "0"
                    ) {
                        return false;
                    }

                    return null;
                };

                const expectedBool =
                    normalizeBool(expected);

                const actualBool =
                    normalizeBool(actual);

                passed =
                    expectedBool !== null &&
                    actualBool !== null &&
                    expectedBool === actualBool;
            }

            /*
             * vector<int>
             */
            if (
    problem.execution &&
    problem.execution.returnType ===
        "vector<int>"
) {
    try {
        let expectedArray;

        /*
         * vector<int> outputs can be stored in
         * either of these formats:
         *
         * JSON:
         * [0,1]
         *
         * Whitespace:
         * 3 4
         * -1 -1
         *
         * Support both formats.
         */

        const trimmedExpected =
            expected.trim();

        if (
            trimmedExpected.startsWith("[") &&
            trimmedExpected.endsWith("]")
        ) {
            expectedArray =
                JSON.parse(
                    trimmedExpected
                );
        } else {
            expectedArray =
                trimmedExpected
                    .split(/\s+/)
                    .filter(Boolean)
                    .map(Number);
        }

        const actualArray =
            actual
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .map(Number);

        passed =
            Array.isArray(
                expectedArray
            ) &&
            expectedArray.length ===
                actualArray.length &&
            expectedArray.every(
                (value, i) =>
                    Number.isFinite(
                        actualArray[i]
                    ) &&
                    actualArray[i] ===
                        Number(value)
            );

    } catch (error) {
        console.error(
            "vector<int> evaluation error:",
            error
        );

        passed = false;
    }
}

            /*
             * Two Sum
             *
             * Any valid pair of indices is accepted.
             */
            if (
                problem.slug === "two-sum"
            ) {
                try {
                    const testInput =
                        JSON.parse(
                            testCase.input
                        );

                    const values =
                        actual
                            .split(/\s+/)
                            .filter(Boolean)
                            .map(Number);

                    if (
                        values.length === 2 &&
                        values.every(
                            Number.isInteger
                        )
                    ) {
                        const [i, j] =
                            values;

                        passed =
                            i >= 0 &&
                            j >= 0 &&
                            i <
                                testInput.nums
                                    .length &&
                            j <
                                testInput.nums
                                    .length &&
                            i !== j &&
                            testInput.nums[i] +
                                testInput.nums[j] ===
                                testInput.target;
                    } else {
                        passed = false;
                    }
                } catch (error) {
                    passed = false;
                }
            }

            /*
             * Group Anagrams
             *
             * Runner output format:
             *
             * {eat,tea,ate} {tan,nat} {bat}
             *
             * Empty string:
             *
             * {<EMPTY>}
             *
             * Both group order and word order
             * are ignored.
             */
            if (
                problem.slug ===
                "group-anagrams"
            ) {
                try {
                    const expectedGroups =
                        JSON.parse(expected);

                    const actualGroups = [];

                    /*
                     * Extract every {...} group.
                     */
                    const groupMatches =
                        actual.match(
                            /\{[^}]*\}/g
                        ) || [];

                    for (
                        const groupText
                        of groupMatches
                    ) {
                        const content =
                            groupText.slice(
                                1,
                                -1
                            );

                        /*
                         * Empty string case.
                         */
                        if (
                            content ===
                            "<EMPTY>"
                        ) {
                            actualGroups.push(
                                [""]
                            );

                            continue;
                        }

                        /*
                         * Safety for empty group.
                         */
                        if (
                            content.trim() ===
                            ""
                        ) {
                            actualGroups.push(
                                [""]
                            );

                            continue;
                        }

                        const values =
                            content
                                .split(",")
                                .map(
                                    (value) =>
                                        value.trim()
                                )
                                .filter(
                                    (value) =>
                                        value.length >
                                        0
                                );

                        actualGroups.push(
                            values
                        );
                    }

                    /*
                     * Normalize:
                     *
                     * 1. Sort strings inside
                     *    each group.
                     *
                     * 2. Sort groups.
                     */
                    const normalizeGroups =
                        (groups) =>
                            groups
                                .map(
                                    (group) =>
                                        [...group]
                                            .sort()
                                )
                                .sort(
                                    (a, b) =>
                                        JSON.stringify(
                                            a
                                        ).localeCompare(
                                            JSON.stringify(
                                                b
                                            )
                                        )
                                );

                    const normalizedExpected =
                        normalizeGroups(
                            expectedGroups
                        );

                    const normalizedActual =
                        normalizeGroups(
                            actualGroups
                        );

                    passed =
                        JSON.stringify(
                            normalizedActual
                        ) ===
                        JSON.stringify(
                            normalizedExpected
                        );

                    /*
                     * Useful debugging.
                     */
                    if (!passed) {
                        console.log(
                            "=== GROUP ANAGRAM DEBUG ==="
                        );

                        console.log(
                            "Expected:",
                            JSON.stringify(
                                normalizedExpected
                            )
                        );

                        console.log(
                            "Actual:",
                            JSON.stringify(
                                normalizedActual
                            )
                        );

                        console.log(
                            "============================"
                        );
                    }
                } catch (error) {
                    console.error(
                        "Group Anagrams evaluation error:",
                        error
                    );

                    passed = false;
                }
            }

            return {
                testCase: index + 1,
                expected,
                actual,
                passed,
            };
        }
    );

    const passedCount =
        results.filter(
            (result) =>
                result.passed
        ).length;

    return {
        passed: passedCount,
        total: results.length,
        allPassed:
            results.length > 0 &&
            passedCount ===
                results.length,
        results,
    };
}

router.post(
    "/run",
    async (req, res) => {
        const {
            code,
            input = "",
            problemId,
        } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                type: "error",
                output:
                    "Code is required.",
                analysisAllowed: false,
            });
        }

        if (!problemId) {
            return res.status(400).json({
                success: false,
                type: "error",
                output:
                    "Problem ID is required.",
                analysisAllowed: false,
            });
        }

        let problem;

        try {
            problem =
                await Problem.findOne({
                    slug: problemId,
                });
        } catch (error) {
            console.error(
                "Failed to load problem:",
                error
            );

            return res.status(500).json({
                success: false,
                type: "error",
                output:
                    "Failed to load problem.",
                analysisAllowed: false,
            });
        }

        if (!problem) {
            return res.status(404).json({
                success: false,
                type: "error",
                output:
                    "Problem not found.",
                analysisAllowed: false,
            });
        }

        let executableCode = code;

        /*
         * Get generic runner from
         * problem metadata.
         */
        const runner =
            getRunner(problem);

        if (runner) {
            try {
                const testCases =
                    problem.testCases;

                if (
                    !testCases ||
                    testCases.length === 0
                ) {
                    return res.status(400).json({
                        success: false,
                        type: "error",
                        output:
                            "No test cases available for this problem.",
                        analysisAllowed: false,
                    });
                }

                executableCode = await runner(
                    code,
                    testCases
                );
            } catch (error) {
                console.error(
                    "Failed to build test harness:",
                    error
                );

                return res.status(400).json({
                    success: false,
                    type: "error",
                    output:
                        "Could not build test case.",
                    analysisAllowed: false,
                });
            }
        } else {
            /*
             * Normal complete C++
             * programs require main().
             */
            if (
                !/\bmain\s*\(/.test(code)
            ) {
                return res.json({
                    success: false,
                    type: "compilation",
                    output:
                        "Your program does not contain a main() function.\n\n" +
                        "Run Code requires a complete C++ program with int main().",
                    analysisAllowed: false,
                });
            }
        }

        const tempDir =
            fs.mkdtempSync(
                path.join(
                    os.tmpdir(),
                    "algolens-"
                )
            );

        const sourceFile =
            path.join(
                tempDir,
                "main.cpp"
            );

        const executable =
            path.join(
                tempDir,
                process.platform ===
                    "win32"
                    ? "main.exe"
                    : "main"
            );

        try {
            fs.writeFileSync(
                sourceFile,
                executableCode
            );
        } catch (error) {
            fs.rmSync(
                tempDir,
                {
                    recursive: true,
                    force: true,
                }
            );

            return res.status(500).json({
                success: false,
                type: "error",
                output:
                    "Could not create temporary source file.",
                analysisAllowed: false,
            });
        }

        /*
         * Compile C++
         */
        const compiler =
            spawn("g++", [
                sourceFile,
                "-o",
                executable,
            ]);

        let compileError = "";

        compiler.stderr.on(
            "data",
            (data) => {
                compileError +=
                    data.toString();
            }
        );

        compiler.on(
            "error",
            (error) => {
                console.error(
                    "Compiler error:",
                    error
                );

                fs.rmSync(
                    tempDir,
                    {
                        recursive: true,
                        force: true,
                    }
                );

                return res.json({
                    success: false,
                    type: "compilation",
                    output:
                        error.message ||
                        "Could not start compiler.",
                    analysisAllowed: false,
                });
            }
        );

        compiler.on(
            "close",
            (exitCode) => {
                if (exitCode !== 0) {
                    fs.rmSync(
                        tempDir,
                        {
                            recursive: true,
                            force: true,
                        }
                    );

                    return res.json({
                        success: false,
                        type: "compilation",
                        output:
                            compileError ||
                            "Compilation failed.",
                        analysisAllowed: false,
                    });
                }

                /*
                 * Run compiled program
                 */
                const program =
                    spawn(
                        executable
                    );

                let output = "";
                let runtimeError = "";

                program.stdout.on(
                    "data",
                    (data) => {
                        output +=
                            data.toString();
                    }
                );

                program.stderr.on(
                    "data",
                    (data) => {
                        runtimeError +=
                            data.toString();
                    }
                );

                /*
                 * Normal programs may
                 * receive custom stdin.
                 *
                 * Runner-based problems
                 * receive test cases through
                 * the generated main().
                 */
                if (
                    !runner &&
                    input
                ) {
                    program.stdin.write(
                        input
                    );
                }

                program.stdin.end();

                /*
                 * 3 second execution limit
                 */
                let timedOut = false;

                const timeout =
                    setTimeout(
                        () => {
                            timedOut =
                                true;

                            program.kill();
                        },
                        3000
                    );

                program.on(
                    "error",
                    (error) => {
                        clearTimeout(
                            timeout
                        );

                        fs.rmSync(
                            tempDir,
                            {
                                recursive: true,
                                force: true,
                            }
                        );

                        return res.json({
                            success: false,
                            type: "runtime",
                            output:
                                error.message ||
                                "Failed to execute program.",
                            analysisAllowed: false,
                        });
                    }
                );

                program.on(
                    "close",
                    (exitCode) => {
                        clearTimeout(
                            timeout
                        );

                        fs.rmSync(
                            tempDir,
                            {
                                recursive: true,
                                force: true,
                            }
                        );

                        /*
                         * Timeout
                         */
                        if (timedOut) {
                            return res.json({
                                success: false,
                                type: "timeout",
                                output:
                                    "Execution timed out.",
                                analysisAllowed: false,
                            });
                        }

                        /*
                         * Runtime error
                         *
                         * This catches:
                         * std::bad_alloc
                         * segmentation faults
                         * abort()
                         * uncaught exceptions
                         * etc.
                         */
                        if (
                            exitCode !== 0
                        ) {
                            return res.json({
                                success: false,
                                type: "runtime",
                                output:
                                    runtimeError ||
                                    "Runtime error.",
                                analysisAllowed: false,
                            });
                        }

                        /*
                         * Runner-based problems
                         * must pass every test case
                         * before analysis is allowed.
                         */
                        if (runner) {
                            console.log("=== RAW PROGRAM OUTPUT ===");
                            console.log(JSON.stringify(output));
                            console.log("=== TEST CASES ===");
                            console.log(JSON.stringify(problem.testCases, null, 2));
                            const testResults =
                                evaluateTestCases(
                                    problem,
                                    output
                                );

                            return res.json({
                                success: true,
                                type:
                                    testResults.allPassed
                                        ? "success"
                                        : "test-failed",

                                output,

                                testResults,

                                analysisAllowed:
                                    testResults.allPassed,
                            });
                        }

                        /*
                         * Normal complete
                         * programs.
                         *
                         * There are no managed
                         * test cases, so they can
                         * be analyzed after
                         * successful execution.
                         */
                        return res.json({
                            success: true,
                            type: "success",
                            output,
                            analysisAllowed: true,
                        });
                    }
                );
            }
        );
    }
);

module.exports = router;