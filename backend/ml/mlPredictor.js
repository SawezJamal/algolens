const { spawn } = require("child_process");
const path = require("path");

function predictEfficiency(features) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(
            __dirname,
            "predict.py"
        );

        const python = spawn("python", [
            scriptPath,
        ]);

        let output = "";
        let errorOutput = "";

        python.stdout.on("data", (data) => {
            output += data.toString();
        });

        python.stderr.on("data", (data) => {
            errorOutput += data.toString();
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
                reject(error);
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