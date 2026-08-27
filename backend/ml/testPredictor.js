const {
    predictEfficiency,
} = require("./mlPredictor");

const features = {
    loopCount: 2,
    nestedLoops: 1,
    hasHashMap: 0,
    hasHashSet: 0,
    hasSorting: 0,
    hasBinarySearch: 0,
    arrayAccesses: 2,
    returnVector: 1,
};

predictEfficiency(features)
    .then((result) => {
        console.log("ML Result:");
        console.log(result);
    })
    .catch((error) => {
        console.error("ML Error:", error);
    });