require("dotenv").config();

const mongoose = require("mongoose");
const Problem = require("../models/Problem");

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        const result = await Problem.updateOne(
            {
                slug: "linked-list-cycle-detection"
            },
            {
                $set: {
                    execution: {
                        enabled: true,
                        runnerType: "linkedList",
                        functionName: "hasCycle",
                        returnType: "bool",
                        parameters: [
                            {
                                name: "head",
                                type: "ListNode*"
                            }
                        ]
                    }
                }
            }
        );

        console.log(result);

        await mongoose.disconnect();
    })
    .catch(console.error);