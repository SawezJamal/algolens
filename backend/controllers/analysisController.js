const analyzeCode = require("../analyzer/codeAnalyzer");
const Analysis = require("../models/Analysis");

async function analyze(req, res) {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                error: "Code is required",
            });
        }

        const result = analyzeCode(code);

        const savedAnalysis = await Analysis.create({
            code,
            detected: result.detected,
            findings: result.findings || [],
        });

        console.log("Analysis saved:", savedAnalysis._id);

        res.json(result);
    } catch (error) {
        console.error("Analysis error:", error);

        res.status(500).json({
            error: "Failed to analyze code",
        });
    }
}

async function getAnalyses(req, res) {
    try {
        const analyses = await Analysis.find()
            .sort({ createdAt: -1 });

        res.json(analyses);
    } catch (error) {
        console.error("History error:", error);

        res.status(500).json({
            error: "Failed to fetch analysis history",
        });
    }
}

async function getAnalysisById(req, res) {
    try {
        const { id } = req.params;

        const analysis = await Analysis.findById(id);

        if (!analysis) {
            return res.status(404).json({
                error: "Analysis not found",
            });
        }

        res.json(analysis);
    } catch (error) {
        console.error("Get analysis error:", error);

        res.status(500).json({
            error: "Failed to fetch analysis",
        });
    }
}

module.exports = {
    analyze,
    getAnalyses,
    getAnalysisById,
};