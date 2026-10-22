require("dotenv").config();

const mongoose = require("mongoose");
const Problem = require("../models/Problem");

async function updateProblem() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const result = await Problem.updateOne(
            {
                slug: "almost-sorted-array",
            },
            {
                $set: {
                    starterCode: `#include <bits/stdc++.h>
using namespace std;

int solve(vector<int>& nums) {
    // Write your solution here

    return 0;
}`,

                    expectedTimeComplexity: "O(n)",

                    expectedSpaceComplexity: "O(n)",

                    execution: {
                        enabled: true,
                        runnerType: "array",
                        functionName: "solve",
                        returnType: "int",

                        parameters: [
                            {
                                name: "nums",
                                type: "vector<int>",
                            },
                        ],
                    },
                },
            }
        );

        console.log(result);

        await mongoose.disconnect();

        console.log("MongoDB disconnected");
    } catch (error) {
        console.error(
            "Failed to update Almost Sorted Array:",
            error
        );

        try {
            await mongoose.disconnect();
        } catch {}

        process.exit(1);
    }
}

updateProblem();