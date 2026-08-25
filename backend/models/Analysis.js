const mongoose = require("mongoose");

const findingSchema = new mongoose.Schema(
    {
        rule: String,
        pattern: String,
        startLine: Number,
        endLine: Number,
        timeComplexity: String,
        spaceComplexity: String,
        recommendation: String,
        explanation: String,
        optimizedComplexity: String,
        optimizedCode: String,
    },
    { _id: false }
);

const analysisSchema = new mongoose.Schema(
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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Analysis", analysisSchema);