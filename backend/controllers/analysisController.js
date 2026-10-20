const analyzeCode = require("../analyzer/codeAnalyzer");
const extractFeatures = require("../ml/featureExtractor");
const {
    predictEfficiency,
} = require("../ml/mlPredictor");
const Analysis = require("../models/Analysis");
const {
    generateRecommendation,
} = require("../ml/geminiRecommender");

async function analyze(req, res) {
    console.log("🔥 ANALYZE CONTROLLER HIT");
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                error: "Code is required",
            });
        }

        const result = analyzeCode(code);

        const features = extractFeatures(code);

        let mlPrediction = null;

        try {
            mlPrediction =
                await predictEfficiency(features);
        } catch (mlError) {
            console.error(
                "ML prediction error:",
                mlError
            );
        }
        result.mlAnalysis = mlPrediction;
        result.features = features;

        let aiRecommendation = null;

        try {
            console.log("Calling Gemini...");

            aiRecommendation = await generateRecommendation({
                code,
                findings: result.findings || [],
                mlAnalysis: mlPrediction,
            });

            console.log(
                "Gemini recommendation received:",
                aiRecommendation
            );
        } catch (aiError) {
            console.error(
                "========== AI RECOMMENDATION ERROR =========="
            );
            console.error(aiError);
            console.error(
                "============================================="
            );
        }

        result.aiRecommendation = aiRecommendation;

        const savedAnalysis =
    await Analysis.create({
        code,

        detected:
            Boolean(result.detected),

        findings:
            result.findings ||
            [],

        pattern:
            result.pattern ||
            "Not determined",

        timeComplexity:
            result.timeComplexity ||
            "Not determined",

        spaceComplexity:
            result.spaceComplexity ||
            "Not determined",

        recommendation:
            result.recommendation ||
            "No optimization suggested",

        explanation:
            result.explanation ||
            "",

        optimizedComplexity:
            result.optimizedComplexity ||
            "Not determined",

        optimizedCode:
            result.optimizedCode ||
            null,

        mlAnalysis:
            mlPrediction,

        features,

        aiRecommendation:
            aiRecommendation,
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