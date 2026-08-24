const express = require("express");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const router = express.Router();

router.post("/run", (req, res) => {
    const { code, input = "" } = req.body;

    if (!code) {
        return res.status(400).json({
            success: false,
            type: "error",
            output: "Code is required.",
        });
    }

    const tempDir = fs.mkdtempSync(
        path.join(os.tmpdir(), "algolens-")
    );

    const sourceFile = path.join(tempDir, "main.cpp");
    const executable = path.join(tempDir, "main.exe");

    try {
        fs.writeFileSync(sourceFile, code);
    } catch (error) {
        fs.rmSync(tempDir, {
            recursive: true,
            force: true,
        });

        return res.status(500).json({
            success: false,
            type: "error",
            output: "Could not create temporary source file.",
        });
    }

    // Compile C++
    const compiler = spawn("g++", [
        sourceFile,
        "-o",
        executable,
    ]);

    let compileError = "";

    compiler.stderr.on("data", (data) => {
        compileError += data.toString();
    });

    compiler.on("close", (exitCode) => {
        if (exitCode !== 0) {
            fs.rmSync(tempDir, {
                recursive: true,
                force: true,
            });

            return res.json({
                success: false,
                type: "compilation",
                output: compileError || "Compilation failed.",
            });
        }

        // Run compiled program
        const program = spawn(executable);

        let output = "";
        let runtimeError = "";

        program.stdout.on("data", (data) => {
            output += data.toString();
        });

        program.stderr.on("data", (data) => {
            runtimeError += data.toString();
        });

        // Send input to program
        if (input) {
            program.stdin.write(input);
        }

        program.stdin.end();

        // 3 second execution limit
        const timeout = setTimeout(() => {
            program.kill();

            fs.rmSync(tempDir, {
                recursive: true,
                force: true,
            });

            return res.json({
                success: false,
                type: "timeout",
                output: "Execution timed out.",
            });
        }, 3000);

        program.on("close", (exitCode) => {
            clearTimeout(timeout);

            fs.rmSync(tempDir, {
                recursive: true,
                force: true,
            });

            if (exitCode !== 0) {
                return res.json({
                    success: false,
                    type: "runtime",
                    output: runtimeError || "Runtime error.",
                });
            }

            return res.json({
                success: true,
                type: "success",
                output,
            });
        });
    });
});

module.exports = router;