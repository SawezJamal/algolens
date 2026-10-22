require("dotenv").config();

const mongoose = require("mongoose");
const Problem = require("../models/Problem");

const problem = {
    title: "Valid Anagram",
    slug: "valid-anagram",
    difficulty: "Easy",

    categories: ["Hashing", "Strings"],

    description:
        "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",

    examples: [
        {
            input: "s = \"anagram\", t = \"nagaram\"",
            output: "true",
        },
        {
            input: "s = \"rat\", t = \"car\"",
            output: "false",
        },
    ],

    testCases: [
        {
            input: JSON.stringify({
                s: "anagram",
                t: "nagaram",
            }),
            output: "true",
        },
        {
            input: JSON.stringify({
                s: "rat",
                t: "car",
            }),
            output: "false",
        },
        {
            input: JSON.stringify({
                s: "listen",
                t: "silent",
            }),
            output: "true",
        },
        {
            input: JSON.stringify({
                s: "hello",
                t: "world",
            }),
            output: "false",
        },
        {
            input: JSON.stringify({
                s: "a",
                t: "a",
            }),
            output: "true",
        },
    ],

    constraints: [
        "1 <= s.length, t.length <= 5 * 10^4",
        "s and t consist of lowercase English letters.",
    ],

    starterCode: `#include <bits/stdc++.h>
using namespace std;

bool isAnagram(string s, string t) {
    // Write your solution here

    return false;
}`,

    expectedTimeComplexity: "O(n)",
    expectedSpaceComplexity: "O(1)",

    tags: [
        "hashing",
        "string",
        "frequency-count",
    ],

    source: "AlgoLens",
    sourceUrl: "",

    execution: {
        enabled: true,
        runnerType: "array",
        functionName: "isAnagram",
        returnType: "bool",

        parameters: [
            {
                name: "s",
                type: "string",
            },
            {
                name: "t",
                type: "string",
            },
        ],
    },
};

async function addProblem() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const existing = await Problem.findOne({
            slug: problem.slug,
        });

        if (existing) {
            console.log(
                "Valid Anagram already exists — nothing changed."
            );
        } else {
            await Problem.create(problem);

            console.log(
                "Valid Anagram inserted successfully."
            );
        }

        await mongoose.disconnect();

        console.log("MongoDB disconnected");
    } catch (error) {
        console.error(
            "Failed to add Valid Anagram:",
            error
        );

        try {
            await mongoose.disconnect();
        } catch {}

        process.exit(1);
    }
}

addProblem();