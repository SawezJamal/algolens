const Problem = require("../models/Problem");

async function getProblems(req, res) {
    try {
        const problems = await Problem.find()
            .sort({ createdAt: 1 });

        res.json(problems);
    } catch (error) {
        console.error("Get problems error:", error);

        res.status(500).json({
            error: "Failed to fetch problems",
        });
    }
}

async function getProblemBySlug(req, res) {
    try {
        const { slug } = req.params;

        const problem = await Problem.findOne({ slug });

        if (!problem) {
            return res.status(404).json({
                error: "Problem not found",
            });
        }

        res.json(problem);
    } catch (error) {
        console.error("Get problem error:", error);

        res.status(500).json({
            error: "Failed to fetch problem",
        });
    }
}

module.exports = {
    getProblems,
    getProblemBySlug,
};