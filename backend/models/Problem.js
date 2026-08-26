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
        },

        slug: {
            type: String,
            required: true,
            unique: true,
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },

        categories: {
            type: [String],
            required: true,
            default: [],
        },

        description: {
            type: String,
            required: true,
        },

        examples: {
            type: [exampleSchema],
            default: [],
        },

        testCases: {
            type: [exampleSchema],
            default: [],
        },

        constraints: {
            type: [String],
            default: [],
        },

        starterCode: {
            type: String,
            default: "",
        },

        expectedTimeComplexity: {
            type: String,
            default: "",
        },

        expectedSpaceComplexity: {
            type: String,
            default: "",
        },

        tags: {
            type: [String],
            default: [],
        },

        source: {
            type: String,
            default: "",
        },

        sourceUrl: {
            type: String,
            default: "",
        },
execution: {
    enabled: {
        type: Boolean,
        default: false,
    },

    runnerType: {
        type: String,
        default: "",
    },

    functionName: {
        type: String,
        default: "",
    },

    parameters: {
        type: [
            {
                name: {
                    type: String,
                    required: true,
                },

                type: {
                    type: String,
                    required: true,
                },
            },
        ],
        default: [],
    },
},
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Problem", problemSchema);