const {
    spawn,
} = require("child_process");

const path = require("path");

function predictEfficiency(features) {
    return new Promise(
        (resolve, reject) => {

            const scriptPath =
                path.join(
                    __dirname,
                    "predict.py"
                );

            const pythonCommand =
                process.platform === "win32"
                    ? "python"
                    : "python3";

            const python =
                spawn(
                    pythonCommand,
                    [scriptPath]
                );

            let output = "";
            let errorOutput = "";

            // ==================================================
            // STDOUT
            // ==================================================

            python.stdout.on(
                "data",
                (data) => {

                    output +=
                        data.toString();
                }
            );

            // ==================================================
            // STDERR
            // ==================================================

            python.stderr.on(
                "data",
                (data) => {

                    errorOutput +=
                        data.toString();
                }
            );

            // ==================================================
            // PYTHON START ERROR
            // ==================================================

            python.on(
                "error",
                (error) => {

                    reject(
                        new Error(
                            `Failed to start Python: ${error.message}`
                        )
                    );
                }
            );

            // ==================================================
            // PYTHON EXIT
            // ==================================================

            python.on(
                "close",
                (exitCode) => {

                    console.log(
                        "Python exit code:",
                        exitCode
                    );

                    if (errorOutput.trim()) {

                        console.log(
                            "Python stderr:"
                        );

                        console.log(
                            errorOutput
                        );
                    }

                    if (exitCode !== 0) {

                        return reject(
                            new Error(
                                errorOutput.trim() ||
                                output.trim() ||
                                `Python exited with code ${exitCode}`
                            )
                        );
                    }

                    // ==================================================
                    // EMPTY OUTPUT
                    // ==================================================

                    const trimmedOutput =
                        output.trim();

                    if (!trimmedOutput) {

                        return reject(
                            new Error(
                                "ML returned empty output."
                            )
                        );
                    }

                    // ==================================================
                    // PARSE JSON
                    // ==================================================

                    try {

                        const result =
                            JSON.parse(
                                trimmedOutput
                            );

                        if (
                            result.error
                        ) {

                            return reject(
                                new Error(
                                    result.error
                                )
                            );
                        }

                        resolve(
                            result
                        );

                    } catch (error) {

                        reject(
                            new Error(
                                `Invalid ML output: ${trimmedOutput}`
                            )
                        );
                    }
                }
            );

            // ==================================================
            // SEND FEATURES TO PYTHON
            // ==================================================

            try {

                python.stdin.write(
                    JSON.stringify(
                        features
                    )
                );

                python.stdin.end();

            } catch (error) {

                reject(
                    error
                );
            }
        }
    );
}

module.exports = {
    predictEfficiency,
};