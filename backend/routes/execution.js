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

            let passed = actual === expected;

            /*
             * Two Sum:
             *
             * Multiple valid index pairs can exist.
             *
             * Example:
             * nums = [2,5,9,12]
             * target = 14
             *
             * 0 3 -> 2 + 12 = 14
             * 1 2 -> 5 + 9 = 14
             *
             * Both answers are valid.
             */
            if (
                problem.slug === "two-sum"
            ) {
                try {
                    const input =
                        JSON.parse(
                            testCase.input
                        );

                    const values =
                        actual
                            .split(/\s+/)
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
                            i < input.nums.length &&
                            j < input.nums.length &&
                            i !== j &&
                            input.nums[i] +
                                input.nums[j] ===
                                input.target;
                    } else {
                        passed = false;
                    }
                } catch (error) {
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

    const passed =
        results.filter(
            (result) => result.passed
        ).length;

    return {
        passed,
        total: results.length,
        allPassed:
            passed === results.length,
        results,
    };
}

router.post("/run", async (req, res) => {
    const {
        code,
        input = "",
        problemId,
    } = req.body;

    if (!code) {
        return res.status(400).json({
            success: false,
            type: "error",
            output: "Code is required.",
        });
    }

    if (!problemId) {
        return res.status(400).json({
            success: false,
            type: "error",
            output: "Problem ID is required.",
        });
    }

    let problem;

    try {
        problem = await Problem.findOne({
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
        });
    }

    if (!problem) {
        return res.status(404).json({
            success: false,
            type: "error",
            output:
                "Problem not found.",
        });
    }

    let executableCode = code;

    // Get generic runner from problem metadata
    const runner = getRunner(problem);

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
                });
            }

            executableCode = runner(
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
            });
        }
    } else {
        // Normal complete C++ programs
        if (!/\bmain\s*\(/.test(code)) {
            return res.json({
                success: false,
                type: "compilation",
                output:
                    "Your program does not contain a main() function.\n\n" +
                    "Run Code requires a complete C++ program with int main().",
            });
        }
    }

    const tempDir = fs.mkdtempSync(
        path.join(
            os.tmpdir(),
            "algolens-"
        )
    );

    const sourceFile = path.join(
        tempDir,
        "main.cpp"
    );

    const executable = path.join(
    tempDir,
    process.platform === "win32"
        ? "main.exe"
        : "main"
);

    try {
        fs.writeFileSync(
            sourceFile,
            executableCode
        );
    } catch (error) {
        fs.rmSync(tempDir, {
            recursive: true,
            force: true,
        });

        return res.status(500).json({
            success: false,
            type: "error",
            output:
                "Could not create temporary source file.",
        });
    }

    // Compile C++
    const compiler = spawn("g++", [
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
        "close",
        (exitCode) => {
            if (exitCode !== 0) {
                fs.rmSync(tempDir, {
                    recursive: true,
                    force: true,
                });

                return res.json({
                    success: false,
                    type: "compilation",
                    output:
                        compileError ||
                        "Compilation failed.",
                });
            }

            // Run compiled program
            const program = spawn(
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
             * Runner-based problems already
             * receive their MongoDB test cases
             * through the generated main().
             *
             * Normal programs still support
             * custom stdin input.
             */
            if (!runner && input) {
                program.stdin.write(input);
            }

            program.stdin.end();

            // 3 second execution limit
            let timedOut = false;

            const timeout = setTimeout(
                () => {
                    timedOut = true;
                    program.kill();
                },
                3000
            );

            program.on(
                "close",
                (exitCode) => {
                    clearTimeout(timeout);

                    fs.rmSync(tempDir, {
                        recursive: true,
                        force: true,
                    });

                    if (timedOut) {
                        return res.json({
                            success: false,
                            type: "timeout",
                            output:
                                "Execution timed out.",
                        });
                    }

                    if (exitCode !== 0) {
                        return res.json({
                            success: false,
                            type: "runtime",
                            output:
                                runtimeError ||
                                "Runtime error.",
                        });
                    }

                    /*
                     * Every problem using a runner
                     * gets test-case evaluation.
                     */
                    if (runner) {
                        const testResults =
                            evaluateTestCases(
                                problem,
                                output
                            );

                        return res.json({
                            success: true,
                            type: "success",
                            output,
                            testResults,
                        });
                    }

                    // Normal program response
                    return res.json({
                        success: true,
                        type: "success",
                        output,
                    });
                }
            );
        }
    );
});

module.exports = router;