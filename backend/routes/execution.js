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
        .split(/\s+/);

    const expectedOutputs = problem.testCases.map(
        (testCase) => testCase.output.trim()
    );

    const results = expectedOutputs.map(
        (expected, index) => {
            const actual =
                actualOutputs[index] ?? "";

            return {
                testCase: index + 1,
                expected,
                actual,
                passed: actual === expected,
            };
        }
    );

    const passed = results.filter(
        (result) => result.passed
    ).length;

    return {
        passed,
        total: results.length,
        allPassed: passed === results.length,
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
            output: "Failed to load problem.",
        });
    }

    if (!problem) {
        return res.status(404).json({
            success: false,
            type: "error",
            output: "Problem not found.",
        });
    }

    let executableCode = code;

    /*
 * Problems with registered runners use
 * function-based execution.
 */
    const runner = getRunner(problem);

    if (runner) {
        try {
            const testCases = problem.testCases;

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
        path.join(os.tmpdir(), "algolens-")
    );

    const sourceFile = path.join(
        tempDir,
        "main.cpp"
    );

    const executable = path.join(
        tempDir,
        "main.exe"
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
            compileError += data.toString();
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
                    output += data.toString();
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
 * Normal programs may use custom stdin.
 * Runner-based problems use MongoDB test cases
 * converted into the generated main().
 */
            if (input && !runner) {
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
                     * Evaluate MongoDB test cases.
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

                    /*
                     * Existing response for
                     * normal programs.
                     */
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