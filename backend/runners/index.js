const arrayRunner = require("./arrayRunner");

const graphRunner = require(
    "./graphRunner"
);

const runners = {
    array: arrayRunner,
    graph: graphRunner,
};

function getRunner(problem) {
    if (
        !problem.execution ||
        !problem.execution.enabled
    ) {
        return null;
    }

    const runner =
        runners[problem.execution.runnerType];

    if (!runner) {
        return null;
    }

    return (
        code,
        testCases
    ) =>
        runner(
            code,
            testCases,
            problem.execution.functionName,
            problem.execution.parameters
        );
}

module.exports = {
    getRunner,
};