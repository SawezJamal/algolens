const {
    predictEfficiency,
} = require("./mlPredictor");

const extractFeatures =
    require("./featureExtractor");


// ==========================================================
// TEST CODE
// ==========================================================

const code = `

#include <bits/stdc++.h>
using namespace std;

int main() {

    vector<int> nums = {1, 2, 3, 2, 4};

    for (int i = 0; i < nums.size(); i++) {

        for (int j = i + 1; j < nums.size(); j++) {

            if (nums[i] == nums[j]) {

                cout << "Duplicate";
                return 0;
            }
        }
    }

    return 0;
}

`;


// ==========================================================
// TEST PROBLEM
// ==========================================================

const problem = {

    title: "Contains Duplicate",

    description:
        "Given an array of integers, determine whether " +
        "any value appears at least twice.",

    categories: [
        "hashing",
    ],
};


// ==========================================================
// EXTRACT FEATURES
// ==========================================================

const features =
    extractFeatures(
        code,
        problem
    );


// ==========================================================
// DISPLAY FEATURES
// ==========================================================

console.log(
    "========================================"
);

console.log(
    "EXTRACTED FEATURES"
);

console.log(
    "========================================"
);

console.log(
    features
);


// ==========================================================
// FEATURE COUNT
// ==========================================================

const featureCount =
    Object.keys(features).length;

console.log();

console.log(
    "Feature count:",
    featureCount
);

if (featureCount !== 46) {

    console.error(
        `ERROR: Expected 46 features, ` +
        `but received ${featureCount}.`
    );

    process.exit(1);
}


// ==========================================================
// RUN ML PREDICTION
// ==========================================================

console.log();

console.log(
    "========================================"
);

console.log(
    "ML PREDICTION"
);

console.log(
    "========================================"
);


predictEfficiency(features)

    .then((result) => {

        console.log();

        console.log(
            "ML Result:"
        );

        console.log(
            result
        );

        console.log();

        console.log(
            "Prediction:",
            result.prediction
        );

        console.log(
            "Class:",
            result.predictionClass
        );

        console.log(
            "Confidence:",
            `${result.confidence}%`
        );

    })

    .catch((error) => {

        console.error();

        console.error(
            "ML Error:",
            error.message
        );

        process.exit(1);
    });