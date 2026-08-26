const coinChangeExistence = require("./coinChangeExistence");
const cycleDetectionUndirectedGraph = require("./cycleDetectionUndirectedGraph");

const runners = {
    "coin-change-existence": coinChangeExistence,

    "cycle-detection-in-undirected-graph":
        cycleDetectionUndirectedGraph,
};

function getRunner(problem) {
    return runners[problem.slug] || null;
}

module.exports = {
    getRunner,
};