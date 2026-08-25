const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema(
    {
        input: {
            type: String,
            required: true,
        },

        output: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const problemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        examples: {
            type: [exampleSchema],
            default: [],
        },

        constraints: {
            type: [String],
            default: [],
        },

        starterCode: {
            type: String,
            required: true,
        },

        expectedTimeComplexity: {
            type: String,
        },

        expectedSpaceComplexity: {
            type: String,
        },

        tags: {
            type: [String],
            default: [],
        },

        source: {
            type: String,
        },

        sourceUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Problem", problemSchema);