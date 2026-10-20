const mongoose = require("mongoose");

// ============================================================
// FINDING SCHEMA
// ============================================================

const findingSchema =
    new mongoose.Schema(
        {
            rule: {
                type: String,
            },

            pattern: {
                type: String,
            },

            startLine: {
                type: Number,
            },

            endLine: {
                type: Number,
            },

            timeComplexity: {
                type: String,
            },

            spaceComplexity: {
                type: String,
            },

            recommendation: {
                type: String,
            },

            explanation: {
                type: String,
            },

            optimizedComplexity: {
                type: String,
            },

            optimizedCode: {
                type: String,
            },
        },
        {
            _id: false,
        }
    );

// ============================================================
// ANALYSIS SCHEMA
// ============================================================

const analysisSchema =
    new mongoose.Schema(
        {
            code: {
                type: String,
                required: true,
            },

            detected: {
                type: Boolean,
                required: true,
            },

            findings: {
                type: [findingSchema],
                default: [],
            },

            // =================================================
            // TOP-LEVEL COMPLEXITY
            // =================================================

            pattern: {
                type: String,
                default:
                    "Not determined",
            },

            timeComplexity: {
                type: String,
                default:
                    "Not determined",
            },

            spaceComplexity: {
                type: String,
                default:
                    "Not determined",
            },

            recommendation: {
                type: String,
                default:
                    "No optimization suggested",
            },

            explanation: {
                type: String,
                default: "",
            },

            optimizedComplexity: {
                type: String,
                default:
                    "Not determined",
            },

            optimizedCode: {
                type: String,
                default: null,
            },

            // =================================================
            // ML DATA
            // =================================================

            mlAnalysis: {
                type: mongoose.Schema.Types.Mixed,
                default: null,
            },

            features: {
                type: mongoose.Schema.Types.Mixed,
                default: null,
            },

            // =================================================
            // AI RECOMMENDATION
            // =================================================

            aiRecommendation: {
                type: mongoose.Schema.Types.Mixed,
                default: null,
            },
        },
        {
            timestamps: true,
        }
    );

module.exports =
    mongoose.model(
        "Analysis",
        analysisSchema
    );