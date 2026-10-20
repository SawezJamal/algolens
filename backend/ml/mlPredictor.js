const { spawn } = require("child_process");
const path = require("path");

function predictEfficiency(features) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(
            __dirname,
            "predict.py"
        );

        // Windows uses "python", Linux/macOS commonly use "python3"
        const pythonCommand =
            process.platform === "win32"
                ? "python"
                : "python3";

        const python = spawn(
            pythonCommand,
            [scriptPath]
        );

        let output = "";
        let errorOutput = "";

        python.stdout.on("data", (data) => {
            output += data.toString();
        });

        python.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        python.on("error", (error) => {
            reject(
                new Error(
                    `Failed to start Python: ${error.message}`
                )
            );
        });

        python.on("close", (exitCode) => {
            if (exitCode !== 0) {
                return reject(
                    new Error(
                        errorOutput ||
                        "ML prediction failed."
                    )
                );
            }

            try {
                const result = JSON.parse(
                    output.trim()
                );

                resolve(result);
            } catch (error) {
                reject(
                    new Error(
                        `Invalid ML output: ${output}`
                    )
                );
            }
        });

        python.stdin.write(
            JSON.stringify(features)
        );

        python.stdin.end();
    });
}

module.exports = {
    predictEfficiency,
};