const analyzeCode = require("../analyzer/codeAnalyzer");

function analyze(req, res) {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                error: "Code is required",
            });
        }

        const result = analyzeCode(code);

        res.json(result);
    } catch (error) {
        console.error("Analysis error:", error);

        res.status(500).json({
            error: "Failed to analyze code",
        });
    }
}

module.exports = {
    analyze,
};