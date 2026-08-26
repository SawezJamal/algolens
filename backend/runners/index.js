const coinChangeExistence = require("./coinChangeExistence");

const runners = {
    "coin-change-existence": coinChangeExistence,
};

function getRunner(problem) {
    return runners[problem.slug] || null;
}

module.exports = {
    getRunner,
};