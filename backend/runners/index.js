const arrayRunner =
    require("./arrayRunner");

const graphRunner =
    require("./graphRunner");

const linkedListRunner =
    require("./linkedListRunner");

    const treeRunner =
    require("./treeRunner");

const runners = {
    array: arrayRunner,
    graph: graphRunner,
    linkedList: linkedListRunner,
     tree: treeRunner,
};


function getRunner(problem) {
    if (
        !problem.execution ||
        !problem.execution.enabled
    ) {
        return null;
    }

    const runner =
        runners[
            problem.execution.runnerType
        ];

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
            problem.execution.parameters,
            problem.execution.returnType
        );
}


module.exports = {
    getRunner,
};
