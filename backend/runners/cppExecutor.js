const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { execFile } = require("child_process");

function executeCpp(
    sourceCode,
    timeoutMs = 3000
) {
    return new Promise((resolve) => {
        const id = crypto
            .randomBytes(8)
            .toString("hex");

        const tempDir = path.join(
            os.tmpdir(),
            "algolens"
        );

        fs.mkdirSync(
            tempDir,
            { recursive: true }
        );

        const sourcePath = path.join(
            tempDir,
            `solution_${id}.cpp`
        );

        const executablePath = path.join(
            tempDir,
            `solution_${id}.exe`
        );

        let cleaned = false;

        const cleanup = () => {
            if (cleaned) {
                return;
            }

            cleaned = true;

            try {
                if (
                    fs.existsSync(sourcePath)
                ) {
                    fs.unlinkSync(
                        sourcePath
                    );
                }
            } catch {}

            try {
                if (
                    fs.existsSync(
                        executablePath
                    )
                ) {
                    fs.unlinkSync(
                        executablePath
                    );
                }
            } catch {}
        };

        try {
            fs.writeFileSync(
                sourcePath,
                sourceCode,
                "utf8"
            );
        } catch (error) {
            cleanup();

            resolve({
                success: false,
                stage: "write",
                stdout: "",
                stderr: error.message,
                error: error.message,
            });

            return;
        }

        execFile(
            "g++",
            [
                sourcePath,
                "-std=c++17",
                "-O2",
                "-o",
                executablePath,
            ],
            {
                timeout: timeoutMs,
                windowsHide: true,
            },
            (
                compileError,
                compileStdout,
                compileStderr
            ) => {
                if (compileError) {
                    cleanup();

                    resolve({
                        success: false,
                        stage: "compile",
                        stdout:
                            compileStdout || "",
                        stderr:
                            compileStderr ||
                            compileError.message,
                        error:
                            compileError.message,
                    });

                    return;
                }

                execFile(
                    executablePath,
                    [],
                    {
                        timeout: timeoutMs,
                        windowsHide: true,
                        maxBuffer:
                            1024 * 1024,
                    },
                    (
                        runtimeError,
                        stdout,
                        stderr
                    ) => {
                        const result = {
                            success:
                                !runtimeError,
                            stage:
                                runtimeError
                                    ? "runtime"
                                    : "execution",
                            stdout:
                                stdout || "",
                            stderr:
                                stderr || "",
                            error:
                                runtimeError
                                    ? runtimeError.message
                                    : null,
                        };

                        cleanup();

                        resolve(result);
                    }
                );
            }
        );
    });
}

module.exports = {
    executeCpp,
};