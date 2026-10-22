const buildArrayHarness =
    require("./buildArrayHarness");

function runArrayProblem(
    code,
    testCases,
    functionName,
    parameters,
    returnType
) {
    return buildArrayHarness(
        code,
        testCases,
        functionName,
        parameters,
        returnType
    );
}

module.exports =
    runArrayProblem;