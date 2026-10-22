require("dotenv").config();

const mongoose = require("mongoose");
const Problem = require("../models/Problem");

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        const result = await Problem.updateOne(
            { slug: "word-break-check" },
            {
                $set: {
                    execution: {
                        enabled: true,
                        runnerType: "array",
                        functionName: "solve",
                        returnType: "string",
                        parameters: [
                            {
                                name: "s",
                                type: "string"
                            },
                            {
                                name: "wordDict",
                                type: "vector<string>"
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