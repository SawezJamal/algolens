require("dotenv").config();

const mongoose = require("mongoose");
const Problem = require("../models/Problem");

async function updateProblem() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const result = await Problem.updateOne(
            {
                slug: "nearly-sorted-array",
            },
            {
                $set: {
                    testCases: [
                        {
                            input: "{\"k\":3,\"nums\":[6,5,3,2,8,10,9]}",
                            output: "3",
                        },
                        {
                            input: "{\"k\":4,\"nums\":[10,9,8,7,4,70,60,50]}",
                            output: "3",
                        },
                        {
                            input: "{\"k\":2,\"nums\":[1,2,3,4,5]}",
                            output: "0",
                        },
                        {
                            input: "{\"k\":4,\"nums\":[5,4,3,2,1]}",
                            output: "2",
                        },
                        {
                            input: "{\"k\":1,\"nums\":[1,3,2,4,5]}",
                            output: "1",
                        },
                    ],
                },
            }
        );

        console.log(result);

        await mongoose.disconnect();

        console.log("MongoDB disconnected");
    } catch (error) {
        console.error(
            "Failed to update Nearly Sorted Array:",
            error
        );

        try {
            await mongoose.disconnect();
        } catch {}

        process.exit(1);
    }
}

updateProblem();