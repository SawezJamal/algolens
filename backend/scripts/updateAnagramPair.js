require("dotenv").config();

const mongoose = require("mongoose");
const Problem = require("../models/Problem");

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {

        const result = await Problem.updateOne(
            { slug: "anagram-pair" },
            {
                $set: {
                    "execution.enabled": true,
                    "execution.runnerType": "array",
                    "execution.functionName": "areAnagramPairs",
                    "execution.returnType": "bool",
                    "execution.parameters": [
                        {
                            name: "array1",
                            type: "vector<string>"
                        },
                        {
                            name: "array2",
                            type: "vector<string>"
                        }
                    ],
                    starterCode: `#include <bits/stdc++.h>
using namespace std;

bool areAnagramPairs(vector<string>& array1, vector<string>& array2) {
    // Write your solution here

    return false;
}`,
                    expectedTimeComplexity: "O(n * k log k)",
                    expectedSpaceComplexity: "O(k)"
                }
            }
        );

        console.log(result);

        await mongoose.disconnect();
    })
    .catch(console.error);